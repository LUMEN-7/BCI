import apiFetch from "./api";

export async function iniciarBusca(payload) {
  const resultado = await apiFetch("/Pesquisa/busca", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("jobId", resultado.job_id);
  return resultado;
}

export async function getFavorites() {
  return apiFetch("/user/modelos", { method: "GET" }); // confirma esse nome de rota rapidinho antes de confiar
}

export async function addFavorites(carId) {
  return apiFetch("/user/modelos", { method: "POST", body: JSON.stringify({ linhagemId: carId }) });
}

export async function removeFavorite(carId) {
  return apiFetch(`/user/modelos/${carId}`, { method: "DELETE" });
}

export async function getCars(pagina = 1, tamanhoPagina = 20) {
  return apiFetch(`/Carro/listar?pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`, { method: "GET" });
}

export async function getComparacoesSalvas() {
  return apiFetch("/user/comparacoes", { method: "GET" });
}
export async function removerComparacaoSalva(comparacaoId) {
  return apiFetch(`/user/comparacoes/${comparacaoId}`, { method: "DELETE" });
}

export async function obterCarro(linhagemId) {
  return apiFetch(`/Carro/recente/${linhagemId}`, { method: "GET" });
}