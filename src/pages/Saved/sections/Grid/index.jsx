import { useEffect, useState } from "react";

import {
  IoArrowForwardOutline,
  IoCarSportOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCloseOutline,
  IoGitCompareOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";

import {
  listarVersoesCarro,
  obterVersaoEspecifica,
} from "@/services/carsService";

import "./style.css";


/* =========================================================
   VERSION HISTORY
========================================================= */

function VersionHistory({
  linhagemId,
}) {
  const [
    versoes,
    setVersoes,
  ] = useState([]);

  const [
    versaoSelecionada,
    setVersaoSelecionada,
  ] = useState(null);

  const [
    detalheVersao,
    setDetalheVersao,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingDetalhe,
    setLoadingDetalhe,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setError("");

      try {
        const response =
          await listarVersoesCarro(
            linhagemId
          );

        setVersoes(response);

      } catch (err) {

        setError(
          err.message ||
          "Não foi possível carregar o histórico."
        );

      } finally {

        setLoading(false);

      }
    }

    carregar();

  }, [linhagemId]);


  async function verVersao(
    carroId
  ) {
    setVersaoSelecionada(
      carroId
    );

    setLoadingDetalhe(true);
    setError("");

    try {
      const response =
        await obterVersaoEspecifica(
          carroId
        );

      setDetalheVersao(response);

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível carregar essa versão."
      );

    } finally {

      setLoadingDetalhe(false);

    }
  }


  return (
    <div className="update-history">

      <div className="update-history-header">

        <div className="update-history-title">

          <IoTimeOutline />

          <div>
            <strong>
              Histórico de versões
            </strong>

            <span>
              Todas as vezes que este carro foi atualizado
            </span>
          </div>

        </div>

      </div>


      {/* =====================================================
          LOADING DO HISTÓRICO
      ====================================================== */}

      {loading ? (

        <div
          className="saved-local-loader"
          role="status"
          aria-live="polite"
        >

          <span
            className="saved-local-loader-spinner"
            aria-hidden="true"
          />

          <p>
            Carregando histórico
            <span className="saved-local-loader-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>

        </div>

      ) : error ? (

        <p className="update-history-empty">
          {error}
        </p>

      ) : versoes.length > 0 ? (

        <div className="update-history-list">

          {versoes.map((v) => (

            <div
              key={v.carroId}
              className="update-item"
            >

              <div className="update-timeline">
                <span />
                <div />
              </div>


              <div className="update-content">

                <div className="update-meta">

                  <span>
                    {
                      new Date(
                        v.dataCriacao
                      ).toLocaleDateString(
                        "pt-BR"
                      )
                    }
                  </span>


                  {v.ehVersaoAtual && (
                    <small>
                      ATUAL
                    </small>
                  )}

                </div>


                <button
                  type="button"
                  className="mark-read-button"
                  onClick={() =>
                    verVersao(
                      v.carroId
                    )
                  }
                >
                  Ver detalhes desta versão
                </button>


                {versaoSelecionada ===
                  v.carroId && (

                  loadingDetalhe ? (

                    <div className="update-version-detail">

                      <div
                        className="
                          saved-local-loader
                          saved-local-loader-compact
                        "
                        role="status"
                        aria-live="polite"
                      >

                        <span
                          className="saved-local-loader-spinner"
                          aria-hidden="true"
                        />

                        <p>
                          Carregando alterações
                          <span className="saved-local-loader-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                          </span>
                        </p>

                      </div>

                    </div>

                  ) : detalheVersao ? (

                    <div className="update-version-detail">

                      <strong>
                        O que mudou nesta versão
                      </strong>


                      <div className="update-version-changes">

                        <span>

                          <small>
                            Potência
                          </small>

                          <b>
                            {
                              detalheVersao
                                .especificacoes?.[0]
                                ?.potencia
                                ?.Fontes?.[0]
                                ?.Valor ||
                              "Não informado"
                            }{" "}
                            cv
                          </b>

                        </span>


                        <span>

                          <small>
                            Torque
                          </small>

                          <b>
                            {
                              detalheVersao
                                .especificacoes?.[0]
                                ?.torque
                                ?.Fontes?.[0]
                                ?.Valor ||
                              "Não informado"
                            }{" "}
                            Nm
                          </b>

                        </span>

                      </div>

                    </div>

                  ) : null

                )}

              </div>

            </div>

          ))}

        </div>

      ) : (

        <p className="update-history-empty">
          Nenhum histórico registrado para este carro.
        </p>

      )}

    </div>
  );
}


/* =========================================================
   SAVED CARD
========================================================= */

function SavedCard({
  item,
  activeTab,
  isOpen,
  onToggleCard,
  onHistory,
  onDelete,
  onCarDetails,
  onComparisonDetails,
}) {
  const isCar =
    activeTab === "cars";


  const imageContent =
    isCar ? (

      <div
        className="saved-image"
        onClick={() =>
          onCarDetails(
            item.id
          )
        }
      >

        <img
          src={item.image}
          alt={item.name}
        />


        <button
          type="button"
          onClick={(event) => {

            event.stopPropagation();

            onCarDetails(
              item.id
            );

          }}
        >
          Ver detalhes

          <IoArrowForwardOutline />
        </button>

      </div>

    ) : (

      <div className="saved-compare-image">

        <div>
          <img
            src={item.firstImage}
            alt={item.firstCar}
          />
        </div>


        <span className="compare-vs">
          VS
        </span>


        <div>
          <img
            src={item.secondImage}
            alt={item.secondCar}
          />
        </div>


        <button
          type="button"
          onClick={() =>
            onComparisonDetails(
              item.id
            )
          }
        >
          Ver comparação

          <IoArrowForwardOutline />
        </button>

      </div>

    );


  return (
    <article
      className={
        `saved-card ${
          isOpen
            ? "saved-card-open"
            : ""
        }`
      }
    >

      {imageContent}


      <div className="saved-info">

        <div className="saved-card-header">

          <div className="saved-card-heading">

            <span>
              {
                isCar
                  ? item.brand
                  : "Comparação"
              }
            </span>


            <h2>
              {
                isCar
                  ? item.name
                  : `${
                    item.firstCar
                      ?.split(" ")[0] ||
                    "Modelo"
                  } VS ${
                    item.secondCar
                      ?.split(" ")[0] ||
                    "Modelo"
                  }`
              }
            </h2>

          </div>


          <div className="saved-card-actions">

            {isCar && (

              <button
                type="button"
                className="history-card-button"
                title="Ver histórico"
                aria-label="Ver histórico"
                onClick={() =>
                  onHistory(item)
                }
              >
                <IoTimeOutline />
              </button>

            )}


            <button
              type="button"
              className="delete-button"
              title="Remover dos salvos"
              aria-label="Remover dos salvos"
              onClick={() =>
                onDelete(
                  item.id
                )
              }
            >
              <IoTrashOutline />
            </button>

          </div>

        </div>


        {/* ===================================================
            DETALHES
        ==================================================== */}

        {isOpen && (

          <div className="saved-details">

            <div className="saved-specs">

              {isCar ? (

                <>
                  <span>
                    {item.engine}
                  </span>

                  <span>
                    {item.power}
                  </span>

                  <span>
                    {item.type}
                  </span>
                </>

              ) : (

                <>
                  <span>
                    {item.firstCar}
                  </span>

                  <span>
                    {item.secondCar}
                  </span>
                </>

              )}

            </div>


            <p>
              {item.description}
            </p>

          </div>

        )}


        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="saved-card-footer-actions">

          <button
            type="button"
            className="expand-button"
            onClick={() =>
              onToggleCard(
                item.id
              )
            }
            aria-label={
              isOpen
                ? "Fechar detalhes"
                : "Abrir detalhes"
            }
          >

            <span>
              {
                isOpen
                  ? "Fechar detalhes"
                  : "Ver informações"
              }
            </span>


            {
              isOpen
                ? <IoChevronUpOutline />
                : <IoChevronDownOutline />
            }

          </button>

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   SAVED GRID
========================================================= */

export default function SavedGrid({
  activeTab,
  items,
  openCards,
  loading,
  onToggleCard,
  onDelete,
  onCarDetails,
  onComparisonDetails,
}) {
  const [
    historyItem,
    setHistoryItem,
  ] = useState(null);


  return (
    <>

      {/* =====================================================
          GRID
      ====================================================== */}

      <section className="saved-grid">

        {loading ? (

          /* ===================================================
             LOADING DOS SALVOS
          ==================================================== */

          <div
            className="saved-loading"
            role="status"
            aria-live="polite"
          >

            <span
              className="saved-loading-spinner"
              aria-hidden="true"
            />


            <strong>
              Carregando salvos
            </strong>


            <span>
              Buscando suas informações salvas...
            </span>

          </div>

        ) : !items.length ? (

          /* ===================================================
             ESTADO VAZIO
          ==================================================== */

          <div className="saved-empty">

            <div className="saved-empty-icon">

              {
                activeTab === "cars"
                  ? <IoCarSportOutline />
                  : <IoGitCompareOutline />
              }

            </div>


            <h2>
              {
                activeTab === "cars"
                  ? "Nenhum modelo salvo"
                  : "Nenhuma comparação salva"
              }
            </h2>


            <p>
              {
                activeTab === "cars"
                  ? "Seus veículos favoritos aparecerão aqui."
                  : "Suas comparações salvas aparecerão aqui."
              }
            </p>

          </div>

        ) : (

          /* ===================================================
             CARDS
          ==================================================== */

          items.map((item) => (

            <SavedCard
              key={item.id}
              item={item}
              activeTab={activeTab}
              isOpen={
                !!openCards[
                  item.id
                ]
              }
              onToggleCard={
                onToggleCard
              }
              onHistory={
                setHistoryItem
              }
              onDelete={
                onDelete
              }
              onCarDetails={
                onCarDetails
              }
              onComparisonDetails={
                onComparisonDetails
              }
            />

          ))

        )}

      </section>


      {/* =====================================================
          MODAL DO HISTÓRICO
      ====================================================== */}

      {historyItem && (

        <div
          className="saved-history-modal-backdrop"
          onClick={() =>
            setHistoryItem(null)
          }
        >

          <div
            className="saved-history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-history-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                HEADER DO MODAL
            ================================================= */}

            <header className="saved-history-modal-header">

              <div>

                <span className="saved-history-modal-eyebrow">
                  Histórico do salvo
                </span>


                <h2 id="saved-history-title">
                  {historyItem.name}
                </h2>

              </div>


              <button
                type="button"
                className="saved-history-modal-close"
                aria-label="Fechar histórico"
                onClick={() =>
                  setHistoryItem(null)
                }
              >
                <IoCloseOutline />
              </button>

            </header>


            {/* =================================================
                HISTÓRICO
            ================================================= */}

            <VersionHistory
              linhagemId={
                historyItem.linhagemId
              }
            />

          </div>

        </div>

      )}

    </>
  );
}