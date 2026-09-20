import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateLogin } from '../validation';
import { login, loginComGoogle } from '@/services/authService'; // ajusta o caminho real
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/config/firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default function useLoginController() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [carregandoGoogle, setCarregandoGoogle] = useState(false);

    function irParaProximoPasso(resultado) {
        if (resultado.requerDoisFatores) {
            navigate('/verificar-2fa', { state: { tokenDesafio: resultado.tokenDesafio } });
            return;
        }
        // console.log(resultado)
        if (!resultado.usuario?.NomeExibicao?.trim()) {
            navigate('/welcome');
            return;
        }

        navigate('/home');
    }

    async function handleLogin(event) {
        event.preventDefault();
        setAuthError('');
        const newErrors = validateLogin(email, password);
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;

        try {
            const resultado = await login(email, password);
            irParaProximoPasso(resultado);
        } catch (error) {
            setAuthError(error.message || 'Não foi possível entrar.');
        }
    }

    async function handleGoogleLogin() {
        if (carregandoGoogle) return; // trava disparo duplo
        setCarregandoGoogle(true);
        setAuthError('');
        try {
            
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            
            if (!credential?.idToken) throw new Error('Não foi possível obter o token do Google.');
            
            const resultado = await loginComGoogle(credential.idToken);
            irParaProximoPasso(resultado);
            
        } catch (error) {
            
            if (error.message !== "Firebase: Error (auth/popup-closed-by-user)."){
                setAuthError(error.message || 'Erro ao entrar com Google.');        
            }
            setCarregandoGoogle(false)
        }
    }

    function updateField(field, value) {
        const setters = { email: setEmail, password: setPassword };
        setters[field](value);
        setErrors((previous) => ({ ...previous, [field]: '' }));
    }

    return {
        email, password, showPassword, errors, authError,
        setShowPassword, updateField, handleLogin, handleGoogleLogin,
        goToRegister: () => navigate('/register'),
    };
}