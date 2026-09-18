import { IoCloseCircleOutline, IoSearchOutline, IoSparklesOutline } from "react-icons/io5";

import "./style.css";

export default function Search({
  activeSlot,
  search,
  setSearch,
  referenceCar,
  similarityFilters = [],
  activeSimilarityFilters = [],
  onToggleSimilarityFilter,
}) {
  return (
    <section className="search-section">
      <div className="search-header">
        <div>
          <span className="section-eyebrow">SELECIONAR MODELO</span>
          <h2>
            Buscar para{" "}
            <strong>{activeSlot === "first" ? "modelo 1" : "modelo 2"}</strong>
          </h2>
        </div>
        <span className="search-hint">
          {activeSlot === "first" ? "Primeiro veículo" : "Segundo veículo"}
        </span>
      </div>
      <div className="search-box">
        <div className="search-icon">
          <IoSearchOutline />
        </div>
        <input
          type="text"
          placeholder="Pesquise por marca, modelo, motor ou tipo..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {search && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearch("")}
            aria-label="Limpar busca"
          >
            <IoCloseCircleOutline />
          </button>
        )}
      </div>

      <div className="similarity-filters">
        <div className="similarity-filters-header">
          <IoSparklesOutline />
          <span>
            Filtrar por similaridade com{" "}
            <strong>{referenceCar ? referenceCar.name : "o veículo selecionado"}</strong>
          </span>
        </div>

        <div className="similarity-chips">
          {similarityFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`similarity-chip ${activeSimilarityFilters.includes(filter.id) ? "is-active" : ""}`}
              onClick={() => onToggleSimilarityFilter?.(filter.id)}
              disabled={!referenceCar}
              title={referenceCar ? filter.label : "Selecione um veículo para habilitar este filtro"}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {!referenceCar && (
          <span className="similarity-hint">
            Selecione o primeiro modelo para habilitar os filtros de similaridade.
          </span>
        )}
      </div>
    </section>
  );
}

