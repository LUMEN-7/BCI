import { IoCloseOutline, IoCheckmarkOutline } from 'react-icons/io5';
import './style.css';

export default function VehicleModal({ isOpen, onClose, savedCars, currentVehicleId, onSelectVehicle }) {
    if (!isOpen) return null;

    return (
        <div className="vehicle-modal-backdrop" onClick={onClose}>
            <div className="vehicle-modal" onClick={(event) => event.stopPropagation()}>
                <header className="vehicle-modal-header">
                    <div>
                        <span>Biblioteca</span>
                        <h2>Selecionar veículo</h2>
                    </div>
                    <button type="button" onClick={onClose}>
                        <IoCloseOutline />
                    </button>
                </header>

                <div className="vehicle-list">
                    {savedCars.map((car) => {
                        const selected = currentVehicleId === car.id;

                        return (
                            <button
                                type="button"
                                key={car.id}
                                className={`vehicle-option ${selected ? 'selected' : ''}`}
                                onClick={() => onSelectVehicle(car.id)}
                            >
                                <div className="vehicle-option-image">
                                    <img src={car.image} alt={car.name} />
                                </div>
                                <div className="vehicle-option-info">
                                    <span>{car.brand}</span>
                                    <strong>{car.name}</strong>
                                    <small>{car.engine} · {car.power} · {car.type}</small>
                                </div>
                                {selected && <IoCheckmarkOutline />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}