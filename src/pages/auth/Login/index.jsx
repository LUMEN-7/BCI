import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FloatingInput from '../../../components/FloatingInput';

import './style.css';

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const [authError, setAuthError] = useState('');

	async function handleLogin(event) {
		event.preventDefault();

		setAuthError('');

		const newErrors = {
			email: '',
			password: '',
		};

		if (!isValidEmail(email)) {
			newErrors.email = 'E-mail não existe ou está inválido.';
		}

		if (password.trim().length < 6) {
			newErrors.password = 'Senha incorreta.';
		}

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
			setAuthError(error.message || 'Não foi possível entrar.');
		}
	}

	return (
		<main className="login-page">
			<section className="login-container">
				<div className="logo">
					<img
						src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/logo.png"
						alt="Logo BCI"
					/>
				</div>

				<form className="login-card" onSubmit={handleLogin}>
					<h1>Login</h1>

					<p className="subtitle">
						Preencha as informações para continuar.
					</p>

					<div className="form-fields">
						<FloatingInput
							label="E-MAIL"
							value={email}
							onChange={(text) => {
								setEmail(text);
								setErrors((prev) => ({
									...prev,
									email: '',
								}));
							}}
							error={errors.email}
						/>

						<FloatingInput
							label="SENHA"
							value={password}
							onChange={(text) => {
								setPassword(text);
								setErrors((prev) => ({
									...prev,
									password: '',
								}));
							}}
							type="password"
							error={errors.password}
						/>

						{authError && (
							<p className="auth-error">
								{authError}
							</p>
						)}
					</div>

					<button
						className="primary-button"
						type="submit"
					>
						Entrar
					</button>

					<button
						type="button"
						className="link-button"
						onClick={() => navigate('/register')}
					>
						Criar conta
					</button>
				</form>
			</section>
		</main>
	);
}