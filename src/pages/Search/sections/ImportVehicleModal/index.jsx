import { useEffect, useRef, useState } from 'react';
import {
  IoCarSportOutline,
  IoCloseOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoAddOutline,
  IoSaveOutline,
} from 'react-icons/io5';
import { saveImportedVehicle } from '@/utils/importedVehiclesStorage';
import './style.css';

const EMPTY_VEHICLE = {
  brand: '',
  modelo: '',
  ano: '',
  segment: '',
  engine: '',
  power: '',
  transmission: '',
  price: '',
  consumption: '',
  cityConsumption: '',
  highwayConsumption: '',
  torque: '',
  drivetrain: '',
  length: '', width: '', height: '', wheelbase: '',
  tireType: '', rim: '', tireWidth: '', tireProfile: '',
  tankCapacity: '', fuelType: '', loadCapacity: '', towingCapacity: '',
  performance: '',
  security: '',
  technology: '',
  comfort: '',
  description: '',
  image: null,
};

const FIELD_GROUPS = [
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
      ['power', 'Potência', 'Ex: 169 cv'],
      ['torque', 'Torque', 'Ex: 25 kgfm'],
      ['transmission', 'Transmissão', 'Ex: Automática'],
      ['drivetrain', 'Tração', 'Ex: 4x2'],
      ['price', 'Preço', 'Ex: R$ 189.990'],
    ],
  },
  {
    title: 'Consumo e dimensões',
    fields: [
      ['consumption', 'Consumo', 'Ex: 12,4 km/l'],
      ['cityConsumption', 'Consumo urbano', 'Ex: 10,8 km/l'],
      ['highwayConsumption', 'Consumo estrada', 'Ex: 13,6 km/l'],
      ['length', 'Comprimento', 'Ex: 4,8 m'],
      ['width', 'Largura', 'Ex: 1,9 m'],
      ['height', 'Altura', 'Ex: 1,7 m'],
      ['wheelbase', 'Entre-eixos', 'Ex: 2,8 m'],
    ],
  },
  {
    title: 'Pneus e capacidades',
    fields: [
      ['tireType', 'Tipo de pneu', 'Ex: All-terrain'],
      ['rim', 'Aro', 'Ex: 18"'],
      ['tireWidth', 'Largura do pneu', 'Ex: 235 mm'],
      ['tireProfile', 'Perfil do pneu', 'Ex: 55'],
      ['tankCapacity', 'Tanque', 'Ex: 60 L'],
      ['fuelType', 'Combustível', 'Ex: Gasolina'],
      ['loadCapacity', 'Carga', 'Ex: 450 kg'],
      ['towingCapacity', 'Reboque', 'Ex: 1.500 kg'],
    ],
  },
];

const FEATURE_GROUPS = [
  ['performance', 'Performance'],
  ['security', 'Segurança'],
  ['technology', 'Tecnologia'],
  ['comfort', 'Conforto'],
];

function normalizeFeatureItems(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value || '').split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function FeatureListField({ field, label, value, onChange }) {
  const [draft, setDraft] = useState('');
  const items = normalizeFeatureItems(value);

  function addItem(event) {
    event.preventDefault();
    const item = draft.trim();
    if (!item) return;
    onChange([...items, item]);
    setDraft('');
  }

  function removeItem(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="import-feature-list-field">
      <span>{label}</span>
      <div className="import-feature-list">
        {items.length === 0 && <small>Nenhum item adicionado</small>}
        {items.map((item, index) => (
          <div className="import-feature-list-item" key={`${item}-${index}`}>
            <span>{item}</span>
            <button type="button" onClick={() => removeItem(index)} aria-label={`Remover ${item}`}>
              <IoCloseOutline />
            </button>
          </div>
        ))}
      </div>
      <div className="import-feature-add-row">
        <input
          value={draft}
          placeholder="Adicionar item"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && addItem(event)}
        />
        <button type="button" onClick={addItem} aria-label={`Adicionar item em ${field}`}>
          <IoAddOutline />
        </button>
      </div>
    </div>
  );
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
    power: pick('potencia', 'power', 'cavalos') || '',
    transmission: pick('transmissao', 'transmission', 'cambio') || '',
    price: pick('preco', 'price', 'valor') || '',
    consumption: pick('consumo', 'consumption') || '',
    cityConsumption: pick('consumocidade', 'cityconsumption') || '',
    highwayConsumption: pick('consumoestrada', 'highwayconsumption') || '',
    torque: pick('torque') || '',
    drivetrain: pick('tracao', 'drivetrain') || '',
    length: pick('comprimento', 'length') || '',
    width: pick('largura', 'width') || '',
    height: pick('altura', 'height') || '',
    wheelbase: pick('entreeixos', 'wheelbase') || '',
    tireType: pick('tipopneu', 'tiretype') || '',
    rim: pick('aro', 'rim') || '',
    tireWidth: pick('largurapneu', 'tirewidth') || '',
    tireProfile: pick('perfilpneu', 'tireprofile') || '',
    tankCapacity: pick('capacidadetanque', 'tankcapacity') || '',
    fuelType: pick('tipocombustivel', 'fueltype') || '',
    loadCapacity: pick('capacidad carga', 'loadcapacity') || '',
    towingCapacity: pick('capacidadereboque', 'towingcapacity') || '',
    performance: pick('performance', 'desempenho') || '',
    security: pick('seguranca', 'security') || '',
    technology: pick('tecnologia', 'technology') || '',
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

export default function ImportVehicleModal({ isOpen, onClose, initialVehicle, onSaved }) {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState('choice');
  const [vehicle, setVehicle] = useState(EMPTY_VEHICLE);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setStep(initialVehicle ? 'form' : 'choice');
    setVehicle({ ...EMPTY_VEHICLE, ...(initialVehicle || {}) });
    setFileName('');
    setError('');
  }, [isOpen, initialVehicle]);

  if (!isOpen) return null;

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

  function handleSave(event) {
    event.preventDefault();
    if (!vehicle.brand.trim() || !vehicle.modelo.trim()) {
      setError('Informe pelo menos a marca e o modelo do veículo.');
      return;
    }
    const saved = saveImportedVehicle(vehicle);
    onSaved(saved);
    onClose();
  }

  return (
    <div className="import-vehicle-backdrop" onClick={onClose}>
      <div className="import-vehicle-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header className="import-vehicle-header">
          <div>
            <span className="section-eyebrow">CADASTRO DE VEÍCULO</span>
            <h2>{step === 'choice' ? 'Como deseja cadastrar?' : initialVehicle ? 'Editar veículo' : 'Revisar ficha do veículo'}</h2>
          </div>
          <button type="button" className="import-vehicle-close" onClick={onClose} aria-label="Fechar">
            <IoCloseOutline />
          </button>
        </header>

        {step === 'choice' ? (
          <div className="import-vehicle-choice">
            <button type="button" className="import-choice-card" onClick={() => fileInputRef.current?.click()}>
              <IoCloudUploadOutline />
              <strong>Importar automaticamente do arquivo</strong>
              <span>Leia um CSV ou JSON e preencha a ficha com os dados encontrados.</span>
            </button>
            <button type="button" className="import-choice-card" onClick={() => setStep('form')}>
              <IoDocumentTextOutline />
              <strong>Preencher ficha manualmente</strong>
              <span>Comece com uma ficha vazia e informe os dados do veículo.</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.json,application/json,text/csv" hidden onChange={handleFile} />
          </div>
        ) : (
          <form className="import-vehicle-form" onSubmit={handleSave}>
            <div className="import-vehicle-photo-field">
              <div className="import-vehicle-photo-preview">
                {vehicle.image ? <img src={vehicle.image} alt="Prévia do veículo" /> : <IoCarSportOutline />}
              </div>
              <div>
                <strong>Foto do modelo</strong>
                <span>{fileName || 'Adicione uma imagem para identificar o veículo.'}</span>
                <label className="import-photo-button">
                  <IoCloudUploadOutline />
                  <span>Enviar foto</span>
                  <input type="file" accept="image/*" hidden onChange={handlePhoto} />
                </label>
              </div>
            </div>

            {FIELD_GROUPS.map((group) => (
              <section className="import-vehicle-field-section" key={group.title}>
                <div className="import-vehicle-section-heading">
                  <span>Ficha técnica</span>
                  <h3>{group.title}</h3>
                </div>
                <div className="import-vehicle-fields">
                  {group.fields.map(([field, label, placeholder]) => (
                    <label key={field}>
                      <span>{label}</span>
                      <input value={vehicle[field]} placeholder={placeholder} onChange={(event) => updateField(field, event.target.value)} />
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <div className="import-vehicle-feature-fields">
              {FEATURE_GROUPS.map(([field, label]) => (
                <FeatureListField
                  key={field}
                  field={field}
                  label={label}
                  value={vehicle[field]}
                  onChange={(value) => updateField(field, value)}
                />
              ))}
            </div>

            {error && <p className="import-vehicle-error" role="alert">{error}</p>}
            <footer className="import-vehicle-footer">
              <button type="button" className="import-cancel-button" onClick={onClose}>Cancelar</button>
              <button type="submit" className="import-save-button"><IoSaveOutline /><span>Salvar veículo</span></button>
            </footer>
          </form>
        )}

        {step === 'choice' && error && <p className="import-vehicle-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
