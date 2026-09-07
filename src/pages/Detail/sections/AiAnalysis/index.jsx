import './style.css';

function InsightCard({ label, value, featured = false }) {
	return <div className={`ai-insight ${featured ? 'featured' : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}

export default function AiAnalysis({ firstCar, secondCar, comparisonSummary }) {
	return <section className="ai-analysis-section">
		<div className="ai-analysis-header"><span>Análise da IA</span><h2>Resumo inteligente</h2><p>Uma leitura comparativa baseada nas características dos modelos selecionados.</p></div>
		<p className="ai-summary">{comparisonSummary}</p>
		<div className="ai-insights"><InsightCard label="Melhor para desempenho" value={firstCar.name} /><InsightCard label="Melhor para versatilidade" value={secondCar.name} /><InsightCard label="Decisão recomendada" value="Depende do perfil de uso" featured /></div>
	</section>;
}