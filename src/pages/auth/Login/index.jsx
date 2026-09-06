import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoArrowForward
} from 'react-icons/io5';

import { validateLogin } from './validation';

import './style.css';

const LOGO_URL =
    'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/logo.png';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [authError, setAuthError] = useState('');

    function handleLogin(event) {
        event.preventDefault();

        setAuthError('');

        const newErrors = validateLogin(email, password);

        setErrors(newErrors);

        if (newErrors.email || newErrors.password) {
            return;
        }

        try {
            const currentUser = JSON.parse(
                localStorage.getItem('currentUser')
            );

            if (!currentUser) {
                setAuthError('Nenhum usuário cadastrado.');
                return;
            }

            navigate('/home');
        } catch (error) {
            setAuthError(
                error.message || 'Não foi possível entrar.'
            );
        }
    }

    function handleEmailChange(value) {
        setEmail(value);

        setErrors((prev) => ({
            ...prev,
            email: '',
        }));
    }

    function handlePasswordChange(value) {
        setPassword(value);

        setErrors((prev) => ({
            ...prev,
            password: '',
        }));
    }

    return (
        <main className="login-page">
            <section className="login-shell">

                <div className="login-visual">
                    <div className="visual-content">
                        <span className="visual-label">
                            BUSINESS COMPETITIVE
                        </span>

                        <h2>
                            Inteligência
                            <br />
                            para ir além.
                        </h2>
                    </div>
                </div>

                <form
                    className="login-card"
                    onSubmit={handleLogin}
                >
                    <div className="login-brand">
                        <img
                            src={LOGO_URL}
                            alt="Ford"
                        />

                        <span>BCI</span>
                    </div>

                    <div className="login-heading">
                        <span className="eyebrow">
                            ACESSO
                        </span>

                        <h1>
                            Bem-vindo
                            <br />
                            de volta.
                        </h1>

                        <p>
                            Entre para continuar suas análises
                            de inteligência competitiva.
                        </p>
                    </div>

                    <div className="form-fields">

                        <div className="field">
                            <label htmlFor="email">
                                E-MAIL
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    handleEmailChange(
                                        event.target.value
                                    )
                                }
                            />

                            {errors.email && (
                                <span className="field-error">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="password">
                                SENHA
                            </label>

                            <div className="password-field">
                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        handlePasswordChange(
                                            event.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Ocultar senha'
                                            : 'Mostrar senha'
                                    }
                                >
                                    {showPassword ? '◉' : '◌'}
                                </button>
                            </div>

                            {errors.password && (
                                <span className="field-error">
                                    {errors.password}
                                </span>
                            )}

                            {authError && (
                                <span className="field-error">
                                    {authError}
                                </span>
                             )}
                        </div>
                    </div>

                    <button
                        className="primary-button"
                        type="submit"
                    >
                        <span>Entrar</span>
                        <IoArrowForward />
                    </button>

                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate('/register')}
                    >
                        <span>
                            Ainda não possui uma conta?
                        </span>

                        <strong>
                            Criar conta
                        </strong>
                    </button>
                </form>
            </section>
        </main>
    );
}