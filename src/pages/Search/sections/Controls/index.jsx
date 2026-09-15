import {
  IoAlarmOutline,
  IoAlertCircleOutline,
  IoCalendarOutline,
  IoCarOutline,
  IoCloseCircle,
  IoCloseOutline,
  IoRefreshOutline,
  IoSearchOutline,
} from "react-icons/io5";

import "./style.css";

export default function Controls({
  search,
  selectedBrand,
  selectedYear,
  activeFilterChips = [],
  validationError,
  scheduledCount = 0,
  onSearchChange,
  onBrandChange,
  onYearChange,
  onRemoveFilter,
  onExecute,
  onClear,
  onOpenSchedule,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <section className="search-controls">
      <div className="search-page-box">
        <IoSearchOutline className="search-page-icon" />
        <input
          type="text"
          placeholder="Pesquisar modelo, marca ou segmento..."
          value={search}
          onChange={onSearchChange}
          onKeyDown={handleKeyDown}
        />
        {search && (
          <button
            type="button"
            className="search-page-clear"
            onClick={() => onRemoveFilter?.("search") || onClear()}
            aria-label="Limpar texto da pesquisa"
          >
            <IoCloseCircle />
          </button>
        )}
      </div>

      <div className="filter-row">
        <label className="text-filter-field">
          <IoCarOutline />
          <span className="text-filter-content">
            <span className="text-filter-label">Marca</span>
            <input
              type="text"
              value={selectedBrand}
              onChange={onBrandChange}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma marca"
              autoComplete="off"
              aria-label="Digite uma marca válida"
            />
          </span>
        </label>

        <label className="text-filter-field">
          <IoCalendarOutline />
          <span className="text-filter-content">
            <span className="text-filter-label">Ano</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={selectedYear}
              onChange={onYearChange}
              onKeyDown={handleKeyDown}
              placeholder="Digite um ano"
              autoComplete="off"
              aria-label="Digite um ano válido"
            />
          </span>
        </label>

        <button type="button" className="execute-search" onClick={onExecute}>
          <IoSearchOutline />
          <span>Pesquisar</span>
        </button>

        <button
          type="button"
          className="schedule-search-btn"
          onClick={onOpenSchedule}
          title="Agendar pesquisa para um modelo específico"
        >
          <IoAlarmOutline />
          <span>Agendar Pesquisa</span>
          {scheduledCount > 0 && (
            <span className="schedule-badge-pill">{scheduledCount}</span>
          )}
        </button>

        {activeFilterChips.length > 0 && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onClear}
            title="Limpar todos os filtros"
          >
            <IoRefreshOutline />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>

      {activeFilterChips.length > 0 && (
        <div className="active-filters-container">
          <span className="active-filters-label">Filtros ativos:</span>
          <div className="active-filters-list">
            {activeFilterChips.map((chip) => (
              <span key={chip.id} className="active-filter-badge">
                <span>{chip.label}</span>
                <button
                  type="button"
                  className="remove-filter-btn"
                  onClick={() => onRemoveFilter(chip.type)}
                  aria-label={`Remover filtro ${chip.label}`}
                >
                  <IoCloseOutline />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="clear-all-text-btn"
              onClick={onClear}
            >
              Remover todos
            </button>
          </div>
        </div>
      )}

      {validationError && (
        <div className="search-validation-error" role="alert">
          <IoAlertCircleOutline />
          <span>{validationError}</span>
        </div>
      )}
    </section>
  );
}
