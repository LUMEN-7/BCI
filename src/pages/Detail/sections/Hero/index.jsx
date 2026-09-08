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

export default function Hero({ firstCar, secondCar }) {
  return (
    <section className="compare-hero">
      <CarPreview car={firstCar} />
      <div className="vs-wrapper">
        <span className="vs-label">VS</span>
      </div>
      <CarPreview car={secondCar} />
    </section>
  );
}
