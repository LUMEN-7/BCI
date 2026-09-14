import {
  IoCheckmarkCircleOutline,
  IoChevronDown,
  IoChevronUp,
  IoDocumentTextOutline,
  IoHardwareChipOutline,
  IoInformationCircleOutline,
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
        {!['verified', 'ia'].includes(type) && <span className="legend-dot" />}
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

function Accordion({ title, open, onClick, verified, children }) {
  return (
    <div className={`accordion ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="accordion-trigger"
        onClick={onClick}
        aria-expanded={open}
      >
        <span className="accordion-title">{title}</span>
        {verified && (
          <span className="verified-badge">
            <IoCheckmarkCircleOutline />
            Verificado
          </span>
        )}
        <span className="accordion-arrow">
          {open ? <IoChevronUp /> : <IoChevronDown />}
        </span>
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </div>
  );
}

function TechnicalAccordion({ section, firstCar, secondCar, open, onClick }) {
  return (
    <Accordion
      title={section.title}
      verified={section.verified}
      open={open}
      onClick={onClick}
    >
      <div className="technical-list">
        {section.items.map(([label, key]) => (
          <div className="technical-row" key={key}>
            <span className="technical-label">{label}</span>
            {[firstCar, secondCar].map((car) => (
              <div className="technical-car-value" key={car.id}>
                <span>{car.name}</span>
                <strong>
                  {car.specs?.[key] || car[key] || "Não informado"}
                </strong>
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
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ResourceAccordion({ section, firstCar, secondCar, open, onClick }) {
  return (
    <Accordion
      title={section.title}
      verified={section.verified}
      open={open}
      onClick={onClick}
    >
      <div className="feature-grid">
        <FeatureCard
          car={firstCar}
          items={firstCar.sections?.[section.id] || []}
        />
        <FeatureCard
          car={secondCar}
          items={secondCar.sections?.[section.id] || []}
        />
      </div>
    </Accordion>
  );
}

export default function Technical({
  firstCar,
  secondCar,
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
            firstCar={firstCar}
            secondCar={secondCar}
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
            firstCar={firstCar}
            secondCar={secondCar}
            open={expandedSection === section.id}
            onClick={() => onToggleSection(section.id)}
          />
        ))}
      </div>
    </section>
  );
}
