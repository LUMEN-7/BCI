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

export const initialPosts = [
  {
    id: 1,
    type: "comparison",
    author: {
      name: "Ianny Raquel",
      initials: "IR",
    },
    createdAt: "há 20 min",
    content:
      "Atualizei a comparação entre Ford Territory e Jeep Compass. Identifiquei diferenças importantes entre as versões analisadas.",
    tags: ["Territory", "Compass"],
    linkedItem: {
      type: "comparison",
      title: "Territory × Compass",
    },
    likes: 4,
    liked: false,
    comments: [
      {
        id: 1,
        author: "Ana Laura",
        initials: "AL",
        time: "há 15 min",
        content:
          "Podemos incluir também a versão topo de linha na comparação?",
      },
      {
        id: 2,
        author: "Ianny Raquel",
        initials: "IR",
        time: "há 10 min",
        content:
          "Sim! Vou adicionar essa versão antes da próxima revisão.",
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
    createdAt: "há 1h",
    content:
      "O valor de potência registrado para o Compass precisa ser validado antes de utilizarmos o dado na apresentação.",
    tags: ["Compass", "Motorização"],
    linkedItem: {
      type: "vehicle",
      title: "Jeep Compass",
    },
    likes: 2,
    liked: false,
    comments: [
      {
        id: 1,
        author: "Murilo",
        initials: "MC",
        time: "há 45 min",
        content:
          "Vou conferir novamente a fonte utilizada para esse dado.",
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
    createdAt: "há 3h",
    content:
      "O Territory apresenta uma vantagem interessante em equipamentos de série quando comparado aos concorrentes selecionados.",
    tags: ["Territory", "Equipamentos"],
    linkedItem: {
      type: "analysis",
      title: "SUVs Médios 2026",
    },
    likes: 7,
    liked: true,
    comments: [],
  },

  {
    id: 4,
    type: "decision",
    author: {
      name: "Ana Laura",
      initials: "AL",
    },
    createdAt: "ontem",
    content:
      "A equipe decidiu utilizar versões intermediárias como referência principal para a próxima análise competitiva.",
    tags: ["Metodologia", "Equipe"],
    linkedItem: null,
    likes: 5,
    liked: false,
    comments: [],
  },
];

export const workspaceMembers = [
  "Ana Laura",
  "Ianny Raquel",
  "Gerônimo",
  "Murilo Cordeiro",
  "Vitor Augusto",
];