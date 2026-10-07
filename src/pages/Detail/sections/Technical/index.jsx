import { getInformationStatus } from '@/utils/confidence';
import {
  IoCheckmarkCircleOutline,
  IoChevronDown,
  IoChevronUp,
  IoDocumentTextOutline,
  IoHardwareChipOutline,
  IoInformationCircleOutline,
  IoShieldCheckmarkOutline,
  IoShieldHalfOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { resourceSections, technicalSections } from "../../data";
import "./style.css";

const legendItems = [
  ["verified", "Verificado", "Fonte confirmada"],
  ["high", "Alta confiança", "80% ou mais"],
  ["medium", "Média confiança", "60% a 79%"],
  ["low", "Baixa confiança", "Abaixo de 60%"],
  ["ia", "IA", "Análise gerada por IA"],
];

function LegendItem({ type, label, description }) {
  return (
    <div className={`legend-item ${type}`}>
      <span className="legend-badge">
        {type === "verified" && <IoCheckmarkCircleOutline />}
        {type === "ia" && <IoHardwareChipOutline />}
        {type === 'high' && <IoShieldCheckmarkOutline />}
        {type === 'medium' && <IoShieldHalfOutline />}
        {type === 'low' && <IoWarningOutline />}
        <span className="legend-label">{label}</span>
      </span>
      <span className="legend-description">{description}</span>
    </div>
  );
}

function SourcesPanel() {
  return (
    <div className="sources-panel">
      <div className="sources-panel-header">
        <div>
          <span className="section-eyebrow">Rastreabilidade</span>
          <h3>Fontes dos dados</h3>
        </div>
        <span className="sources-total">0 fontes</span>
      </div>

      <div className="sources-empty">
        <IoDocumentTextOutline />
        <p>Nenhuma fonte disponível no momento</p>
        <small>As fontes de comparação serão exibidas quando a API entregar esse metadata.</small>
      </div>
    </div>
  );
}

function InformationBadges({ item }) {
  const status = getInformationStatus(item);
  if (status.missing) return null;
  const level = status.confidence >= 80 ? 'high' : status.confidence >= 60 ? 'medium' : 'low';
  return (
    <div className="detail-information-badges">
      <div className="detail-status">
        {status.iaGen ? <span className="detail-badge ai"><IoHardwareChipOutline />IA</span>
          : status.verified && <span className="detail-badge verified"><IoCheckmarkCircleOutline />Verificado</span>}
      </div>
      <div>{status.confidence < 100 && <span className={`detail-badge confidence ${level}`} title="Confiança da informação">{status.confidence}%</span>}</div>
      <div>{item.source && <span className="detail-badge source" title={String(item.source)}>{String(item.source)}</span>}</div>
    </div>
  );
}

function Accordion({ title, open, onClick, children }) {
  return (
    <div className={`accordion ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="accordion-trigger"
        onClick={onClick}
        aria-expanded={open}
      >
        <span className="accordion-title">{title}</span>
        <span className="accordion-arrow">
          {open ? <IoChevronUp /> : <IoChevronDown />}
        </span>
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </div>
  );
}

function TechnicalAccordion({ section, cars, open, onClick }) {
  return (
    <Accordion
      title={section.title}
      open={open}
      onClick={onClick}
    >
      <div className="technical-list" style={{ '--tech-cols': cars.length }}>
        {section.items.map(([label, key]) => (
          <div className="technical-row" key={key}>
            <span className="technical-label">{label}</span>
            {cars.map((car) => (
              <div className="technical-car-value" key={car.id}>
                <span>{car.name}</span>
                <div className="detail-information-line"><strong>
                  {car.specs?.[key] || car[key] || "Não informado"}
                </strong>
                {section.id !== 'base' && <InformationBadges item={{ ...car.specsMetadata?.[key], value: car.specs?.[key] || car[key] }} />}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Accordion>
  );
}

function FeatureCard({ car, items }) {
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <span>{car.brand}</span>
        <strong>{car.name}</strong>
      </div>
      <ul>
        {items.map((item, index) => {
          const information = typeof item === 'object' && item !== null ? item : { value: item };
          return <li key={`${information.value}-${index}`}><span>{information.value}</span><InformationBadges item={information} /></li>;
        })}
      </ul>
    </div>
  );
}

function ResourceAccordion({ section, cars, open, onClick }) {
  return (
    <Accordion
      title={section.title}
      open={open}
      onClick={onClick}
    >
      <div className="feature-grid" style={{ '--tech-cols': cars.length }}>
        {cars.map((car) => (
          <FeatureCard key={car.id} car={car} items={car.sections?.[section.id] || []} />
        ))}
      </div>
    </Accordion>
  );
}

export default function Technical({
  cars = [],
  expandedSection,
  showSources,
  onToggleSection,
  onToggleSources,
}) {
  const handleToggleSources = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSources();
  };

  return (
    <section className="technical-section">
      <div className="technical-heading">
        <div>
          <span className="section-eyebrow">Especificações</span>
          <h2 className="section-title">Ficha Técnica</h2>
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
            <LegendItem key={type} type={type} label={label} description={description} />
          ))}
        </div>
        {showSources && <SourcesPanel />}
      </div>

      <div className="accordion-group">
        {technicalSections.map((section) => (
          <TechnicalAccordion
            key={section.id}
            section={section}
            cars={cars}
            open={expandedSection === section.id}
            onClick={() => onToggleSection(section.id)}
          />
        ))}
      </div>
      <div className="resources-heading">
        <span className="section-eyebrow">Características</span>
        <h2 className="section-title">Recursos e Desempenho</h2>
      </div>
      <div className="accordion-group">
        {resourceSections.map((section) => (
          <ResourceAccordion
            key={section.id}
            section={section}
            cars={cars}
            open={expandedSection === section.id}
            onClick={() => onToggleSection(section.id)}
          />
        ))}
      </div>
    </section>
  );
}
