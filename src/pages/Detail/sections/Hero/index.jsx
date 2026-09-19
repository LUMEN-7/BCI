import { Fragment } from "react";
import "./style.css";

function CarPreview({ car }) {
  return (
    <div className="car-preview">
      <div className="car-preview-brand">{car.brand}</div>
      <img src={car.image} alt={car.name} />
      <h2>{car.name}</h2>
    </div>
  );
}

export default function Hero({ cars = [] }) {
  return (
    <section className="compare-hero">
      {cars.map((car, index) => (
        <Fragment key={car.id}>
          {index > 0 && (
            <div className="vs-wrapper">
              <span className="vs-label">VS</span>
            </div>
          )}
          <CarPreview car={car} />
        </Fragment>
      ))}
    </section>
  );
}
