import { IoArrowBack, IoHomeOutline, IoStar, IoStarOutline, IoDownloadOutline } from 'react-icons/io5';
import './style.css';

export default function Topbar({ favorite, onBack, onHome, onToggleFavorite }) {
    return (
        <header className="information-topbar">
            <button className="back-button" onClick={onBack}><IoArrowBack />Voltar</button>
            <div className="topbar-actions">
                <button className="home-button" onClick={onHome} aria-label="Ir para home"><IoHomeOutline /></button>
                <button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} onClick={onToggleFavorite} aria-label="Favoritar modelo">
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
