import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '@/services/authService';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
        if (password.trim().length < 6) newErrors.password = 'Mínimo de 6 caracteres.';
        setErrors(newErrors);
        if (newErrors.name || newErrors.email || newErrors.password) return;
        try {
            await cadastrar(name, email, password, null);
            navigate('/home');
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
