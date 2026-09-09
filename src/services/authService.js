import apiFetch from "./api";


export async function cadastrar(userName,email, password,confirmPassword) {
  const resultado = await apiFetch("/User/cadastro", {
    method: "POST",
    body: JSON.stringify({userName,email, password,confirmPassword }),
  });
  return tratarRespostaLogin(resultado);
}


export async function login(email, password) {
  const resultado = await apiFetch("/User/login", {
    method: "POST",
    body: JSON.stringify({ userIdentifier: email, password }),
  });
  return tratarRespostaLogin(resultado);
}

export async function loginComGoogle(idToken) {
  const resultado = await apiFetch("/User/login/google", {
    method: "POST",
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
  return { requerDoisFatores: false };
}