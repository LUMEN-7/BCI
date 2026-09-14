import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateLogin } from '../validation';

export default function useLoginController() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [authError, setAuthError] = useState('');

    function handleLogin(event) {
        event.preventDefault();
        setAuthError('');
        const newErrors = validateLogin(email, password);
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) { setAuthError('Nenhum usuário cadastrado.'); return; }
            navigate('/loading');
        } catch (error) {
            setAuthError(error.message || 'Não foi possível entrar.');
        }
    }

    function updateField(field, value) {
        const setters = { email: setEmail, password: setPassword };
        setters[field](value);
        setErrors((previous) => ({ ...previous, [field]: '' }));
    }

    return { email, password, showPassword, errors, authError, setShowPassword, updateField, handleLogin, goToRegister: () => navigate('/register') };
}
