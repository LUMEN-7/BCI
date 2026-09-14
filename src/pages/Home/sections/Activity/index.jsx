import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";

import { getActivityMetaByPath, getStoredNavigationActivities } from "../../../../utils/navigationActivity";

import "./style.css";

function formatActivityDate(timestamp) {
  if (!timestamp) return "Agora";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Agora";

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", " às");
}

export default function Activity() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getStoredNavigationActivities());

  useEffect(() => {
    const updateActivities = () => setItems(getStoredNavigationActivities());

    updateActivities();
    window.addEventListener("navigation-activity-updated", updateActivities);

    return () => {
      window.removeEventListener("navigation-activity-updated", updateActivities);
    };
  }, []);

  const recentActivities = useMemo(() => items.slice(0, 3), [items]);

  if (!recentActivities.length) {
    return null;
  }

  return (
    <section className="activity-section">
      <div className="section-heading">
        <span>ATIVIDADE RECENTE</span>
        <div />
      </div>

      <div className="activity-list">
        {recentActivities.map((item) => {
          const meta = getActivityMetaByPath(item.path) || {
            label: "Navegação",
            type: "NAVEGAÇÃO",
            icon: null,
          };
          const Icon = meta.icon || (() => null);

          return (
            <button
              className="activity-item"
              key={`${item.path}-${item.timestamp}`}
              onClick={() => navigate(item.path)}
              type="button"
            >
              <div className="activity-icon">
                <Icon />
              </div>
              <div className="activity-info">
                <span>{item.type || meta.type}</span>
                <strong>{item.label || meta.label}</strong>
              </div>
              <time>{formatActivityDate(item.timestamp)}</time>
              <IoArrowForward />
            </button>
          );
        })}
      </div>
    </section>
  );
}
