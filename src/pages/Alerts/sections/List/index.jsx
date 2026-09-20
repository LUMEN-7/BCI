import {
  IoCheckmarkDoneOutline,
  IoCheckmarkOutline,
  IoTrashOutline,
} from "react-icons/io5";

import { alertTypeConfig } from "../../data";

import "./style.css";

export default function List({
  alerts,
  activeFilter,
  loading,
  onAlertClick,
  onMarkAsRead,
  onDelete,
}) {
  if (loading) {
    return (
      <section
        className="alerts-list"
        aria-live="polite"
      >
        <div className="alerts-list-loading">
          <span
            className="alerts-list-loading-spinner"
            aria-hidden="true"
          />

          <p>
            Carregando notificações...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="alerts-list">
      {alerts.length > 0 ? (
        alerts.map((alert) => {
          const config =
            alertTypeConfig[alert.type] ||
            alertTypeConfig.information;

          const Icon = config.icon;

          return (
            <article
              key={alert.id}
              className={`alert-card ${
                !alert.read
                  ? "is-unread"
                  : ""
              }`}
              onClick={() =>
                onAlertClick(alert)
              }
            >
              <div
                className={`alert-icon ${config.className}`}
              >
                <Icon />
              </div>

              <div className="alert-content">
                <div className="alert-top">
                  <div className="alert-type">
                    {!alert.read && (
                      <span className="unread-dot" />
                    )}

                    <span>
                      {config.label}
                    </span>
                  </div>

                  <small>
                    {alert.date}
                  </small>
                </div>

                <h2>
                  {alert.title}
                </h2>

                <p>
                  {alert.description}
                </p>
              </div>

              <div className="alert-actions">
                {!alert.read && (
                  <button
                    type="button"
                    className="read-button"
                    title="Marcar como lida"
                    onClick={(event) => {
                      event.stopPropagation();

                      onMarkAsRead(
                        alert.id
                      );
                    }}
                  >
                    <IoCheckmarkOutline />
                  </button>
                )}

                <button
                  type="button"
                  className="delete-alert-button"
                  title="Excluir alerta"
                  onClick={(event) => {
                    event.stopPropagation();

                    onDelete(
                      alert.id
                    );
                  }}
                >
                  <IoTrashOutline />
                </button>
              </div>
            </article>
          );
        })
      ) : (
        <div className="alerts-empty">
          <div className="alerts-empty-icon">
            <IoCheckmarkDoneOutline />
          </div>

          <h2>
            {activeFilter === "unread"
              ? "Tudo lido"
              : "Nenhum alerta"}
          </h2>

          <p>
            {activeFilter === "unread"
              ? "Você não possui notificações pendentes."
              : "Novos alertas aparecerão aqui."}
          </p>
        </div>
      )}
    </section>
  );
}