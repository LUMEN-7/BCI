import { IoArrowForward, IoStar, IoStarOutline } from "react-icons/io5";

import "./style.css";

export default function CarGrid({
  cars,
  favorites,
  onToggleFavorite,
  onDetails,
}) {
  return (
    <div className="cars-grid">
      {cars.map((car) => (
        <article key={car.id} className="car-card">
          <div className="card-top">
            <span className="car-brand">{car.brand}</span>
            <button
              type="button"
              className={`favorite-button ${favorites.includes(car.id) ? "is-favorite" : ""}`}
              onClick={() => onToggleFavorite(car.id)}
              aria-label={
                favorites.includes(car.id)
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              {favorites.includes(car.id) ? <IoStar /> : <IoStarOutline />}
            </button>
          </div>

          <div className="car-image-container">
            <img src={car.image} alt={car.name} className="car-image" />
          </div>

          <div className="car-information">
            <div className="car-meta">{car.segment}</div>
            <h3>{car.name.replace(` ${car.year}`, "")}</h3>
            <span className="car-year">{car.year}</span>
          </div>

          <button
            type="button"
            className="details-button"
            onClick={() => onDetails(car.id)}
          >
            <span>EXPLORAR MODELO</span>
            <IoArrowForward />
          </button>
        </article>
      ))}
    </div>
  );
}
