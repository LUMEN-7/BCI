import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarPerfil } from '@/services/userService';

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
        return null;
    }
}

export default function useWelcomeController() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // usuário já escolheu um nome de exibição antes: pula a tela de boas-vindas
    useEffect(() => {
        if (getCurrentUser()?.nomeExibicao?.trim()) {
            navigate('/home', { replace: true });
        }
    }, [navigate]);

    async function handleSubmit(event) {
        event.preventDefault();
        const trimmed = name.trim();

        if (trimmed.length < 2) {
            setError('Digite um nome com pelo menos 2 caracteres.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await atualizarPerfil(trimmed);
            const currentUser = getCurrentUser();
            localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, nomeExibicao: trimmed }));
            navigate('/loading', { replace: true });
        } catch (err) {
            setError(err.message || 'Não foi possível salvar seu nome.');
        } finally {
            setSaving(false);
        }
    }

    return { name, setName, error, saving, handleSubmit };
}
