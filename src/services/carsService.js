import apiFetch from "./api";
import {apiFetchMultipart} from "./api";
import { setUserScopedItem } from '@/utils/userScopedStorage';

export async function iniciarBusca(payload) {
  const resultado = await apiFetch("/Pesquisa/busca", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setUserScopedItem('jobId', resultado.job_id);
  return resultado;
}

export async function importCarsFromFiles(file) {
  const formData = new FormData();
  formData.append('arquivo', file, file.name);
  return apiFetchMultipart('/Carro/importar-arquivo', formData);
}

export async function getJobStatus(jobId) {
  return apiFetch(`/Pesquisa/jobs/${jobId}`, { method: "GET" });
}

export async function getCars(pagina = 1, tamanhoPagina = 20) {
  return apiFetch(`/Carro/listar?pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`, { method: "GET" });
}
export async function obterCarro(linhagemId) {
  return apiFetch(`/Carro/recente/${linhagemId}`, { method: "GET" });
}

export async function listarVersoesCarro(linhagemId) {
  return apiFetch(`/Carro/${linhagemId}/versoes`, { method: "GET" });
}

export async function obterVersaoEspecifica(carroId) {
  return apiFetch(`/Carro/versao/${carroId}`, { method: "GET" });
}

export async function getImage(carid) {
  return apiFetch(`/Carro/Imagem-Carro/${carid}`,  { method: "GET" })  
}

