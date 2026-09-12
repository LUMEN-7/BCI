import "./style.css";

function formatLabel(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase());
}

function formatMathValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${formatLabel(key)}: ${formatMathValue(item)}`)
      .join(" | ");
  }
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "");
  return value ?? "—";
}

function InsightCard({ label, value, featured = false }) {
  return (
    <div className={`ai-insight ${featured ? "featured" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function AiAnalysis({ firstCar, secondCar, comparisonSummary, mathConclusions }) {
  const mathEntries = Object.entries(mathConclusions || {}).flatMap(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.entries(value).map(([subKey, subValue]) => ({
        label: `${formatLabel(key)} · ${formatLabel(subKey)}`,
        value: formatMathValue(subValue),
      }));
    }

    return [{ label: formatLabel(key), value: formatMathValue(value) }];
  });

  return (
    <section className="ai-analysis-section">
      <div className="ai-analysis-header">
        <span>Análise da IA</span>
        <h2>Resumo inteligente</h2>
        <p>
          Uma leitura comparativa baseada nas características dos modelos
          selecionados.
        </p>
      </div>

      <p className="ai-summary">{comparisonSummary}</p>

      <div className="ai-insights">
        <InsightCard label="Melhor para desempenho" value={firstCar.name} />
        <InsightCard label="Melhor para versatilidade" value={secondCar.name} />
        <InsightCard
          label="Decisão recomendada"
          value="Depende do perfil de uso"
          featured
        />
      </div>

      {mathEntries.length > 0 && (
        <div className="math-conclusions">
          <div className="math-conclusions-header">
            <span>Conclusões matemáticas</span>
            <h3>Comparativo objetivo</h3>
          </div>

          <div className="math-conclusions-grid">
            {mathEntries.map(({ label, value }) => (
              <div className="math-conclusion-item" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
