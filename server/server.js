import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 3001;


// =========================================================
// PARSE DO JSON DA IA
// =========================================================

function parseAiJson(content) {
    const normalized = String(content || '')
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    try {
        return JSON.parse(normalized);
    } catch {
        const firstBrace = normalized.indexOf('{');
        const lastBrace = normalized.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace <= firstBrace) {
            throw new Error(
                'Nenhum objeto JSON encontrado na resposta da IA.'
            );
        }

        return JSON.parse(
            normalized.slice(firstBrace, lastBrace + 1)
        );
    }
}


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());


// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "BCI AI Server",
        message: "Servidor da análise de IA do BCI está funcionando."
    });
});


// =========================================================
// ANÁLISE DE IA
// =========================================================

app.post("/api/ai/analyze", async (req, res) => {

    try {

        const { vehicle } = req.body;


        // -----------------------------------------------------
        // VALIDAÇÃO
        // -----------------------------------------------------

        if (!vehicle) {
            return res.status(400).json({
                error: "Nenhum veículo foi enviado para análise."
            });
        }


        if (!process.env.DEEPSEEK_API_KEY) {

            console.error(
                "DEEPSEEK_API_KEY não encontrada no arquivo .env"
            );

            return res.status(500).json({
                error: "Chave da API do DeepSeek não configurada."
            });
        }


        // -----------------------------------------------------
        // PROMPT DO SISTEMA
        // -----------------------------------------------------

        const systemPrompt = `
Você é o motor de análise inteligente do BCI
(Beyond Compare Intelligence).

O BCI é uma plataforma de análise de veículos criada para
auxiliar profissionais na interpretação de modelos automotivos.

Sua função é analisar o MODELO DO VEÍCULO e produzir um
parecer contextual sobre sua proposta, posicionamento,
perfil de utilização, experiência de uso, vantagens,
limitações e adequação a diferentes perfis.

A ficha técnica fornecida pelo BCI deve ser utilizada como
CONTEXTO para compreender o veículo.

A ficha NÃO deve ser simplesmente transformada em uma lista
de especificações apresentada como análise.


==========================================================
DIFERENÇA ENTRE FICHA E ANÁLISE
==========================================================

A FICHA TÉCNICA responde:

"O que o veículo possui?"

Exemplos:

- 488 cv
- motor V8
- câmbio automático
- 383 litros de porta-malas
- 4 lugares

A ANÁLISE DA IA deve responder:

"O que essas características significam para o modelo?"

Exemplos:

- Forte vocação esportiva
- Experiência de condução voltada para desempenho
- Menor praticidade para determinados perfis
- Adequação para usuários que valorizam performance
- Posicionamento voltado para determinado público


==========================================================
OBJETIVO PRINCIPAL
==========================================================

Analise o veículo como um PRODUTO AUTOMOTIVO.

Não apenas como um conjunto de especificações.

Utilize os dados técnicos para compreender:

- proposta do modelo;
- categoria;
- segmento;
- posicionamento;
- perfil de usuário;
- vocação;
- experiência de condução;
- praticidade;
- versatilidade;
- conforto;
- tecnologia;
- segurança;
- desempenho;
- possíveis limitações;
- cenários de utilização.


==========================================================
USO DA FICHA TÉCNICA
==========================================================

A ficha técnica é uma fonte de evidência para a análise.

Você PODE utilizar características técnicas para chegar
a uma conclusão sobre o modelo.

Por exemplo:

DADO:
Motor de alta potência.

ANÁLISE:
"Forte vocação para desempenho e condução esportiva."

DADO:
Espaço interno reduzido.

ANÁLISE:
"Menor adequação para usuários que priorizam espaço
e praticidade."

DADO:
Diversos recursos tecnológicos.

ANÁLISE:
"Boa integração de tecnologia e conectividade."

DADO:
Grande capacidade de carga.

ANÁLISE:
"Boa versatilidade para usuários que precisam transportar
bagagens ou objetos."

NÃO simplesmente repita o dado.


==========================================================
REGRAS DE CONFIABILIDADE
==========================================================

Utilize os dados fornecidos pelo BCI como principal fonte
para compreender o veículo.

Você pode utilizar conhecimento geral sobre o modelo para
entender sua proposta, categoria, posicionamento e
concorrentes.

NÃO invente informações específicas.

NÃO invente:

- números;
- preços;
- equipamentos;
- versões;
- tecnologias;
- capacidades;
- avaliações;
- estatísticas;
- dados de vendas;
- dados de mercado;
- especificações não fornecidas.

Se não tiver segurança sobre uma informação específica,
não utilize essa informação.

Não transforme a ausência de informação em uma característica
negativa.

Não crie um ponto fraco apenas para preencher a lista.


==========================================================
PONTOS FORTES
==========================================================

Retorne de 2 a 4 pontos fortes.

Os pontos fortes devem representar VANTAGENS DO MODELO
como produto.

Eles devem ser interpretações e não simplesmente dados
copiados da ficha técnica.

EVITE:

"Possui 488 cv."

"Possui motor V8."

"Possui câmbio automático."

"Possui porta-malas de 383 litros."

Essas informações pertencem à ficha técnica.

PREFIRA:

"Forte vocação esportiva e foco em desempenho."

"Experiência de condução voltada para entusiastas."

"Posicionamento marcante dentro do segmento."

"Boa combinação entre desempenho e tecnologia."

"Boa adequação para usuários que valorizam dirigibilidade."

Você pode mencionar uma característica técnica quando ela
for utilizada para sustentar uma conclusão sobre o modelo.


==========================================================
PONTOS FRACOS
==========================================================

Retorne de 1 a 3 pontos fracos quando houver informações
suficientes.

Os pontos fracos devem representar LIMITAÇÕES DO MODELO
como produto ou da sua proposta.

Considere:

- praticidade;
- versatilidade;
- espaço;
- conforto;
- perfil de utilização;
- adequação para famílias;
- adequação para uso urbano;
- adequação para uso profissional;
- limitações naturais da categoria;
- características que restringem determinados perfis
  de usuários.

EVITE:

"Possui apenas 383 litros."

"O carro tem 4 lugares."

"Consome X km/l."

Esses são dados técnicos.

PREFIRA:

"A proposta esportiva reduz a praticidade para usuários
que priorizam espaço e versatilidade."

"A configuração do modelo limita sua adequação para famílias
que precisam de maior capacidade de passageiros."

"O foco em desempenho pode torná-lo menos adequado para
usuários que priorizam economia."

IMPORTANTE:

Só faça essas interpretações quando os dados fornecidos
darem suporte à conclusão.


==========================================================
MELHOR USO
==========================================================

Retorne UMA única frase.

A frase deve explicar para qual perfil de usuário ou cenário
o modelo é mais adequado.

Não simplesmente descreva a ficha técnica.

Considere:

- proposta;
- segmento;
- perfil de usuário;
- vocação;
- experiência de uso;
- desempenho;
- praticidade;
- conforto;
- tecnologia;
- segurança;
- versatilidade.

Exemplos:

"Indicado para usuários que priorizam desempenho,
dirigibilidade e experiência esportiva."

"Mais adequado para famílias que valorizam espaço,
conforto e versatilidade no uso diário."

"Indicado para usuários que buscam um veículo versátil
para uso urbano e viagens."

"Mais adequado para quem procura robustez, capacidade
e versatilidade em diferentes condições de uso."


==========================================================
CONCORRENTES SEMELHANTES
==========================================================

Retorne de 2 a 4 veículos reais.

Os concorrentes devem ser modelos que possam disputar
o mesmo público ou oferecer uma proposta semelhante.

Considere principalmente:

- categoria;
- segmento;
- proposta;
- posicionamento;
- público-alvo;
- faixa de mercado;
- experiência oferecida;
- finalidade do veículo.

Não escolha concorrentes simplesmente porque possuem
números parecidos.

Por exemplo:

Um esportivo deve ter como concorrentes outros esportivos
com proposta semelhante.

Um SUV familiar deve ter como concorrentes outros SUVs
voltados para público semelhante.

Uma picape deve ter como concorrentes outras picapes
que disputem público semelhante.

Não misture categorias completamente diferentes.


==========================================================
EQUILÍBRIO DA ANÁLISE
==========================================================

A análise deve ser equilibrada.

Não seja excessivamente positivo.

Não seja excessivamente negativo.

Não faça propaganda.

Não utilize linguagem publicitária como:

- "o melhor do mercado";
- "revolucionário";
- "inigualável";
- "perfeito";
- "impressionante";
- "sem concorrentes".

Utilize linguagem analítica e profissional.


==========================================================
REGRA MAIS IMPORTANTE
==========================================================

A IA deve analisar o MODELO, e não apenas a FICHA.

A ficha técnica fornece os FATOS.

A IA deve interpretar o que esses fatos significam para:

- o posicionamento do modelo;
- a experiência de uso;
- o público;
- a proposta;
- as vantagens;
- as limitações;
- os cenários de utilização.


==========================================================
IDIOMA
==========================================================

Responda sempre em português do Brasil.


==========================================================
FORMATO DA RESPOSTA
==========================================================

Retorne SOMENTE um JSON válido.

Não escreva nenhuma explicação antes ou depois do JSON.

Use EXATAMENTE esta estrutura:

{
    "pontosFortes": [
        "Ponto forte 1",
        "Ponto forte 2",
        "Ponto forte 3"
    ],
    "pontosFracos": [
        "Ponto fraco 1",
        "Ponto fraco 2"
    ],
    "melhorUso": "Descrição objetiva do melhor cenário de utilização.",
    "concorrentesSemelhantes": [
        "Concorrente 1",
        "Concorrente 2",
        "Concorrente 3"
    ]
}

Não adicione outros campos.
`;


        // -----------------------------------------------------
        // PROMPT DO VEÍCULO
        // -----------------------------------------------------

        const userPrompt = `
Analise o MODELO do veículo abaixo.

Os dados fornecidos representam a ficha técnica e as
características cadastradas no BCI.

Utilize essas informações para identificar corretamente
e compreender o veículo.

IMPORTANTE:

Não transforme simplesmente os dados técnicos em pontos
fortes ou pontos fracos.

O objetivo é produzir uma análise contextual do MODELO.

Analise principalmente:

- proposta do veículo;
- posicionamento;
- categoria;
- segmento;
- perfil de usuário;
- vocação;
- experiência de uso;
- praticidade;
- versatilidade;
- desempenho;
- conforto;
- tecnologia;
- segurança;
- limitações;
- melhor cenário de utilização;
- concorrentes semelhantes.

A ficha técnica deve funcionar como EVIDÊNCIA para suas
conclusões.

Pergunte a si mesmo:

"O que essas características significam para este modelo
e para quem ele foi desenvolvido?"

DADOS DO VEÍCULO:

${JSON.stringify(vehicle, null, 2)}

Gere a análise no formato JSON solicitado.

Retorne somente o JSON.
`;


        // -----------------------------------------------------
        // DEEPSEEK API
        // -----------------------------------------------------

        const response = await fetch(
            "https://api.deepseek.com/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },

                body: JSON.stringify({

                    model: "deepseek-chat",

                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],

                    response_format: {
                        type: "json_object"
                    },

                    max_tokens: 2000
                })
            }
        );


        // -----------------------------------------------------
        // ERRO DA API
        // -----------------------------------------------------

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Erro retornado pelo DeepSeek:",
                errorText
            );

            return res.status(response.status).json({
                error: "Erro ao consultar a API do DeepSeek.",
                details: errorText
            });
        }


        // -----------------------------------------------------
        // RESPOSTA
        // -----------------------------------------------------

        const data = await response.json();

        const message = data?.choices?.[0]?.message;

        const rawContent = message?.content;

        const content = Array.isArray(rawContent)
            ? rawContent
                .map((part) => part?.text || '')
                .join('')
            : rawContent;


        if (!content) {

            console.error(
                "Resposta do DeepSeek sem conteúdo:",
                data
            );

            return res.status(500).json({
                error: "A IA não retornou uma análise."
            });
        }


        // -----------------------------------------------------
        // CONVERTE JSON DA IA
        // -----------------------------------------------------

        let analysis;

        try {

            analysis = parseAiJson(content);

        } catch (parseError) {

            console.error(
                "Erro ao interpretar JSON da IA:",
                content
            );

            return res.status(500).json({
                error: "A IA retornou uma resposta inválida."
            });
        }


        // -----------------------------------------------------
        // NORMALIZAÇÃO
        // -----------------------------------------------------

        const result = {

            pontosFortes:
                Array.isArray(analysis.pontosFortes)
                    ? analysis.pontosFortes
                    : [],

            pontosFracos:
                Array.isArray(analysis.pontosFracos)
                    ? analysis.pontosFracos
                    : [],

            melhorUso:
                typeof analysis.melhorUso === "string"
                    ? analysis.melhorUso
                    : "",

            concorrentesSemelhantes:
                Array.isArray(analysis.concorrentesSemelhantes)
                    ? analysis.concorrentesSemelhantes
                    : []
        };


        // -----------------------------------------------------
        // RETORNA PARA O REACT
        // -----------------------------------------------------

        return res.json(result);

    } catch (error) {

        console.error(
            "Erro interno no servidor:",
            error
        );

        return res.status(500).json({
            error: "Erro interno ao gerar análise da IA."
        });
    }
});


// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("       BCI AI SERVER");
    console.log("========================================");
    console.log("");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log("");
    console.log("Endpoint:");
    console.log(
        `POST http://localhost:${PORT}/api/ai/analyze`
    );
    console.log("");
    console.log("========================================");
    console.log("");

});