import apiFetch from "./api";

export async function getFavorites() {
  return apiFetch("/user/modelos", { method: "GET" }); // confirma esse nome de rota rapidinho antes de confiar
}

export async function addFavorites(carId) {
  console.log(carId)
  return apiFetch("/user/modelos", { method: "POST", body: JSON.stringify({ linhagemId: carId }) });
}

export async function removeFavorite(carId) {
  return apiFetch(`/user/modelos/${carId}`, { method: "DELETE" });
}

export async function modelosSalvos() {
  return apiFetch("/user/modelos/quantidade-salvos", { method: "GET" });
}


export async function getComparacoesSalvas() {
  return apiFetch("/user/comparacoes", { method: "GET" });
}

export async function salvarComparacao(dto) {
  return apiFetch("/user/comparacoes", { method: "POST", body: JSON.stringify(dto) });
}

export async function removerComparacaoSalva(comparacaoId) {
  return apiFetch(`/user/comparacoes/${comparacaoId}`, { method: "DELETE" });
}

export async function listarMinhasComparacoes() {
    return apiFetch('/user/comparacoes/minhas', { method: "GET" } );
}
export async function essaSemana() {
    return apiFetch('/user/comparacoes/quantidade-semana', { method: "GET" });
}
export async function salvas() {
    return apiFetch('/user/comparacoes/quantidade-salvas', { method: "GET" });
}



