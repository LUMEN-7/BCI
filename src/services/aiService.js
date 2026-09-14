const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || "http://localhost:3001";

export async function analisarVeiculo(vehicle) {
  const response = await fetch(`${AI_SERVER_URL}/api/ai/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vehicle }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível gerar a análise da IA.");
  }

  return {
    strengths: Array.isArray(data.pontosFortes) ? data.pontosFortes : [],
    weaknesses: Array.isArray(data.pontosFracos) ? data.pontosFracos : [],
    bestUse: data.melhorUso || "Não foi possível determinar o melhor uso.",
    competitors: Array.isArray(data.concorrentesSemelhantes)
      ? data.concorrentesSemelhantes
      : [],
  };
}
