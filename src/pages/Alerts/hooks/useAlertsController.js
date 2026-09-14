import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    listarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    excluirNotificacao,
} from '@/services/notiService';

function formatarData(isoString) {
    return new Date(isoString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
}

function adaptNotification(dto) {
    return {
        id: dto.id,
        read: dto.lida,
        date: formatarData(dto.dataCriacao),
        title: dto.titulo,
        description: dto.mensagem,
        type: dto.tipo.toLowerCase(),
        route: dto.linhagemIdReferenciado ? `/information/${dto.linhagemIdReferenciado}` : null, // ajusta o padrão de rota se for diferente
    };
}

export default function useAlertsController() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const carregarAlertas = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const dtos = await listarNotificacoes();
            setAlerts(dtos.map(adaptNotification));
        } catch (err) {
            console.error(err);
            setError('Não foi possível carregar as notificações.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { carregarAlertas(); }, [carregarAlertas]);

    const unreadCount = alerts.filter((alert) => !alert.read).length;
    const filteredAlerts = useMemo(
        () => activeFilter === 'unread' ? alerts.filter((alert) => !alert.read) : alerts,
        [activeFilter, alerts]
    );

    async function markAsRead(id) {
        setAlerts((current) => current.map((a) => a.id === id ? { ...a, read: true } : a)); // otimista
        try {
            await marcarComoLida(id);
        } catch (err) {
            console.error(err);
            carregarAlertas(); // reverte buscando o estado real
        }
    }

    async function markAllAsRead() {
        setAlerts((current) => current.map((a) => ({ ...a, read: true })));
        try {
            await marcarTodasComoLidas();
        } catch (err) {
            console.error(err);
            carregarAlertas();
        }
    }

    async function deleteAlert(id) {
        const anterior = alerts;
        setAlerts((current) => current.filter((a) => a.id !== id));
        try {
            await excluirNotificacao(id);
        } catch (err) {
            console.error(err);
            setAlerts(anterior); // reverte
        }
    }

    function handleAlertClick(alert) {
        if (!alert.read) markAsRead(alert.id);
        if (alert.route) navigate(alert.route);
    }

    return {
        loading,
        error,
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