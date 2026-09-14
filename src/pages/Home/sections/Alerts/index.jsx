import { useEffect, useMemo, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";

import "./style.css";

function getStoredAlerts() {
  try {
    const storedAlerts = localStorage.getItem("alerts");
    return storedAlerts ? JSON.parse(storedAlerts) : [];
  } catch {
    return [];
  }
}

export default function Alerts({ onReview }) {
  const [alerts, setAlerts] = useState(getStoredAlerts);

  useEffect(() => {
    const syncAlerts = () => setAlerts(getStoredAlerts());
    syncAlerts();

    window.addEventListener("storage", syncAlerts);
    return () => window.removeEventListener("storage", syncAlerts);
  }, []);

  const unreadAlerts = useMemo(
    () => alerts.filter((alert) => !alert.read),
    [alerts]
  );
  const latestUnreadAlert = useMemo(
    () =>
      [...unreadAlerts].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0] ||
      null,
    [unreadAlerts]
  );
  const unreadCount = unreadAlerts.length;
  const alertLabel = unreadCount === 1 ? "alerta" : "alertas";

  return (
    <section className="alerts-section">
      <div className="section-heading">
        <span>MONITORAMENTO</span>
        <div />
      </div>

      {unreadCount > 0 ? (
        <>
          <div className="alerts-header">
            <div>
              <div>
                <h2>{`${alertLabel.toUpperCase()}${unreadCount === 1 ? " AGUARDA REVISÃO" : " AGUARDAM REVISÃO"}`}</h2>
                <p>
                  {unreadCount === 1
                    ? "Existe uma movimentação do mercado que pode exigir sua atenção."
                    : "Existem movimentações do mercado que podem exigir sua atenção."}
                </p>
              </div>
            </div>
            <IoWarningOutline />
          </div>

          {latestUnreadAlert && (
            <div className="alert-card">
              <span className="alert-dot" />
              <div>
                <strong>{latestUnreadAlert.title}</strong>
                {latestUnreadAlert.description && (
                  <p className="alert-description">{latestUnreadAlert.description}</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="alerts-header alerts-header-empty">
          <div>
            <div>
              <h2>Tudo certo por aqui, sem alertas</h2>
            </div>
          </div>
          <IoWarningOutline />
        </div>
      )}
    </section>
  );
}
