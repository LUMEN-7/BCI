import {
  IoAlarmOutline,
  IoArrowForward,
  IoCarSportOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";

import "./style.css";

export default function CarGrid({
  cars,
  favorites,
  onToggleFavorite,
  onDetails,
  onSchedule,
  onEdit,
}) {
  return (
    <div className="cars-grid">
      {cars.map((car) => (
        <article key={car.id} className="car-card">
          <div className="card-top">
            <span className="car-brand">{car.brand}</span>
            <div className="card-top-actions">
              {car.isImported && (
                <span className="imported-car-badge">IMPORTADO</span>
              )}
              {!car.isImported && onSchedule && (
                <button
                  type="button"
                  className="schedule-card-button"
                  onClick={() => onSchedule(car)}
                  title="Agendar pesquisa deste modelo"
                  aria-label="Agendar pesquisa deste modelo"
                >
                  <IoAlarmOutline />
                </button>
              )}
              <button
                type="button"
                className={`favorite-button ${favorites.includes(String(car.id)) ? "is-favorite" : ""}`}
                onClick={() => onToggleFavorite(car.id)}
                aria-label={
                  favorites.includes(String(car.id))
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
              >
                {favorites.includes(String(car.id)) ? <IoStar /> : <IoStarOutline />}
              </button>
            </div>
          </div>

          <div className="car-image-container">
            {car.image || car.imagemUrl ? (
              <img src={car.image || car.imagemUrl} alt={car.modelo} className="car-image" />
            ) : (
              <div className="car-image-fallback">
                <IoCarSportOutline />
                <span>Sem foto disponível</span>
              </div>
            )}
          </div>

          <div className="car-information">
            <div className="car-meta">{car.segment || "Veículo"}</div>
            <h3>{car.modelo?.replace(` ${car.ano}`, "") || car.modelo}</h3>
            <span className="car-year">{car.ano}</span>
          </div>

          {car.isImported ? (
            <button type="button" className="details-button" onClick={() => onDetails(car.id, car)}>
              <span>EXPLORAR MODELO</span>
              <IoArrowForward />
            </button>
          ) : (
            <button type="button" className="details-button" onClick={() => onDetails(car.id)}>
              <span>EXPLORAR MODELO</span>
              <IoArrowForward />
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
