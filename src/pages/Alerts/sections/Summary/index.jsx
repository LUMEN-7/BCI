import { IoNotificationsOutline } from 'react-icons/io5';
import './style.css';

export default function Summary({ unreadCount }) {
    return (
        <div className="alerts-summary">
            <div className="alerts-summary-icon"><IoNotificationsOutline /></div>
            <div className="alerts-summary-content">
                <span>Notificações pendentes</span>
                <strong>{unreadCount === 0 ? 'Tudo em dia' : `${unreadCount} ${unreadCount === 1 ? 'alerta não lido' : 'alertas não lidos'}`}</strong>
            </div>
        </div>
    );
}
