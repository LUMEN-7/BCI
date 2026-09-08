import {
  IoArrowBack,
  IoHomeOutline,
  IoStar,
  IoStarOutline,
  IoDownloadOutline
} from "react-icons/io5";
import "./style.css";

export default function Topbar({ favorite, onBack, onHome, onToggleFavorite }) {
  return (
    <header className="compare-detail-topbar">
      <button type="button" className="back-button" onClick={onBack}>
        <IoArrowBack />
        <span>Voltar</span>
      </button>
      <div className="topbar-actions">
        <button
          type="button"
          className="home-button"
          onClick={onHome}
          aria-label="Ir para início"
        >
          <IoHomeOutline />
        </button>
        <button
          type="button"
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          onClick={onToggleFavorite}
          aria-label="Favoritar comparação"
        >
          {favorite ? <IoStar /> : <IoStarOutline />}
        </button>
		<button
			type="button"
			className="export-data-button"
			// onClick={onExport}
			aria-label="Exportar dados"
		>
			<IoDownloadOutline />
			<span>Exportar dados</span>
		</button>
      </div>
    </header>
  );
}
