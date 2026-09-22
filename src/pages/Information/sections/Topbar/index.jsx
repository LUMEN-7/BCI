import {
  IoArrowBack,
  IoCheckmarkCircleOutline,
  IoClose,
  IoCreateOutline,
  IoDownloadOutline,
  IoHomeOutline,
  IoStar,
  IoStarOutline,
  IoTrashOutline,
} from "react-icons/io5";

import { useEffect, useState } from "react";

import "./style.css";


/* =========================================================
   EXPORT DIALOG
========================================================= */

function ExportDialog({
  handleExport,
  onClose,
}) {
  const [format, setFormat] =
    useState("csv");

  const [separator, setSeparator] =
    useState(",");

  const [isExporting, setIsExporting] =
    useState(false);


  async function handleConfirm() {
    try {
      setIsExporting(true);

      await handleExport(
        format,
        separator
      );

      onClose();

    } catch (error) {

      console.error(
        "Erro ao exportar:",
        error
      );

    } finally {

      setIsExporting(false);

    }
  }


  return (
    <div
      className="export-dialog-backdrop"
      role="presentation"
      onMouseDown={
        isExporting
          ? undefined
          : onClose
      }
    >

      <section
        className="export-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        <div className="export-dialog-header">

          <div>

            <span className="export-dialog-eyebrow">
              Exportação
            </span>

            <h2 id="export-dialog-title">
              Escolha o formato dos dados
            </h2>

          </div>


          <button
            type="button"
            className="export-dialog-close"
            onClick={onClose}
            aria-label="Fechar exportação"
            disabled={isExporting}
          >
            <IoClose />
          </button>

        </div>


        {isExporting ? (

          /* =================================================
             LOADING DA EXPORTAÇÃO
          ================================================= */

          <div className="export-dialog-loading">

            <span
              className="export-dialog-spinner"
              aria-hidden="true"
            />

            <strong>
              Preparando exportação...
            </strong>

            <p>
              Estamos gerando o arquivo.
            </p>

          </div>

        ) : (

          <>
            {/* ===============================================
                FORMATOS
            =============================================== */}

            <div className="export-format-options">

              {[
                "csv",
                "xlsx",
                "json",
                "xml",
              ].map((option) => (

                <label
                  className={
                    `export-format-option ${
                      format === option
                        ? "is-selected"
                        : ""
                    }`
                  }
                  key={option}
                >

                  <input
                    type="radio"
                    name="export-format"
                    value={option}
                    checked={
                      format === option
                    }
                    onChange={(event) =>
                      setFormat(
                        event.target.value
                      )
                    }
                  />

                  <strong>
                    {option.toUpperCase()}
                  </strong>

                </label>

              ))}

            </div>


            {/* ===============================================
                SEPARADOR CSV
            =============================================== */}

            {format === "csv" && (

              <fieldset className="csv-separator-options">

                <legend>
                  Separador do CSV
                </legend>


                <label>

                  <input
                    type="radio"
                    name="csv-separator"
                    value=","
                    checked={
                      separator === ","
                    }
                    onChange={() =>
                      setSeparator(",")
                    }
                  />

                  Vírgula (,)

                </label>


                <label>

                  <input
                    type="radio"
                    name="csv-separator"
                    value=";"
                    checked={
                      separator === ";"
                    }
                    onChange={() =>
                      setSeparator(";")
                    }
                  />

                  Ponto e vírgula (;)

                </label>

              </fieldset>

            )}


            {/* ===============================================
                AÇÕES
            =============================================== */}

            <div className="export-dialog-actions">

              <button
                type="button"
                className="export-dialog-cancel"
                onClick={onClose}
              >
                Cancelar
              </button>


              <button
                type="button"
                className="export-dialog-confirm"
                onClick={handleConfirm}
              >
                Baixar arquivo
              </button>

            </div>
          </>

        )}

      </section>

    </div>
  );
}


/* =========================================================
   SAVE LOADING MODAL
========================================================= */

function SaveLoadingModal() {
  return (
    <div
      className="save-loading-backdrop"
      role="presentation"
    >

      <section
        className="save-loading-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-loading-title"
      >

        <span
          className="save-loading-spinner"
          aria-hidden="true"
        />

        <div className="save-loading-content">

          <strong id="save-loading-title">
            Salvando informações...
          </strong>

          <span>
            Aguarde enquanto salvamos
            esta pesquisa.
          </span>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   SUCCESS TOAST
========================================================= */

function SaveSuccessToast({
  onClose,
}) {
  return (
    <div
      className="save-success-toast"
      role="status"
      aria-live="polite"
    >

      <div className="save-success-toast-icon">
        <IoCheckmarkCircleOutline />
      </div>


      <div className="save-success-toast-content">

        <strong>
          Pesquisa salva
        </strong>

        <span>
          As informações foram salvas
          com sucesso.
        </span>

      </div>


      <button
        type="button"
        className="save-success-toast-close"
        onClick={onClose}
        aria-label="Fechar aviso"
      >
        <IoClose />
      </button>

    </div>
  );
}


/* =========================================================
   TOPBAR
========================================================= */

export default function Topbar({
  isFavorite,
  isImported,
  onBack,
  onHome,
  handleExport,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  const [
    isExportOpen,
    setIsExportOpen,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    showSaveSuccess,
    setShowSaveSuccess,
  ] = useState(false);


  /* =========================================================
     FECHAR TOAST AUTOMATICAMENTE
  ========================================================= */

  useEffect(() => {
    if (!showSaveSuccess) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3500);

    return () =>
      clearTimeout(timer);

  }, [showSaveSuccess]);


  /* =========================================================
     FAVORITAR / SALVAR
  ========================================================= */

  async function handleFavoriteClick() {

    /*
      Se já estiver salvo, mantém
      o comportamento normal de remover.
    */
    if (isFavorite) {
      await onToggleFavorite();

      return;
    }


    try {

      setShowSaveSuccess(false);
      setIsSaving(true);


      const result =
        await onToggleFavorite();


      if (
        result?.success &&
        result?.acao === "adicionado"
      ) {
        setShowSaveSuccess(true);
      }

    } catch (error) {

      console.error(
        "Erro ao salvar pesquisa:",
        error
      );

    } finally {

      setIsSaving(false);

    }
  }


  return (
    <>

      {/* =====================================================
          TOPBAR
      ====================================================== */}

      <header className="information-topbar">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          <IoArrowBack />

          Voltar
        </button>


        <div className="topbar-actions">

          {/* HOME */}

          <button
            type="button"
            className="home-button"
            onClick={onHome}
            aria-label="Ir para home"
          >
            <IoHomeOutline />
          </button>


          {/* FAVORITAR / SALVAR */}

          <button
            type="button"
            className={
              `favorite-button ${
                isFavorite
                  ? "is-favorite"
                  : ""
              }`
            }
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite
                ? "Remover dos salvos"
                : "Salvar pesquisa"
            }
            disabled={isSaving}
          >
            {
              isFavorite
                ? <IoStar />
                : <IoStarOutline />
            }
          </button>


          {/* IMPORTADO */}

          {isImported && (

            <>
              <button
                type="button"
                className="information-action-button"
                onClick={onEdit}
                aria-label="Editar veículo"
              >
                <IoCreateOutline />
              </button>


              <button
                type="button"
                className="information-action-button danger"
                onClick={onDelete}
                aria-label="Excluir veículo"
              >
                <IoTrashOutline />
              </button>
            </>

          )}


          {/* EXPORTAR */}

          <button
            type="button"
            className="export-data-button"
            onClick={() =>
              setIsExportOpen(true)
            }
            aria-label="Exportar dados"
          >
            <IoDownloadOutline />

            <span>
              Exportar dados
            </span>
          </button>

        </div>

      </header>


      {/* =====================================================
          MODAL DE EXPORTAÇÃO
      ====================================================== */}

      {isExportOpen && (

        <ExportDialog
          handleExport={handleExport}
          onClose={() =>
            setIsExportOpen(false)
          }
        />

      )}


      {/* =====================================================
          LOADING DE SALVAMENTO
      ====================================================== */}

      {isSaving && (
        <SaveLoadingModal />
      )}


      {/* =====================================================
          TOAST DE SUCESSO
      ====================================================== */}

      {showSaveSuccess && (

        <SaveSuccessToast
          onClose={() =>
            setShowSaveSuccess(false)
          }
        />

      )}

    </>
  );
}