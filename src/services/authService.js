import apiFetch from "./api";
import { removeLegacySharedUserData } from '@/utils/userScopedStorage';


export async function cadastrar(Nome,Email, Password,FotoPerfilUrl) {
  const resultado = await apiFetch("/user/cadastro", {
    method: "POST",
    body: JSON.stringify({Nome,Email, Password, FotoPerfilUrl }),
  });
  return tratarRespostaLogin(resultado);
}


export async function login(email, password) {
  const resultado = await apiFetch("/User/login", {
    method: "POST",
    skip401Redirect: true,
    body: JSON.stringify({ userIdentifier: email, password }),
  });
  return tratarRespostaLogin(resultado);
}

export async function loginComGoogle(idToken) {
  const resultado = await apiFetch("/User/login/google", {
    method: "POST",
    skip401Redirect: true,
    body: JSON.stringify({ idToken }),
  });
  return tratarRespostaLogin(resultado);
}

export async function verificarDoisFatores(tokenDesafio, codigo) {
  const resultado = await apiFetch("/User/login/2fa", {
    method: "POST",
    body: JSON.stringify({ tokenDesafio, codigo }),
  });
  return tratarRespostaLogin(resultado);
}

function tratarRespostaLogin(resultado) {
  if (resultado.requerDoisFatores) {
    return { requerDoisFatores: true, tokenDesafio: resultado.tokenDesafio };
  }
  localStorage.setItem("accessToken", resultado.accessToken);
  localStorage.setItem("currentUser", JSON.stringify(resultado.usuario));
  removeLegacySharedUserData();
  return { requerDoisFatores: false, usuario: resultado.usuario };
}
