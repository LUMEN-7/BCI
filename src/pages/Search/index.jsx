import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoSearchOutline,
	IoCloseCircle,
	IoStar,
	IoStarOutline,
} from 'react-icons/io5';

import './style.css';

const cars = [
	{
		id: '1',
		brand: 'Ford',
		name: 'Mustang GT 2024',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
	},
	{
		id: '2',
		brand: 'Ford',
		name: 'Bronco 2021',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
	},
	{
		id: '3',
		brand: 'Ford',
		name: 'Bronco Sport 2025',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
	},
	{
		id: '4',
		brand: 'Ford',
		name: 'Explorer 2026',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_explorer.png',
	},
];

export default function Search() {
	const navigate = useNavigate();

	const [search, setSearch] = useState('');
	const [favorites, setFavorites] = useState([]);

	const results = useMemo(() => {
		const term = search.toLowerCase().trim();

		if (!term) {
			return cars;
		}

		return cars.filter(
			(car) =>
				car.name.toLowerCase().includes(term) ||
				car.brand.toLowerCase().includes(term)
		);
	}, [search]);

	function toggleFavorite(id) {
		setFavorites((prev) =>
			prev.includes(id)
				? prev.filter((item) => item !== id)
				: [...prev, id]
		);
	}

	return (
		<main className="search-page">
			<div className="search-container">
				<h1>Encontre o modelo</h1>
				<button
						type="button"
						className="back-button"
						onClick={() => navigate('/home')}
					>
						Voltar
					</button>

				<p>
					Pesquise pela marca ou modelo para comparar
					diferenciais com mais facilidade.
				</p>

				<div className="search-box">
					<IoSearchOutline />

					<input
						type="text"
						placeholder="Ex: Ford Mustang"
						value={search}
						onChange={(e) =>
							setSearch(e.target.value)
						}
					/>

					{search && (
						<button
							type="button"
							onClick={() =>
								setSearch('')
							}
						>
							<IoCloseCircle />
						</button>
					)}
				</div>

				<div className="cars-grid">
					{results.map((car) => (
						<div
							key={car.id}
							className="car-card"
						>
							<div className="card-header">
								<span>
									{car.brand}
								</span>

								<button
									onClick={() =>
										toggleFavorite(
											car.id
										)
									}
								>
									{favorites.includes(
										car.id
									) ? (
										<IoStar />
									) : (
										<IoStarOutline />
									)}
								</button>
							</div>

							<img
								src={car.image}
								alt={car.name}
							/>

							<h3>{car.name}</h3>

							<button
								className="details-button"
								onClick={() => navigate(`/information/${car.id}`
									
								)
								}
							>
								Saiba Mais
							</button>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}