export const COLORS = {
  primary: "#00142e",
  secondary: "#0562d2",
  muted: "#737d89",
  border: "#d8dce1",
  softBorder: "#e8edf2",
  surface: "#ffffff",
  surfaceSoft: "#f1f2f0",
  blue: "#0562d2",
  cyan: "#1682a8",
  green: "#16876e",
  red: "#c9434f",
  slate: "#64748b",
};

export const SEGMENTOS = ["Todos", "SUV compacto", "Sedã médio", "Picape média"];

export const FEATURE_META = {
  adas2: { label: "ADAS nível 2 de série", color: COLORS.blue },
  hibrido: { label: "Motorização híbrida", color: COLORS.cyan },
  tetoPanoramico: { label: "Teto solar panorâmico", color: COLORS.green },
};

export const FEATURE_ADOPTION = [
  { periodo: "T1 24", adas2: 34, hibrido: 21, tetoPanoramico: 18 },
  { periodo: "T2 24", adas2: 38, hibrido: 24, tetoPanoramico: 20 },
  { periodo: "T3 24", adas2: 44, hibrido: 29, tetoPanoramico: 23 },
  { periodo: "T4 24", adas2: 49, hibrido: 33, tetoPanoramico: 24 },
  { periodo: "T1 25", adas2: 55, hibrido: 39, tetoPanoramico: 27 },
  { periodo: "T2 25", adas2: 61, hibrido: 45, tetoPanoramico: 29 },
  { periodo: "T3 25", adas2: 67, hibrido: 52, tetoPanoramico: 33 },
];

export const SEGMENT_BRAND = {
  "SUV compacto": [{ marca: "Ford", pct: 58 }, { marca: "Toyota", pct: 71 }, { marca: "Honda", pct: 64 }, { marca: "Hyundai", pct: 69 }, { marca: "Volkswagen", pct: 52 }],
  "Sedã médio": [{ marca: "Ford", pct: 41 }, { marca: "Toyota", pct: 63 }, { marca: "Honda", pct: 59 }, { marca: "Hyundai", pct: 55 }, { marca: "Volkswagen", pct: 47 }],
  "Picape média": [{ marca: "Ford", pct: 72 }, { marca: "Toyota", pct: 66 }, { marca: "Chevrolet", pct: 61 }, { marca: "Volkswagen", pct: 38 }],
};

export const POWERTRAIN_MIX = [
  { ano: "2021", combustao: 82, hibrido: 14, plugin: 3, eletrico: 1 },
  { ano: "2022", combustao: 74, hibrido: 18, plugin: 5, eletrico: 3 },
  { ano: "2023", combustao: 66, hibrido: 22, plugin: 7, eletrico: 5 },
  { ano: "2024", combustao: 57, hibrido: 26, plugin: 9, eletrico: 8 },
  { ano: "2025", combustao: 47, hibrido: 29, plugin: 11, eletrico: 13 },
];

export const SCATTER_DATA = [
  ["Ford", "Territory", 174, 10.8], ["Ford", "Bronco Sport", 181, 9.9],
  ["Toyota", "Corolla Cross", 177, 12.4], ["Toyota", "RAV4", 203, 11.6],
  ["Honda", "HR-V", 177, 12.1], ["Honda", "CR-V", 190, 10.9],
  ["Hyundai", "Creta", 130, 13.2], ["Hyundai", "Tucson", 187, 11.1],
  ["Volkswagen", "Taos", 150, 12.0], ["Volkswagen", "Tiguan", 187, 10.6],
].map(([marca, modelo, potencia, consumo]) => ({ marca, modelo, potencia, consumo }));

export const RADAR_MODELOS = ["Ford Territory", "Toyota Corolla Cross", "Honda HR-V", "Hyundai Creta"];
export const RADAR_COLOR = { "Ford Territory": COLORS.blue, "Toyota Corolla Cross": COLORS.cyan, "Honda HR-V": COLORS.green, "Hyundai Creta": COLORS.red };
export const RADAR_DATA = [
  { atributo: "Potência", "Ford Territory": 68, "Toyota Corolla Cross": 71, "Honda HR-V": 70, "Hyundai Creta": 48 },
  { atributo: "Autonomia", "Ford Territory": 62, "Toyota Corolla Cross": 74, "Honda HR-V": 69, "Hyundai Creta": 66 },
  { atributo: "Porta-malas", "Ford Territory": 71, "Toyota Corolla Cross": 58, "Honda HR-V": 61, "Hyundai Creta": 55 },
  { atributo: "Tecnologia", "Ford Territory": 64, "Toyota Corolla Cross": 69, "Honda HR-V": 73, "Hyundai Creta": 51 },
  { atributo: "Custo-benefício", "Ford Territory": 59, "Toyota Corolla Cross": 62, "Honda HR-V": 54, "Hyundai Creta": 77 },
];

export const SOURCE_FREQUENCY = [
  { fonte: "Toyota Newsroom BR", atualizacoes: 27 }, { fonte: "Webmotors", atualizacoes: 24 },
  { fonte: "Hyundai Press", atualizacoes: 19 }, { fonte: "Honda Brasil", atualizacoes: 16 },
  { fonte: "Quatro Rodas", atualizacoes: 14 }, { fonte: "VW Newsroom", atualizacoes: 11 },
];

export const INSIGHTS = [
  { categoria: "Powertrain", cor: COLORS.cyan, resumo: "Concorrentes diretos no segmento de SUV compacto aceleraram lançamentos híbridos nos últimos 2 trimestres, subindo de 33% para 52% de adoção.", confianca: 88, fontes: ["Toyota Newsroom BR", "Quatro Rodas"], status: "pendente" },
  { categoria: "Recursos", cor: COLORS.blue, resumo: "ADAS nível 2 de série deixou de ser diferencial de topo de linha e passou a aparecer também em versões intermediárias em 3 dos 5 concorrentes monitorados.", confianca: 91, fontes: ["Webmotors", "Honda Brasil"], status: "aprovado" },
  { categoria: "Preço", cor: COLORS.green, resumo: "Diferença média de preço entre versão híbrida e a combustão equivalente caiu de ~18% para ~11% no segmento sedã médio no último ano.", confianca: 74, fontes: ["Quatro Rodas"], status: "pendente" },
  { categoria: "Opinião pública", cor: COLORS.muted, resumo: "Fase ainda não implementada: vai reunir sentimento de reviews, fóruns e redes sociais sobre lançamentos da concorrência.", confianca: null, fontes: [], status: "em breve" },
];

export const BRAND_COLOR = { Ford: COLORS.blue, Toyota: COLORS.cyan, Honda: COLORS.green, Hyundai: COLORS.red, Volkswagen: COLORS.slate, Chevrolet: "#a9a15b" };
