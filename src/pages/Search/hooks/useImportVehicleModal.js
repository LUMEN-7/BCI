import { useEffect, useRef, useState } from 'react';
import { importarVeiculo } from '@/services/carsService';

export const EMPTY_VEHICLE = {
  brand: '', modelo: '', ano: '', segment: '', engine: '', power: '',
  transmission: '', price: '', consumption: '', cityConsumption: '', highwayConsumption: '',
  torque: '', drivetrain: '',
  length: '', width: '', height: '', wheelbase: '',
  tireType: '', rim: '', tireWidth: '', tireProfile: '',
  tankCapacity: '', fuelType: '', loadCapacity: '', towingCapacity: '',
  performance: '', security: '', technology: '', comfort: '',
  description: '', image: null,
};

export const FIELD_GROUPS = [
  {
    title: 'Identidade do modelo',
    fields: [
      ['brand', 'Marca', 'Ex: Ford'],
      ['modelo', 'Modelo', 'Ex: Territory'],
      ['ano', 'Ano', 'Ex: 2025'],
      ['segment', 'Categoria', 'Ex: SUV'],
      ['description', 'Descrição', 'Resumo do modelo'],
    ],
  },
  {
    title: 'Motorização e desempenho',
    fields: [
      ['engine', 'Motor', 'Ex: 1.5 EcoBoost'],
      ['power', 'Potência', 'Ex: 169'],
      ['torque', 'Torque', 'Ex: 25'],
      ['transmission', 'Transmissão', 'Ex: Automática'],
      ['drivetrain', 'Tração', 'Ex: 4x2'],
      ['price', 'Preço', 'Ex: 189990'],
    ],
  },
  {
    title: 'Consumo e dimensões',
    fields: [
      ['consumption', 'Consumo', 'Ex: 12,4 km/l'],
      ['cityConsumption', 'Consumo urbano', 'Ex: 10,8'],
      ['highwayConsumption', 'Consumo estrada', 'Ex: 13,6'],
      ['length', 'Comprimento (mm)', 'Ex: 4800'],
      ['width', 'Largura (mm)', 'Ex: 1900'],
      ['height', 'Altura (mm)', 'Ex: 1700'],
      ['wheelbase', 'Entre-eixos (mm)', 'Ex: 2800'],
    ],
  },
  {
    title: 'Pneus e capacidades',
    fields: [
      ['tireType', 'Tipo de pneu', 'Ex: 235/55 R18'],
      ['rim', 'Aro', 'Ex: 18'],
      ['tireWidth', 'Largura do pneu (mm)', 'Ex: 235'],
      ['tireProfile', 'Perfil do pneu', 'Ex: 55'],
      ['tankCapacity', 'Tanque (L)', 'Ex: 60'],
      ['fuelType', 'Combustível', 'Ex: Gasolina'],
      ['loadCapacity', 'Carga (kg)', 'Ex: 450'],
      ['towingCapacity', 'Reboque (kg)', 'Ex: 1500'],
    ],
  },
];

export const FEATURE_GROUPS = [
  ['performance', 'Performance'],
  ['security', 'Segurança'],
  ['technology', 'Tecnologia'],
  ['comfort', 'Conforto'],
];

export function normalizeFeatureItems(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value || '').split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeVehicle(source = {}) {
  const entries = Object.entries(source).reduce((result, [key, value]) => {
    result[normalizeKey(key)] = value;
    return result;
  }, {});

  const pick = (...keys) => keys.map(normalizeKey).map((key) => entries[key]).find((value) => value !== undefined && value !== '');

  return {
    brand: pick('brand', 'marca') || '',
    modelo: pick('modelo', 'model', 'nome', 'name') || '',
    ano: pick('ano', 'year') || '',
    segment: pick('segmento', 'categoria', 'tipo', 'segment', 'type') || '',
    engine: pick('motor', 'engine') || '',
    power: pick('potencia', 'power', 'cavalos', 'potencia_cv') || '',
    transmission: pick('transmissao', 'transmission', 'cambio') || '',
    price: pick('preco', 'price', 'valor') || '',
    consumption: pick('consumo', 'consumption') || '',
    cityConsumption: pick('consumocidade', 'cityconsumption', 'consumo_cidade_km_l') || '',
    highwayConsumption: pick('consumoestrada', 'highwayconsumption', 'consumo_estrada_km_l') || '',
    torque: pick('torque', 'torque_kgfm') || '',
    drivetrain: pick('tracao', 'drivetrain') || '',
    length: pick('comprimento', 'length', 'comprimento_mm') || '',
    width: pick('largura', 'width', 'largura_mm') || '',
    height: pick('altura', 'height', 'altura_mm') || '',
    wheelbase: pick('entreeixos', 'wheelbase', 'entre_eixos_mm') || '',
    tireType: pick('tipopneu', 'tiretype', 'pneu_tipo') || '',
    rim: pick('aro', 'rim', 'pneu_aro') || '',
    tireWidth: pick('largurapneu', 'tirewidth', 'pneu_largura_mm') || '',
    tireProfile: pick('perfilpneu', 'tireprofile', 'pneu_perfil_pct') || '',
    tankCapacity: pick('capacidadetanque', 'tankcapacity', 'capacidade_tanque_l') || '',
    fuelType: pick('tipocombustivel', 'fueltype', 'tipo_combustivel') || '',
    loadCapacity: pick('capacidadecarga', 'loadcapacity', 'capacidade_carga_kg') || '',
    towingCapacity: pick('capacidadereboque', 'towingcapacity', 'capacidade_reboque_kg') || '',
    performance: pick('performance', 'desempenho') || '',
    security: pick('seguranca', 'security', 'segurança') || '',
    technology: pick('tecnologia', 'technology', 'tecnologias') || '',
    comfort: pick('conforto', 'comfort') || '',
    description: pick('descricao', 'description') || '',
    image: pick('imagem', 'imagemurl', 'image', 'imageurl', 'foto') || null,
  };
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean).map((row) => row.split(/[,;\t]/).map((value) => value.trim().replace(/^['"]|['"]$/g, '')));
  if (rows.length < 2) return {};
  const [headers, values] = rows;
  return headers.reduce((result, header, index) => ({ ...result, [header]: values[index] || '' }), {});
}

// Extrai o primeiro número de uma string tipo "169 cv" -> "169".
// Limitação conhecida: não distingue separador decimal de milhar (ex: "189.990").
function toNumeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const match = String(value).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return match ? match[0] : null;
}

// Monta o payload com as chaves canônicas que o backend já sabe mapear
// (mesmos aliases usados na importação de arquivo em massa).
function buildImportPayload(vehicle) {
  
  const payload = {
    marca: vehicle.brand,
    modelo: vehicle.modelo,
    ano: toNumeric(vehicle.ano) ?? vehicle.ano,
    imagem_url: vehicle.image,
    categoria: vehicle.segment,
    transmissao: vehicle.transmission,
    tracao: vehicle.drivetrain,
    tipo_combustivel: vehicle.fuelType,
    pneu_tipo: vehicle.tireType,
  };

  const numericFields = {
    preco: vehicle.price,
    potencia_cv: vehicle.power,
    torque_kgfm: vehicle.torque,
    consumo_cidade_km_l: vehicle.cityConsumption,
    consumo_estrada_km_l: vehicle.highwayConsumption,
    altura_mm: vehicle.height,
    largura_mm: vehicle.width,
    comprimento_mm: vehicle.length,
    entre_eixos_mm: vehicle.wheelbase,
    pneu_aro: vehicle.rim,
    pneu_largura_mm: vehicle.tireWidth,
    pneu_perfil_pct: vehicle.tireProfile,
    capacidade_tanque_l: vehicle.tankCapacity,
    capacidade_reboque_kg: vehicle.towingCapacity,
    capacidade_carga_kg: vehicle.loadCapacity,
  };

  for (const [key, rawValue] of Object.entries(numericFields)) {
    const numero = toNumeric(rawValue);
    if (numero !== null) payload[key] = numero;
  }

  // "engine", "consumption", "description", "image" e as 4 features (performance/
  // security/technology/comfort) não têm coluna correspondente no back hoje —
  // ficam de fora do payload de propósito.

  return payload;
}

export default function useImportVehicleModal({ isOpen, initialVehicle, onSaved, onClose }) {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState('choice');
  const [vehicle, setVehicle] = useState(EMPTY_VEHICLE);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep(initialVehicle ? 'form' : 'choice');
    setVehicle({ ...EMPTY_VEHICLE, ...(initialVehicle || {}) });
    setFileName('');
    setError('');
    setWarning('');
  }, [isOpen, initialVehicle]);

  function updateField(field, value) {
    setVehicle((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setFileName(file.name);
    setError('');

    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text);
      const source = Array.isArray(parsed) ? parsed[0] : parsed;
      setVehicle((current) => ({ ...current, ...normalizeVehicle(source) }));
      setStep('form');
    } catch {
      setError('Não foi possível ler o arquivo. Use um JSON ou CSV válido.');
    }
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField('image', reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!vehicle.brand.trim() || !vehicle.modelo.trim()) {
      setError('Informe pelo menos a marca e o modelo do veículo.');
      return;
    }

    setSaving(true);
    setError('');
    setWarning('');

    try {
        console.log("bateu")
      const payload = buildImportPayload(vehicle);
      const resultado = await importarVeiculo(payload);
        
      if (resultado.colunasNaoReconhecidas?.length > 0) {
        setWarning(`Alguns campos não foram reconhecidos e não foram salvos: ${resultado.colunasNaoReconhecidas.join(', ')}`);
      }
      console.log(resultado.carro)
      onSaved(resultado.carro);
      onClose();
    } catch (err) {
      setError(err.message || 'Não foi possível salvar o veículo.');
    } finally {
      setSaving(false);
    }
  }

  return {
    fileInputRef, step, setStep, vehicle, fileName, error, warning, saving,
    updateField, handleFile, handlePhoto, handleSave,
  };
}