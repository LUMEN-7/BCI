import './style.css';

export default function Overview({ metrics }) {
    return (
        <section className="overview-section">
            <div className="section-heading">
                <span>VISÃO GERAL</span>
                <div />
            </div>

            <div className="metrics-grid">
                {metrics.map((metric) => (
                    <div className="metric" key={metric.value}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
