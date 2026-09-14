import {
  IoCarSportOutline,
  IoCloseOutline,
  IoOpenOutline,
} from 'react-icons/io5';

export default function VehicleCard({ car, onNavigate, onRemove }) {
  const carName = car.name || car.model || 'Veículo';
  const specs = [car.year || car.ano, car.engine, car.power, car.type]
    .filter(Boolean);

  return (
    <div
      className={`md-vehicle-card ${onRemove ? 'attached-vehicle-card' : ''}`}
      onClick={() => onNavigate?.(car.id)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onNavigate?.(car.id);
        }
      }}
      title="Ver ficha técnica do veículo"
    >
      <div className="md-vehicle-card-image">
        {car.image ? (
          <img src={car.image} alt={carName} />
        ) : (
          <IoCarSportOutline />
        )}
      </div>

      <div className="md-vehicle-card-info">
        <span className="md-vehicle-card-brand">{car.brand || 'FORD'}</span>
        <h4>{carName}</h4>
        <div className="md-vehicle-card-specs">
          {specs.map((spec, index) => <span key={`${spec}-${index}`}>{spec}</span>)}
        </div>
      </div>

      <button
        type="button"
        className="md-vehicle-card-action"
        onClick={(event) => {
          event.stopPropagation();
          onNavigate?.(car.id);
        }}
        title="Ver veículo"
      >
        <span>Ver ficha</span>
        <IoOpenOutline />
      </button>

      {onRemove && (
        <button
          type="button"
          className="attached-vehicle-card-remove"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(car.id);
          }}
          title="Remover veículo da anotação"
          aria-label={`Remover ${carName}`}
        >
          <IoCloseOutline />
        </button>
      )}
    </div>
  );
}
