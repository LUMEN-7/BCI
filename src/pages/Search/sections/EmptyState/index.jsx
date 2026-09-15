import { IoArrowForward, IoRefreshOutline, IoSearchOutline } from "react-icons/io5";

import "./style.css";

export default function EmptyState({ onClear }) {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <IoSearchOutline />
      </div>
      <span className="section-label">NENHUM RESULTADO</span>
      <h2>NENHUM MODELO ENCONTRADO</h2>
      <p>
        Tente alterar os termos da busca ou remover alguns filtros.
      </p>
      {onClear && (
        <button type="button" className="empty-button" onClick={onClear}>
          <span>LIMPAR FILTROS</span>
          <IoRefreshOutline />
        </button>
      )}
    </section>
  );
}
