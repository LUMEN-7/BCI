import { SEGMENTOS } from "../../data";
import "./style.css";

export default function Filter({ value, onChange }) {
  return (
    <section className="insights-filter" aria-label="Filtros de insights">
      <span>Segmento monitorado</span>
      <div className="insights-segmented-control">
        {SEGMENTOS.map((segment) => (
          <button key={segment} type="button" className={value === segment ? "active" : ""} onClick={() => onChange(segment)}>
            {segment}
          </button>
        ))}
      </div>
    </section>
  );
}
