const API_BASE_URL = "https://localhost:7213";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(erro.message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export default apiFetch;