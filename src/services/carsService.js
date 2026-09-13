import apiFetch from "./api";

export async function iniciarBusca(payload) {
  const resultado = await apiFetch("/Pesquisa/busca", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("jobId", resultado.job_id);
  return resultado;
}


export async function getCars(pagina = 1, tamanhoPagina = 20) {
  return apiFetch(`/Carro/listar?pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`, { method: "GET" });
}
export async function obterCarro(linhagemId) {
  return apiFetch(`/Carro/recente/${linhagemId}`, { method: "GET" });
}


