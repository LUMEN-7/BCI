import {
    IoCheckmarkCircleOutline,
    IoChevronDown,
    IoChevronUp,
    IoDocumentTextOutline,
    IoHardwareChipOutline,
    IoInformationCircleOutline,
    IoTimeOutline,
} from 'react-icons/io5';

import { sources } from '../../data';
import './style.css';

const legendItems = [
    ['verified', 'Verificado', 'Fonte confirmada'],
    ['high', 'Alta confiança', '80% ou mais'],
    ['medium', 'Média confiança', '60% a 79%'],
    ['low', 'Baixa confiança', 'Abaixo de 60%'],
    ['ia', 'IA', 'Análise gerada por IA'],
];

function LegendItem({ type, label, description }) {
    return <div className={`legend-item ${type}`}><span className="legend-badge">{type === 'verified' && <IoCheckmarkCircleOutline />}{type === 'ia' && <IoHardwareChipOutline />}{!['verified', 'ia'].includes(type) && <span className="legend-dot" />}<span className="legend-label">{label}</span></span><span className="legend-description">{description}</span></div>;
}

function SourceTag({ sourceId }) {
    const source = sources[sourceId];
    return source ? <span className="source-tag"><IoDocumentTextOutline />{source.name}</span> : null;
}

function ConfidenceBadge({ confidence }) {
    const type = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
    const label = type === 'high' ? 'Alta confiança' : type === 'medium' ? 'Média confiança' : 'Baixa confiança';
    return <span className={`confidence-badge ${type}`}><span className="confidence-dot" /><span>{label}</span><strong>{confidence}%</strong></span>;
}

function Accordion({ title, items, open, onClick, verified, iaGen, confidence }) {
    return <div className={`accordion ${open ? 'is-open' : ''}`}><button className="accordion-trigger" onClick={onClick}><span className="accordion-title">{title}</span><span className="accordion-badges">{verified && <span className="verified-badge"><IoCheckmarkCircleOutline /><span>Verificado</span></span>}{iaGen && <span className="iaGen-badge"><IoHardwareChipOutline /><span>IA</span></span>}{confidence !== undefined && !verified && <ConfidenceBadge confidence={confidence} />}</span><span className="accordion-arrow">{open ? <IoChevronUp /> : <IoChevronDown />}</span></button>{open && <div className="accordion-content"><div className="technical-list">{items.map((item, index) => <div className="technical-row" key={`${item.label || item.value}-${index}`}><div className="technical-value"><span className="technical-label">{item.label || item.value}</span>{item.label && <strong>{item.value}</strong>}</div>{item.source && <SourceTag sourceId={item.source} />}</div>)}</div></div>}</div>;
}

function getSourceUsage(car, sourceId) {
    const usage = [];
    if ([car.specs.engine, car.specs.power, car.specs.type].some((item) => item.source === sourceId)) usage.push('dados principais');
    if ([car.specs.cityConsumption, car.specs.highwayConsumption].some((item) => item.source === sourceId)) usage.push('consumos');
    if ([car.specs.length, car.specs.width, car.specs.height].some((item) => item.source === sourceId)) usage.push('dimensões');
    Object.entries(car.sections).forEach(([key, items]) => { if (items.some((item) => item.source === sourceId)) usage.push(key === 'security' ? 'segurança' : key === 'technology' ? 'tecnologia' : key); });
    return usage.length ? usage.join(' · ') : 'informações técnicas';
}

function SourcesPanel({ car }) {
    const usedSources = new Set();
    Object.values(car.specs).forEach((item) => item?.source && usedSources.add(item.source));
    Object.values(car.sections).flat().forEach((item) => item?.source && usedSources.add(item.source));
    return <div className="sources-panel"><div className="sources-panel-header"><div><span className="section-eyebrow">Rastreabilidade</span><h3>Fontes dos dados</h3></div><span className="sources-total">{usedSources.size} fontes</span></div><div className="sources-list">{Array.from(usedSources).map((sourceId) => { const source = sources[sourceId]; return <div className="source-card" key={sourceId}><div className="source-icon"><IoDocumentTextOutline /></div><div className="source-content"><div className="source-title-row"><strong>{source.name}</strong><span>{source.type}</span></div><p>{source.description}</p><div className="source-items"><span>Utilizada em:</span><strong>{getSourceUsage(car, sourceId)}</strong></div></div></div>; })}</div></div>;
}

const baseGroups = (specs) => [
    { key: 'base', title: 'Dados Base', items: [['Modelo', 'model'], ['Marca', 'brand'], ['Ano', 'year'], ['Modos de Condução', 'driveModes']].map(([label, key]) => ({ label, ...specs[key] })), confidence: 97 },
    { key: 'specs', title: 'Especificações', items: [['Potência', 'power'], ['Torque', 'torque'], ['Potência RPM', 'powerRpm'], ['Torque RPM', 'torqueRpm'], ['Transmissão', 'transmission'], ['Tração', 'drivetrain']].map(([label, key]) => ({ label, ...specs[key] })), confidence: 80 },
    { key: 'consumption', title: 'Consumos', items: [['Cidade', 'cityConsumption'], ['Estrada', 'highwayConsumption']].map(([label, key]) => ({ label, ...specs[key] })), iaGen: true },
    { key: 'dimensions', title: 'Dimensões', items: [['Comprimento', 'length'], ['Largura', 'width'], ['Altura', 'height'], ['Entre-Eixos', 'wheelbase']].map(([label, key]) => ({ label, ...specs[key] })), confidence: 87 },
    { key: 'tires', title: 'Pneus', items: [['Tipo', 'tireType'], ['Aro', 'rim'], ['Largura', 'tireWidth'], ['Perfil', 'tireProfile']].map(([label, key]) => ({ label, ...specs[key] })), verified: true },
    { key: 'extras', title: 'Extras', items: [['Capacidade do Tanque', 'tankCapacity'], ['Tipo de Combustível', 'fuelType'], ['Capacidade de Carga', 'loadCapacity'], ['Capacidade de Reboque', 'towingCapacity']].map(([label, key]) => ({ label, ...specs[key] })), confidence: 81 },
];

export default function Technical({ car, openSection, showSources, onToggleSection, onToggleSources }) {
    const groups = [...baseGroups(car.specs), { key: 'performance', title: 'Performance', items: car.sections.performance, verified: true }, { key: 'security', title: 'Segurança', items: car.sections.security, confidence: 95 }, { key: 'technology', title: 'Tecnologia', items: car.sections.technology, verified: true }, { key: 'comfort', title: 'Conforto', items: car.sections.comfort, confidence: 67 }];
    return <section className="technical-section"><div className="technical-heading"><div><span className="section-eyebrow">Especificações</span><h2 className="section-title">Ficha Técnica</h2></div><div className="update-card"><div className="update-icon"><IoTimeOutline /></div><div><span>Última atualização</span><strong>{car.lastUpdated}</strong><small>{car.updatedAgo}</small></div></div></div><div className="information-legend"><div className="legend-header"><div className="legend-title"><IoInformationCircleOutline /><div><strong>Confiabilidade dos dados</strong><span>Entenda como cada informação foi validada.</span></div></div><button className="sources-toggle" onClick={onToggleSources}><IoDocumentTextOutline />{showSources ? 'Ocultar fontes' : 'Ver fontes dos dados'}</button></div><div className="legend-items">{legendItems.map(([type, label, description]) => <LegendItem key={type} type={type} label={label} description={description} />)}</div>{showSources && <SourcesPanel car={car} />}</div><h2 className="subsection-title">Dados técnicos</h2><div className="accordion-group">{groups.slice(0, 6).map((group) => <Accordion key={group.key} {...group} open={openSection === group.key} onClick={() => onToggleSection(group.key)} />)}</div><h2 className="subsection-title resources-title">Recursos e Desempenho</h2><div className="accordion-group">{groups.slice(6).map((group) => <Accordion key={group.key} {...group} open={openSection === group.key} onClick={() => onToggleSection(group.key)} />)}</div></section>;
}
