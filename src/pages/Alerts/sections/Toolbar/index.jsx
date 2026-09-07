import './style.css';

export default function Toolbar({ activeFilter, alertCount, unreadCount, onFilterChange }) {
    return (
        <div className="alerts-toolbar">
            <div className="alerts-filters">
                <button type="button" className={activeFilter === 'all' ? 'active' : ''} onClick={() => onFilterChange('all')}>Todos<span>{alertCount}</span></button>
                <button type="button" className={activeFilter === 'unread' ? 'active' : ''} onClick={() => onFilterChange('unread')}>Não lidos<span>{unreadCount}</span></button>
            </div>
        </div>
    );
}
