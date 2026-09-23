import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Tempo limite máximo para chamadas à API do DeepSeek (25 segundos)
const DEEPSEEK_TIMEOUT_MS = 25000;

// =========================================================
// PARSE SEGURO DO JSON DA IA
// =========================================================



function parseAiJson(content) {
  const normalized = String(content || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(normalized);
  } catch {
    const firstBrace = normalized.indexOf("{");
    const lastBrace = normalized.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Nenhum objeto JSON encontrado na resposta da IA.");
    }

    return JSON.parse(normalized.slice(firstBrace, lastBrace + 1));
  }
}

// =========================================================
// CLIENTE GENÉRICO DE REQUISIÇÃO PARA DEEPSEEK COM TRACKING & TIMEOUT
// =========================================================

async function callDeepSeek(systemPrompt, userPrompt, requestId = "SYS", maxTokens = 2500) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY_MISSING");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);
  const startTime = Date.now();

  console.log(`[REQ:${requestId}] [DeepSeek] 🚀 Iniciando requisição para a API...`);

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: maxTokens,
      }),
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[REQ:${requestId}] [DeepSeek ERRO HTTP ${response.status}] (${duration}ms):`,
        errorText
      );
      throw new Error(`DEEPSEEK_ERROR_${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // <<< AQUI — antes de tentar ler data.choices, confere se veio um erro disfarçado de 200
    if (data?.error) {
      console.error(
        `[REQ:${requestId}] [DeepSeek ERRO NO CORPO] (${duration}ms):`,
        data.error.message
      );

      if (data.error.message?.includes("900-second timeout")) {
        throw new Error("DEEPSEEK_OVERLOADED");
      }

      throw new Error(`DEEPSEEK_ERROR_BODY: ${data.error.message || "Erro desconhecido"}`);
    }

    console.log(
      `[REQ:${requestId}] [DeepSeek SUCESSO] (${duration}ms) | Tokens:`,
      data?.usage || "Não informado"
    );

    const rawContent = data?.choices?.[0]?.message?.content;
    const content = Array.isArray(rawContent)
      ? rawContent.map((part) => part?.text || "").join("")
      : rawContent;

    if (!content) {
      console.error(
        `[REQ:${requestId}] [DeepSeek RESPOSTA VAZIA] Conteúdo veio nulo/vazio. Dump da resposta original:`,
        JSON.stringify(data, null, 2)
      );
      throw new Error("EMPTY_AI_RESPONSE");
    }

    return parseAiJson(content);
  } catch (err) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (err.name === "AbortError") {
      console.error(
        `[REQ:${requestId}] [DeepSeek TIMEOUT] Requisição excedeu o tempo máximo de ${DEEPSEEK_TIMEOUT_MS}ms (${duration}ms).`
      );
      throw new Error("DEEPSEEK_TIMEOUT", { cause: err });
    }

    throw err;
  }
}

// =========================================================
// MIDDLEWARES DE MONITORAMENTO E REGISTRO DE REQUISIÇÕES
// =========================================================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://beyond-compare.vercel.app",
    /^https:\/\/beyond-compare.*\.vercel\.app$/,
  ],
}));
app.use(express.json());
app.use((req, res, next) => {
  res.setTimeout(28000, () => {
    if (!res.headersSent) {
      console.error(`[REQ:${req.id}] Timeout do servidor Express atingido.`);
      res.status(504).json({ error: "Tempo limite do servidor excedido." });
    }
  });
  next();
});
// Logger de requisições com geração de ID único por chamada
app.use((req, res, next) => {
  req.id = crypto.randomUUID().slice(0, 8);
  const start = Date.now();

  console.log(`\n---> [REQ:${req.id}] ${req.method} ${req.path}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `<--- [REQ:${req.id}] ${req.method} ${req.path} STATUS:${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "BCI AI Server",
    message: "Servidor da análise de IA do BCI está funcionando.",
  });
});

// =========================================================
// 1. ANÁLISE INDIVIDUAL DO VEÍCULO
// =========================================================

app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { vehicle } = req.body;

    if (!vehicle) {
      return res.status(400).json({
        error: "Nenhum veículo foi enviado para análise.",
      });
    }

    const systemPrompt = `
Você é o motor de análise inteligente do BCI (Beyond Compare Intelligence).
Sua função é analisar o MODELO DO VEÍCULO e produzir um parecer contextual sobre vantagens, limitações e concorrência.

FORMATO ESPERADO:
Retorne SOMENTE um JSON válido:
{
    "descricao": "Descrição objetiva do veículo em até 3 frases, destacando proposta e diferenciais.",
    "pontosFortes": ["Ponto forte 1", "Ponto forte 2"],
    "pontosFracos": ["Ponto fraco 1", "Ponto fraco 2"],
    "melhorUso": "Descrição objetiva do melhor cenário de utilização.",
    "concorrentesSemelhantes": ["Concorrente 1", "Concorrente 2"]
}
`;

    const userPrompt = `Analise o MODELO do veículo abaixo:\n${JSON.stringify(vehicle, null, 2)}`;
    const analysis = await callDeepSeek(systemPrompt, userPrompt, req.id);

    return res.json({
      descricao: typeof analysis.descricao === "string" ? analysis.descricao : "",
      pontosFortes: Array.isArray(analysis.pontosFortes) ? analysis.pontosFortes : [],
      pontosFracos: Array.isArray(analysis.pontosFracos) ? analysis.pontosFracos : [],
      melhorUso: typeof analysis.melhorUso === "string" ? analysis.melhorUso : "",
      concorrentesSemelhantes: Array.isArray(analysis.concorrentesSemelhantes) ? analysis.concorrentesSemelhantes : [],
    });
  } catch (error) {
    if (res.headersSent) return; // <- idem no catch

        console.error(`[REQ:${req.id}] Erro na rota /api/ai/analyze:`, error.message);
        if (error.message === "DEEPSEEK_TIMEOUT") {
        return res.status(504).json({ error: "A análise da IA demorou muito para responder (Timeout)." });
        }
        if (error.message === "DEEPSEEK_API_KEY_MISSING") {
        return res.status(500).json({ error: "Chave da API do DeepSeek não configurada no servidor." });
        }
        return res.status(500).json({ error: "Não foi possível gerar a análise da IA." });
    }
});

// =========================================================
// 2. COMPARAÇÃO ENTRE VEÍCULOS
// =========================================================

app.post("/api/ai/compare", async (req, res) => {
  try {
    const { firstCar, secondCar, mathConclusions } = req.body;

    if (!firstCar || !secondCar) {
      return res.status(400).json({ error: "Dados dos dois veículos são obrigatórios." });
    }

    const systemPrompt = `
Você é o motor comparativo avançado do BCI (Beyond Compare Intelligence).
Compare dois veículos e entregue um parecer objetivo, neutro e focado em usabilidade.

FORMATO ESPERADO:
Retorne SOMENTE um JSON válido:
{
    "parecerIA": "Resumo comparativo e veredito geral.",
    "recomendacao": "Indicação por perfil de uso.",
    "conclusoesMatematicas": {}
}
`;

    const userPrompt = `
VEÍCULO 1: ${JSON.stringify(firstCar, null, 2)}
VEÍCULO 2: ${JSON.stringify(secondCar, null, 2)}
DADOS C#: ${JSON.stringify(mathConclusions || {}, null, 2)}
`;

    const result = await callDeepSeek(systemPrompt, userPrompt, req.id);

    return res.json({
      parecerIA: result.parecerIA || result.summary || "Não foi possível gerar o parecer.",
      recomendacao: result.recomendacao || "Análise indisponível.",
      conclusoesMatematicas: result.conclusoesMatematicas || mathConclusions || {},
    });
  } catch (error) {
    if (res.headersSent) return; // <- idem no catch
    console.error(`[REQ:${req.id}] Erro na rota /api/ai/compare:`, error.message);

    if (error.message === "DEEPSEEK_TIMEOUT") {
      return res.status(504).json({ error: "A comparação da IA excedeu o tempo limite." });
    }
    return res.status(500).json({ error: "Não foi possível gerar o parecer comparativo." });
  }
});

// =========================================================
// 3. ENRIQUECIMENTO DE ESPECIFICAÇÕES E SEÇÕES
// =========================================================

app.post("/api/ai/enrich-features", async (req, res) => {
  try {
    const { vehicle, missingFields = [] } = req.body;

    if (!vehicle) {
      return res.status(400).json({ error: "Dados do veículo são obrigatórios." });
    }

    const camposFaltantesTexto = missingFields.length
      ? missingFields.join(", ")
      : "nenhum — todas as especificações já estão preenchidas, gere apenas as seções";

    const systemPrompt = `
Você é o especialista automotivo do BCI.

Sua tarefa tem DUAS partes, e a primeira é opcional:

1) PREENCHER ESPECIFICAÇÕES FALTANTES (campo "specs" da resposta)
Você receberá a lista exata de campos que estão faltando no campo "camposFaltantes" do prompt do usuário.
Preencha SOMENTE esses campos específicos, usando conhecimento confiável sobre o modelo exato (marca, modelo, ano).
NÃO inclua no JSON de retorno nenhum campo que não esteja nessa lista — mesmo que você saiba o valor,
ele já está preenchido no sistema e não deve ser sobrescrito.
Se não tiver certeza sobre um campo da lista, simplesmente OMITA esse campo do objeto "specs" (não adivinhe, não invente).

2) SEÇÕES DE RECURSOS (campo "secoes" da resposta) — SEMPRE gere, mesmo que a parte 1 não tenha nada a fazer
Gere as 4 seções abaixo, com 2 a 5 itens cada, específicos do modelo:
- performance
- seguranca
- tecnologia
- conforto

FORMATO ESPERADO — retorne SOMENTE este JSON:
{
    "specs": {
        "campoQueEstavaFaltando": "valor preenchido"
    },
    "secoes": {
        "performance": ["Item 1", "Item 2"],
        "seguranca": ["Item 1", "Item 2"],
        "tecnologia": ["Item 1", "Item 2"],
        "conforto": ["Item 1", "Item 2"]
    }
}

Não adicione campos fora dessa estrutura.
`;

    const userPrompt = `
Campos faltantes que precisam ser preenchidos: ${camposFaltantesTexto}

Dados atuais do veículo (contexto — NÃO reescreva nem repita os campos que já estão preenchidos aqui):
${JSON.stringify(vehicle, null, 2)}
`;

    const enriched = await callDeepSeek(systemPrompt, userPrompt, req.id, 3500);

    if (res.headersSent) return;

    return res.json({
      specs: enriched.specs || {},
      secoes: {
        performance: Array.isArray(enriched.secoes?.performance) ? enriched.secoes.performance : [],
        seguranca: Array.isArray(enriched.secoes?.seguranca) ? enriched.secoes.seguranca : [],
        tecnologia: Array.isArray(enriched.secoes?.tecnologia) ? enriched.secoes.tecnologia : [],
        conforto: Array.isArray(enriched.secoes?.conforto) ? enriched.secoes.conforto : [],
      },
    });
  } catch (error) {
    if (res.headersSent) return;

    console.error(`[REQ:${req.id}] Erro na rota /api/ai/enrich-features:`, error.message);
    if (error.message === "DEEPSEEK_TIMEOUT") {
      return res.status(504).json({ error: "O preenchimento de dados excedeu o tempo limite." });
    }
    if (error.message === "DEEPSEEK_OVERLOADED") {
      return res.status(503).json({ error: "A IA está sobrecarregada no momento. Tente novamente em instantes." });
    }
    return res.status(500).json({ error: "Não foi possível preencher os dados via IA." });
  }
});
// =========================================================
// INICIALIZAÇÃO
// =========================================================


app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("   BCI AI SERVER (Tracking & Timeout)");
  console.log("========================================");
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log("");
  console.log("Logs de monitoramento ativos.");
  console.log("========================================");
  console.log("");
});
