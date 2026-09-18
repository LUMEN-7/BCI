const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || "http://localhost:3001";

const AI_TIMEOUT_MS = 30000; // um pouco maior que o timeout do servidor (25s), pra dar tempo do 504 chegar antes

async function fetchComTimeout(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("A IA demorou muito para responder. Tente novamente.", { cause: err });
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Análise individual do veículo (pontos fortes, fracos, melhor uso e concorrentes)
 */
export async function analisarVeiculo(vehicle) {
  const response = await fetchComTimeout(`${AI_SERVER_URL}/api/ai/analyze`, {
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

/**
 * Análise comparativa entre dois veículos (Parecer e resumo inteligente)
 */
export async function analisarComparacao(firstCar, secondCar, mathConclusions) {
  const response = await fetchComTimeout(`${AI_SERVER_URL}/api/ai/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstCar,
      secondCar,
      mathConclusions,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível gerar a comparação da IA.");
  }

  return {
    comparisonSummary:
      data.parecerIA || data.summary || "Resumo comparativo não disponível.",
    mathConclusions: data.conclusoesMatematicas || mathConclusions || {},
  };
}

/**
 * Preenche especificações vazias ("Não informado") e carrega as features extras
 * (performance, tecnologia, segurança, conforto) usando o DeepSeek local
 */
export async function buscarFeaturesECompletarVeiculo(vehicle, missingFields = []) {
  const response = await fetchComTimeout(`${AI_SERVER_URL}/api/ai/enrich-features`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicle, missingFields }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Não foi possível preencher os dados ausentes via IA.");
  }

  return {
    specs: data.specs || {},
    sections: {
      performance: Array.isArray(data.secoes?.performance) ? data.secoes.performance : [],
      security: Array.isArray(data.secoes?.seguranca) ? data.secoes.seguranca : [],
      technology: Array.isArray(data.secoes?.tecnologia) ? data.secoes.tecnologia : [],
      comfort: Array.isArray(data.secoes?.conforto) ? data.secoes.conforto : [],
    },
  };
}
