import {
  IoCarSportOutline,
  IoCheckmarkOutline,
  IoGitCompareOutline,
  IoSearchOutline,
  IoSparklesOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";

import useMultiCompareController from "../../hooks/useMultiCompareController";
import "./style.css";

export default function MultiCompare({ cars }) {
  const controller = useMultiCompareController({ cars });

  if (!controller.referenceCar) {
    return (
      <section className="multi-compare-section">
        <div className="multi-compare-intro">
          <span className="section-eyebrow">PASSO 1</span>
          <h2>Escolha o modelo de referência</h2>
          <p>Selecione o veículo principal para encontrarmos os modelos mais parecidos com ele.</p>
        </div>

        <div className="multi-search-bar">
          <IoSearchOutline />
          <input
            type="text"
            placeholder="Buscar por marca, modelo ou motor..."
            value={controller.referenceSearch}
            onChange={(e) => controller.setReferenceSearch(e.target.value)}
          />
        </div>

        {controller.referenceResults.length > 0 ? (
          <div className="multi-results-grid">
            {controller.referenceResults.map((car) => (
              <ModelCard key={car.id} car={car} onClick={() => controller.selectReference(car)} />
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhum modelo encontrado para essa busca." />
        )}
      </section>
    );
  }

  return (
    <section className="multi-compare-section">
      <div className="multi-reference-card">
        <div className="multi-reference-image">
          {controller.referenceCar.image ? (
            <img src={controller.referenceCar.image} alt={controller.referenceCar.name} />
          ) : (
            <IoCarSportOutline />
          )}
        </div>
        <div className="multi-reference-info">
          <span className="section-eyebrow">MODELO DE REFERÊNCIA</span>
          <h3>{controller.referenceCar.name}</h3>
          <div className="multi-result-specs">
            <span>{controller.referenceCar.engine}</span>
            <span>{controller.referenceCar.power}</span>
            <span>{controller.referenceCar.type}</span>
          </div>
        </div>
        <button type="button" className="multi-change-reference" onClick={controller.changeReference}>
          <IoSwapHorizontalOutline />
          <span>Trocar modelo</span>
        </button>
      </div>

      {!controller.similarityConfirmed ? (
        <div className="multi-similarity-step">
          <div className="multi-compare-intro">
            <span className="section-eyebrow">PASSO 2</span>
            <h2>Defina o tipo de similaridade</h2>
            <p>Escolha um ou mais critérios para encontrar veículos semelhantes ao modelo de referência.</p>
          </div>

          <div className="multi-similarity-header">
            <IoSparklesOutline />
            <span>Encontrar modelos semelhantes por</span>
          </div>

          <div className="multi-similarity-chips">
            {controller.similarityFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`multi-similarity-chip ${controller.activeSimilarityFilters.includes(filter.id) ? "is-active" : ""}`}
                onClick={() => controller.toggleSimilarityFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="multi-confirm-similarity"
            disabled={controller.activeSimilarityFilters.length === 0}
            onClick={controller.confirmSimilarity}
          >
            <IoSearchOutline />
            <span>Encontrar veículos semelhantes</span>
          </button>
        </div>
      ) : (
        <>
          <div className="multi-compare-intro">
            <span className="section-eyebrow">PASSO 3</span>
            <h2>Escolha até {controller.maxSimilar} modelos semelhantes</h2>
            <p>
              {controller.selectedIds.length} de {controller.maxSimilar} selecionados · selecione ao menos 2 para
              liberar a comparação.
            </p>
          </div>

          {controller.similarCars.length > 0 ? (
            <div className="multi-results-grid">
              {controller.similarCars.map((car) => {
                const selected = controller.selectedIds.includes(car.id);
                const disabled = !selected && controller.selectedIds.length >= controller.maxSimilar;
                return (
                  <ModelCard
                    key={car.id}
                    car={car}
                    selected={selected}
                    disabled={disabled}
                    similarity={car.similarity}
                    onClick={() => controller.toggleSimilar(car)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState message="Nenhum modelo semelhante encontrado no catálogo." />
          )}

          <div className="multi-compare-footer">
            <button
              type="button"
              className={`multi-compare-button ${controller.canCompare ? "is-ready" : ""}`}
              disabled={!controller.canCompare}
              onClick={controller.handleCompare}
            >
              <IoGitCompareOutline />
              <span>Comparar {controller.selectedIds.length + 1} modelos</span>
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function ModelCard({ car, selected, disabled, similarity, onClick }) {
  return (
    <button
      type="button"
      className={`multi-result-card ${selected ? "multi-result-card-selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {typeof similarity === "number" && (
        <span className="multi-similarity-badge">{similarity}% parecido</span>
      )}
      <div className="multi-result-image">
        {car.image ? <img src={car.image} alt={car.name} /> : <IoCarSportOutline />}
      </div>
      <div className="multi-result-info">
        <span className="multi-result-brand">{car.brand}</span>
        <h3>{car.name}</h3>
        <div className="multi-result-specs">
          <span>{car.engine}</span>
          <span>{car.power}</span>
          <span>{car.type}</span>
        </div>
      </div>
      {typeof similarity === "number" && (
        <div className={`add-button ${selected ? "add-button-selected" : ""}`}>
          {selected ? <IoCheckmarkOutline /> : <IoGitCompareOutline />}
        </div>
      )}
    </button>
  );
}

function EmptyState({ message }) {
  return (
    <div className="multi-empty-box">
      <div className="empty-icon">
        <IoCarSportOutline />
      </div>
      <p>{message}</p>
    </div>
  );
}
