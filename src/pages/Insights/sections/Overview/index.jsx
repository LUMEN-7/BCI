import { CircleAlert, Fuel, Gauge, TrendingUp } from "lucide-react";
import { COLORS } from "../../data";
import "./style.css";

const metrics = [
  ["Veículos monitorados", "612", "+18 nos últimos 30 dias", Gauge, true],
  ["Atualizações (30 dias)", "47", "+12% vs. período anterior", TrendingUp, true],
  ["Marcas monitoradas", "6", null, Fuel, null],
  ["Insights pendentes", "2", "aguardando revisão", CircleAlert, false],
];

export default function Overview() {
  return (
    <section className="insights-overview" aria-label="Resumo de indicadores">
      {metrics.map(([label, value, delta, Icon, positive]) => (
        <article className="insights-kpi-card" key={label}>
          <div className="insights-kpi-top"><span>{label}</span><Icon size={17} color={COLORS.muted} /></div>
          <strong>{value}</strong>
          {delta && <small className={positive ? "positive" : "negative"}>{delta}</small>}
        </article>
      ))}
    </section>
  );
}
