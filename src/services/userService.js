import apiFetch from "./api";

//===================================== Modelos =====================================

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
//===================================== Comparacoes =====================================

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

//===================================== Perfil =====================================

export async function atualizarPerfil(nomeExibicao) {
  return apiFetch("/User/atualizar", { method: "PUT", body: JSON.stringify({ nomeExibicao }) });
}

export async function uploadFotoPerfil(file) {
  const formData = new FormData();
  formData.append("arquivo", file);
  return apiFetch("/User/foto-perfil", { method: "POST", body: formData });
}

export async function removerFotoPerfil() {
  return apiFetch("/User/foto-perfil", { method: "DELETE" });
}

export async function iniciarDoisFatores() {
  return apiFetch("/User/2fa/iniciar", { method: "POST" });
}

export async function confirmarDoisFatores(codigo) {
  return apiFetch("/User/2fa/confirmar", { method: "POST", body: JSON.stringify({ codigo }) });
}

export async function desativarDoisFatores() {
  return apiFetch("/User/2fa/desativar", { method: "POST" });
}

export async function logout() {
  return apiFetch("/User/logout", { method: "POST" });
}