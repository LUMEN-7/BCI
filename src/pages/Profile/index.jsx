import { useNavigate } from 'react-router-dom';
import {
	IoArrowBackOutline,
	IoPersonOutline,
	IoPencilOutline,
	IoBookmarkOutline,
	IoDocumentTextOutline,
	IoLockClosedOutline,
	IoLogOutOutline,
	IoChevronForwardOutline,
} from 'react-icons/io5';

import './style.css';

export default function Profile() {
	const navigate = useNavigate();

	const currentUser =
		JSON.parse(localStorage.getItem('currentUser')) || null;

	const displayName = currentUser?.name?.trim() || 'Usuário';
	const displayEmail = currentUser?.email || 'Sem e-mail';
	const profilePhoto = currentUser?.photo || null;

	function handleLogout() {
		localStorage.removeItem('currentUser');
		navigate('/');
	}

	const menuItems = [
		{
			title: 'Editar Perfil',
			subtitle: 'Atualize seus dados e foto',
			icon: <IoPencilOutline />,
			route: '/edit-profile',
		},
		{
			title: 'Redefinir Senha',
			subtitle: 'Altere sua senha de acesso',
			icon: <IoLockClosedOutline />,
			route: '/password',
		},
	];

	return (
		<main className="profile-page">
			<section className="profile-container">
				<button
					type="button"
					className="profile-back"
					onClick={() => navigate('/home')}
				>
					<IoArrowBackOutline />
					<span>Voltar</span>
				</button>

				<div className="profile-hero">
					<div className="profile-avatar">
						{profilePhoto ? (
							<img src={profilePhoto} alt="Foto de perfil" />
						) : (
							<IoPersonOutline />
						)}
					</div>

					<div className="profile-info">
						<p className="profile-eyebrow">Minha conta</p>
						<h1>{displayName}</h1>
						<p>{displayEmail}</p>
					</div>
				</div>

				<div className="profile-section-title">
					<h2>Configurações</h2>
					<p>Gerencie sua experiência no app.</p>
				</div>

				<div className="profile-menu">
					{menuItems.map((item) => (
						<button
							key={item.title}
							type="button"
							className="profile-menu-item"
							onClick={() => navigate(item.route)}
						>
							<span className="profile-menu-icon">
								{item.icon}
							</span>

							<span className="profile-menu-text">
								<strong>{item.title}</strong>
								<small>{item.subtitle}</small>
							</span>

							<IoChevronForwardOutline className="profile-chevron" />
						</button>
					))}
				</div>

				<button
					type="button"
					className="logout-button"
					onClick={handleLogout}
				>
					<IoLogOutOutline />
					Sair da conta
				</button>
			</section>
		</main>
	);
}