import { useEffect, useRef, useState } from "react";
import {
  IoAlarmOutline,
  IoAlertCircleOutline,
  IoCalendarOutline,
  IoCarOutline,
  IoCheckmarkOutline,
  IoChevronDownOutline,
  IoCloseCircle,
  IoCloseOutline,
  IoRefreshOutline,
  IoSearchOutline,
} from "react-icons/io5";

import "./style.css";

function CustomDropdown({
  label,
  placeholder,
  value,
  options,
  onChange,
  icon: Icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayValue = value || placeholder;
  const isSelected = Boolean(value);

  return (
    <div className={`custom-dropdown ${isOpen ? "is-open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className={`dropdown-trigger ${isSelected ? "has-value" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="dropdown-trigger-icon">
          {Icon ? <Icon /> : <IoCarOutline />}
        </span>
        <span className="dropdown-trigger-text">
          <span className="dropdown-trigger-label">{label}:</span>
          <strong className="dropdown-trigger-value">{displayValue}</strong>
        </span>
        <IoChevronDownOutline className="dropdown-arrow" />
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          <div className="dropdown-header">
            <span>Selecionar {label}</span>
          </div>
          <div className="dropdown-options">
            <button
              type="button"
              className={`dropdown-option ${!value ? "is-selected" : ""}`}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              <span>{placeholder}</span>
              {!value && <IoCheckmarkOutline className="option-check" />}
            </button>

            {options.map((option) => {
              const optionStr = String(option);
              const isCurrent = String(value) === optionStr;
              return (
                <button
                  key={optionStr}
                  type="button"
                  className={`dropdown-option ${isCurrent ? "is-selected" : ""}`}
                  onClick={() => {
                    onChange(optionStr);
                    setIsOpen(false);
                  }}
                >
                  <span>{optionStr}</span>
                  {isCurrent && <IoCheckmarkOutline className="option-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Controls({
  search,
  brands,
  years,
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
        <CustomDropdown
          label="Marca"
          placeholder="Todas as marcas"
          value={selectedBrand}
          options={brands}
          onChange={onBrandChange}
          icon={IoCarOutline}
        />

        <CustomDropdown
          label="Ano"
          placeholder="Todos os anos"
          value={selectedYear}
          options={years}
          onChange={onYearChange}
          icon={IoCalendarOutline}
        />

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
