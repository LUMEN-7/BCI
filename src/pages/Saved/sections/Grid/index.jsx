import { useState } from "react";
import {
  IoArrowForwardOutline,
  IoCarSportOutline,
  IoCheckmarkOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCloseOutline,
  IoGitCompareOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { SavedAttention } from "../Header";
import "./style.css";

function UpdateHistory({ item, hasUpdates, isUpdateRead, onMarkRead }) {
  return (
    <div className="update-history">
        <div className="update-history-header">
          <div className="update-history-title">
            <IoTimeOutline />
            <div>
              <strong>Histórico de atualizações</strong>
              <span>Alterações neste item</span>
            </div>
          </div>
          {hasUpdates && (
            <button
              type="button"
              className="mark-read-button"
              onClick={() => onMarkRead(item)}
            >
              <IoCheckmarkOutline />
              Marcar como lido
            </button>
          )}
        </div>
        {item.updates?.length > 0 ? (
          <div className="update-history-list">
            {item.updates.map((update) => {
              const unread = !isUpdateRead(update.id);
              return (
                <div
                  key={update.id}
                  className={`update-item ${unread ? "unread" : ""}`}
                >
                  <div className="update-timeline">
                    <span />
                    <div />
                  </div>
                  <div className="update-content">
                    <div className="update-meta">
                      <span>{update.date}</span>
                      {unread && <small>NOVA</small>}
                    </div>
                    <strong>{update.title}</strong>
                    <p>{update.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="update-history-empty">Nenhuma atualização registrada para este item.</p>
        )}
      </div>
  );
}

function SavedCard({
  item,
  activeTab,
  isOpen,
  hasUpdates,
  unreadCount,
  onToggleCard,
  onHistory,
  onDelete,
  onCarDetails,
  onComparisonDetails,
}) {
  const isCar = activeTab === "cars";
  const imageContent = isCar ? (
    <div className="saved-image" onClick={() => onCarDetails(item.id)}>
      <img src={item.image} alt={item.name} />
      {hasUpdates && (
        <span className="attention-dot" title="Atualização não lida" />
      )}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onCarDetails(item.id);
        }}
      >
        Ver detalhes
        <IoArrowForwardOutline />
      </button>
    </div>
  ) : (
    <div className="saved-compare-image">
      <div>
        <img src={item.firstImage} alt={item.firstCar} />
      </div>
      <span className="compare-vs">VS</span>
      <div>
        <img src={item.secondImage} alt={item.secondCar} />
      </div>
      {hasUpdates && (
        <span className="attention-dot" title="Atualização não lida" />
      )}
      <button type="button" onClick={() => onComparisonDetails(item)}>
        Ver comparação
        <IoArrowForwardOutline />
      </button>
    </div>
  );
  return (
    <article className={`saved-card ${isOpen ? "saved-card-open" : ""}`}>
      {imageContent}
      <div className="saved-info">
        <div className="saved-card-header">
          <div className="saved-card-heading">
            <span>{isCar ? item.brand : "Comparação"}</span>

            <h2>
              {isCar
                ? item.name
                : `${item.firstCar.split(" ")[0]} VS ${item.secondCar.split(" ")[0]}`}
            </h2>

            {!isCar && item.savedAtLabel && (
              <span className="saved-date">
                <IoTimeOutline />
                {item.savedAtLabel}
              </span>
            )}
          </div>
          <div className="saved-card-actions">
            {hasUpdates && (
              <div className="update-indicator">
                <span className="indicator-dot" />
                {unreadCount}{" "}
                {unreadCount === 1 ? "atualização" : "atualizações"}
              </div>
            )}
            <button
              type="button"
              className="history-card-button"
              title="Ver histórico"
              onClick={() => onHistory(item)}
            >
              <IoTimeOutline />
            </button>
            <button
              type="button"
              className="delete-button"
              title="Remover dos salvos"
              onClick={() => onDelete(item.id)}
            >
              <IoTrashOutline />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="saved-details">
            <div className="saved-specs">
              {isCar ? (
                <>
                  <span>{item.engine}</span>
                  <span>{item.power}</span>
                  <span>{item.type}</span>
                </>
              ) : (
                <>
                  <span>{item.firstCar}</span>
                  <span>{item.secondCar}</span>
                </>
              )}
            </div>
            <p>{item.description}</p>
          </div>
        )}
        <div className="saved-card-footer-actions">
          <button
            type="button"
            className="expand-button"
            onClick={() => onToggleCard(item.id)}
            aria-label={isOpen ? "Fechar detalhes" : "Abrir detalhes"}
          >
            <span>{isOpen ? "Fechar detalhes" : "Ver informações"}</span>
            {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SavedGrid({
  activeTab,
  items,
  openCards,
  hasUnreadUpdates,
  getUnreadCount,
  isUpdateRead,
  onToggleCard,
  onDelete,
  onMarkRead,
  onCarDetails,
  onComparisonDetails,
}) {
  const [historyItem, setHistoryItem] = useState(null);

  return (
    <>
      {items.some(hasUnreadUpdates) && <SavedAttention />}
      <section className="saved-grid">
        {!items.length ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">
              {activeTab === "cars" ? (
                <IoCarSportOutline />
              ) : (
                <IoGitCompareOutline />
              )}
            </div>
            <h2>Nada salvo ainda</h2>
            <p>
              {activeTab === "cars"
                ? "Seus veículos favoritos aparecerão aqui."
                : "Suas comparações salvas aparecerão aqui."}
            </p>
          </div>
        ) : (
          items.map((item) => (
            <SavedCard
              key={item.id}
              item={item}
              activeTab={activeTab}
              isOpen={!!openCards[item.id]}
              hasUpdates={hasUnreadUpdates(item)}
              unreadCount={getUnreadCount(item)}
              onToggleCard={onToggleCard}
              onHistory={setHistoryItem}
              onDelete={onDelete}
              onCarDetails={onCarDetails}
              onComparisonDetails={onComparisonDetails}
            />
          ))
        )}
      </section>
      {historyItem && (
        <div
          className="saved-history-modal-backdrop"
          onClick={() => setHistoryItem(null)}
        >
          <div
            className="saved-history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-history-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="saved-history-modal-header">
              <div>
                <span className="saved-history-modal-eyebrow">Histórico do salvo</span>
                <h2 id="saved-history-title">
                  {activeTab === "cars"
                    ? historyItem.name
                    : `${historyItem.firstCar} VS ${historyItem.secondCar}`}
                </h2>
              </div>
              <button
                type="button"
                className="saved-history-modal-close"
                aria-label="Fechar histórico"
                onClick={() => setHistoryItem(null)}
              >
                <IoCloseOutline />
              </button>
            </header>
            <UpdateHistory
              item={historyItem}
              hasUpdates={hasUnreadUpdates(historyItem)}
              isUpdateRead={isUpdateRead}
              onMarkRead={onMarkRead}
            />
          </div>
        </div>
      )}
    </>
  );
}
