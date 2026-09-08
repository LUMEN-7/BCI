import { IoCheckmarkDoneOutline } from "react-icons/io5";
import "./style.css";

export default function Header({ unreadCount, onMarkAllAsRead }) {
  return (
    <header className="alerts-header">
      <div>
        <p className="alerts-eyebrow">Central de notificações</p>
        <h1>Alertas</h1>
        <p className="alerts-description">
          Acompanhe atualizações, mudanças e informações importantes dos seus
          veículos.
        </p>
      </div>
      {unreadCount > 0 && (
        <button
          type="button"
          className="mark-all-button"
          onClick={onMarkAllAsRead}
        >
          <IoCheckmarkDoneOutline />
          Marcar todas como lidas
        </button>
      )}
    </header>
  );
}
