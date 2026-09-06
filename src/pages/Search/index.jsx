import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	IoSearchOutline,
	IoCloseCircle,
	IoStar,
	IoStarOutline,
	IoArrowForward,
	IoChevronDownOutline
} from 'react-icons/io5';

import Navbar from '../../components/Navbar/Navbar';

import './style.css';

const cars = [
	{
		id: '1',
		brand: 'Ford',
		year: 2024,
		name: 'Mustang GT 2024',
		segment: 'Esportivo',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
	},
	{
		id: '2',
		brand: 'Ford',
		year: 2021,
		name: 'Bronco 2021',
		segment: 'SUV',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
	},
	{
		id: '3',
		brand: 'Ford',
		year: 2025,
		name: 'Bronco Sport 2025',
		segment: 'SUV Compacto',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
	},
	{
		id: '4',
		brand: 'Ford',
		year: 2026,
		name: 'Explorer 2026',
		segment: 'SUV',
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

	const brands = useMemo(
		() => [...new Set(cars.map((car) => car.brand))],
		[]
	);

	const years = useMemo(
		() =>
			[...new Set(cars.map((car) => car.year))].sort(
				(a, b) => b - a
			),
		[]
	);

	const results = useMemo(() => {
		const term = search.toLowerCase().trim();

		return cars.filter((car) => {
			const matchesSearch =
				!term ||
				car.name.toLowerCase().includes(term) ||
				car.brand.toLowerCase().includes(term) ||
				car.segment.toLowerCase().includes(term);

			const matchesBrand =
				!selectedBrand || car.brand === selectedBrand;

			const matchesYear =
				!selectedYear ||
				car.year === Number(selectedYear);

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

	function clearFilters() {
		setSearch('');
		setSelectedBrand('');
		setSelectedYear('');
	}

	const hasFilters =
		search.trim() ||
		selectedBrand ||
		selectedYear;

	return (
		<main className="search-page">
			<Navbar />

			<div className="search-container">

				{/* =====================================================
				    HEADER
				===================================================== */}

				<header className="compare-header">
					<div className="compare-eyebrow">
						PESQUISA DE VEÍCULOS
					</div>

					<h1>BUSCAR</h1>

					<p>
						Pesquise, filtre e explore os veículos disponíveis para construir sua análise competitiva.
					</p>
				</header>


				{/* =====================================================
				    SEARCH / FILTERS
				===================================================== */}

				<section className="search-controls">

					<div className="search-page-box">

						<IoSearchOutline className="search-page-icon" />

						<input
							type="text"
							placeholder="Pesquisar modelo, marca ou segmento"
							value={search}
							onChange={(e) =>
								setSearch(e.target.value)
							}
						/>

						{search && (
							<button
								type="button"
								className="search-page-clear"
								onClick={() => setSearch('')}
								aria-label="Limpar pesquisa"
							>
								<IoCloseCircle />
							</button>
						)}

					</div>


					<div className="filter-row">

						<div className="select-wrapper">

							<select
								className="filter-select"
								value={selectedBrand}
								onChange={(e) =>
									setSelectedBrand(
										e.target.value
									)
								}
							>
								<option value="">
									Todas as marcas
								</option>

								{brands.map((brand) => (
									<option
										key={brand}
										value={brand}
									>
										{brand}
									</option>
								))}
							</select>

							<IoChevronDownOutline />

						</div>


						<div className="select-wrapper">

							<select
								className="filter-select"
								value={selectedYear}
								onChange={(e) =>
									setSelectedYear(
										e.target.value
									)
								}
							>
								<option value="">
									Todos os anos
								</option>

								{years.map((year) => (
									<option
										key={year}
										value={year}
									>
										{year}
									</option>
								))}
							</select>

							<IoChevronDownOutline />

						</div>


						{hasFilters && (
							<button
								type="button"
								className="clear-filters"
								onClick={clearFilters}
							>
								Limpar filtros
							</button>
						)}

					</div>

				</section>


				{/* =====================================================
				    RESULTS HEADER
				===================================================== */}

				<section className="results-header">

					<div>
						<span className="section-label">
							{hasFilters
								? 'RESULTADOS DA PESQUISA'
								: 'MODELOS DISPONÍVEIS'}
						</span>

						<h2>
							{hasFilters
								? search
									? `RESULTADOS PARA "${search.toUpperCase()}"`
									: 'MODELOS ENCONTRADOS'
								: 'EXPLORE OS MODELOS'}
						</h2>
					</div>

					<span className="results-count">
						{results.length}{' '}
						{results.length === 1
							? 'MODELO'
							: 'MODELOS'}
					</span>

				</section>


				{/* =====================================================
				    RESULTS
				===================================================== */}

				{results.length > 0 ? (
					<div className="cars-grid">

						{results.map((car) => (

							<article
								key={car.id}
								className="car-card"
							>

								<div className="card-top">

									<span className="car-brand">
										{car.brand}
									</span>

									<button
										type="button"
										className={`favorite-button ${
											favorites.includes(
												car.id
											)
												? 'is-favorite'
												: ''
										}`}
										onClick={() =>
											toggleFavorite(
												car.id
											)
										}
										aria-label={
											favorites.includes(
												car.id
											)
												? 'Remover dos favoritos'
												: 'Adicionar aos favoritos'
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


								<div className="car-image-container">

									<img
										src={car.image}
										alt={car.name}
										className="car-image"
									/>

								</div>


								<div className="car-information">

									<div className="car-meta">
										{car.segment}
									</div>

									<h3>
										{car.name.replace(
											` ${car.year}`,
											''
										)}
									</h3>

									<span className="car-year">
										{car.year}
									</span>

								</div>


								<button
									type="button"
									className="details-button"
									onClick={() =>
										navigate(
											`/information/${car.id}`
										)
									}
								>
									<span>
										EXPLORAR MODELO
									</span>

									<IoArrowForward />

								</button>

							</article>

						))}

					</div>
				) : (

					/* =================================================
					   EMPTY STATE
					================================================= */

					<section className="empty-state">

						<div className="empty-icon">
							<IoSearchOutline />
						</div>

						<span className="section-label">
							NENHUM RESULTADO
						</span>

						<h2>
							NENHUM MODELO ENCONTRADO.
						</h2>

						<p>
							Não encontramos veículos para os
							filtros selecionados. Tente
							alterar sua pesquisa.
						</p>

						<button
							type="button"
							className="empty-button"
							onClick={clearFilters}
						>
							LIMPAR FILTROS
							<IoArrowForward />
						</button>

					</section>

				)}

			</div>
		</main>
	);
}