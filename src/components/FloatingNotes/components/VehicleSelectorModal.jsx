import {
  IoCarSportOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoSearchOutline,
  IoTimeOutline,
  IoStarOutline,
} from 'react-icons/io5';
import { useVehicleSelectorController } from '../hooks/useVehicleSelectorController';

function VehicleItem({ car, onSelectCar, onClose }) {
  return (
    <button type="button" className="floating-vehicle-item" onClick={() => { onSelectCar(car); onClose(); }}>
      <div className="floating-vehicle-thumb">
        {car.image ? <img src={car.image} alt={car.name} /> : <IoCarSportOutline />}
      </div>
      <div className="floating-vehicle-info">
        <span className="floating-vehicle-brand">{car.brand}</span>
        <strong>{car.name}</strong>
        <small>{[car.year, car.type, car.engine || car.power].filter(Boolean).join(' · ')}</small>
      </div>
      <IoCheckmarkOutline className="floating-vehicle-check" />
    </button>
  );
}

export default function VehicleSelectorModal({ isOpen, onClose, onSelectCar }) {
  const { search, setSearch, loading, error, favoritosFiltrados, recentesFiltrados, semResultado } =
    useVehicleSelectorController(isOpen);

  if (!isOpen) return null;

  return (
    <div className="floating-vehicle-modal-backdrop" onClick={onClose}>
      <div className="floating-vehicle-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Selecionar veículo salvo">
        <div className="floating-vehicle-modal-header">
          <div className="floating-vehicle-title">
            <div className="floating-vehicle-icon"><IoCarSportOutline /></div>
            <div><span>Veículos Salvos</span><h3>Inserir na Anotação</h3></div>
          </div>
          <button type="button" className="floating-vehicle-close" onClick={onClose} aria-label="Fechar modal">
            <IoCloseOutline />
          </button>
        </div>

        <div className="floating-vehicle-search">
          <IoSearchOutline />
          <input type="text" placeholder="Buscar em veículos salvos..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>

        <div className="floating-vehicle-list">
          {loading ? (
            <div className="floating-vehicle-empty"><span>Carregando seus veículos salvos...</span></div>
          ) : error ? (
            <div className="floating-vehicle-empty"><p>{error}</p></div>
          ) : (
            <>
              {favoritosFiltrados.length > 0 && (
                <div className="floating-vehicle-section">
                  <div className="floating-vehicle-section-title"><IoStarOutline /><span>Favoritos</span></div>
                  {favoritosFiltrados.map((car) => <VehicleItem key={car.id} car={car} onSelectCar={onSelectCar} onClose={onClose} />)}
                </div>
              )}

              {recentesFiltrados.length > 0 && (
                <div className="floating-vehicle-section">
                  <div className="floating-vehicle-section-title"><IoTimeOutline /><span>Vistos recentemente</span></div>
                  {recentesFiltrados.map((car) => <VehicleItem key={car.id} car={car} onSelectCar={onSelectCar} onClose={onClose} />)}
                </div>
              )}

              {semResultado && (
                <div className="floating-vehicle-empty">
                  <IoCarSportOutline />
                  <p>Nenhum veículo encontrado</p>
                  <small>Favorite ou visite veículos no catálogo pra inseri-los facilmente nas suas anotações.</small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}