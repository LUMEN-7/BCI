import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	IoSearchOutline,
	IoCloseCircleOutline,
	IoCarSportOutline,
	IoAddOutline,
	IoCheckmarkOutline,
	IoCloseOutline,
	IoSwapHorizontalOutline,
} from 'react-icons/io5';

import './style.css';
import Navbar from '../../components/Navbar/Navbar';

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
			`${car.brand} ${car.name} ${car.engine} ${car.power} ${car.type}`
				.toLowerCase()
				.includes(term)
		);
	}, [search]);

	const canCompare = Boolean(firstCar && secondCar);

	function selectCar(car) {
		// Se clicar no modelo que já está selecionado,
		// remove ele do slot correspondente.
		if (firstCar?.id === car.id) {
			setFirstCar(null);
			setActiveSlot('first');
			return;
		}

		if (secondCar?.id === car.id) {
			setSecondCar(null);
			setActiveSlot('second');
			return;
		}

		// Primeiro slot vazio
		if (!firstCar) {
			setFirstCar(car);
			setActiveSlot('second');
			return;
		}

		// Segundo slot vazio
		if (!secondCar) {
			setSecondCar(car);
			return;
		}

		// Se ambos estiverem preenchidos,
		// substitui o slot ativo.
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
			<Navbar />

			<div className="compare-container">
				<header className="compare-header">
					<div className="compare-eyebrow">
						COMPARAÇÃO DE MODELOS
					</div>

					<h1>Comparar</h1>

					<p>
						Selecione dois modelos para analisar desempenho,
						consumo, características e diferenciais lado a lado.
					</p>
				</header>

				<section className="selected-section">
					<div className="selected-section-header">
						<div>
							<span className="section-eyebrow">
								SUA SELEÇÃO
							</span>

							<h2>
								Escolha os modelos
							</h2>
						</div>

						<div className="selection-status">
							<span
								className={
									firstCar
										? 'status-dot status-dot-active'
										: 'status-dot'
								}
							/>
							<span>
								{firstCar ? '1' : '0'} de 2 selecionados
							</span>
						</div>
					</div>

					<div className="selected-area">
						<SelectedSlot
							label="Modelo 1"
							car={firstCar}
							active={activeSlot === 'first'}
							onClick={() => setActiveSlot('first')}
							onRemove={() => removeCar('first')}
						/>

						<div className="vs-wrapper">
							<div className="vs-line" />

							<button
								type="button"
								className={`vs-circle ${
									canCompare ? 'vs-circle-ready' : ''
								}`}
								onClick={handleCompare}
								disabled={!canCompare}
								aria-label="Comparar modelos"
							>
								<span>VS</span>
								<IoSwapHorizontalOutline />
							</button>

							<div className="vs-line" />
						</div>

						<SelectedSlot
							label="Modelo 2"
							car={secondCar}
							active={activeSlot === 'second'}
							onClick={() => setActiveSlot('second')}
							onRemove={() => removeCar('second')}
						/>
					</div>
				</section>

				<section className="search-section">
					<div className="search-header">
						<div>
							<span className="section-eyebrow">
								SELECIONAR MODELO
							</span>

							<h2>
								Buscar para{' '}
								<strong>
									{activeSlot === 'first'
										? 'modelo 1'
										: 'modelo 2'}
								</strong>
							</h2>
						</div>

						<span className="search-hint">
							{activeSlot === 'first'
								? 'Primeiro veículo'
								: 'Segundo veículo'}
						</span>
					</div>

					<div className="search-box">
						<div className="search-icon">
							<IoSearchOutline />
						</div>

						<input
							type="text"
							placeholder="Pesquise por marca, modelo, motor ou tipo..."
							value={search}
							onChange={(event) =>
								setSearch(event.target.value)
							}
						/>

						{search && (
							<button
								type="button"
								className="clear-search"
								onClick={() => setSearch('')}
								aria-label="Limpar busca"
							>
								<IoCloseCircleOutline />
							</button>
						)}
					</div>
				</section>

				<section className="results-section">
					<div className="results-header">
						<div>
							<span className="section-eyebrow">
								MODELOS DISPONÍVEIS
							</span>

							<h2>
								{search
									? `${results.length} resultado${
											results.length !== 1
												? 's'
												: ''
									  }`
									: 'Todos os modelos'}
							</h2>
						</div>
					</div>

					{results.length > 0 ? (
						<div className="results-grid">
							{results.map((car) => {
								const selected =
									firstCar?.id === car.id ||
									secondCar?.id === car.id;

								const selectedSlot =
									firstCar?.id === car.id
										? 'Modelo 1'
										: secondCar?.id === car.id
										? 'Modelo 2'
										: null;

								return (
									<button
										type="button"
										key={car.id}
										className={`result-card ${
											selected
												? 'result-card-selected'
												: ''
										}`}
										onClick={() =>
											selectCar(car)
										}
									>
										<div className="result-image-wrapper">
											{car.image ? (
												<img
													src={car.image}
													alt={car.name}
												/>
											) : (
												<IoCarSportOutline />
											)}
										</div>

										<div className="result-info">
											<span className="result-brand">
												{car.brand}
											</span>

											<h3>{car.name}</h3>

											<div className="result-specs">
												<span>{car.engine}</span>
												<span>{car.power}</span>
												<span>{car.type}</span>
											</div>
										</div>

										<div
											className={`add-button ${
												selected
													? 'add-button-selected'
													: ''
											}`}
										>
											{selected ? (
												<IoCheckmarkOutline />
											) : (
												<IoAddOutline />
											)}
										</div>

										{selected && (
											<span className="selected-label">
												{selectedSlot}
											</span>
										)}
									</button>
								);
							})}
						</div>
					) : (
						<div className="empty-box">
							<div className="empty-icon">
								<IoCarSportOutline />
							</div>

							<h3>Nenhum modelo encontrado</h3>

							<p>
								Tente pesquisar por outra marca, modelo,
								motor ou tipo de veículo.
							</p>

							<button
								type="button"
								onClick={() => setSearch('')}
							>
								Ver todos os modelos
							</button>
						</div>
					)}
				</section>

				<footer className="compare-footer">
					<div className="footer-info">
						<span
							className={
								canCompare
									? 'footer-indicator ready'
									: 'footer-indicator'
							}
						/>

						<p>
							{canCompare
								? 'Pronto para comparar os dois modelos'
								: 'Selecione dois modelos para continuar'}
						</p>
					</div>

					<button
						type="button"
						className="compare-button"
						disabled={!canCompare}
						onClick={handleCompare}
					>
						Comparar modelos
						<IoSwapHorizontalOutline />
					</button>
				</footer>
			</div>
		</main>
	);
}

function SelectedSlot({
	label,
	car,
	active,
	onClick,
	onRemove,
}) {
	return (
		<button
			type="button"
			className={`slot-card ${
				active ? 'slot-card-active' : ''
			} ${car ? 'slot-card-filled' : 'slot-card-empty'}`}
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
						<span className="slot-label">
							{label}
						</span>

						<strong>{car.name}</strong>

						<div className="slot-meta">
							<span>{car.engine}</span>
							<span>{car.power}</span>
							<span>{car.type}</span>
						</div>
					</div>

					<button
						type="button"
						className="remove-button"
						onClick={(event) => {
							event.stopPropagation();
							onRemove();
						}}
						aria-label={`Remover ${car.name}`}
					>
						<IoCloseOutline />
					</button>
				</>
			) : (
				<div className="empty-slot">
					<div className="empty-slot-icon">
						<IoCarSportOutline />
					</div>

					<div>
						<span>{label}</span>
						<strong>Adicionar modelo</strong>
					</div>

					<IoAddOutline className="empty-slot-add" />
				</div>
			)}
		</button>
	);
}