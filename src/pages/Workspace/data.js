export const postTypes = {
  update: {
    label: "Atualização",
    className: "update",
  },

  insight: {
    label: "Insight",
    className: "insight",
  },

  review: {
    label: "Dado para revisão",
    className: "review",
  },

  decision: {
    label: "Decisão",
    className: "decision",
  },

  comparison: {
    label: "Comparação",
    className: "comparison",
  },
};


/* =========================================================
   TIPOS DE CONTEÚDO VINCULADO
========================================================= */

export const linkedContentTypes = {
  research: {
    label: "Pesquisa competitiva",
  },

  comparison: {
    label: "Comparação",
  },

  aiAnalysis: {
    label: "Análise da IA",
  },

  vehicle: {
    label: "Veículo / Modelo",
  },
};


/* =========================================================
   CONTEÚDOS DISPONÍVEIS NO BCI
   Mock temporário até integração com API/backend
========================================================= */

export const linkedContents = [
  {
    id: "research-suvs-medios",
    type: "research",
    title: "SUVs Médios — Cenário Competitivo",
    route: "/search",
  },

  {
    id: "research-territory-market",
    type: "research",
    title: "Posicionamento do Ford Territory",
    route: "/search",
  },

  {
    id: "comparison-territory-compass",
    type: "comparison",
    title: "Ford Territory × Jeep Compass",
    route: "/compare",
  },

  {
    id: "comparison-bronco-compass",
    type: "comparison",
    title: "Ford Bronco Sport × Jeep Compass",
    route: "/compare",
  },

  {
    id: "analysis-territory-compass",
    type: "aiAnalysis",
    title: "Territory × Compass — Análise competitiva da IA",
    route: "/compare",
  },

  {
    id: "analysis-suvs-medium",
    type: "aiAnalysis",
    title: "SUVs Médios — Insights competitivos da IA",
    route: "/search",
  },

  {
    id: "vehicle-territory",
    type: "vehicle",
    title: "Ford Territory",
    route: "/detail",
  },

  {
    id: "vehicle-bronco",
    type: "vehicle",
    title: "Ford Bronco Sport",
    route: "/detail",
  },

  {
    id: "vehicle-compass",
    type: "vehicle",
    title: "Jeep Compass",
    route: "/detail",
  },
];


/* =========================================================
   POSTS
========================================================= */

export const initialPosts = [
  {
    id: 1,

    type: "comparison",

    author: {
      name: "Ianny Raquel",
      initials: "IR",
    },

    createdAt: "há 5 min",

    content:
      "Comparei o Ford Territory com o Jeep Compass considerando motorização, equipamentos e posicionamento competitivo. A principal diferença está no pacote de tecnologia e na proposta de valor entre as versões intermediárias.",

    tags: [
      "Territory",
      "Compass",
      "SUV",
      "Comparação",
    ],

    linkedItem: {
      id: "comparison-territory-compass",
      type: "comparison",
      title: "Ford Territory × Jeep Compass",
      route: "/compare",
    },

    responsible: null,

    status: null,

    pinned: true,

    likes: 4,

    liked: false,

    comments: [
      {
        id: 101,

        author: "Murilo Cordeiro",

        initials: "MC",

        time: "há 3 min",

        content:
          "Acho interessante também verificarmos a diferença de equipamentos entre as versões intermediárias.",
      },

      {
        id: 102,

        author: "Ana Laura",

        initials: "AL",

        time: "há 1 min",

        content:
          "Concordo. Podemos usar essa comparação como base para a análise da próxima reunião.",
      },
    ],
  },


  {
    id: 2,

    type: "review",

    author: {
      name: "Vitor Augusto",
      initials: "VA",
    },

    createdAt: "há 12 min",

    content:
      "Os dados de potência do Jeep Compass encontrados em duas fontes estão diferentes. Precisamos validar qual informação será considerada como referência oficial no BCI.",

    tags: [
      "Compass",
      "Potência",
      "Validação",
    ],

    linkedItem: {
      id: "vehicle-compass",
      type: "vehicle",
      title: "Jeep Compass",
      route: "/detail",
    },

    responsible:
      "Murilo Cordeiro",

    status:
      "pending",

    pinned:
      false,

    likes:
      2,

    liked:
      false,

    comments: [
      {
        id: 201,

        author:
          "Murilo Cordeiro",

        initials:
          "MC",

        time:
          "há 8 min",

        content:
          "Vou revisar as fontes e atualizar os dados assim que confirmar a informação.",
      },
    ],
  },


  {
    id: 3,

    type: "insight",

    author: {
      name: "Murilo Cordeiro",
      initials: "MC",
    },

    createdAt: "há 25 min",

    content:
      "O Territory apresenta uma combinação competitiva interessante de equipamentos de série. Isso pode ser um diferencial relevante quando comparado com outros SUVs médios da mesma faixa de preço.",

    tags: [
      "Territory",
      "Tecnologia",
      "Equipamentos",
    ],

    linkedItem: {
      id: "analysis-territory-compass",
      type: "aiAnalysis",
      title: "Territory × Compass — Análise competitiva da IA",
      route: "/compare",
    },

    responsible:
      null,

    status:
      null,

    pinned:
      false,

    likes:
      7,

    liked:
      true,

    comments:
      [],
  },


  {
    id: 4,

    type: "decision",

    author: {
      name: "Ana Laura",
      initials: "AL",
    },

    createdAt: "há 1 h",

    content:
      "Para as próximas análises competitivas, vamos priorizar versões intermediárias dos veículos. Elas representam melhor o equilíbrio entre preço, equipamentos e volume potencial de mercado.",

    tags: [
      "Estratégia",
      "Versões",
      "Análise",
    ],

    linkedItem: {
      id: "research-suvs-medios",
      type: "research",
      title: "SUVs Médios — Cenário Competitivo",
      route: "/search",
    },

    responsible:
      null,

    status:
      null,

    pinned:
      true,

    likes:
      5,

    liked:
      false,

    comments:
      [],
  },


  {
    id: 5,

    type: "update",

    author: {
      name: "Gerônimo Augusto",
      initials: "GA",
    },

    createdAt: "há 2 h",

    content:
      "Os dados da pesquisa de veículos foram atualizados para considerar novas informações de versões e modelos disponíveis para análise.",

    tags: [
      "Pesquisa",
      "Dados",
      "Atualização",
    ],

    linkedItem: {
      id: "research-territory-market",
      type: "research",
      title: "Posicionamento do Ford Territory",
      route: "/search",
    },

    responsible:
      null,

    status:
      null,

    pinned:
      false,

    likes:
      3,

    liked:
      false,

    comments:
      [],
  },
];


/* =========================================================
   MEMBERS
========================================================= */

export const workspaceMembers = [
  {
    id: 1,
    name: "Ana Laura",
    initials: "AL",
  },

  {
    id: 2,
    name: "Ianny Raquel",
    initials: "IR",
  },

  {
    id: 3,
    name: "Murilo Cordeiro",
    initials: "MC",
  },

  {
    id: 4,
    name: "Vitor Augusto",
    initials: "VA",
  },

  {
    id: 5,
    name: "Gerônimo Augusto",
    initials: "GA",
  },
];


/* =========================================================
   RECENT ACTIVITIES
========================================================= */

export const recentActivities = [
  {
    id: 1,

    postId: 2,

    user:
      "Vitor Augusto",

    initials:
      "VA",

    action:
      "solicitou revisão de um dado do Compass.",

    time:
      "há 1 h",
  },

  {
    id: 2,

    postId: 3,

    user:
      "Murilo Cordeiro",

    initials:
      "MC",

    action:
      "publicou um novo insight sobre o Territory.",

    time:
      "há 3 h",
  },

  {
    id: 3,

    postId: 4,

    user:
      "Ana Laura",

    initials:
      "AL",

    action:
      "registrou uma decisão da equipe.",

    time:
      "ontem",
  },
];