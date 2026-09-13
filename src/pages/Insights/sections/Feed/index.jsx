import { Check, X } from "lucide-react";
import "./style.css";

export default function Feed({ items, onResolve }) {
  return (
    <section className="insights-feed-section">
      <header className="insights-feed-header"><div><span>Leitura editorial</span><h2>Feed de insights</h2><p>Resumos gerados a partir de fontes monitoradas, prontos para revisão manual.</p></div></header>
      <div className="insights-feed-list">
        {items.map((item, index) => <article key={`${item.categoria}-${index}`} className={`insight-card ${item.status === "em breve" ? "locked" : ""}`}>
          <div className="insight-top"><span className="insight-tag" style={{ background: `${item.cor}18`, color: item.cor }}>{item.categoria}</span><span className="insight-confidence">{item.confianca != null ? `confiança ${item.confianca}%` : "em breve"}</span></div>
          <p className="insight-body">{item.resumo}</p>
          <div className="insight-bottom"><span className="insight-sources">{item.fontes.length ? `Fontes: ${item.fontes.join(", ")}` : "Sem fontes conectadas"}</span>{item.status === "pendente" && <div className="insight-actions"><button type="button" className="approve" onClick={() => onResolve(index, "aprovado")} aria-label="Aprovar insight"><Check size={13} /></button><button type="button" className="dismiss" onClick={() => onResolve(index, "descartado")} aria-label="Descartar insight"><X size={13} /></button></div>}{item.status === "aprovado" && <span className="insight-status approved">Aprovado</span>}{item.status === "descartado" && <span className="insight-status">Descartado</span>}{item.status === "em breve" && <span className="insight-status">Fase futura do roadmap</span>}</div>
        </article>)}
      </div>
    </section>
  );
}
