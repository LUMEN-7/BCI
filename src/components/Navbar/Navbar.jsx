import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoAdd,
	IoBookmarkOutline,
	IoClose,
	IoDocumentTextOutline,
	IoPersonCircleOutline,
} from 'react-icons/io5';

import './style.css';

const actions = [
	{
		label: 'Perfil',
		icon: <IoPersonCircleOutline />,
		route: '/profile',
	},
	{
		label: 'Salvos',
		icon: <IoBookmarkOutline />,
		route: '/saved',
	},
	{
		label: 'Anotações',
		icon: <IoDocumentTextOutline />,
		route: '/notes',
	},
];

export default function Navbar() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	return (
		<nav className={`navbar ${open ? 'is-open' : ''}`}>
			<div className="navbar-action-list">
				{actions.map((action) => (
					<button
						key={action.label}
						className="navbar-action-button"
						onClick={() => navigate(action.route)}
					>
						<span className="navbar-action-icon">{action.icon}</span>
						<span>{action.label}</span>
					</button>
				))}
			</div>

			<button
				className="navbar-toggle"
				onClick={() => setOpen(!open)}
				aria-label={open ? 'Fechar menu' : 'Abrir menu'}
			>
				{open ? <IoClose /> : <IoAdd />}
			</button>
		</nav>
	);
}