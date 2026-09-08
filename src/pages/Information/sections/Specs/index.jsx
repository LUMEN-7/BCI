import {
  IoCarSportOutline,
  IoFlashOutline,
  IoSpeedometerOutline,
  IoWaterOutline,
} from "react-icons/io5";
import "./style.css";

const cards = [
  ["engine", <IoSpeedometerOutline />, "Motor"],
  ["power", <IoFlashOutline />, "Potência"],
  ["type", <IoCarSportOutline />, "Tipo"],
  ["consumption", <IoWaterOutline />, "Consumo"],
];

export default function Specs({ specs }) {
  return (
    <section className="specs-grid">
      {cards.map(([key, icon, label]) => (
        <div className="spec-card" key={key}>
          <div className="spec-icon">{icon}</div>
          <span>{label}</span>
          <strong>{specs[key].value}</strong>
        </div>
      ))}
    </section>
  );
}
