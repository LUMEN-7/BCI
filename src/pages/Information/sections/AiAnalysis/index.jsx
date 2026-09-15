import "./style.css";

function AnalysisCard({ title, items }) {
  return (
    <div className="ai-analysis-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AiAnalysis({ analysis, loading, error }) {
  return (
    <section className="ai-analysis-section">
      <div className="ai-analysis-header">
        <span>Análise inteligente</span>
        <h2>Análise da IA</h2>
        <p>
          Resumo gerado com base nas características técnicas, perfil de uso e
          posicionamento do modelo.
        </p>
      </div>
      {loading ? (
        <div className="ai-analysis-feedback" role="status">
          <span className="ai-analysis-spinner" />
          <strong>Gerando análise personalizada...</strong>
          <p>A IA está interpretando os dados técnicos deste veículo.</p>
        </div>
      ) : error ? (
        <div className="ai-analysis-feedback is-error" role="alert">
          <strong>Análise indisponível</strong>
          <p>{error}</p>
        </div>
      ) : (
        <div className="ai-analysis-grid">
          <AnalysisCard title="Pontos fortes" items={analysis.strengths} />
          <AnalysisCard title="Pontos fracos" items={analysis.weaknesses} />
          <div className="ai-analysis-card featured">
            <h3>Melhor uso</h3>
            <p>{analysis.bestUse}</p>
          </div>
          <AnalysisCard
            title="Concorrentes semelhantes"
            items={analysis.competitors}
          />
        </div>
      )}
    </section>
  );
}
