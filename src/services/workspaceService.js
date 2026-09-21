import apiFetch from "./api";
import { getFavorites } from "./userService";
import { getComparacoesSalvas } from "./userService";

const TIPO_PARA_API = { update: "Atualizacao", insight: "Insight", review: "Revisao", decision: "Decisao", comparison: "Comparacao" };
const TIPO_DA_API = Object.fromEntries(Object.entries(TIPO_PARA_API).map(([k, v]) => [v, k]));

const STATUS_PARA_API = { pending: "Pendente", progress: "EmAnalise", resolved: "Resolvido" };
const STATUS_DA_API = Object.fromEntries(Object.entries(STATUS_PARA_API).map(([k, v]) => [v, k]));

const VINCULO_PARA_API = { research: "Pesquisa", comparison: "Comparacao", aiAnalysis: "AnaliseIA", vehicle: "Veiculo" };
const VINCULO_DA_API = Object.fromEntries(Object.entries(VINCULO_PARA_API).map(([k, v]) => [v, k]));

const ROTA_POR_TIPO_VINCULO = { research: "/search", comparison: "/compare", aiAnalysis: "/compare", vehicle: "/detail" };

const TIPO_ATIVIDADE_ACAO = {
  PostCriado: () => "criou uma publicação",
  Atribuicao: (a) => `atribuiu "${a.postConteudoResumo ?? "uma publicação"}" para ${a.alvoNome ?? "alguém"}`,
  StatusAlterado: (a) => `marcou "${a.postConteudoResumo ?? "uma publicação"}" como ${a.statusNovo === "Resolvido" ? "resolvido" : "em análise"}`,
  Comentario: (a) => `comentou em "${a.postConteudoResumo ?? "uma publicação"}"`,
  Fixado: (a) => `fixou "${a.postConteudoResumo ?? "uma publicação"}"`,
};

function formatarTempoRelativo(isoDate) {
  const segundos = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (segundos < 60) return "agora";
  if (segundos < 3600) return `há ${Math.floor(segundos / 60)} min`;
  if (segundos < 86400) return `há ${Math.floor(segundos / 3600)} h`;
  return `há ${Math.floor(segundos / 86400)} d`;
}

function adaptarAutor(autor) {
  return { name: autor?.nome ?? "Usuário", initials: autor?.iniciais ?? "?" };
}

function adaptarComentario(c) {
  return { id: c.id, author: c.autor?.nome ?? "Usuário", initials: c.autor?.iniciais ?? "?", time: formatarTempoRelativo(c.criadoEm), content: c.conteudo };
}

function adaptarPost(post) {
  return {
    id: post.id,
    type: TIPO_DA_API[post.tipo] ?? "update",
    author: adaptarAutor(post.autor),
    createdAt: formatarTempoRelativo(post.criadoEm),
    content: post.conteudo,
    tags: post.tags ?? [],
    linkedItem: post.tipoConteudoVinculado
      ? {
          id: post.conteudoVinculadoId,
          type: VINCULO_DA_API[post.tipoConteudoVinculado],
          title: post.conteudoVinculadoTitulo,
          route: ROTA_POR_TIPO_VINCULO[VINCULO_DA_API[post.tipoConteudoVinculado]],
        }
      : null,
    responsible: post.responsavel?.nome ?? null,
    responsibleUserId: post.responsavel?.userId ?? null,
    status: STATUS_DA_API[post.status] ?? null,
    pinned: post.fixado,
    liked: post.curtidoPeloUsuarioAtual,
    likes: post.totalCurtidas,
    comments: (post.comentarios ?? []).map(adaptarComentario),
    completedAt: post.concluidoEm ? formatarTempoRelativo(post.concluidoEm) : null,
  };
}


function gerarIniciais(nome) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ").filter(Boolean);
  return partes.length >= 2
    ? `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
    : partes[0][0].toUpperCase();
}

function adaptarAtividade(a) {
  return {
    id: a.id,
    user: a.atorNome,
    initials: gerarIniciais(a.atorNome),
    action: (TIPO_ATIVIDADE_ACAO[a.tipo] ?? (() => "fez uma ação"))(a),
    time: formatarTempoRelativo(a.dataCriacao),
    postId: a.postId,
  };
}
export async function listarAtividades(equipeId) {
  const atividades = await apiFetch(`/Workspace/${equipeId}/atividades`, { method: "GET" });
  return atividades.map(adaptarAtividade);
}

export async function listarPosts(equipId) {
  const posts = await apiFetch(`/Workspace/${equipId}/posts`, { method: "GET" });  
  return posts.map(adaptarPost);
}

export async function criarPost(equipeId, { type, content, tags, responsibleUserId, status, linkedType, linkedItemId, linkedItemTitle }) {
  const payload = {
    tipo: TIPO_PARA_API[type],
    conteudo: content,
    tags,
    responsavelUserId: (type === "review" || type === "decision") ? responsibleUserId || null : null,
    status: (type === "review" || type === "decision") ? STATUS_PARA_API[status || "pending"] : null,
    tipoConteudoVinculado: linkedType ? VINCULO_PARA_API[linkedType] : null,
    conteudoVinculadoId: linkedType && linkedType !== "research" ? Number(linkedItemId) : null,
    conteudoVinculadoTitulo: linkedType ? linkedItemTitle : null,
  };
  const post = await apiFetch(`/Workspace/${equipeId}/posts`, { method: "POST", body: JSON.stringify(payload) });
  return adaptarPost(post);
}
export async function comentar(postId, content) {
  const comentario = await apiFetch(`/Workspace/posts/${postId}/comentarios`, { method: "POST", body: JSON.stringify({ conteudo: content }) });
  return adaptarComentario(comentario);
}

export async function toggleCurtida(postId) {
  return apiFetch(`/Workspace/posts/${postId}/curtida`, { method: "POST" });
}

export async function togglePin(postId) {
  return apiFetch(`/Workspace/posts/${postId}/fixar`, { method: "PATCH" });
}

export async function atualizarStatus(postId, status) {
  return apiFetch(`/Workspace/posts/${postId}/status`, { method: "PATCH", body: JSON.stringify({ status: STATUS_PARA_API[status] }) });
}

export async function excluirPost(postId) {
  return apiFetch(`/Workspace/posts/${postId}`, { method: "DELETE" });
}

export async function listarConteudosVinculaveis(linkedType) {
  if (linkedType === "vehicle") {
    const resultado = await getFavorites();
    return (resultado.favoriteCarros ?? resultado).map((c) => ({
      id: String(c.linhagemId ?? c.id),
      title: `${c.marca} ${c.modelo} ${c.ano}`,
    }));
  }
  if (linkedType === "comparison" || linkedType === "aiAnalysis") {
    const comparacoes = await getComparacoesSalvas();
    return comparacoes.map((c) => ({ id: String(c.id), title: c.titulo }));
  }
  return []; // "research" não tem lista — vira campo de texto livre no formulário
}