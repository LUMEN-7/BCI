const API_BASE_URL = "https://apiford.onrender.com";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("accessToken");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

    if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
    throw new Error("Sessão expirada. Faça login novamente.");
  }


  if (!response.ok) {
    const erro = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(erro.message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;

  const responseText = await response.text();
  if (!responseText.trim()) return null;

  return JSON.parse(responseText);
}

export default apiFetch;

export async function apiFetchBlob(path, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    const erro = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(erro.message || erro.title || `Erro ${response.status}`);
  }

  const blob = await response.blob();
  const contentType = response.headers.get("Content-Type") || "";

  const disposition = response.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match ? decodeURIComponent(match[1]) : null;

  return { blob, contentType, filename };
}

export async function apiFetchMultipart(path, formData) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // sem Content-Type aqui de propósito — o browser define com o boundary certo
    },
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    const erro = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(erro.message || erro.title || `Erro ${response.status}`);
  }

  return response.json();
}