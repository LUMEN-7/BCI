import apiFetch from "./api";

function adaptarEquipe(e) {
  return {
    id: e.id,
    name: e.nome,
    description: e.descricao || "Workspace colaborativo do BCI.",
    members: e.totalMembros,
    inviteCode: e.codigoConvite,
    role: e.meuPapel === "Administrador" ? "owner" : "member",
  };
}

function adaptarMembro(m) {
  return {
    id: m.userId ?? m.id,
    name: m.nome ?? m.name,
    initials: m.iniciais ?? (m.nome ? m.nome.charAt(0).toUpperCase() : "?"),
    role: m.papel === "Administrador" ? "owner" : "member",
  };
}

export async function listarMinhasEquipes() {
  return (await apiFetch("/Equipe/minhas", { method: "GET" })).map(adaptarEquipe);
}
export async function criarEquipe(nome, descricao) {
  return adaptarEquipe(await apiFetch("/Equipe", { method: "POST", body: JSON.stringify({ nome, descricao }) }));
}

export async function ListarMembros(equipeId) {
  
  return (await apiFetch(`/Equipe/${equipeId}/membros`, { method: "GET" })).map(adaptarMembro);
}

export async function entrarComCodigo(codigo) {
  return adaptarEquipe(await apiFetch("/Equipe/entrar", { method: "POST", body: JSON.stringify({ codigo }) }));
}

export async function obterEquipe(equipeId) {
  
  return adaptarEquipe(await apiFetch(`/Equipe/${equipeId}`, { method: "GET" }));
}