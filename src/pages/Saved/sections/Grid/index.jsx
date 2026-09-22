import {
  useEffect,
  useState,
} from "react";

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

import SectionLoader from "@/components/SectionLoader/index.jsx";

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


  /* =========================================================
     CARREGAR HISTÓRICO
  ========================================================= */

  useEffect(() => {
    async function carregar() {
      setLoading(
        true
      );

      setError(
        ""
      );


      try {
        const response =
          await listarVersoesCarro(
            linhagemId
          );


        setVersoes(
          response
        );

      } catch (err) {

        setError(
          err.message ||
          "Não foi possível carregar o histórico."
        );

      } finally {

        setLoading(
          false
        );

      }
    }


    carregar();

  }, [
    linhagemId,
  ]);


  /* =========================================================
     VER VERSÃO
  ========================================================= */

  async function verVersao(
    carroId
  ) {
    setVersaoSelecionada(
      carroId
    );


    setLoadingDetalhe(
      true
    );


    setError(
      ""
    );


    try {
      const response =
        await obterVersaoEspecifica(
          carroId
        );


      setDetalheVersao(
        response
      );

    } catch (err) {

      setError(
        err.message ||
        "Não foi possível carregar essa versão."
      );

    } finally {

      setLoadingDetalhe(
        false
      );

    }
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="update-history">

      {/* =====================================================
          HEADER
      ====================================================== */}

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
          CONTEÚDO
      ====================================================== */}

      {loading ? (

        <SectionLoader
          message="Carregando histórico"
          compact
        />

      ) : error ? (

        <p className="update-history-empty">
          {error}
        </p>

      ) : versoes.length > 0 ? (

        <div className="update-history-list">

          {versoes.map(
            (versao) => (

              <div
                key={
                  versao.carroId
                }
                className="update-item"
              >

                {/* TIMELINE */}

                <div className="update-timeline">
                  <span />
                  <div />
                </div>


                {/* CONTEÚDO */}

                <div className="update-content">

                  <div className="update-meta">

                    <span>
                      {
                        new Date(
                          versao.dataCriacao
                        ).toLocaleDateString(
                          "pt-BR"
                        )
                      }
                    </span>


                    {versao.ehVersaoAtual && (

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
                        versao.carroId
                      )
                    }
                  >
                    Ver detalhes desta versão
                  </button>


                  {/* ===========================================
                      DETALHE DA VERSÃO
                  ============================================ */}

                  {
                    versaoSelecionada ===
                    versao.carroId && (

                      loadingDetalhe ? (

                        <div className="update-version-detail">

                          <SectionLoader
                            message="Carregando alterações"
                            compact
                          />

                        </div>

                      ) : detalheVersao ? (

                        <div className="update-version-detail">

                          <strong>
                            O que mudou nesta versão
                          </strong>


                          <div className="update-version-changes">

                            {/* POTÊNCIA */}

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


                            {/* TORQUE */}

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

                    )
                  }

                </div>

              </div>

            )
          )}

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
    activeTab ===
    "cars";


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
          src={
            item.image
          }
          alt={
            item.name
          }
        />


        <button
          type="button"
          onClick={
            (event) => {

              event
                .stopPropagation();


              onCarDetails(
                item.id
              );

            }
          }
        >
          Ver detalhes

          <IoArrowForwardOutline />
        </button>

      </div>

    ) : (

      <div className="saved-compare-image">

        <div>

          <img
            src={
              item.firstImage
            }
            alt={
              item.firstCar
            }
          />

        </div>


        <span className="compare-vs">
          VS
        </span>


        <div>

          <img
            src={
              item.secondImage
            }
            alt={
              item.secondCar
            }
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
        `saved-card ${isOpen
          ? "saved-card-open"
          : ""
        }`
      }
    >

      {imageContent}


      <div className="saved-info">

        {/* ===================================================
            HEADER
        ==================================================== */}

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
                  : `${item.firstCar
                    ?.split(" ")[0] ||
                  "Modelo"
                  } VS ${item.secondCar
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
                  onHistory(
                    item
                  )
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
                    {
                      item.engine
                    }
                  </span>


                  <span>
                    {
                      item.power
                    }
                  </span>


                  <span>
                    {
                      item.type
                    }
                  </span>

                </>

              ) : (

                <>

                  <span>
                    {
                      item.firstCar
                    }
                  </span>


                  <span>
                    {
                      item.secondCar
                    }
                  </span>

                </>

              )}

            </div>


            <p>
              {
                item.description
              }
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
                ? (
                  <IoChevronUpOutline />
                )
                : (
                  <IoChevronDownOutline />
                )
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
             LOADING
          ==================================================== */

          <SectionLoader
            message="Carregando salvos"
          />

        ) : !items.length ? (

          /* ===================================================
             ESTADO VAZIO
          ==================================================== */

          <div className="saved-empty">

            <div className="saved-empty-icon">

              {
                activeTab ===
                  "cars"
                  ? (
                    <IoCarSportOutline />
                  )
                  : (
                    <IoGitCompareOutline />
                  )
              }

            </div>


            <h2>
              {
                activeTab ===
                  "cars"
                  ? "Nenhum modelo salvo"
                  : "Nenhuma comparação salva"
              }
            </h2>


            <p>
              {
                activeTab ===
                  "cars"
                  ? "Seus veículos favoritos aparecerão aqui."
                  : "Suas comparações salvas aparecerão aqui."
              }
            </p>

          </div>

        ) : (

          /* ===================================================
             CARDS
          ==================================================== */

          items.map(
            (item) => (

              <SavedCard
                key={
                  item.id
                }
                item={
                  item
                }
                activeTab={
                  activeTab
                }
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

            )
          )

        )}

      </section>


      {/* =====================================================
          MODAL DO HISTÓRICO
      ====================================================== */}

      {historyItem && (

        <div
          className="saved-history-modal-backdrop"
          onClick={() =>
            setHistoryItem(
              null
            )
          }
        >

          <div
            className="saved-history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-history-title"
            onClick={
              (event) =>
                event
                  .stopPropagation()
            }
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="saved-history-modal-header">

              <div>

                <span className="saved-history-modal-eyebrow">
                  Histórico do salvo
                </span>


                <h2 id="saved-history-title">
                  {
                    historyItem.name
                  }
                </h2>

              </div>


              <button
                type="button"
                className="saved-history-modal-close"
                aria-label="Fechar histórico"
                onClick={() =>
                  setHistoryItem(
                    null
                  )
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
                historyItem
                  .linhagemId
              }
            />

          </div>

        </div>

      )}

    </>
  );
}