import { IoTimeOutline } from "react-icons/io5";
import CarGrid from "../CarGrid";
import "./style.css";

export default function RecentViewed({
  cars,
  favorites,
  onToggleFavorite,
  onDetails,
  onSchedule,
  onEdit,
}) {
  if (!cars || cars.length === 0) return null;

  return (
    <section className="recent-viewed-section">
      <div className="recent-viewed-header">
        <div>
          <span className="section-label">
            <IoTimeOutline />
            <span>HISTÓRICO RECENTE</span>
          </span>
          <h2 className="recent-viewed-title">Últimos vistos</h2>
          <p className="recent-viewed-subtitle">
            Modelos que você acessou recentemente no sistema.
          </p>
        </div>
        <span className="recent-viewed-count">
          {cars.length} {cars.length === 1 ? "MODELO" : "MODELOS"}
        </span>
      </div>

      <CarGrid
        cars={cars}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onDetails={onDetails}
        onSchedule={onSchedule}
        onEdit={onEdit}
      />
    </section>
  );
}
