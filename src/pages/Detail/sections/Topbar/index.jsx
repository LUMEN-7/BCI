import {
  IoArrowBack,
  IoClose,
  IoHomeOutline,
  IoStar,
  IoStarOutline,
  IoDownloadOutline
} from "react-icons/io5";
import { useState } from "react";
import "./style.css";

function ExportDialog({ handleExport, onClose }) {
  const [format, setFormat] = useState("csv");
  const [separator, setSeparator] = useState(",");

  async function handleConfirm() {
    await handleExport(format, separator);
    onClose();
  }

  return (
    <div className="export-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="export-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="export-dialog-header">
          <div>
            <span className="export-dialog-eyebrow">Exportação</span>
            <h2 id="export-dialog-title">Escolha o formato dos dados</h2>
          </div>
          <button
            type="button"
            className="export-dialog-close"
            onClick={onClose}
            aria-label="Fechar exportação"
          >
            <IoClose />
          </button>
        </div>

        <div className="export-format-options">
          {["csv", "xlsx", "json", "xml"].map((option) => (
            <label
              className={`export-format-option ${format === option ? "is-selected" : ""}`}
              key={option}
            >
              <input
                type="radio"
                name="export-format"
                value={option}
                checked={format === option}
                onChange={(event) => setFormat(event.target.value)}
              />
              <strong>{option.toUpperCase()}</strong>
            </label>
          ))}
        </div>

        {format === "csv" && (
          <fieldset className="csv-separator-options">
            <legend>Separador do CSV</legend>
            <label>
              <input
                type="radio"
                name="csv-separator"
                value=","
                checked={separator === ","}
                onChange={() => setSeparator(",")}
              />
              Vírgula (,)
            </label>
            <label>
              <input
                type="radio"
                name="csv-separator"
                value=";"
                checked={separator === ";"}
                onChange={() => setSeparator(";")}
              />
              Ponto e vírgula (;)
            </label>
          </fieldset>
        )}

        <div className="export-dialog-actions">
          <button type="button" className="export-dialog-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="export-dialog-confirm" onClick={handleConfirm}>
            Baixar arquivo
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Topbar({ favorite, onBack, onHome, onToggleFavorite, handleExport }) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <>
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
            onClick={() => setIsExportOpen(true)}
            aria-label="Exportar dados"
          >
            <IoDownloadOutline />
            <span>Exportar dados</span>
          </button>
        </div>
      </header>
      {isExportOpen && (
        <ExportDialog
          handleExport={handleExport}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </>
  );
}
