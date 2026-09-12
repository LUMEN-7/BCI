import {
  IoCalendarOutline,
  IoCarSportOutline,
  IoCompassOutline,
  IoFilterOutline,
  IoSearchOutline,
} from "react-icons/io5";

import "./style.css";

export default function InitialState({ onSelectSuggestion }) {
  return (
    <section className="search-initial-state">
      <div className="initial-state-card">
        <div className="initial-icon-wrapper">
          <IoCompassOutline />
        </div>

        <span className="section-label">PRIMEIRO ACESSO</span>
        <h2>Encontre o veículo que você procura</h2>
        <p>
          Pesquise por um modelo ou utilize os filtros para começar a explorar a
          ficha técnica completa de cada automóvel.
        </p>

        <div className="initial-tips-grid">
          <div className="initial-tip-item">
            <div className="tip-icon">
              <IoSearchOutline />
            </div>
            <div>
              <strong>Busca direta</strong>
              <span>Digite o nome do modelo ou categoria na barra de pesquisa</span>
            </div>
          </div>

          <div className="initial-tip-item">
            <div className="tip-icon">
              <IoFilterOutline />
            </div>
            <div>
              <strong>Filtros combinados</strong>
              <span>Refine por marca e ano de fabricação para encontrar modelos exatos</span>
            </div>
          </div>

          <div className="initial-tip-item">
            <div className="tip-icon">
              <IoCarSportOutline />
            </div>
            <div>
              <strong>Ficha completa</strong>
              <span>Acesse especificações de motor, consumo, dimensões e dados oficiais</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
