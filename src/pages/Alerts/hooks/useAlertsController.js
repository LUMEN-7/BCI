import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialAlerts } from '../data';

function getStoredAlerts() {
    const storedAlerts = localStorage.getItem('alerts');

    if (storedAlerts) {
        return JSON.parse(storedAlerts);
    }

    localStorage.setItem('alerts', JSON.stringify(initialAlerts));
    return initialAlerts;
}

export default function useAlertsController() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState(getStoredAlerts);
    const [activeFilter, setActiveFilter] = useState('all');
    const unreadCount = alerts.filter((alert) => !alert.read).length;
    const filteredAlerts = useMemo(
        () => activeFilter === 'unread' ? alerts.filter((alert) => !alert.read) : alerts,
        [activeFilter, alerts]
    );

    function updateAlerts(nextAlerts) {
        setAlerts(nextAlerts);
        localStorage.setItem('alerts', JSON.stringify(nextAlerts));
    }

    function markAsRead(id) {
        updateAlerts(alerts.map((alert) => alert.id === id ? { ...alert, read: true } : alert));
    }

    function markAllAsRead() {
        updateAlerts(alerts.map((alert) => ({ ...alert, read: true })));
    }

    function deleteAlert(id) {
        updateAlerts(alerts.filter((alert) => alert.id !== id));
    }

    function handleAlertClick(alert) {
        if (!alert.read) markAsRead(alert.id);
        if (alert.route) navigate(alert.route);
    }

    return {
        alerts,
        activeFilter,
        filteredAlerts,
        unreadCount,
        setActiveFilter,
        markAsRead,
        markAllAsRead,
        deleteAlert,
        handleAlertClick,
    };
}
