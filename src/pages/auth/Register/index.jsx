import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoCameraOutline,
    IoPersonOutline,
    IoArrowForward
} from 'react-icons/io5';

import './style.css';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
    const navigate = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [authError, setAuthError] = useState('');

    function handleImage(event) {
        const file = event.target.files?.[0];

        if (file) {
            setPhoto(URL.createObjectURL(file));
        }
    }

    function handleRegister(event) {
        event.preventDefault();

        setAuthError('');

        const newErrors = {
            name: '',
            email: '',
            password: '',
        };

        if (name.trim().length < 3) {
            newErrors.name = 'Nome muito curto.';
        }

        if (!isValidEmail(email)) {
            newErrors.email = 'E-mail inválido.';
        }

        if (password.trim().length < 6) {
            newErrors.password = 'Mínimo de 6 caracteres.';
        }

        setErrors(newErrors);

        if (
            newErrors.name ||
            newErrors.email ||
            newErrors.password
        ) {
            return;
        }

        try {
            localStorage.setItem(
                'currentUser',
                JSON.stringify({
                    name,
                    email,
                    photo,
                })
            );

            navigate('/home');
        } catch (error) {
            setAuthError(
                error.message || 'Não foi possível criar a conta.'
            );
        }
    }

    return (
        <main className="register-page">

            <section className="register-container">

                {/* ÁREA DE CADASTRO */}
                <form
                    className="register-card"
                    onSubmit={handleRegister}
                >

                    {/* BRAND */}
                    <div className="register-brand">

                        <img
                            src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/logo.png"
                            alt="Ford"
                        />

                        <span>BCI</span>

                    </div>

                    {/* HEADER */}
                    <div className="register-heading">

                        <span className="eyebrow">
                            CADASTRO
                        </span>

                        <h2>
                            Criar
                            <br />
                            conta.
                        </h2>

                        <p>
                            Crie seu acesso para começar a explorar
                            análises de inteligência competitiva.
                        </p>

                    </div>
                    

                    {/* CONTEÚDO */}
                    <div className="register-content">

                        {/* FOTO */}
                        <div className="photo-area">

                            <label className="photo-wrapper">

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                />

                                {photo ? (
                                    <img
                                        src={photo}
                                        alt="Foto de perfil"
                                        className="profile-photo"
                                    />
                                ) : (
                                    <div className="photo-placeholder">
                                        <IoPersonOutline />
                                    </div>
                                )}

                                <span className="camera-button">
                                    <IoCameraOutline />
                                </span>

                            </label>

                            <span className="photo-text">
                                Adicionar foto
                            </span>

                        </div>

                        {/* CAMPOS */}
                        <div className="form-fields">

                            <div className="field">
                                <label htmlFor="name">
                                    NOME
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);

                                        setErrors((prev) => ({
                                            ...prev,
                                            name: '',
                                        }));
                                    }}
                                />

                                {errors.name && (
                                    <span className="field-error">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="field">
                                <label htmlFor="email">
                                    E-MAIL
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);

                                        setErrors((prev) => ({
                                            ...prev,
                                            email: '',
                                        }));
                                    }}
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

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);

                                        setErrors((prev) => ({
                                            ...prev,
                                            password: '',
                                        }));
                                    }}
                                />

                                {errors.password && (
                                    <span className="field-error">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            {authError && (
                                <p className="auth-error">
                                    {authError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                <span>Cadastrar</span>

                                <IoArrowForward />
                            </button>

                            <button
                                type="button"
                                className="link-button"
                                onClick={() => navigate('/')}
                            >
                                Já possui uma conta?
                                <strong>Entrar</strong>
                            </button>

                        </div>

                    </div>

                </form>

            </section>

        </main>
    );
}