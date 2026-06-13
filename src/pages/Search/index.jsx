import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoSearchOutline,
	IoCloseCircle,
	IoStar,
	IoStarOutline,
	IoArrowBackOutline 
} from 'react-icons/io5';

import './style.css';

const cars = [
	{
		id: '1',
		brand: 'Ford',
		year: 2024,
		name: 'Mustang GT 2024',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
	},
	{
		id: '2',
		brand: 'Ford',
		year: 2021,
		name: 'Bronco 2021',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
	},
	{
		id: '3',
		brand: 'Ford',
		year: 2025,
		name: 'Bronco Sport 2025',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
	},
	{
		id: '4',
		brand: 'Ford',
		year: 2026,
		name: 'Explorer 2026',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_explorer.png',
	},
];

export default function Search() {
	const navigate = useNavigate();
	const [selectedBrand, setSelectedBrand] = useState('');
	const [selectedYear, setSelectedYear] = useState('');

	const [search, setSearch] = useState('');
	const [favorites, setFavorites] = useState([]);

	const brands = [...new Set(cars.map((car) => car.brand))];
	const years = [...new Set(cars.map((car) => car.year))].sort(
		(a, b) => b - a
	);

	const results = useMemo(() => {
	const term = search.toLowerCase().trim();

	return cars.filter((car) => {
		const matchesSearch =
			!term ||
			car.name.toLowerCase().includes(term) ||
			car.brand.toLowerCase().includes(term);

		const matchesBrand =
			!selectedBrand || car.brand === selectedBrand;

		const matchesYear =
			!selectedYear || car.year === Number(selectedYear);

		return (
			matchesSearch &&
			matchesBrand &&
			matchesYear
		);
	});
}, [search, selectedBrand, selectedYear]);

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
				<header className="search-header">
					<div>
						<h1>Encontre o modelo</h1>
					</div>

					<button
						type="button"
						className="back-button"
						onClick={() => navigate(-1)}
					>
						<IoArrowBackOutline />
						<span>Voltar</span>
					</button>
				</header>
				<p>
					Pesquise pela marca ou modelo para comparar
					diferenciais com mais facilidade.
				</p>

				<div className="search-filters">
					<div className="search-box">
						<IoSearchOutline />

						<input
							type="text"
							placeholder="Ex: Ford Mustang"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>

						{search && (
							<button
								type="button"
								onClick={() => setSearch('')}
							>
								<IoCloseCircle />
							</button>
						)}
					</div>

					<select
						className="filter-select"
						value={selectedBrand}
						onChange={(e) => setSelectedBrand(e.target.value)}
					>
						<option value="">Todas as marcas</option>

						{brands.map((brand) => (
							<option key={brand} value={brand}>
								{brand}
							</option>
						))}
					</select>

					<select
						className="filter-select"
						value={selectedYear}
						onChange={(e) => setSelectedYear(e.target.value)}
					>
						<option value="">Todos os anos</option>

						{years.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
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