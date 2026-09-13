export function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section className={`insights-panel ${className}`}>
      <header className="insights-panel-header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </header>
      <div className="insights-panel-body">{children}</div>
    </section>
  );
}

export function ChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="insights-tooltip">
      {label && <strong>{label}</strong>}
      {payload.map((item, index) => (
        <div key={index}>
          <span className="insights-tooltip-dot" style={{ background: item.color || item.fill }} />
          <span>{item.name}</span>
          <b>{typeof item.value === "number" ? item.value.toLocaleString("pt-BR") : item.value}{suffix}</b>
        </div>
      ))}
    </div>
  );
}
