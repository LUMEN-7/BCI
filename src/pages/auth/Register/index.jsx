import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCameraOutline, IoPersonOutline } from 'react-icons/io5';

import FloatingInput from '../../../components/FloatingInput';

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

	async function handleRegister(event) {
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

		if (newErrors.name || newErrors.email || newErrors.password) {
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
			setAuthError(error.message || 'Não foi possível criar a conta.');
		}
	}

	return (
		<main className="register-page">
			<section className="register-container">
				<form className="register-card" onSubmit={handleRegister}>
					<h1>Criar Conta</h1>

					<p className="subtitle">
						Cadastre um usuário válido para liberar o acesso.
					</p>

					<label className="photo-wrapper">
						<input
							type="file"
							accept="image/*"
							onChange={handleImage}
							hidden
						/>

						{photo ? (
							<img
								src={photo}
								alt="Foto de perfil"
								className="profile-photo"
							/>
						) : (
							<div className="photo-placeholder">
								<IoPersonOutline size={38} />
							</div>
						)}

						<div className="camera-button">
							<IoCameraOutline />
						</div>
					</label>

					<p className="photo-text">
						Adicionar foto de perfil
					</p>

					<div className="form-fields">
						<FloatingInput
							label="NOME"
							value={name}
							onChange={(text) => {
								setName(text);
								setErrors((prev) => ({
									...prev,
									name: '',
								}));
							}}
							error={errors.name}
						/>

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

						<button type="submit" className="primary-button">
							Cadastrar e Entrar
						</button>

						{authError && (
							<p className="auth-error">{authError}</p>
						)}

						<button
							type="button"
							className="link-button"
							onClick={() => navigate('/')}
						>
							Voltar para Login
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}