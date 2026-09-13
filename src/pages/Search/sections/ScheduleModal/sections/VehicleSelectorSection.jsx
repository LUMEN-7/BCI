import React, { useState } from 'react';
import {
  IoCarSportOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoCheckmarkOutline,
} from 'react-icons/io5';

export function VehicleSelectorSection({
  selectedCar,
  isUnreleased,
  unreleasedName,
  unreleasedBrand,
  unreleasedYear,
  brandOptions,
  isCarDropdownOpen,
  carSearch,
  filteredCars,
  setIsUnreleased,
  setUnreleasedName,
  setUnreleasedBrand,
  setUnreleasedYear,
  setIsCarDropdownOpen,
  setCarSearch,
  handleSelectCar,
}) {
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  return (
    <div className="schedule-field-group">
      <div className="schedule-vehicle-mode" role="group" aria-label="Tipo de veículo">
        <button
          type="button"
          className={`schedule-vehicle-mode-btn ${!isUnreleased ? 'is-active' : ''}`}
          onClick={() => setIsUnreleased(false)}
        >
          Do catálogo
        </button>
        <button
          type="button"
          className={`schedule-vehicle-mode-btn ${isUnreleased ? 'is-active' : ''}`}
          onClick={() => setIsUnreleased(true)}
        >
          Não lançado
        </button>
      </div>

      {isUnreleased ? (
        <div className="schedule-unreleased-fields">
          <div className="schedule-field-group">
            <label htmlFor="unreleased-car-name" className="schedule-field-label">
              <IoCarSportOutline />
              <span>Nome do carro</span>
            </label>
            <div className="schedule-input-wrapper">
              <input
                id="unreleased-car-name"
                type="text"
                placeholder="Ex: Mustang elétrico"
                value={unreleasedName}
                onChange={(e) => setUnreleasedName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="schedule-grid-row">
            <div className="schedule-field-group">
              <label htmlFor="unreleased-car-brand" className="schedule-field-label">
                <span>Marca</span>
              </label>
              <div className={`schedule-brand-dropdown ${isBrandDropdownOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className={`schedule-brand-trigger ${unreleasedBrand ? 'has-value' : ''}`}
                  onClick={() => setIsBrandDropdownOpen((open) => !open)}
                  aria-expanded={isBrandDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <span>{unreleasedBrand || 'Selecionar marca'}</span>
                  <IoChevronDownOutline />
                </button>

                {isBrandDropdownOpen && (
                  <div className="schedule-brand-menu" role="listbox">
                    <button
                      type="button"
                      className={`schedule-brand-option ${!unreleasedBrand ? 'is-selected' : ''}`}
                      onClick={() => {
                        setUnreleasedBrand('');
                        setIsBrandDropdownOpen(false);
                      }}
                    >
                      Selecionar marca
                    </button>
                    {brandOptions.map((brand) => (
                      <button
                        type="button"
                        key={brand}
                        className={`schedule-brand-option ${unreleasedBrand === brand ? 'is-selected' : ''}`}
                        onClick={() => {
                          setUnreleasedBrand(brand);
                          setIsBrandDropdownOpen(false);
                        }}
                      >
                        <span>{brand}</span>
                        {unreleasedBrand === brand && <IoCheckmarkOutline />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="schedule-field-group">
              <label htmlFor="unreleased-car-year" className="schedule-field-label">
                <span>Ano</span>
              </label>
              <div className="schedule-input-wrapper">
                <input
                  id="unreleased-car-year"
                  type="number"
                  placeholder="Ex: 2027"
                  min="1886"
                  max="2100"
                  value={unreleasedYear}
                  onChange={(e) => setUnreleasedYear(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
      <div className="schedule-field-header">
        <label className="schedule-field-label">
          <IoCarSportOutline />
          <span>Modelo do Veículo</span>
        </label>
        <button
          type="button"
          className="schedule-change-model-link"
          onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
        >
        </button>
      </div>

      <div className="car-selector-box">
        {selectedCar ? (
          <div
            className={`car-selected-preview ${isCarDropdownOpen ? 'is-expanded' : ''}`}
            onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
            role="button"
            tabIndex={0}
            title="Clique para escolher outro modelo"
          >
            <div className="car-preview-thumb">
              {selectedCar.image ? (
                <img src={selectedCar.image} alt={selectedCar.modelo || selectedCar.name} />
              ) : (
                <IoCarSportOutline />
              )}
            </div>
            <div className="car-preview-info">
              <span className="car-preview-brand">{selectedCar.brand || 'FORD'}</span>
              <strong>{selectedCar.modelo || selectedCar.name}</strong>
              <small>
                {selectedCar.segment || 'Veículo'}
                {selectedCar.ano ? ` · ${selectedCar.ano}` : ''}
              </small>
            </div>
            <div className="car-selector-toggle-btn">
              <span>{isCarDropdownOpen ? 'Fechar' : 'Alterar'}</span>
              {isCarDropdownOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="car-selected-placeholder"
            onClick={() => setIsCarDropdownOpen(true)}
          >
            <IoCarSportOutline />
            <span>Clique para selecionar um modelo de veículo</span>
            <IoChevronDownOutline />
          </button>
        )}

        {isCarDropdownOpen && (
          <div className="car-dropdown-panel">
            <div className="car-dropdown-search">
              <IoSearchOutline />
              <input
                type="text"
                placeholder="Buscar por nome, marca ou categoria..."
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                autoFocus
              />
              {carSearch && (
                <button
                  type="button"
                  className="car-search-clear-btn"
                  onClick={() => setCarSearch('')}
                >
                  <IoCloseOutline />
                </button>
              )}
            </div>

            <div className="car-dropdown-list">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => {
                  const isCur = String(car.id) === String(selectedCar?.id);
                  return (
                    <button
                      type="button"
                      key={car.id}
                      className={`car-dropdown-item ${isCur ? 'is-selected' : ''}`}
                      onClick={() => handleSelectCar(car)}
                    >
                      <div className="item-thumb">
                        {car.image ? (
                          <img src={car.image} alt={car.modelo || car.name} />
                        ) : (
                          <IoCarSportOutline />
                        )}
                      </div>
                      <div className="item-info">
                        <span className="item-brand">{car.brand}</span>
                        <strong>{car.modelo || car.name}</strong>
                        <small>
                          {car.segment || 'Veículo'}
                          {car.ano ? ` · ${car.ano}` : ''}
                        </small>
                      </div>
                      {isCur ? (
                        <span className="item-badge is-active">
                          <IoCheckmarkOutline />
                          <span>Selecionado</span>
                        </span>
                      ) : (
                        <span className="item-badge">Escolher</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="car-dropdown-empty">
                  <p>Nenhum modelo encontrado para "{carSearch}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}