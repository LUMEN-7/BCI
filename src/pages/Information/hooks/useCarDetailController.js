import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obterCarro } from '@/services/carsService';
import { getFavorites, getFavoriteIds, removeFavorite, addFavorites } from '@/services/userService';
import { exportCar } from '@/services/exportService';
import {
  analisarVeiculo,
  buscarFeaturesECompletarVeiculo,
} from '@/services/aiService';
import { appendRecentViewedCar } from '@/utils/recentViewedCars';
import { getImportedVehicles, removeImportedVehicle, saveImportedVehicle } from '@/utils/importedVehiclesStorage';

function extractList(source) {
  if (!source) return [];

  if (typeof source === "string") {
    return source
      .split(/[;\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((value) => ({ value, source: null, confidence: 0 }));
  }

  if (Array.isArray(source)) {
    return source.flatMap((item) => extractList(item));
  }

  const fontes = source.fontes || source.Fontes || [];
  const confEnvelope = Math.round((source.confianca ?? source.Confianca ?? 0) * 100);

  if (fontes.length) {
    return fontes.flatMap((f) => {
      const val = f?.valor ?? f?.Valor;
      const items = typeof val === "string"
        ? val.split(/[;\n,]/).map((s) => s.trim()).filter(Boolean)
        : extractList(val).map((x) => x.value ?? x);
      const confItem = Math.round((f.confianca ?? f.Confianca ?? source.confianca ?? source.Confianca ?? 0) * 100);
      const fonte = f.fonte ?? f.Fonte ?? null;
      return items.map((value) => ({
        value,
        source: fonte,
        confidence: confItem || confEnvelope,
      }));
    });
  }

  return extractList(source.valor ?? source.Valor);
}

function hasEmptySections(sections) {
  if (!sections) return true;
  return (
    !sections.performance?.length ||
    !sections.security?.length ||
    !sections.technology?.length ||
    !sections.comfort?.length
  );
}

function adaptCarToDetail(dto) {
  if (!dto) return null;

  const rawFontes = dto.fontes || dto.Fontes || dto.sources || dto.Sources || [];
  const fontesList = Array.isArray(rawFontes) ? rawFontes : [];

  const safeExtract = (obj, suffix = '') => {
    if (!obj) return { value: 'Não informado', source: null, confidence: 0 };

    const fontesArray = obj?.Fontes || obj?.fontes;
    const firstFonte = Array.isArray(fontesArray)
      ? fontesArray[0]
      : typeof fontesArray === 'object' && fontesArray !== null
      ? fontesArray
      : null;

    let val =
      firstFonte?.Valor ??
      firstFonte?.valor ??
      obj?.Valor ??
      obj?.valor ??
      (typeof obj === 'string' || typeof obj === 'number' ? obj : null);

    const rawSource =
      firstFonte?.Fonte ??
      firstFonte?.fonte ??
      firstFonte?.Url ??
      firstFonte?.url ??
      firstFonte?.Link ??
      firstFonte?.link ??
      firstFonte?.Site ??
      firstFonte?.site ??
      firstFonte?.Nome ??
      firstFonte?.nome ??
      obj?.Fonte ??
      obj?.fonte ??
      obj?.source ??
      null;

    const confBruta = obj?.Confianca ?? obj?.confianca ?? 0;
    const confidence = Math.round(confBruta * 100);

    if (Array.isArray(val)) {
      val = val.join(', ');
    }

    let sourceValue = rawSource ? String(rawSource).trim() : null;
    if (sourceValue && fontesList.length > 0) {
      const fonteEncontrada = fontesList.find(
        (f) =>
          String(f.id ?? f.Id ?? '') === sourceValue ||
          String(f.url ?? f.Url ?? '') === sourceValue ||
          String(f.link ?? f.Link ?? '') === sourceValue ||
          String(f.site ?? f.Site ?? '') === sourceValue ||
          String(f.nome ?? f.Nome ?? '') === sourceValue
      );
      if (fonteEncontrada) {
        sourceValue =
          fonteEncontrada.url ||
          fonteEncontrada.Url ||
          fonteEncontrada.link ||
          fonteEncontrada.Link ||
          fonteEncontrada.site ||
          fonteEncontrada.Site ||
          fonteEncontrada.nome ||
          fonteEncontrada.Nome ||
          sourceValue;
      }
    }

    const finalValue =
      val !== null && val !== undefined && val !== 'Não informado' && val !== ''
        ? `${val}${suffix}`
        : 'Não informado';

    return {
      value: finalValue,
      source: sourceValue,
      confidence,
    };
  };

  const specs = dto.especificacoes?.[0] || dto.Especificacoes?.[0] || {};
  const consumos = dto.consumos?.[0] || dto.Consumos?.[0] || {};
  const dimensoes = dto.dimensoes?.[0] || dto.Dimensoes?.[0] || {};
  const extras = dto.extras?.[0] || dto.Extras?.[0] || {};
  const pneus = dto.pneus?.[0] || dto.Pneus?.[0] || {};
  
  console.log(extras)
  return {
    id: dto.id || dto.Id || dto.linhagemId || dto.LinhagemId,
    name: `${dto.modelo || dto.Modelo || ''} ${dto.ano || dto.Ano || ''}`.trim(),
    brand: dto.marca || dto.Marca,
    image:
      dto.imagemUrl ||
      dto.ImagemUrl ||
      'https://via.placeholder.com/600x400?text=Sem+Foto',
    description:
      dto.descricao ||
      dto.Descricao ||
      'Dados técnicos detalhados extraídos da base da API Forde.',
    lastUpdated: 'Hoje',
    updatedAgo: 'Base atualizada',
    sources: fontesList,
    fontes: fontesList,

    specs: {
      model: { value: dto.modelo || dto.Modelo, confidence: 100 },
      brand: { value: dto.marca || dto.Marca, confidence: 100 },
      year: {
        value: (dto.ano || dto.Ano || '').toString(),
        confidence: 100,
      },

      engine: safeExtract(specs.motor || specs.Motor),
      power: safeExtract(specs.potencia || specs.Potencia, ' cv'),
      type: safeExtract(dto.categoria || dto.Categoria),
      consumption: safeExtract(consumos.cidade || consumos.Cidade, ' km/l'),

      torque: safeExtract(specs.torque || specs.Torque, ' kgfm'),
      powerRpm: safeExtract(specs.potenciaRpm || specs.PotenciaRpm, ' rpm'),
      torqueRpm: safeExtract(specs.torqueRpm || specs.TorqueRpm, ' rpm'),
      transmission: safeExtract(specs.transmissao || specs.Transmissao),
      drivetrain: safeExtract(specs.tracao || specs.Tracao),

      cityConsumption: safeExtract(
        consumos.cidade || consumos.Cidade,
        ' km/l'
      ),
      highwayConsumption: safeExtract(
        consumos.estrada || consumos.Estrada,
        ' km/l'
      ),

      length: safeExtract(
        dimensoes.comprimento || dimensoes.Comprimento,
        ' m'
      ),
      width: safeExtract(dimensoes.largura || dimensoes.Largura, ' m'),
      height: safeExtract(dimensoes.altura || dimensoes.Altura, ' m'),
      wheelbase: safeExtract(
        dimensoes.entreEixos || dimensoes.EntreEixos,
        ' m'
      ),

      tireType: safeExtract(pneus.tipo || pneus.Tipo),
      rim: safeExtract(pneus.aro || pneus.Aro, '"'),
      tireWidth: safeExtract(pneus.largura || pneus.Largura, ' mm'),
      tireProfile: safeExtract(pneus.perfil || pneus.Perfil, '%'),

      tankCapacity: safeExtract(
        extras.capacidadeTanque || extras.CapacidadeTanque,
        ' L'
      ),
      fuelType: safeExtract(extras.tipoCombustivel || extras.TipoCombustivel),
      loadCapacity: safeExtract(
        extras.capacidadeCarga || extras.CapacidadeCarga,
        ' kg'
      ),
      towingCapacity: safeExtract(
        extras.capacidadeReboque || extras.CapacidadeReboque,
        ' kg'
      ),

      driveModes: safeExtract(dto.modos || dto.Modos),
    },
    sections: {
      performance: extractList(extras.performance || extras.desempenho),
      security: extractList(extras.security || extras.seguranca || extras.segurança),
      technology: extractList(extras.technology || extras.tecnologia || extras.tecnologias),
      comfort: extractList(extras.comfort || extras.conforto),
    },
    analysis: {
      strengths: [],
      weaknesses: [],
      bestUse: '',
      competitors: [],
    },
  };
}

function adaptImportedVehicleToDetail(vehicle) {
  const spec = (value) => ({ value: value || 'Não informado', source: null, confidence: 100 });
  const list = (value) => Array.isArray(value)
    ? value
    : String(value || '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

  return {
    ...vehicle,
    id: String(vehicle.id),
    name: `${vehicle.modelo || 'Modelo sem nome'} ${vehicle.ano || ''}`.trim(),
    image: vehicle.image || 'https://via.placeholder.com/600x400?text=Sem+Foto',
    description: vehicle.description || 'Veículo cadastrado manualmente no Search.',
    isImported: true,
    sources: [],
    fontes: [],
    specs: {
      model: spec(vehicle.modelo), brand: spec(vehicle.brand), year: spec(vehicle.ano),
      engine: spec(vehicle.engine), power: spec(vehicle.power), type: spec(vehicle.segment),
      consumption: spec(vehicle.consumption || vehicle.cityConsumption),
      cityConsumption: spec(vehicle.cityConsumption), highwayConsumption: spec(vehicle.highwayConsumption),
      torque: spec(vehicle.torque), transmission: spec(vehicle.transmission), drivetrain: spec(vehicle.drivetrain),
      driveModes: spec('Não informado'), length: spec(vehicle.length),
      width: spec(vehicle.width), height: spec(vehicle.height), wheelbase: spec(vehicle.wheelbase),
      tireType: spec(vehicle.tireType), rim: spec(vehicle.rim), tireWidth: spec(vehicle.tireWidth), tireProfile: spec(vehicle.tireProfile),
      tankCapacity: spec(vehicle.tankCapacity), fuelType: spec(vehicle.fuelType),
      loadCapacity: spec(vehicle.loadCapacity), towingCapacity: spec(vehicle.towingCapacity),
    },
    sections: {
      performance: list(vehicle.performance), security: list(vehicle.security),
      technology: list(vehicle.technology), comfort: list(vehicle.comfort),
    },
    analysis: { strengths: [], weaknesses: [], bestUse: '', competitors: [] },
  };
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const match = String(value).match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  return Number(match[1].replace(',', '.'));
}

// traduz o carro da ficha técnica para o formato usado na tela de comparação
function adaptCarToCompareSelection(car) {
  if (!car) return null;

  const specValue = (spec) => (spec?.value && spec.value !== 'Não informado' ? spec.value : null);

  return {
    id: car.id,
    brand: car.brand,
    name: car.name,
    image: car.image,
    engine: specValue(car.specs.engine) || 'Motor não informado',
    power: specValue(car.specs.power) || '-- cv',
    powerValue: parseNumber(specValue(car.specs.power)),
    type: specValue(car.specs.type) || 'Geral',
    transmission: specValue(car.specs.transmission),
    price: null,
    dimensions: {
      length: parseNumber(specValue(car.specs.length)),
      width: parseNumber(specValue(car.specs.width)),
      height: parseNumber(specValue(car.specs.height)),
      wheelbase: parseNumber(specValue(car.specs.wheelbase)),
    },
    safetyFeatures: car.sections?.security || [],
    technologyFeatures: car.sections?.technology || [],
  };
}

export default function useCarDetailController() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [car, setCar] = useState(null);
  const [importedVehicle, setImportedVehicle] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [favorites, setFavorites] = useState([]);

  const [openSection, setOpenSection] = useState('base');
  const [showSources, setShowSources] = useState(false);




useEffect(() => {
    let isCurrentRequest = true;
    function getMissingSpecKeys(specs) {
    return Object.entries(specs)
        .filter(([, val]) => !val || val.value === 'Não informado')
        .map(([key]) => key);
    }
    async function rodarEnriquecimentos(adapted, dto) {
    const missingFields = getMissingSpecKeys(adapted.specs);
    const precisaEnrich = missingFields.length > 0 || hasEmptySections(adapted.sections);
    // console.log(missingFields)
    // console.log(adapted.specs)
    if (precisaEnrich) {
        try {
        const enriched = await buscarFeaturesECompletarVeiculo(adapted, missingFields);
        // console.log('ENRICHED SPECS:', JSON.stringify(enriched.specs, null, 2));
        // console.log('ENRICHED SECTIONS:', JSON.stringify(enriched.sections, null, 2));
        if (isCurrentRequest && enriched) {
            setCar((curr) => {
            if (!curr) return curr;

            const mergedSpecs = { ...curr.specs };
            if (enriched.specs) {
                for (const [key, value] of Object.entries(enriched.specs)) {
                // ainda protege contra a IA devolver algo fora da lista pedida
                if (missingFields.includes(key) && value) {
                    mergedSpecs[key] = { value: String(value), source: null, confidence: 0 };
                }
                }
            }
            const novo =  {
                ...curr,
                specs: mergedSpecs,
                sections: enriched.sections
                ? {
                    performance: curr.sections.performance.length ? curr.sections.performance : enriched.sections.performance,
                    security: curr.sections.security.length ? curr.sections.security : enriched.sections.security,
                    technology: curr.sections.technology.length ? curr.sections.technology : enriched.sections.technology,
                    comfort: curr.sections.comfort.length ? curr.sections.comfort : enriched.sections.comfort,
                }
                : curr.sections,
            };
            console.log('NOVO CAR.SECTIONS:', novo.sections);
            return novo
            });
        }
        } catch (enrichErr) {
        console.warn('Falha no enriquecimento de seções:', enrichErr);
        }
    }

      if (!isCurrentRequest) return;
      setAnalysisLoading(true);
      setAnalysisError('');
      try {
        const analysis = await analisarVeiculo({ nome: adapted.name, marca: adapted.brand, ano: adapted.specs.year.value, dados: dto });
        if (isCurrentRequest) setCar((curr) => (curr ? { ...curr, analysis } : curr));
      } catch (analysisErr) {
        if (isCurrentRequest) {
          console.error(analysisErr);
          setAnalysisError(analysisErr.message || 'Não foi possível gerar a análise da IA.');
        }
      } finally {
        if (isCurrentRequest) setAnalysisLoading(false);
      }
    }

    async function fetchCarDetails() {
      if (!id) return;
      try {
        setLoading(true);
        setError('');

        const imported = location.state?.car?.isImported
          ? location.state.car
          : getImportedVehicles().find((vehicle) => String(vehicle.id) === String(id));

        if (imported) {
          const adaptedImported = adaptImportedVehicleToDetail(imported);
          appendRecentViewedCar(adaptedImported);
          setImportedVehicle(imported);
          setCar(adaptedImported);
          const favoritos = await getFavorites().catch(() => []);
          setFavorites(getFavoriteIds(favoritos));
          setLoading(false);
          return;
        }

        const dto = await obterCarro(id);
        if (!isCurrentRequest) return;

        const adapted = adaptCarToDetail(dto);
        if (!adapted) {
          setError('Veículo não encontrado.');
          setLoading(false);
          return;
        }

        appendRecentViewedCar(adapted);
        setCar(adapted);
        const favoritos = await getFavorites().catch(() => []);
        setFavorites(getFavoriteIds(favoritos));
        setLoading(false);

        rodarEnriquecimentos(adapted, dto); // dto passado explicitamente agora
      } catch (err) {
        if (!isCurrentRequest) return;
        console.error(err);
        setError('Não foi possível carregar os detalhes do veículo.');
        setLoading(false);
      }
    }

    fetchCarDetails();
    return () => { isCurrentRequest = false; };
}, [id]);


  async function toggleFavorite() {
    const strId = String(id);
    const jaFavoritado = favorites.includes(strId);
    try {
      if (jaFavoritado) {
        await removeFavorite(id);
        setFavorites((prev) => prev.filter((f) => f !== strId));
      } else {
        await addFavorites(id);
        setFavorites((prev) => [...prev, strId]);
      }
      return { success: true, acao: jaFavoritado ? 'removido' : 'adicionado' };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  async function generateAnalysis() {
    if (!car || analysisLoading) return;
    setAnalysisLoading(true);
    setAnalysisError('');
    try {
      const analysis = await analisarVeiculo({
        nome: car.name,
        marca: car.brand,
        ano: car.specs.year.value,
        dados: car,
      });
      setCar((current) => (current ? { ...current, analysis } : current));
    } catch (analysisErr) {
      setAnalysisError(analysisErr.message || 'Não foi possível gerar a análise da IA.');
    } finally {
      setAnalysisLoading(false);
    }
  }

  function updateImportedVehicle(vehicle) {
    const saved = saveImportedVehicle(vehicle);
    setImportedVehicle(saved);
    setCar(adaptImportedVehicleToDetail(saved));
  }

  function deleteImportedVehicle() {
    if (!car?.isImported) return;
    removeImportedVehicle(car.id);
    navigate('/search');
  }

  async function handleExport(formato = 'csv', separador = ',') {
    try {
      await exportCar([{ linhagemId: Number(id) }], formato, undefined, separador);
    } catch (error) {
      console.error(error);
      alert('Erro ao exportar dados do veículo.');
    }
  }

  return {
    loading,
    error,
    car,
    importedVehicle,
    analysisLoading,
    analysisError,
    favorites,
    isFavorite: favorites.includes(String(id)),
    isImported: Boolean(car?.isImported),
    openSection,
    showSources,
    handleBack: () => navigate(-1),
    handleHome: () => navigate('/home'),
    handleCompare: () => navigate('/compare', { state: { firstCar: adaptCarToCompareSelection(car) } }),
    toggleFavorite,
    toggleSection: (sectionId) =>
      setOpenSection((curr) => (curr === sectionId ? null : sectionId)),
    toggleSources: () => setShowSources((curr) => !curr),
    handleExport,
    generateAnalysis,
    updateImportedVehicle,
    deleteImportedVehicle,
  };
}