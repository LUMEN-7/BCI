import apiFetch from "./api";

export async function criarAnotacao({ titulo, subtitulo }) {
  return apiFetch("/Anotacao", {
    method: "POST",
    body: JSON.stringify({ titulo, subtitulo }),
  });
}

export async function inserirBloco(anotacaoId, bloco) {
  return apiFetch(`/Anotacao/${anotacaoId}/blocos`, {
    method: "POST",
    body: JSON.stringify(bloco),
  });
}

export async function listarAnotacoes() {
  return apiFetch("/Anotacao/minhas", { method: "GET" });
}

export async function atualizarTextoBloco(anotacaoId, blocoId, texto) {
  return apiFetch(`/Anotacao/${anotacaoId}/blocos/${blocoId}`, {
    method: "PATCH",
    body: JSON.stringify({ texto }),
  });
}

export async function atualizarReferenciaBloco(anotacaoId, blocoId, referencia) {
  return apiFetch(`/Anotacao/${anotacaoId}/blocos/${blocoId}/referencia`, {
    method: "PUT",
    body: JSON.stringify(referencia), // { linhagemIdReferenciado } ou { comparacaoIdReferenciada }
  });
}

export async function removerBloco(anotacaoId, blocoId) {
  return apiFetch(`/Anotacao/${anotacaoId}/blocos/${blocoId}`, { method: "DELETE" });
}

export async function excluirAnotacao(anotacaoId) {
  return apiFetch(`/Anotacao/${anotacaoId}`, { method: "DELETE" });
}

export async function obterAnotacao(anotacaoId) {
  return apiFetch(`/Anotacao/${anotacaoId}`, { method: "GET" });
}