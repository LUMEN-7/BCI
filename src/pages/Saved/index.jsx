import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	IoCarSportOutline,
	IoGitCompareOutline,
	IoChevronDownOutline,
	IoChevronUpOutline,
	IoTrashOutline,
	IoTimeOutline,
	IoCheckmarkOutline,
	IoAlertCircleOutline,
	IoArrowForwardOutline,
} from 'react-icons/io5';

import './style.css';
import Navbar from '../../components/Navbar/Navbar';


/* =========================================================
   MOCK DATA
========================================================= */

const initialSavedCars = [
	{
		id: 'car-1',
		name: 'Mustang GT 2024',
		brand: 'Ford',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		engine: '5.0 V8',
		power: '488 cv',
		type: 'Coupé',
		description:
			'Modelo esportivo com foco em potência, performance e experiência de direção.',

		updates: [
			{
				id: 'update-1',
				date: '03/09/2026',
				title: 'Nova atualização disponível',
				description:
					'Os dados de potência e especificações técnicas foram revisados.',
			},
			{
				id: 'update-2',
				date: '28/08/2026',
				title: 'Dados revisados',
				description:
					'Informações gerais do veículo foram atualizadas.',
			},
		],
	},

	{
		id: 'car-2',
		name: 'Bronco 2021',
		brand: 'Ford',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		engine: '2.7 V6',
		power: '330 cv',
		type: 'SUV',
		description:
			'SUV robusto voltado para aventura, trilhas e uso off-road.',

		updates: [
			{
				id: 'update-3',
				date: '30/08/2026',
				title: 'Informações atualizadas',
				description:
					'Foram revisadas informações técnicas do modelo.',
			},
		],
	},
];


const initialSavedComparisons = [
	{
		id: 'comparison-1',
		firstCar: 'Mustang GT 2024',
		secondCar: 'Bronco 2021',

		firstImage:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',

		secondImage:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',

		result: 'Esportivo vs aventureiro',

		description:
			'Comparação entre desempenho em estrada e capacidade off-road.',

		updates: [
			{
				id: 'update-4',
				date: '02/09/2026',
				title: 'Comparação atualizada',
				description:
					'Novos dados de desempenho foram adicionados à comparação.',
			},
		],
	},
];


/* =========================================================
   HELPERS
========================================================= */

const READ_UPDATES_KEY = 'lumen-read-saved-updates';

function getReadUpdates() {
	try {
		return JSON.parse(
			localStorage.getItem(READ_UPDATES_KEY)
		) || [];
	} catch {
		return [];
	}
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Saved() {
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState('cars');

	const [savedCars, setSavedCars] =
		useState(initialSavedCars);

	const [savedComparisons, setSavedComparisons] =
		useState(initialSavedComparisons);

	const [openCards, setOpenCards] = useState({});

	const [readUpdates, setReadUpdates] =
		useState(getReadUpdates);


	/* =========================================================
	   PERSIST READ STATUS
	========================================================= */

	useEffect(() => {
		localStorage.setItem(
			READ_UPDATES_KEY,
			JSON.stringify(readUpdates)
		);
	}, [readUpdates]);


	/* =========================================================
	   DATA
	========================================================= */

	const currentItems =
		activeTab === 'cars'
			? savedCars
			: savedComparisons;


	/* =========================================================
	   CARD ACCORDION
	========================================================= */

	function toggleCard(id) {
		setOpenCards((current) => ({
			...current,
			[id]: !current[id],
		}));
	}


	/* =========================================================
	   UPDATE STATUS
	========================================================= */

	function isUpdateRead(updateId) {
		return readUpdates.includes(updateId);
	}


	function hasUnreadUpdates(item) {
		return item.updates?.some(
			(update) => !isUpdateRead(update.id)
		);
	}


	function getUnreadCount(item) {
		return (
			item.updates?.filter(
				(update) => !isUpdateRead(update.id)
			).length || 0
		);
	}


	/* =========================================================
	   MARK AS READ
	========================================================= */

	function markItemAsRead(item) {
		const updateIds =
			item.updates?.map((update) => update.id) || [];

		setReadUpdates((current) => [
			...new Set([
				...current,
				...updateIds,
			]),
		]);
	}


	/* =========================================================
	   DELETE
	========================================================= */

	function deleteItem(id) {
		if (activeTab === 'cars') {
			setSavedCars((current) =>
				current.filter((car) => car.id !== id)
			);
		} else {
			setSavedComparisons((current) =>
				current.filter(
					(comparison) =>
						comparison.id !== id
				)
			);
		}

		setOpenCards((current) => {
			const next = { ...current };
			delete next[id];
			return next;
		});
	}


	/* =========================================================
	   NAVIGATION
	========================================================= */

	function handleCarDetails(id) {
		navigate(`/information/${id.replace('car-', '')}`);
	}


	function handleComparisonDetails() {
		navigate('/compare/detail');
	}


	/* =========================================================
	   RENDER
	========================================================= */

	return (
		<main className="saved-page">

			<Navbar />

			<section className="saved-container">

				{/* =================================================
				    HEADER
				================================================= */}

				<header className="saved-header">

					<div>
						<span className="saved-eyebrow">
							Minha coleção
						</span>

						<h1>Salvos</h1>

						<p>
							Acesse rapidamente seus veículos
							favoritos e comparações salvas.
						</p>
					</div>

				</header>


				{/* =================================================
				    TABS
				================================================= */}

				<div className="saved-tabs">

					<button
						type="button"
						className={
							activeTab === 'cars'
								? 'active'
								: ''
						}
						onClick={() => {
							setActiveTab('cars');
							setOpenCards({});
						}}
					>
						<IoCarSportOutline />

						<span>Modelos</span>

						<strong>
							{savedCars.length}
						</strong>
					</button>


					<button
						type="button"
						className={
							activeTab === 'comparisons'
								? 'active'
								: ''
						}
						onClick={() => {
							setActiveTab('comparisons');
							setOpenCards({});
						}}
					>
						<IoGitCompareOutline />

						<span>Comparações</span>

						<strong>
							{savedComparisons.length}
						</strong>
					</button>

				</div>


				{/* =================================================
				    ATTENTION INFO
				================================================= */}

				{currentItems.some(hasUnreadUpdates) && (
					<div className="saved-attention">

						<div className="saved-attention-icon">
							<IoAlertCircleOutline />
						</div>

						<div>
							<strong>
								Atualizações disponíveis
							</strong>

							<span>
								Alguns itens salvos possuem
								informações novas.
							</span>
						</div>

					</div>
				)}


				{/* =================================================
				    GRID
				================================================= */}

				<section className="saved-grid">

					{currentItems.length === 0 ? (

						<div className="saved-empty">

							<div className="saved-empty-icon">
								{activeTab === 'cars' ? (
									<IoCarSportOutline />
								) : (
									<IoGitCompareOutline />
								)}
							</div>

							<h2>
								Nada salvo ainda
							</h2>

							<p>
								{activeTab === 'cars'
									? 'Seus veículos favoritos aparecerão aqui.'
									: 'Suas comparações salvas aparecerão aqui.'}
							</p>

						</div>

					) : (

						currentItems.map((item) => {

							const isOpen =
								!!openCards[item.id];

							const hasUpdates =
								hasUnreadUpdates(item);

							const unreadCount =
								getUnreadCount(item);


							return (
								<article
									key={item.id}
									className={`saved-card ${
										isOpen
											? 'saved-card-open'
											: ''
									}`}
								>

									{/* =================================
									    IMAGE
									================================= */}

									{activeTab === 'cars' ? (

										<div
											className="saved-image"
											onClick={() =>
												handleCarDetails(
													item.id
												)
											}
										>

											<img
												src={item.image}
												alt={item.name}
											/>


											{hasUpdates && (
												<span
													className="attention-dot"
													title="Atualização não lida"
												/>
											)}


											<button
												type="button"
												onClick={(event) => {
													event.stopPropagation();
													handleCarDetails(
														item.id
													);
												}}
											>
												Ver detalhes
												<IoArrowForwardOutline />
											</button>

										</div>

									) : (

										<div className="saved-compare-image">

											<div>
												<img
													src={item.firstImage}
													alt={item.firstCar}
												/>
											</div>


											<span className="compare-vs">
												VS
											</span>


											<div>
												<img
													src={item.secondImage}
													alt={item.secondCar}
												/>
											</div>


											{hasUpdates && (
												<span
													className="attention-dot"
													title="Atualização não lida"
												/>
											)}


											<button
												type="button"
												onClick={() =>
													handleComparisonDetails()
												}
											>
												Ver comparação
												<IoArrowForwardOutline />
											</button>

										</div>

									)}


									{/* =================================
									    CARD INFO
									================================= */}

									<div className="saved-info">

										<div className="saved-card-header">

											<div className="saved-card-heading">

												<span>
													{activeTab === 'cars'
														? item.brand
														: 'Comparação'}
												</span>

												<h2>
													{activeTab === 'cars'
														? item.name
														: item.result}
												</h2>

											</div>


											<div className="saved-card-actions">

												{hasUpdates && (
													<div className="update-indicator">

														<span className="indicator-dot" />

														{unreadCount}{' '}
														{unreadCount === 1
															? 'atualização'
															: 'atualizações'}

													</div>
												)}


												<button
													type="button"
													className="delete-button"
													title="Remover dos salvos"
													onClick={() =>
														deleteItem(
															item.id
														)
													}
												>
													<IoTrashOutline />
												</button>

											</div>

										</div>


										{/* =================================
										    DETAILS
										================================= */}

										{isOpen && (

											<div className="saved-details">

												{activeTab === 'cars' ? (

													<>
														<div className="saved-specs">

															<span>
																{item.engine}
															</span>

															<span>
																{item.power}
															</span>

															<span>
																{item.type}
															</span>

														</div>

														<p>
															{item.description}
														</p>
													</>

												) : (

													<>
														<div className="saved-specs">

															<span>
																{item.firstCar}
															</span>

															<span>
																{item.secondCar}
															</span>

														</div>

														<p>
															{item.description}
														</p>
													</>
												)}


												{/* =============================
												    UPDATE HISTORY
												============================= */}

												{item.updates?.length > 0 && (

													<div className="update-history">

														<div className="update-history-header">

															<div className="update-history-title">

																<IoTimeOutline />

																<div>
																	<strong>
																		Histórico de atualizações
																	</strong>

																	<span>
																		Alterações neste item
																	</span>
																</div>

															</div>


															{hasUpdates && (
																<button
																	type="button"
																	className="mark-read-button"
																	onClick={() =>
																		markItemAsRead(
																			item
																		)
																	}
																>
																	<IoCheckmarkOutline />
																	Marcar como lido
																</button>
															)}

														</div>


														<div className="update-history-list">

															{item.updates.map(
																(update) => {

																	const unread =
																		!isUpdateRead(
																			update.id
																		);

																	return (
																		<div
																			key={update.id}
																			className={`update-item ${
																				unread
																					? 'unread'
																					: ''
																			}`}
																		>

																			<div className="update-timeline">

																				<span />

																				<div />

																			</div>


																			<div className="update-content">

																				<div className="update-meta">

																					<span>
																						{update.date}
																					</span>

																					{unread && (
																						<small>
																							NOVA
																						</small>
																					)}

																				</div>

																				<strong>
																					{update.title}
																				</strong>

																				<p>
																					{update.description}
																				</p>

																			</div>

																		</div>
																	);
																}
															)}

														</div>

													</div>
												)}

											</div>
										)}


										{/* =================================
										    EXPAND
										================================= */}

										<button
											type="button"
											className="expand-button"
											onClick={() =>
												toggleCard(
													item.id
												)
											}
											aria-label={
												isOpen
													? 'Fechar detalhes'
													: 'Abrir detalhes'
											}
										>

											<span>
												{isOpen
													? 'Fechar detalhes'
													: 'Ver informações'}
											</span>

											{isOpen ? (
												<IoChevronUpOutline />
											) : (
												<IoChevronDownOutline />
											)}

										</button>

									</div>

								</article>
							);
						})
					)}

				</section>

			</section>

		</main>
	);
}