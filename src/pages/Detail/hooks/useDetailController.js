import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { direct } from "@/services/comprationService";
import { salvarComparacao } from "@/services/userService";
import { exportCar } from "@/services/exportService";
import {
  analisarComparacao,
  buscarFeaturesECompletarVeiculo,
} from "@/services/aiService";

function extractList(source) {
  if (!source) return [];
  if (Array.isArray(source)) {
    return source.map((item) =>
      typeof item === "object"
        ? item.nome || item.descricao || item.label || String(item)
        : String(item)
    );
  }
  if (typeof source === "string") return [source];
  return [];
}

function adaptCarToComparison(dto) {
  if (!dto) return null;

    const safeExtract = (obj, suffix = "") => {
    if (obj === null || obj === undefined) return "Não informado";

    // Já é primitivo — usa direto
    if (typeof obj === "string" || typeof obj === "number") {
        return `${obj}${suffix}`;
    }

    const fontesArray = obj?.Fontes || obj?.fontes;
    let val;

    if (Array.isArray(fontesArray) && fontesArray.length > 0) {
        val = fontesArray[0]?.Valor ?? fontesArray[0]?.valor;
    } else if (fontesArray && typeof fontesArray === "object") {
        val = fontesArray.Valor ?? fontesArray.valor;
    }

    val = val ?? obj?.Valor ?? obj?.valor;

    if (Array.isArray(val)) val = val.join(", ");

    // Trava final: nunca deixa objeto virar string
    if (val === undefined || val === null || val === "" || typeof val === "object") {
        return "Não informado";
    }

    return `${val}${suffix}`;
    };

  const specs = dto.especificacoes?.[0] || dto.specs || {};
  const consumos = dto.consumos?.[0] || {};
  const dimensoes = dto.dimensoes?.[0] || {};
  const extras = dto.extras?.[0] || {};
  const pneus = dto.pneus?.[0] || {};  // <- faltava
  const secoes = dto.secoes || dto.sections || dto.recursos || dto;

  return {
    id: dto.id,
    name: `${dto.marca} ${dto.modelo} ${dto.ano}`,
    brand: dto.marca,
    image: dto.imagemUrl || "https://via.placeholder.com/600x400?text=Sem+Foto",

      specs: {
    model: dto.modelo || specs.model || "Não informado",
    brand: dto.marca || specs.brand || "Não informado",
    year: dto.ano?.toString() || specs.year || "Não informado",
    driveModes: safeExtract(dto.modos || specs.driveModes),

    engine: safeExtract(specs.engine || specs.motor),
    power: safeExtract(specs.power || specs.potencia, " cv"),
    torque: safeExtract(specs.torque, " kgfm"),
    powerRpm: safeExtract(specs.powerRpm || specs.potenciaRpm, " rpm"),      // <- faltava
    torqueRpm: safeExtract(specs.torqueRpm, " rpm"),                        // <- faltava
    transmission: safeExtract(specs.transmission || specs.transmissao),
    drivetrain: safeExtract(specs.drivetrain || specs.tracao),
    type: safeExtract(dto.categoria || specs.type),

    cityConsumption: safeExtract(consumos.cidade || specs.cityConsumption, " km/l"),
    highwayConsumption: safeExtract(consumos.estrada || specs.highwayConsumption, " km/l"),

    length: safeExtract(dimensoes.comprimento || specs.length, " m"),
    width: safeExtract(dimensoes.largura || specs.width, " m"),
    height: safeExtract(dimensoes.altura || specs.height, " m"),
    wheelbase: safeExtract(dimensoes.entreEixos || specs.wheelbase, " m"),

    tireType: safeExtract(pneus.tipo || specs.tireType),              // <- faltava
    rim: safeExtract(pneus.aro || specs.rim, '"'),                    // <- faltava
    tireWidth: safeExtract(pneus.largura || specs.tireWidth, " mm"),  // <- faltava
    tireProfile: safeExtract(pneus.perfil || specs.tireProfile, "%"), // <- faltava

    tankCapacity: safeExtract(extras.capacidadeTanque || specs.tankCapacity, " L"),
    loadCapacity: safeExtract(extras.capacidadeCarga || specs.loadCapacity, " kg"),
    towingCapacity: safeExtract(extras.capacidadeReboque || specs.towingCapacity, " kg"), // <- também faltava, existe no detail
    fuelType: safeExtract(extras.tipoCombustivel || specs.fuelType),
  },

    sections: {
      performance: extractList(secoes.performance || secoes.desempenho),
      security: extractList(secoes.security || secoes.seguranca || secoes.segurança),
      technology: extractList(secoes.technology || secoes.tecnologia),
      comfort: extractList(secoes.comfort || secoes.conforto),
    },

    sources: dto.fontes || dto.sources || [],
  };
}

function hasEmptyFieldsOrSections(car) {
  if (!car) return false;
  const { specs, sections } = car;

  const hasEmptySpec = Object.values(specs || {}).some(
    (v) => !v || v === "Não informado"
  );

  const hasEmptySection =
    !sections.performance?.length ||
    !sections.security?.length ||
    !sections.technology?.length ||
    !sections.comfort?.length;

  return hasEmptySpec || hasEmptySection;
}

function getMissingSpecKeys(specs) {
  return Object.entries(specs)
    .filter(([, val]) => !val || val === "Não informado")
    .map(([key]) => key);
}

export default function useDetailController() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [expandedSection, setExpandedSection] = useState("base");

  const [cars, setCars] = useState([]);
  const [comparisonSummary, setComparisonSummary] = useState("");
  const [mathConclusions, setMathConclusions] = useState({});

  // Novos: loading específico da IA, não trava a tela toda
  const [aiEnriching, setAiEnriching] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  const carrosIdsRef = useRef(null);

  useEffect(() => {
    let isCurrentRequest = true;

    async function enriquecerComIA(adaptado, index) {
      if (!hasEmptyFieldsOrSections(adaptado)) return;
      try {
        const missing = getMissingSpecKeys(adaptado.specs);
        const enriched = await buscarFeaturesECompletarVeiculo(adaptado, missing);

        if (!isCurrentRequest) return;

        setCars((curr) => {
          const atual = curr[index];
          if (!atual) return curr;
          const next = [...curr];
          next[index] = {
            ...atual,
            specs: { ...atual.specs, ...enriched.specs },
            sections: {
              performance: atual.sections.performance.length ? atual.sections.performance : enriched.sections.performance,
              security: atual.sections.security.length ? atual.sections.security : enriched.sections.security,
              technology: atual.sections.technology.length ? atual.sections.technology : enriched.sections.technology,
              comfort: atual.sections.comfort.length ? atual.sections.comfort : enriched.sections.comfort,
            },
          };
          return next;
        });
      } catch (errAi) {
        console.warn("Falha ao enriquecer com IA:", errAi);
      }
    }

    async function fetchComparison() {
      // Aceita tanto o fluxo antigo (firstCar/secondCar) quanto o novo (cars: [ref, ...similares])
      const stateCars = location.state?.cars;
      const car1 = location.state?.firstCar;
      const car2 = location.state?.secondCar;
      const carRefs = Array.isArray(stateCars) && stateCars.length >= 2 ? stateCars : (car1 && car2 ? [car1, car2] : null);

      if (!carRefs) {
        navigate(-1);
        return;
      }

      try {
        setLoading(true);

        const ids = carRefs.map((c) => (Number.isFinite(c) ? c : c.id));
        carrosIdsRef.current = ids;

        const data = await direct(ids);
        if (!isCurrentRequest) return;

        const adaptedCars = ids.map((id, index) =>
          adaptCarToComparison(
            data.carrosComparados.find((c) => String(c.id) === String(id)) || data.carrosComparados[index]
          )
        );

        // Mostra a tela JÁ com os dados base do C# — sem esperar a IA
        setCars(adaptedCars);
        setComparisonSummary(data.parecerIA || "");
        setMathConclusions(data.conclusoesMatematicas || {});
        setLoading(false);

        // A partir daqui, tudo roda em background, com indicadores próprios
        setAiEnriching(true);
        await Promise.all(adaptedCars.map((adaptado, index) => enriquecerComIA(adaptado, index)));
        if (isCurrentRequest) setAiEnriching(false);

        // O resumo comparativo da IA é pareado (backend só entende dois veículos por vez)
        if (adaptedCars.length === 2) {
          setAiSummaryLoading(true);
          try {
            const aiCompare = await analisarComparacao(adaptedCars[0], adaptedCars[1], data.conclusoesMatematicas);
            if (isCurrentRequest) {
              setComparisonSummary(aiCompare.comparisonSummary || "Resumo comparativo não disponível.");
              setMathConclusions(aiCompare.mathConclusions || data.conclusoesMatematicas || {});
            }
          } catch (errAi) {
            console.warn("Falha ao obter resumo comparativo da IA:", errAi);
          } finally {
            if (isCurrentRequest) setAiSummaryLoading(false);
          }
        }
      } catch (err) {
        if (!isCurrentRequest) return;
        console.error(err);
        setError("Não foi possível gerar a comparação no momento.");
        setLoading(false);
      }
    }

    fetchComparison();
    return () => { isCurrentRequest = false; };
  }, [location.state, navigate]);

  function toggleSection(sectionId) {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  }

  async function toggleFavorite() {
    if (favorite || salvando || !carrosIdsRef.current) return;

    setSalvando(true);
    try {
      const requestPayload = JSON.stringify({ carrosIds: carrosIdsRef.current });
      const titulo = cars.map((c) => `${c?.brand ?? ""} ${c?.name ?? ""}`.trim()).join(" vs ");

      await salvarComparacao({ titulo, tipo: "Direta", requestPayload });
      setFavorite(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a comparação.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExport(formato, separador) {
    if (cars.length < 2) return;
    try {
      await exportCar(
        cars.map((c) => ({ linhagemId: Number(c.id) })),
        formato,
        undefined,
        separador
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao exportar a comparação.");
    }
  }

  return {
    loading,
    error,
    cars,
    firstCar: cars[0] || null,
    secondCar: cars[1] || null,
    favorite,
    salvando,
    handleExport,
    expandedSection,
    comparisonSummary,
    mathConclusions,
    aiEnriching,       // <- novo: true enquanto specs/seções da IA ainda estão chegando
    aiSummaryLoading,
    handleBack: () => navigate(-1),
    handleHome: () => navigate("/home"),
    toggleFavorite,
    toggleSection,
  };
}