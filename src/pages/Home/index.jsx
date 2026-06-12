import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoAdd,
	IoClose,
	IoPersonCircleOutline,
	IoBookmarkOutline,
	IoDocumentTextOutline,
	IoSearchOutline,
	IoGitCompareOutline
} from 'react-icons/io5';

import './style.css';

const cars = [
	{
		id: '1',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		widthRatio: 1.4,
		rightRatio: -0.5,
	},
	{
		id: '2',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		widthRatio: 1.2,
		rightRatio: -0.4,
	},
	{
		id: '3',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
		widthRatio: 1.4,
		rightRatio: -0.5,
	},
	{
		id: '4',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_expedition.png',
		widthRatio: 1.4,
		rightRatio: -0.5,
	},
	{
		id: '5',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_explorer.png',
		widthRatio: 1.4,
		rightRatio: -0.5,
	},
	{
		id: '6',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_mustang_mach.png',
		widthRatio: 1.3,
		rightRatio: -0.45,
	},
];

export default function Home() {
	const navigate = useNavigate();

	const [currentIndex, setCurrentIndex] = useState(0);
	const [open, setOpen] = useState(false);

	const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === cars.length - 1 ? 0 : prevIndex + 1
			);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	const currentCar = cars[currentIndex];
	const displayName = currentUser?.name?.trim() || 'Usuário';

	function getGreetingByHour() {
		const hour = new Date().getHours();

		if (hour < 12) return 'Bom dia';
		if (hour < 18) return 'Boa tarde';

		return 'Boa noite';
	}

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

	return (
		<main className="home-page">
			<header className="home-header">
				<h1>
					{getGreetingByHour()}, {displayName}
				</h1>

				<p>
					Built Beyond Comparison é mais do que um conceito, é o
					compromisso de transformar inovação, estratégia e criatividade
					em experiências que mantêm a Ford sempre além de qualquer
					comparação. E você, está pronto para levar a Ford além da
					comparação?
				</p>

                <div className="hero-actions">
					<button
						className="hero-button primary"
						onClick={() => navigate('/search')}
					>
						<IoSearchOutline />
						<span>Pesquisar</span>
					</button>

					<button
						className="hero-button secondary"
						onClick={() => navigate('/compare')}
					>
						<IoGitCompareOutline />
						<span>Comparar</span>
					</button>
				</div>
			</header>

			<section className="hero">
				<img
					src={currentCar.image}
					alt="Carro Ford"
					className="car-image"
					style={{
						width: `${currentCar.widthRatio * 55}vw`,
						right: `${currentCar.rightRatio * 55}vw`,
					}}
				/>
			</section>

			<div className={`fab-container ${open ? 'is-open' : ''}`}>
				<div className="action-list">
					{actions.map((action) => (
						<button
							key={action.label}
							className="action-button"
							onClick={() => navigate(action.route)}
						>
							<span className="action-icon">
								{action.icon}
							</span>

							<span>{action.label}</span>
						</button>
					))}
				</div>

				<button
					className="fab"
					onClick={() => setOpen(!open)}
				>
					{open ? <IoClose /> : <IoAdd />}
				</button>
			</div>
		</main>
	);
}