import apiFetch from './api';

export async function listarNotificacoes() {
    return apiFetch('/Notificacao/minhas');
}

export async function marcarComoLida(id) {
    return apiFetch(`/Notificacao/${id}/lida`, { method: 'PATCH' });
}

export async function marcarTodasComoLidas() {
    return apiFetch('/Notificacao/lidas/todas', { method: 'PATCH' });
}

export async function excluirNotificacao(id) {
    return apiFetch(`/Notificacao/${id}`, { method: 'DELETE' });
}