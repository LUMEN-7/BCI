import React from 'react';
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
  isCarDropdownOpen,
  carSearch,
  filteredCars,
  setIsCarDropdownOpen,
  setCarSearch,
  handleSelectCar,
}) {
  return (
    <div className="schedule-field-group">
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
          {isCarDropdownOpen ? 'Recolher lista' : 'Trocar / Escolher outro modelo'}
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
    </div>
  );
}