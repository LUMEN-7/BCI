import "./style.css";

export default function Coverage({ items }) {
  return (
    <section className="coverage-section">
      <div className="section-heading">
        <span>COBERTURA DO MERCADO</span>
        <div />
      </div>

      <div className="coverage-list">
        {items.map((item) => (
          <div className="coverage-item" key={item.name}>
            <div className="coverage-header">
              <strong>{item.name}</strong>
              <span>
                {item.models} modelos — {item.percentage}%
              </span>
            </div>

            <div className="coverage-bar">
              <div style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
