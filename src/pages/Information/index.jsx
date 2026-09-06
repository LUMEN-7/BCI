import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
	IoArrowBack,
	IoStar,
	IoStarOutline,
	IoChevronDown,
	IoChevronUp,
	IoSpeedometerOutline,
	IoFlashOutline,
	IoCarSportOutline,
	IoWaterOutline,
	IoCheckmarkCircleOutline,
	IoHardwareChipOutline,
	IoHomeOutline,
	IoInformationCircleOutline,
	IoTimeOutline,
	IoOpenOutline,
	IoDocumentTextOutline,
} from 'react-icons/io5';

import './style.css';


/* =========================================================
   SOURCES
========================================================= */

const sources = {
	manufacturer: {
		id: 'manufacturer',
		name: 'Ford',
		description: 'Informações técnicas disponibilizadas pelo fabricante.',
		type: 'Fabricante',
	},

	technicalDatabase: {
		id: 'technicalDatabase',
		name: 'Base técnica',
		description: 'Dados técnicos consolidados para consulta.',
		type: 'Base de dados',
	},

	internalAnalysis: {
		id: 'internalAnalysis',
		name: 'Análise Lumen',
		description: 'Informações geradas a partir da análise dos dados disponíveis.',
		type: 'Análise',
	},
};


/* =========================================================
   CARS
========================================================= */

const cars = [
	{
		id: '1',

		brand: 'Ford',

		name: 'Mustang GT 2024',

		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',

		description:
			'O Mustang GT combina potência, design esportivo e tecnologia para entregar uma experiência de direção marcante.',

		lastUpdated: '03 set 2026',

		updatedAgo: 'há 3 dias',

		specs: {
			engine: {
				value: '5.0 V8',
				source: 'manufacturer',
			},

			power: {
				value: '488 cv',
				source: 'manufacturer',
			},

			type: {
				value: 'Coupé',
				source: 'manufacturer',
			},

			consumption: {
				value: '8 km/l',
				source: 'technicalDatabase',
			},

			model: {
				value: 'Mustang GT',
				source: 'manufacturer',
			},

			brand: {
				value: 'Ford',
				source: 'manufacturer',
			},

			year: {
				value: '2024',
				source: 'manufacturer',
			},

			driveModes: {
				value: 'Sport, Eco, Comfort',
				source: 'manufacturer',
			},

			torque: {
				value: '57,3 kgfm',
				source: 'manufacturer',
			},

			powerRpm: {
				value: '7.250 rpm',
				source: 'manufacturer',
			},

			torqueRpm: {
				value: '4.900 rpm',
				source: 'manufacturer',
			},

			transmission: {
				value: 'Automática',
				source: 'manufacturer',
			},

			drivetrain: {
				value: 'Traseira',
				source: 'manufacturer',
			},

			cityConsumption: {
				value: '6,2 km/l',
				source: 'technicalDatabase',
			},

			highwayConsumption: {
				value: '9,8 km/l',
				source: 'technicalDatabase',
			},

			length: {
				value: '4.810 mm',
				source: 'manufacturer',
			},

			width: {
				value: '1.916 mm',
				source: 'manufacturer',
			},

			height: {
				value: '1.397 mm',
				source: 'manufacturer',
			},

			wheelbase: {
				value: '2.719 mm',
				source: 'manufacturer',
			},

			tireType: {
				value: 'Performance',
				source: 'manufacturer',
			},

			rim: {
				value: '19"',
				source: 'manufacturer',
			},

			tireWidth: {
				value: '255 mm',
				source: 'manufacturer',
			},

			tireProfile: {
				value: '40',
				source: 'manufacturer',
			},

			tankCapacity: {
				value: '61 L',
				source: 'manufacturer',
			},

			fuelType: {
				value: 'Gasolina',
				source: 'manufacturer',
			},

			loadCapacity: {
				value: '380 kg',
				source: 'technicalDatabase',
			},

			towingCapacity: {
				value: 'Não informado',
				source: 'technicalDatabase',
			},
		},

		sections: {
			performance: [
				{
					value: '0 a 100 km/h em cerca de 4,2 segundos',
					source: 'technicalDatabase',
				},
				{
					value: 'Tração traseira',
					source: 'manufacturer',
				},
				{
					value: 'Câmbio automático de alta performance',
					source: 'manufacturer',
				},
			],

			security: [
				{
					value: 'Controle de estabilidade',
					source: 'manufacturer',
				},
				{
					value: 'Assistente de frenagem',
					source: 'manufacturer',
				},
				{
					value: 'Airbags múltiplos',
					source: 'manufacturer',
				},
			],

			technology: [
				{
					value: 'Painel digital',
					source: 'manufacturer',
				},
				{
					value: 'Central multimídia',
					source: 'manufacturer',
				},
				{
					value: 'Apple CarPlay e Android Auto',
					source: 'manufacturer',
				},
			],

			comfort: [
				{
					value: 'Bancos esportivos',
					source: 'manufacturer',
				},
				{
					value: 'Ar-condicionado digital',
					source: 'manufacturer',
				},
				{
					value: 'Acabamento premium',
					source: 'internalAnalysis',
				},
			],
		},

		aiAnalysis: {
			strengths: [
				'Motor V8 potente e resposta imediata',
				'Experiência de condução esportiva',
				'Design icônico e alta presença visual',
			],

			weaknesses: [
				'Consumo elevado em uso urbano',
				'Menor praticidade para uso familiar',
				'Porta-malas limitado para viagens longas',
			],

			bestUse:
				'Estrada, condução esportiva e uso recreativo',

			competitors: [
				'Chevrolet Camaro',
				'Dodge Challenger',
				'BMW Série 4 Coupé',
			],
		},
	},

	{
		id: '2',

		brand: 'Ford',

		name: 'Bronco 2021',

		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',

		description:
			'O Bronco é um SUV robusto, feito para aventura, com presença forte e capacidade off-road.',

		lastUpdated: '03 set 2026',

		updatedAgo: 'há 3 dias',

		specs: {
			engine: {
				value: '2.7 V6',
				source: 'manufacturer',
			},

			power: {
				value: '330 cv',
				source: 'manufacturer',
			},

			type: {
				value: 'SUV',
				source: 'manufacturer',
			},

			consumption: {
				value: '7 km/l',
				source: 'technicalDatabase',
			},

			model: {
				value: 'Bronco',
				source: 'manufacturer',
			},

			brand: {
				value: 'Ford',
				source: 'manufacturer',
			},

			year: {
				value: '2021',
				source: 'manufacturer',
			},

			driveModes: {
				value: 'Sport, Eco, Comfort, Off-road',
				source: 'manufacturer',
			},

			torque: {
				value: '57,6 kgfm',
				source: 'manufacturer',
			},

			powerRpm: {
				value: '5.500 rpm',
				source: 'manufacturer',
			},

			torqueRpm: {
				value: '3.100 rpm',
				source: 'manufacturer',
			},

			transmission: {
				value: 'Automática',
				source: 'manufacturer',
			},

			drivetrain: {
				value: '4x4',
				source: 'manufacturer',
			},

			cityConsumption: {
				value: '6,5 km/l',
				source: 'technicalDatabase',
			},

			highwayConsumption: {
				value: '8,2 km/l',
				source: 'technicalDatabase',
			},

			length: {
				value: '4.811 mm',
				source: 'manufacturer',
			},

			width: {
				value: '1.928 mm',
				source: 'manufacturer',
			},

			height: {
				value: '1.852 mm',
				source: 'manufacturer',
			},

			wheelbase: {
				value: '2.949 mm',
				source: 'manufacturer',
			},

			tireType: {
				value: 'All-terrain',
				source: 'manufacturer',
			},

			rim: {
				value: '17"',
				source: 'manufacturer',
			},

			tireWidth: {
				value: '285 mm',
				source: 'manufacturer',
			},

			tireProfile: {
				value: '70',
				source: 'manufacturer',
			},

			tankCapacity: {
				value: '79 L',
				source: 'manufacturer',
			},

			fuelType: {
				value: 'Gasolina',
				source: 'manufacturer',
			},

			loadCapacity: {
				value: '450 kg',
				source: 'technicalDatabase',
			},

			towingCapacity: {
				value: '1.580 kg',
				source: 'technicalDatabase',
			},
		},

		sections: {
			performance: [
				{
					value: 'Tração 4x4',
					source: 'manufacturer',
				},
				{
					value: 'Modos de terreno',
					source: 'manufacturer',
				},
				{
					value: 'Suspensão preparada para off-road',
					source: 'manufacturer',
				},
			],

			security: [
				{
					value: 'Controle de tração',
					source: 'manufacturer',
				},
				{
					value: 'Assistente em descidas',
					source: 'manufacturer',
				},
				{
					value: 'Monitoramento de estabilidade',
					source: 'manufacturer',
				},
			],

			technology: [
				{
					value: 'Sistema multimídia',
					source: 'manufacturer',
				},
				{
					value: 'Câmeras de apoio',
					source: 'manufacturer',
				},
				{
					value: 'Conectividade embarcada',
					source: 'manufacturer',
				},
			],

			comfort: [
				{
					value: 'Interior resistente',
					source: 'manufacturer',
				},
				{
					value: 'Boa altura do solo',
					source: 'technicalDatabase',
				},
				{
					value: 'Espaço para passageiros',
					source: 'technicalDatabase',
				},
			],
		},

		aiAnalysis: {
			strengths: [
				'Excelente capacidade off-road',
				'Boa altura do solo',
				'Visual robusto e aventureiro',
			],

			weaknesses: [
				'Consumo elevado',
				'Porte grande para uso urbano',
				'Conforto inferior ao de SUVs premium',
			],

			bestUse:
				'Off-road, aventura, trilhas e viagens',

			competitors: [
				'Jeep Wrangler',
				'Toyota 4Runner',
				'Land Rover Defender',
			],
		},
	},
];


/* =========================================================
   COMPONENT
========================================================= */

export default function Information() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [favorite, setFavorite] = useState(false);
	const [openSection, setOpenSection] = useState(null);
	const [showSources, setShowSources] = useState(false);

	const car = useMemo(() => {
		return cars.find((item) => item.id === id);
	}, [id]);

	if (!car) {
		return (
			<main className="information-page">
				<div className="information-container">
					<button
						className="back-button"
						onClick={() => navigate(-1)}
					>
						<IoArrowBack />
						Voltar
					</button>

					<h1>Modelo não encontrado</h1>
				</div>
			</main>
		);
	}

	function toggleSection(section) {
		setOpenSection((current) =>
			current === section ? null : section
		);
	}

	function handleCompare() {
		navigate('/compare', {
			state: {
				firstCar: car,
			},
		});
	}

	return (
		<main className="information-page">

			<div className="information-container">

				{/* =====================================================
				   TOPBAR
				===================================================== */}

				<header className="information-topbar">

					<button
						className="back-button"
						onClick={() => navigate(-1)}
					>
						<IoArrowBack />
						Voltar
					</button>

					<div className="topbar-actions">

						<button
							className="home-button"
							onClick={() => navigate('/home')}
							aria-label="Ir para home"
						>
							<IoHomeOutline />
						</button>

						<button
							className={`favorite-button ${
								favorite ? 'is-favorite' : ''
							}`}
							onClick={() => setFavorite(!favorite)}
							aria-label="Favoritar modelo"
						>
							{favorite ? (
								<IoStar />
							) : (
								<IoStarOutline />
							)}
						</button>

					</div>

				</header>


				{/* =====================================================
				   HERO
				===================================================== */}

				<section className="information-hero">

					<div className="car-preview">
						<img
							src={car.image}
							alt={car.name}
						/>
					</div>

					<div className="car-info">

						<span>{car.brand}</span>

						<h1>{car.name}</h1>

						<p>{car.description}</p>

						<button
							className="compare-button"
							onClick={handleCompare}
						>
							Comparar Modelo
							<IoOpenOutline />
						</button>

					</div>

				</section>


				{/* =====================================================
				   MAIN SPECS
				===================================================== */}

				<section className="specs-grid">

					<SpecCard
						icon={<IoSpeedometerOutline />}
						label="Motor"
						value={car.specs.engine.value}
					/>

					<SpecCard
						icon={<IoFlashOutline />}
						label="Potência"
						value={car.specs.power.value}
					/>

					<SpecCard
						icon={<IoCarSportOutline />}
						label="Tipo"
						value={car.specs.type.value}
					/>

					<SpecCard
						icon={<IoWaterOutline />}
						label="Consumo"
						value={car.specs.consumption.value}
					/>

				</section>


				{/* =====================================================
				   TECHNICAL SECTION
				===================================================== */}

				<section className="technical-section">

					<div className="technical-heading">

						<div>
							<span className="section-eyebrow">
								Especificações
							</span>

							<h2 className="section-title">
								Ficha Técnica
							</h2>
						</div>

						<div className="update-card">

							<div className="update-icon">
								<IoTimeOutline />
							</div>

							<div>
								<span>
									Última atualização
								</span>

								<strong>
									{car.lastUpdated}
								</strong>

								<small>
									{car.updatedAgo}
								</small>
							</div>

						</div>

					</div>


					{/* =================================================
					   CONFIDENCE LEGEND
					================================================= */}

					<div className="information-legend">

						<div className="legend-header">

							<div className="legend-title">
								<IoInformationCircleOutline />

								<div>
									<strong>
										Confiabilidade dos dados
									</strong>

									<span>
										Entenda como cada informação foi validada.
									</span>
								</div>
							</div>

							<button
								className="sources-toggle"
								onClick={() =>
									setShowSources(!showSources)
								}
							>
								<IoDocumentTextOutline />

								{showSources
									? 'Ocultar fontes'
									: 'Ver fontes dos dados'}
							</button>

						</div>


						<div className="legend-items">

							<LegendItem
								type="verified"
								label="Verificado"
								description="Fonte confirmada"
							/>

							<LegendItem
								type="high"
								label="Alta confiança"
								description="80% ou mais"
							/>

							<LegendItem
								type="medium"
								label="Média confiança"
								description="60% a 79%"
							/>

							<LegendItem
								type="low"
								label="Baixa confiança"
								description="Abaixo de 60%"
							/>

							<LegendItem
								type="ia"
								label="IA"
								description="Análise gerada por IA"
							/>

						</div>


						{/* =================================================
						   SOURCES
						================================================= */}

						{showSources && (
							<SourcesPanel car={car} />
						)}

					</div>


					{/* =================================================
					   BASE DATA
					================================================= */}

					<h2 className="subsection-title">
						Dados técnicos
					</h2>

					<div className="accordion-group">

						<Accordion
							title="Dados Base"

							items={[
								{
									label: 'Modelo',
									value: car.specs.model.value,
									source: car.specs.model.source,
								},
								{
									label: 'Marca',
									value: car.specs.brand.value,
									source: car.specs.brand.source,
								},
								{
									label: 'Ano',
									value: car.specs.year.value,
									source: car.specs.year.source,
								},
								{
									label: 'Modos de Condução',
									value: car.specs.driveModes.value,
									source: car.specs.driveModes.source,
								},
							]}

							open={openSection === 'base'}

							onClick={() =>
								toggleSection('base')
							}

							confidence={97}
						/>


						<Accordion
							title="Especificações"

							items={[
								{
									label: 'Potência',
									value: car.specs.power.value,
									source: car.specs.power.source,
								},
								{
									label: 'Torque',
									value: car.specs.torque.value,
									source: car.specs.torque.source,
								},
								{
									label: 'Potência RPM',
									value: car.specs.powerRpm.value,
									source: car.specs.powerRpm.source,
								},
								{
									label: 'Torque RPM',
									value: car.specs.torqueRpm.value,
									source: car.specs.torqueRpm.source,
								},
								{
									label: 'Transmissão',
									value: car.specs.transmission.value,
									source: car.specs.transmission.source,
								},
								{
									label: 'Tração',
									value: car.specs.drivetrain.value,
									source: car.specs.drivetrain.source,
								},
							]}

							open={openSection === 'specs'}

							onClick={() =>
								toggleSection('specs')
							}

							confidence={80}
						/>


						<Accordion
							title="Consumos"

							items={[
								{
									label: 'Cidade',
									value: car.specs.cityConsumption.value,
									source: car.specs.cityConsumption.source,
								},
								{
									label: 'Estrada',
									value: car.specs.highwayConsumption.value,
									source: car.specs.highwayConsumption.source,
								},
							]}

							open={openSection === 'consumption'}

							onClick={() =>
								toggleSection('consumption')
							}

							iaGen
						/>


						<Accordion
							title="Dimensões"

							items={[
								{
									label: 'Comprimento',
									value: car.specs.length.value,
									source: car.specs.length.source,
								},
								{
									label: 'Largura',
									value: car.specs.width.value,
									source: car.specs.width.source,
								},
								{
									label: 'Altura',
									value: car.specs.height.value,
									source: car.specs.height.source,
								},
								{
									label: 'Entre-Eixos',
									value: car.specs.wheelbase.value,
									source: car.specs.wheelbase.source,
								},
							]}

							open={openSection === 'dimensions'}

							onClick={() =>
								toggleSection('dimensions')
							}

							confidence={87}
						/>


						<Accordion
							title="Pneus"

							items={[
								{
									label: 'Tipo',
									value: car.specs.tireType.value,
									source: car.specs.tireType.source,
								},
								{
									label: 'Aro',
									value: car.specs.rim.value,
									source: car.specs.rim.source,
								},
								{
									label: 'Largura',
									value: car.specs.tireWidth.value,
									source: car.specs.tireWidth.source,
								},
								{
									label: 'Perfil',
									value: car.specs.tireProfile.value,
									source: car.specs.tireProfile.source,
								},
							]}

							open={openSection === 'tires'}

							onClick={() =>
								toggleSection('tires')
							}

							verified
						/>


						<Accordion
							title="Extras"

							items={[
								{
									label: 'Capacidade do Tanque',
									value: car.specs.tankCapacity.value,
									source: car.specs.tankCapacity.source,
								},
								{
									label: 'Tipo de Combustível',
									value: car.specs.fuelType.value,
									source: car.specs.fuelType.source,
								},
								{
									label: 'Capacidade de Carga',
									value: car.specs.loadCapacity.value,
									source: car.specs.loadCapacity.source,
								},
								{
									label: 'Capacidade de Reboque',
									value: car.specs.towingCapacity.value,
									source: car.specs.towingCapacity.source,
								},
							]}

							open={openSection === 'extras'}

							onClick={() =>
								toggleSection('extras')
							}

							confidence={81}
						/>

					</div>


					{/* =================================================
					   RESOURCES
					================================================= */}

					<h2 className="subsection-title resources-title">
						Recursos e Desempenho
					</h2>

					<div className="accordion-group">

						<Accordion
							title="Performance"
							items={car.sections.performance}
							open={openSection === 'performance'}
							onClick={() =>
								toggleSection('performance')
							}
							verified
						/>

						<Accordion
							title="Segurança"
							items={car.sections.security}
							open={openSection === 'security'}
							onClick={() =>
								toggleSection('security')
							}
							confidence={95}
						/>

						<Accordion
							title="Tecnologia"
							items={car.sections.technology}
							open={openSection === 'technology'}
							onClick={() =>
								toggleSection('technology')
							}
							verified
						/>

						<Accordion
							title="Conforto"
							items={car.sections.comfort}
							open={openSection === 'comfort'}
							onClick={() =>
								toggleSection('comfort')
							}
							confidence={67}
						/>

					</div>

				</section>


				{/* =====================================================
				   AI ANALYSIS
				===================================================== */}

				<section className="ai-analysis-section">

					<div className="ai-analysis-header">

						<span>
							Análise inteligente
						</span>

						<h2>
							Análise da IA
						</h2>

						<p>
							Resumo gerado com base nas características
							técnicas, perfil de uso e posicionamento
							do modelo.
						</p>

					</div>


					<div className="ai-analysis-grid">

						<AiAnalysisCard
							title="Pontos fortes"
							items={car.aiAnalysis.strengths}
						/>

						<AiAnalysisCard
							title="Pontos fracos"
							items={car.aiAnalysis.weaknesses}
						/>

						<div className="ai-analysis-card featured">

							<h3>
								Melhor uso
							</h3>

							<p>
								{car.aiAnalysis.bestUse}
							</p>

						</div>

						<AiAnalysisCard
							title="Concorrentes semelhantes"
							items={car.aiAnalysis.competitors}
						/>

					</div>

				</section>

			</div>

		</main>
	);
}


/* =========================================================
   SPEC CARD
========================================================= */

function SpecCard({ icon, label, value }) {
	return (
		<div className="spec-card">

			<div className="spec-icon">
				{icon}
			</div>

			<span>
				{label}
			</span>

			<strong>
				{value}
			</strong>

		</div>
	);
}


/* =========================================================
   LEGEND ITEM
========================================================= */

function LegendItem({
	type,
	label,
	description,
}) {
	return (
		<div className={`legend-item ${type}`}>

			<span className="legend-badge">

				{type === 'verified' && (
					<IoCheckmarkCircleOutline />
				)}

				{type === 'ia' && (
					<IoHardwareChipOutline />
				)}

				{type === 'high' && (
					<span className="legend-dot" />
				)}

				{type === 'medium' && (
					<span className="legend-dot" />
				)}

				{type === 'low' && (
					<span className="legend-dot" />
				)}

				{type !== 'verified' &&
					type !== 'ia' &&
					<span className="legend-label">
						{label}
					</span>
				}

				{(type === 'verified' || type === 'ia') && (
					<span className="legend-label">
						{label}
					</span>
				)}

			</span>

			<span className="legend-description">
				{description}
			</span>

		</div>
	);
}


/* =========================================================
   SOURCES PANEL
========================================================= */

function SourcesPanel({ car }) {
	const usedSources = new Set();

	Object.values(car.specs).forEach((item) => {
		if (item?.source) {
			usedSources.add(item.source);
		}
	});

	Object.values(car.sections).forEach((section) => {
		section.forEach((item) => {
			if (item?.source) {
				usedSources.add(item.source);
			}
		});
	});

	return (
		<div className="sources-panel">

			<div className="sources-panel-header">

				<div>
					<span className="section-eyebrow">
						Rastreabilidade
					</span>

					<h3>
						Fontes dos dados
					</h3>
				</div>

				<span className="sources-total">
					{usedSources.size} fontes
				</span>

			</div>


			<div className="sources-list">

				{Array.from(usedSources).map((sourceId) => {

					const source = sources[sourceId];

					return (
						<div
							className="source-card"
							key={sourceId}
						>

							<div className="source-icon">
								<IoDocumentTextOutline />
							</div>

							<div className="source-content">

								<div className="source-title-row">

									<strong>
										{source.name}
									</strong>

									<span>
										{source.type}
									</span>

								</div>

								<p>
									{source.description}
								</p>

								<div className="source-items">

									<span>
										Utilizada em:
									</span>

									<strong>
										{getSourceUsage(
											car,
											sourceId
										)}
									</strong>

								</div>

							</div>

						</div>
					);
				})}

			</div>

		</div>
	);
}


/* =========================================================
   SOURCE USAGE
========================================================= */

function getSourceUsage(car, sourceId) {
	const usage = [];

	if (
		car.specs.engine.source === sourceId ||
		car.specs.power.source === sourceId ||
		car.specs.type.source === sourceId
	) {
		usage.push('dados principais');
	}

	if (
		car.specs.cityConsumption.source === sourceId ||
		car.specs.highwayConsumption.source === sourceId
	) {
		usage.push('consumos');
	}

	if (
		car.specs.length.source === sourceId ||
		car.specs.width.source === sourceId ||
		car.specs.height.source === sourceId
	) {
		usage.push('dimensões');
	}

	if (
		car.sections.performance.some(
			(item) => item.source === sourceId
		)
	) {
		usage.push('performance');
	}

	if (
		car.sections.security.some(
			(item) => item.source === sourceId
		)
	) {
		usage.push('segurança');
	}

	if (
		car.sections.technology.some(
			(item) => item.source === sourceId
		)
	) {
		usage.push('tecnologia');
	}

	if (
		car.sections.comfort.some(
			(item) => item.source === sourceId
		)
	) {
		usage.push('conforto');
	}

	return usage.length
		? usage.join(' · ')
		: 'informações técnicas';
}


/* =========================================================
   ACCORDION
========================================================= */

function Accordion({
	title,
	items,
	open,
	onClick,
	verified,
	iaGen,
	confidence,
}) {
	return (
		<div className={`accordion ${open ? 'is-open' : ''}`}>

			<button
				className="accordion-trigger"
				onClick={onClick}
			>

				<span className="accordion-title">
					{title}
				</span>

				<span className="accordion-badges">

					{verified && (
						<span className="verified-badge">

							<IoCheckmarkCircleOutline />

							<span>
								Verificado
							</span>

						</span>
					)}

					{iaGen && (
						<span className="iaGen-badge">

							<IoHardwareChipOutline />

							<span>
								IA
							</span>

						</span>
					)}

					{confidence !== undefined &&
						!verified && (
							<ConfidenceBadge
								confidence={confidence}
							/>
						)}

				</span>

				<span className="accordion-arrow">
					{open ? (
						<IoChevronUp />
					) : (
						<IoChevronDown />
					)}
				</span>

			</button>


			{open && (
				<div className="accordion-content">

					<div className="technical-list">

						{items.map((item, index) => (

							<div
								className="technical-row"
								key={`${item.label}-${index}`}
							>

								<div className="technical-value">

									<span className="technical-label">
										{item.label || item.value}
									</span>

									{item.label && (
										<strong>
											{item.value}
										</strong>
									)}

								</div>


								{item.source && (
									<SourceTag
										sourceId={item.source}
									/>
								)}

							</div>

						))}

					</div>

				</div>
			)}

		</div>
	);
}


/* =========================================================
   CONFIDENCE BADGE
========================================================= */

function ConfidenceBadge({ confidence }) {
	const type =
		confidence >= 80
			? 'high'
			: confidence >= 60
				? 'medium'
				: 'low';

	const label =
		type === 'high'
			? 'Alta confiança'
			: type === 'medium'
				? 'Média confiança'
				: 'Baixa confiança';

	return (
		<span className={`confidence-badge ${type}`}>

			<span className="confidence-dot" />

			<span>
				{label}
			</span>

			<strong>
				{confidence}%
			</strong>

		</span>
	);
}


/* =========================================================
   SOURCE TAG
========================================================= */

function SourceTag({ sourceId }) {
	const source = sources[sourceId];

	if (!source) return null;

	return (
		<span className="source-tag">

			<IoDocumentTextOutline />

			{source.name}

		</span>
	);
}


/* =========================================================
   AI CARD
========================================================= */

function AiAnalysisCard({ title, items }) {
	return (
		<div className="ai-analysis-card">

			<h3>
				{title}
			</h3>

			<ul>
				{items.map((item, index) => (
					<li key={index}>
						{item}
					</li>
				))}
			</ul>

		</div>
	);
}