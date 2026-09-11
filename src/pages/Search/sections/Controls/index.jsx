import {
  IoChevronDownOutline,
  IoCloseCircle,
  IoSearchOutline,
} from "react-icons/io5";

import "./style.css";

export default function Controls({
  search,
  brands,
  years,
  selectedBrand,
  selectedYear,
  hasFilters,
  validationError,
  onSearchChange,
  onBrandChange,
  onYearChange,
  onExecute,
  onClear,
}) {
  return (
    <section className="search-controls">
      <div className="search-page-box">
        <IoSearchOutline className="search-page-icon" />
        <input
          type="text"
          placeholder="Pesquisar modelo, marca ou segmento"
          value={search}
          onChange={onSearchChange}
        />
        {search && (
          <button
            type="button"
            className="search-page-clear"
            onClick={onClear}
            aria-label="Limpar pesquisa"
          >
            <IoCloseCircle />
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="select-wrapper">
          <select
            className="filter-select"
            value={selectedBrand}
            onChange={onBrandChange}
          >
            <option value="">Todas as marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <IoChevronDownOutline />
        </div>

        <div className="select-wrapper">
          <select
            className="filter-select"
            value={selectedYear}
            onChange={onYearChange}
          >
            <option value="">Todos os anos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <IoChevronDownOutline />
        </div>

        {hasFilters && (
          <button type="button" className="clear-filters" onClick={onClear}>
            Limpar filtros
          </button>
        )}

        <button type="button" className="execute-search" onClick={onExecute}>
          Pesquisar
        </button>
      </div>

      {validationError && (
        <p className="search-validation-error" role="alert">
          {validationError}
        </p>
      )}
    </section>
  );
}
