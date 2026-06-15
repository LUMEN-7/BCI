import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	IoSearchOutline,
	IoCloseCircle,
	IoCarSportOutline,
	IoAdd,
	IoCheckmark,
	IoCloseOutline,
	IoArrowBackOutline,
	IoHomeOutline 
} from 'react-icons/io5';

import './style.css';

const mockCars = [
	{
		id: '1',
		brand: 'Ford',
		name: 'Ford Mustang 2024',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		engine: '5.0 V8',
		power: '488 cv',
		type: 'Coupé',
	},
	{
		id: '2',
		brand: 'Ford',
		name: 'Ford Bronco 2021',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		engine: '2.7 V6',
		power: '330 cv',
		type: 'SUV',
	},
	{
		id: '3',
		brand: 'Ford',
		name: 'Ford Bronco Sport 2025',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2025_ford_bronco_sport.png',
		engine: '2.0 EcoBoost',
		power: '250 cv',
		type: 'SUV',
	},
	{
		id: '4',
		brand: 'Ford',
		name: 'Ford Explorer 2026',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2026_ford_explorer.png',
		engine: '2.3 EcoBoost',
		power: '300 cv',
		type: 'SUV',
	},
];

export default function Compare() {
		const navigate = useNavigate();
	const location = useLocation();

	const initialFirstCar = location.state?.firstCar || null;

	const [firstCar, setFirstCar] = useState(initialFirstCar);
	const [secondCar, setSecondCar] = useState(null);
	const [activeSlot, setActiveSlot] = useState(
		initialFirstCar ? 'second' : 'first'
	);
	const [search, setSearch] = useState('');

	const results = useMemo(() => {
		const term = search.trim().toLowerCase();

		if (!term) {
			return mockCars;
		}

		return mockCars.filter((car) =>
			`${car.brand} ${car.name} ${car.engine} ${car.type}`
				.toLowerCase()
				.includes(term)
		);
	}, [search]);

	const canCompare = firstCar && secondCar;

	function selectCar(car) {
		if (firstCar?.id === car.id) {
			setFirstCar(null);
			return;
		}
		
		if (secondCar?.id === car.id) {
			setSecondCar(null);
			return;
		}
		if (!firstCar) {
			setFirstCar(car);
			return;
		}
		if (!secondCar) {
			setSecondCar(car);
			return;
		}


		if (activeSlot === 'first') {
			setFirstCar(car);
		} else {
			setSecondCar(car);
		}
	}

	function removeCar(slot) {
		if (slot === 'first') {
			setFirstCar(null);
			setActiveSlot('first');
			return;
		}

		setSecondCar(null);
		setActiveSlot('second');
	}

	function handleCompare() {
		if (!canCompare) {
			return;
		}

		navigate('/compare/detail', {
			state: {
				firstCar,
				secondCar,
			},
		});
	}

	return (
		<main className="compare-page">
			<section className="compare-container">
				<header className="compare-header">
					<div className="header-actions">
						<button
							type="button"
							className="back-button"
							onClick={() => navigate(-1)}
						>
							<IoArrowBackOutline />
							<span>Voltar</span>
						</button>

						<button
							type="button"
							className="home-button"
							onClick={() => navigate('/home')}
						>
							<IoHomeOutline />
						</button>
					</div>

					<h1>Comparar</h1>

					<p className="description">
						Pesquise dois modelos para comparar desempenho,
						consumo e diferenciais.
					</p>
				</header>
				<p className='description'>
					Pesquise dois modelos para comparar desempenho,
					consumo e diferenciais.
				</p>
				<section className="selected-area">
					<SelectedSlot
						label="Modelo 1"
						car={firstCar}
						active={activeSlot === 'first'}
						onClick={() => setActiveSlot('first')}
						onRemove={() => removeCar('first')}
					/>

					<div className="vs-circle" onClick={handleCompare}>X</div>

					<SelectedSlot
						label="Modelo 2"
						car={secondCar}
						active={activeSlot === 'second'}
						onClick={() => setActiveSlot('second')}
						onRemove={() => removeCar('second')}
					/>
				</section>

				<section className="search-area">
					<div>
						<h2>
							Buscar para{' '}
							{activeSlot === 'first' ? 'modelo 1' : 'modelo 2'}
						</h2>

						<div className="search-box">
							<IoSearchOutline />

							<input
								type="text"
								placeholder="Ex: Ford Mustang 2024"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
							/>

							{search && (
								<button
									type="button"
									className="clear-search"
									onClick={() => setSearch('')}
								>
									<IoCloseCircle />
								</button>
							)}
						</div>
					</div>
				</section>

				<section className="results-area">
					{results.length > 0 ? (
						<div className="results-grid">
							{results.map((car) => {
								const selected =
									firstCar?.id === car.id || secondCar?.id === car.id;

								return (
									<button
										type="button"
										key={car.id}
										className={`result-card ${
											selected ? 'result-card-selected' : ''
										}`}
										onClick={() => selectCar(car)}
									>
										<div className="result-image-wrapper">
											{car.image ? (
												<img src={car.image} alt={car.name} />
											) : (
												<IoCarSportOutline />
											)}
										</div>

										<div className="result-info">
											<h3>{car.name}</h3>
											<p>{car.brand}</p>

											<div className="specs">
												<span>{car.engine}</span>
												<span>{car.power}</span>
												<span>{car.type}</span>
											</div>
										</div>

										<div
											className={`add-button ${
												selected ? 'add-button-selected' : ''
											}`}
										>
											{selected ? <IoCheckmark /> : <IoAdd />}
										</div>
									</button>
								);
							})}
						</div>
					) : (
						<div className="empty-box">
							<IoCarSportOutline />

							<h3>Nenhum modelo encontrado</h3>

							<p>
								Tente pesquisar com marca, modelo ou ano.
							</p>
						</div>
					)}
				</section>

				<footer className="compare-footer">
					<button
						type="button"
						className="compare-button"
						disabled={!canCompare}
						onClick={handleCompare}
					>
						Comparar Modelos
					</button>
				</footer>
			</section>
		</main>
	);
}

function SelectedSlot({ label, car, active, onClick, onRemove }) {
	return (
		<button
			type="button"
			className={`slot-card ${active ? 'slot-card-active' : ''}`}
			onClick={onClick}
		>
			{car ? (
				<>
					<div className="slot-image-wrapper">
						{car.image ? (
							<img src={car.image} alt={car.name} />
						) : (
							<IoCarSportOutline />
						)}
					</div>

					<div className="slot-info">
						<span>{label}</span>
						<strong>{car.name}</strong>
					</div>

					<span
						className="remove-button"
						onClick={(event) => {
							event.stopPropagation();
							onRemove();
						}}
					>
						<IoCloseOutline />
					</span>
				</>
			) : (
				<div className="empty-slot">
					<IoCarSportOutline />
					<span>{label}</span>
				</div>
			)}
		</button>
	);
}