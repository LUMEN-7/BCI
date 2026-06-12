import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoArrowBackOutline,
	IoCarSportOutline,
	IoGitCompareOutline,
	IoChevronDown,
	IoChevronUp,
	IoTrashOutline,
} from 'react-icons/io5';

import './style.css';

const savedCars = [
	{
		id: '1',
		name: 'Mustang GT 2024',
		brand: 'Ford',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		engine: '5.0 V8',
		power: '488 cv',
		type: 'Coupé',
		description:
			'Modelo esportivo com foco em potência, performance e experiência de direção.',
	},
	{
		id: '2',
		name: 'Bronco 2021',
		brand: 'Ford',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		engine: '2.7 V6',
		power: '330 cv',
		type: 'SUV',
		description:
			'SUV robusto voltado para aventura, trilhas e uso off-road.',
	},
];

const savedComparisons = [
	{
		id: '1',
		firstCar: 'Mustang GT 2024',
		secondCar: 'Bronco 2021',
		firstImage: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		secondImage: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		result: 'Esportivo vs aventureiro',
		description:
			'Comparação entre desempenho em estrada e capacidade off-road.',
	},
];

export default function Saved() {
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState('cars');
	const [openCard, setOpenCard] = useState(null);

	function toggleCard(id) {
		setOpenCard((current) => (current === id ? null : id));
	}

	return (
		<main className="saved-page">
			<section className="saved-container">
				<header className="saved-header">
					<button
						type="button"
						className="back-button"
						onClick={() => navigate('/home')}
					>
						<IoArrowBackOutline />
						<span>Voltar</span>
					</button>

					<div>
						<h1>Salvos</h1>
						<p>
							Acesse rapidamente seus veículos favoritos e comparações
							salvas.
						</p>
					</div>
				</header>

				<div className="saved-tabs">
					<button
						className={activeTab === 'cars' ? 'active' : ''}
						onClick={() => setActiveTab('cars')}
					>
						<IoCarSportOutline />
						Carros
					</button>

					<button
						className={activeTab === 'comparisons' ? 'active' : ''}
						onClick={() => setActiveTab('comparisons')}
					>
						<IoGitCompareOutline />
						Comparações
					</button>
				</div>

				<section className="saved-grid">
					{activeTab === 'cars' &&
						savedCars.map((car) => (
							<article
								key={car.id}
								className={`saved-card ${
									openCard === car.id ? 'saved-card-open' : ''
								}`}
							>
								<div className="saved-image">
									<img src={car.image} alt={car.name} />

									<button
										type="button"
										onClick={() => navigate(`/information/${car.id}`)}
									>
										Ver detalhes
									</button>
								</div>

								<div className="saved-info">
									<div className="saved-card-header">
										<div>
											<span>{car.brand}</span>
											<h2>{car.name}</h2>
										</div>

										<button className="delete-button">
											<IoTrashOutline />
										</button>
									</div>

									{openCard === car.id && (
										<div className="saved-details">
											<div className="saved-specs">
												<span>{car.engine}</span>
												<span>{car.power}</span>
												<span>{car.type}</span>
											</div>

											<p>{car.description}</p>
										</div>
									)}

									<button
										className="expand-button"
										onClick={() => toggleCard(car.id)}
									>
										{openCard === car.id ? (
											<IoChevronUp />
										) : (
											<IoChevronDown />
										)}
									</button>
								</div>
							</article>
						))}

					{activeTab === 'comparisons' &&
						savedComparisons.map((comparison) => (
							<article
								key={comparison.id}
								className={`saved-card ${
									openCard === comparison.id ? 'saved-card-open' : ''
								}`}
							>
								<div className="saved-compare-image">
                                    <div>
                                        <img src={comparison.firstImage} alt={comparison.firstCar} />
                                    </div>

                                    <span>VS</span>

                                    <div>
                                        <img src={comparison.secondImage} alt={comparison.secondCar} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/compare/detail')}
                                    >
                                        Ver comparação
                                    </button>
                                </div>
								<div className="saved-info">
									<div className="saved-card-header">
										<div>
											<span>Comparação</span>
											<h2>{comparison.result}</h2>
										</div>

										<button className="delete-button">
											<IoTrashOutline />
										</button>
									</div>

									{openCard === comparison.id && (
										<div className="saved-details">
											<div className="saved-specs">
												<span>{comparison.firstCar}</span>
												<span>{comparison.secondCar}</span>
											</div>

											<p>{comparison.description}</p>
										</div>
									)}

									<button
										className="expand-button"
										onClick={() => toggleCard(comparison.id)}
									>
										{openCard === comparison.id ? (
											<IoChevronUp />
										) : (
											<IoChevronDown />
										)}
									</button>
								</div>
							</article>
						))}
				</section>
			</section>
		</main>
	);
}