import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '@/services/authService';
import { isValidEmail, validarSenha } from '../validation';

export default function useRegisterController() {
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ name: '', email: '', password: '' });
    const [authError, setAuthError] = useState('');

    function handleImage(event) {
        const file = event.target.files?.[0];
        if (file) setPhoto(URL.createObjectURL(file));
    }

    async function handleRegister(event) {
        event.preventDefault();
        setAuthError('');
        const newErrors = { name: '', email: '', password: '' };
        if (name.trim().length < 3) newErrors.name = 'Nome muito curto.';
        if (!isValidEmail(email)) newErrors.email = 'E-mail inválido.';
        const errosSenha = validarSenha(password);
        if (errosSenha.length > 0) newErrors.password = errosSenha.join(' ');
        setErrors(newErrors);
        if (newErrors.name || newErrors.email || newErrors.password) return;
        try {
            const resultado = await cadastrar(name, email, password, null);
            const displayName = resultado?.usuario?.nomeExibicao || resultado?.usuario?.NomeExibicao;
            if (!displayName?.trim()) {
                navigate('/welcome');
            } else {
                navigate('/loading', { replace: true });
            }
        } catch (error) {
            setAuthError(error.message || 'Não foi possível criar a conta.');
        }
    }

    function updateField(field, value) {
        const setters = { name: setName, email: setEmail, password: setPassword };
        setters[field](value);
        setErrors((previous) => ({ ...previous, [field]: '' }));
    }

    return { photo, name, email, password, errors, authError, handleImage, handleRegister, updateField, goToLogin: () => navigate('/') };
}
