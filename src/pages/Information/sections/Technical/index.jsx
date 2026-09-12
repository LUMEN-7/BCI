import {
  IoCheckmarkCircleOutline,
  IoChevronDown,
  IoChevronUp,
  IoDocumentTextOutline,
  IoHardwareChipOutline,
  IoInformationCircleOutline,
  IoLinkOutline,
  IoOpenOutline,
  IoTimeOutline,
} from "react-icons/io5";

import { sources } from "../../data";
import "./style.css";

const legendItems = [
  ["verified", "Verificado", "Fonte confirmada"],
  ["high", "Alta confiança", "80% ou mais"],
  ["medium", "Média confiança", "60% a 79%"],
  ["low", "Baixa confiança", "Abaixo de 60%"],
  ["ia", "IA", "Análise gerada por IA"],
];

function formatSourceName(str) {
  if (!str) return "Fonte Externa";
  const strVal = String(str).trim();
  const clean = strVal.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];

  const known = {
    "webmotors.com.br": "Webmotors",
    "webmotors": "Webmotors",
    "icarros.com.br": "iCarros",
    "icarros": "iCarros",
    "kbb.com.br": "KBB Brasil",
    "kbb": "KBB Brasil",
    "carrosnaweb.com.br": "Carros na Web",
    "carrosnaweb": "Carros na Web",
    "quatrorodas.abril.com.br": "Quatro Rodas",
    "quatrorodas": "Quatro Rodas",
    "autoesporte.globo.com": "Autoesporte",
    "autoesporte": "Autoesporte",
    "mobiauto.com.br": "Mobiauto",
    "mobiauto": "Mobiauto",
    "fipe.org.br": "Tabela Fipe",
    "fipe": "Tabela Fipe",
    "manufacturer": "Fabricante",
    "technicaldatabase": "Base técnica",
    "internalanalysis": "Análise Lumen",
  };

  const lower = clean.toLowerCase();
  if (known[lower]) return known[lower];

  if (clean.includes(".")) {
    const parts = clean.split(".");
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getSourceDetails(sourceId, car) {
  if (!sourceId) return null;

  const rawSources = car?.sources || car?.fontes;
  let sourceObj = typeof sourceId === "object" ? sourceId : null;

  if (!sourceObj && rawSources) {
    if (Array.isArray(rawSources)) {
      const found = rawSources.find(
        (s) =>
          String(s?.id ?? s?.Id ?? "") === String(sourceId) ||
          String(s?.url ?? s?.Url ?? "") === String(sourceId) ||
          String(s?.link ?? s?.Link ?? "") === String(sourceId) ||
          String(s?.site ?? s?.Site ?? "") === String(sourceId) ||
          String(s?.nome ?? s?.Nome ?? "") === String(sourceId) ||
          String(s?.name ?? s?.Name ?? "") === String(sourceId)
      );
      if (found) {
        sourceObj = found;
      }
    } else if (typeof rawSources === "object" && rawSources[sourceId]) {
      sourceObj = rawSources[sourceId];
    }
  }

  // 1. Objeto de fonte vindo de fontes estáticas em data.js
  if (!sourceObj && sources && sources[sourceId]) {
    sourceObj = sources[sourceId];
  }

  let rawUrl =
    sourceObj?.url ||
    sourceObj?.Url ||
    sourceObj?.link ||
    sourceObj?.Link ||
    sourceObj?.site ||
    sourceObj?.Site ||
    (typeof sourceId === "string" ? sourceId : null);

  const isUrl = Boolean(
    rawUrl &&
      typeof rawUrl === "string" &&
      !/^\d+$/.test(rawUrl.trim()) &&
      (rawUrl.includes(".") || rawUrl.startsWith("http"))
  );

  const cleanDisplayLink = isUrl
    ? rawUrl.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "")
    : null;

  let rawName =
    cleanDisplayLink ||
    sourceObj?.name ||
    sourceObj?.Nome ||
    sourceObj?.nome ||
    formatSourceName(rawUrl || sourceId);

  if (/^\d+$/.test(String(rawName).trim())) {
    rawName = `Fonte ${rawName}`;
  }

  const displayName = cleanDisplayLink || rawName;

  const href = isUrl
    ? rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${cleanDisplayLink}`
    : null;

  return {
    id: sourceObj?.id || sourceObj?.Id || sourceId,
    name: displayName,
    displayLink: displayName,
    href,
    type: sourceObj?.type || sourceObj?.tipo || sourceObj?.Tipo || (isUrl ? "Portal automotivo" : "Fonte de dados"),
    description:
      sourceObj?.description ||
      sourceObj?.descricao ||
      sourceObj?.Descricao ||
      (isUrl ? `Dados técnicos extraídos de ${displayName}.` : `Informações técnicas validadas.`),
    url: href,
  };
}

function LegendItem({ type, label, description }) {
  return (
    <div className={`legend-item ${type}`}>
      <span className="legend-badge">
        {type === "verified" && <IoCheckmarkCircleOutline />}
        {type === "ia" && <IoHardwareChipOutline />}
        {!["verified", "ia"].includes(type) && <span className="legend-dot" />}
        <span className="legend-label">{label}</span>
      </span>
      <span className="legend-description">{description}</span>
    </div>
  );
}

function SourceTag({ sourceId, car }) {
  const source = getSourceDetails(sourceId, car);
  if (!source) return null;

  const displayLabel = source.displayLink || source.name;

  if (source.href) {
    return (
      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="source-tag source-tag-link"
        title={`Abrir fonte: ${source.href}`}
        onClick={(e) => e.stopPropagation()}
      >
        <IoLinkOutline />
        <span>{displayLabel}</span>
      </a>
    );
  }

  return (
    <span className="source-tag" title={source.description || source.name}>
      <IoDocumentTextOutline />
      <span>{displayLabel}</span>
    </span>
  );
}

function ConfidenceBadge({ confidence }) {
  const type = confidence >= 80 ? "high" : confidence >= 60 ? "medium" : "low";
  const label =
    type === "high"
      ? "Alta confiança"
      : type === "medium"
        ? "Média confiança"
        : "Baixa confiança";
  return (
    <span className={`confidence-badge ${type}`}>
      <span className="confidence-dot" />
      <span>{label}</span>
      <strong>{confidence}%</strong>
    </span>
  );
}

function Accordion({
  title,
  items,
  open,
  onClick,
  verified,
  iaGen,
  confidence,
  car,
}) {
  return (
    <div className={`accordion ${open ? "is-open" : ""}`}>
      <button className="accordion-trigger" onClick={onClick}>
        <span className="accordion-title">{title}</span>
        <span className="accordion-badges">
          {verified && (
            <span className="verified-badge">
              <IoCheckmarkCircleOutline />
              <span>Verificado</span>
            </span>
          )}
          {iaGen && (
            <span className="iaGen-badge">
              <IoHardwareChipOutline />
              <span>IA</span>
            </span>
          )}
          {confidence !== undefined && !verified && (
            <ConfidenceBadge confidence={confidence} />
          )}
        </span>
        <span className="accordion-arrow">
          {open ? <IoChevronUp /> : <IoChevronDown />}
        </span>
      </button>
      {open && (
        <div className="accordion-content">
          <div className="technical-list">
            {items.map((item, index) => (
              <div
                className="technical-row"
                key={`${item.label || item.value}-${index}`}
              >
                <div className="technical-value">
                  <span className="technical-label">
                    {item.label || item.value}
                  </span>
                  {item.label && <strong>{item.value}</strong>}
                </div>
                {item.source && <SourceTag sourceId={item.source} car={car} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getSourceUsage(car, source) {
  const sourceName = typeof source === "object" ? source.name : source;
  const sourceId = typeof source === "object" ? source.id : source;
  const sourceLink = typeof source === "object" ? source.displayLink : null;

  const matchesSource = (item) => {
    if (!item?.source) return false;
    if (item.source === sourceId || item.source === sourceName || item.source === sourceLink) return true;
    const details = getSourceDetails(item.source, car);
    return details?.name === sourceName || details?.id === sourceId || details?.displayLink === sourceLink;
  };

  const usage = [];
  if (car?.specs) {
    if (
      [
        car.specs.engine,
        car.specs.power,
        car.specs.type,
        car.specs.model,
        car.specs.brand,
        car.specs.year,
      ].some(matchesSource)
    )
      usage.push("dados principais");

    if (
      [
        car.specs.cityConsumption,
        car.specs.highwayConsumption,
        car.specs.consumption,
      ].some(matchesSource)
    )
      usage.push("consumos");

    if (
      [
        car.specs.length,
        car.specs.width,
        car.specs.height,
        car.specs.wheelbase,
      ].some(matchesSource)
    )
      usage.push("dimensões");

    if (
      [
        car.specs.tireType,
        car.specs.rim,
        car.specs.tireWidth,
        car.specs.tireProfile,
      ].some(matchesSource)
    )
      usage.push("pneus");

    if (
      [
        car.specs.tankCapacity,
        car.specs.fuelType,
        car.specs.loadCapacity,
        car.specs.towingCapacity,
      ].some(matchesSource)
    )
      usage.push("capacidades e extras");

    if (
      [
        car.specs.torque,
        car.specs.powerRpm,
        car.specs.torqueRpm,
        car.specs.transmission,
        car.specs.drivetrain,
        car.specs.driveModes,
      ].some(matchesSource)
    )
      usage.push("transmissão e performance");
  }

  if (car?.sections) {
    Object.entries(car.sections).forEach(([key, items]) => {
      if (Array.isArray(items) && items.some(matchesSource)) {
        const labelMap = {
          security: "segurança",
          technology: "tecnologia",
          performance: "performance",
          comfort: "conforto",
        };
        usage.push(labelMap[key] || key);
      }
    });
  }

  return usage.length ? usage.join(" · ") : "especificações técnicas";
}

function SourcesPanel({ car }) {
  const usedSourceIds = new Set();

  if (car?.specs) {
    Object.values(car.specs).forEach(
      (item) => item?.source && usedSourceIds.add(item.source),
    );
  }

  if (car?.sections) {
    Object.values(car.sections)
      .flat()
      .forEach((item) => item?.source && usedSourceIds.add(item.source));
  }

  const rawSources = car?.sources || car?.fontes;
  if (rawSources) {
    if (Array.isArray(rawSources)) {
      rawSources.forEach((s) => {
        if (s) usedSourceIds.add(s.url || s.Url || s.nome || s.Nome || s.name || s.id || s.Id || s);
      });
    } else if (typeof rawSources === "object") {
      Object.keys(rawSources).forEach((k) => usedSourceIds.add(k));
    }
  }

  const sourcesMap = new Map();
  usedSourceIds.forEach((sourceId) => {
    const details = getSourceDetails(sourceId, car);
    if (details) {
      const key = String(details.href || details.displayLink || details.name || details.id || sourceId);
      if (!sourcesMap.has(key)) {
        sourcesMap.set(key, details);
      }
    }
  });

  const validSources = Array.from(sourcesMap.values());

  return (
    <div className="sources-panel">
      <div className="sources-panel-header">
        <div>
          <span className="section-eyebrow">Rastreabilidade</span>
          <h3>Fontes dos dados</h3>
        </div>
        <span className="sources-total">
          {validSources.length} {validSources.length === 1 ? "fonte" : "fontes"}
        </span>
      </div>
      <div className="sources-list">
        {validSources.length === 0 ? (
          <div className="sources-empty">
            <IoDocumentTextOutline />
            <p>Nenhuma fonte disponível no momento</p>
            <small>Os dados técnicos serão rastreados quando forem carregados.</small>
          </div>
        ) : (
          validSources.map((source) => (
            <div className="source-card" key={source.id || source.displayLink || source.name}>
              <div className="source-icon">
                {source.href ? <IoLinkOutline /> : <IoDocumentTextOutline />}
              </div>
              <div className="source-content">
                <div className="source-title-row">
                  {source.href ? (
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-card-link"
                      title={`Acessar ${source.href}`}
                    >
                      <strong>{source.displayLink}</strong>
                      <IoOpenOutline className="source-open-icon" />
                    </a>
                  ) : (
                    <strong>{source.name}</strong>
                  )}
                  <span className="source-type-badge">{source.type}</span>
                </div>
                <p>{source.description}</p>
                <div className="source-items">
                  <span>Utilizada em:</span>
                  <strong>{getSourceUsage(car, source)}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const baseGroups = (specs) => [
  {
    key: "base",
    title: "Dados Base",
    items: [
      ["Modelo", "model"],
      ["Marca", "brand"],
      ["Ano", "year"],
      ["Modos de Condução", "driveModes"],
    ].map(([label, key]) => ({ label, ...specs[key] })),
    confidence: 97,
  },
  {
    key: "specs",
    title: "Especificações",
    items: [
      ["Potência", "power"],
      ["Torque", "torque"],
      ["Potência RPM", "powerRpm"],
      ["Torque RPM", "torqueRpm"],
      ["Transmissão", "transmission"],
      ["Tração", "drivetrain"],
    ].map(([label, key]) => ({ label, ...specs[key] })),
    confidence: 80,
  },
  {
    key: "consumption",
    title: "Consumos",
    items: [
      ["Cidade", "cityConsumption"],
      ["Estrada", "highwayConsumption"],
    ].map(([label, key]) => ({ label, ...specs[key] })),
    iaGen: true,
  },
  {
    key: "dimensions",
    title: "Dimensões",
    items: [
      ["Comprimento", "length"],
      ["Largura", "width"],
      ["Altura", "height"],
      ["Entre-Eixos", "wheelbase"],
    ].map(([label, key]) => ({ label, ...specs[key] })),
    confidence: 87,
  },
  {
    key: "tires",
    title: "Pneus",
    items: [
      ["Tipo", "tireType"],
      ["Aro", "rim"],
      ["Largura", "tireWidth"],
      ["Perfil", "tireProfile"],
    ].map(([label, key]) => ({ label, ...specs[key] })),
    verified: true,
  },
  {
    key: "extras",
    title: "Extras",
    items: [
      ["Capacidade do Tanque", "tankCapacity"],
      ["Tipo de Combustível", "fuelType"],
      ["Capacidade de Carga", "loadCapacity"],
      ["Capacidade de Reboque", "towingCapacity"],
    ].map(([label, key]) => ({ label, ...specs[key] })),
    confidence: 81,
  },
];

export default function Technical({
  car,
  openSection,
  showSources,
  onToggleSection,
  onToggleSources,
}) {
  const handleToggleSources = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSources();
  };

  const groups = [
    ...baseGroups(car.specs),
    {
      key: "performance",
      title: "Performance",
      items: car.sections.performance,
      verified: true,
    },
    {
      key: "security",
      title: "Segurança",
      items: car.sections.security,
      confidence: 95,
    },
    {
      key: "technology",
      title: "Tecnologia",
      items: car.sections.technology,
      verified: true,
    },
    {
      key: "comfort",
      title: "Conforto",
      items: car.sections.comfort,
      confidence: 67,
    },
  ];
  return (
    <section className="technical-section">
      <div className="technical-heading">
        <div>
          <span className="section-eyebrow">Especificações</span>
          <h2 className="section-title">Ficha Técnica</h2>
        </div>
        <div className="update-card">
          <div className="update-icon">
            <IoTimeOutline />
          </div>
          <div>
            <span>Última atualização</span>
            <strong>{car.lastUpdated}</strong>
            <small>{car.updatedAgo}</small>
          </div>
        </div>
      </div>
      <div className="information-legend">
        <div className="legend-header">
          <div className="legend-title">
            <IoInformationCircleOutline />
            <div>
              <strong>Confiabilidade dos dados</strong>
              <span>Entenda como cada informação foi validada.</span>
            </div>
          </div>
          <button type="button" className="sources-toggle" onClick={handleToggleSources}>
            <IoDocumentTextOutline />
            {showSources ? "Ocultar fontes" : "Ver fontes dos dados"}
          </button>
        </div>
        <div className="legend-items">
          {legendItems.map(([type, label, description]) => (
            <LegendItem
              key={type}
              type={type}
              label={label}
              description={description}
            />
          ))}
        </div>
        {showSources && <SourcesPanel car={car} />}
      </div>
      <h2 className="subsection-title">Dados técnicos</h2>
      <div className="accordion-group">
        {groups.slice(0, 6).map(({ key, ...group }) => (
          <Accordion
            key={key}
            {...group}
            car={car}
            open={openSection === key}
            onClick={() => onToggleSection(key)}
          />
        ))}
      </div>
      <h2 className="subsection-title resources-title">
        Recursos e Desempenho
      </h2>
      <div className="accordion-group">
        {groups.slice(6).map(({ key, ...group }) => (
          <Accordion
            key={key}
            {...group}
            car={car}
            open={openSection === key}
            onClick={() => onToggleSection(key)}
          />
        ))}
      </div>
    </section>
  );
}
