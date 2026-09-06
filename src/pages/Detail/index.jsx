import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
	IoArrowBack,
	IoStar,
	IoStarOutline,
	IoChevronDown,
	IoChevronUp,
	IoCheckmarkCircleOutline,
	IoHomeOutline,
} from 'react-icons/io5';

import './style.css';


const mockCars = {
	'1': {
		id: '1',
		brand: 'Ford',
		name: 'Mustang GT 2024',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',

		sections: {
			performance: [
				'Motor 5.0 V8',
				'488 cv de potência',
				'Perfil esportivo e foco em desempenho',
			],
			technology: [
				'Painel digital',
				'Central multimídia',
				'Apple CarPlay e Android Auto',
			],
			security: [
				'Controle de estabilidade',
				'Assistente de frenagem',
				'Airbags múltiplos',
			],
			comfort: [
				'Bancos esportivos',
				'Ar-condicionado digital',
				'Acabamento premium',
			],
		},

		specs: {
			engine: '5.0 V8',
			power: '488 cv',
			type: 'Coupé',
			consumption: '8 km/l',
			model: 'Mustang GT',
			brand: 'Ford',
			year: '2024',
			driveModes: 'Sport, Eco, Comfort',
			torque: '57,3 kgfm',
			powerRpm: '7.250 rpm',
			torqueRpm: '4.900 rpm',
			transmission: 'Automática',
			drivetrain: 'Traseira',
			cityConsumption: '6,2 km/l',
			highwayConsumption: '9,8 km/l',
			length: '4.810 mm',
			width: '1.916 mm',
			height: '1.397 mm',
			wheelbase: '2.719 mm',
			tireType: 'Performance',
			rim: '19"',
			tireWidth: '255 mm',
			tireProfile: '40',
			tankCapacity: '61 L',
			fuelType: 'Gasolina',
			loadCapacity: '380 kg',
			towingCapacity: 'Não informado',
		},
	},

	'2': {
		id: '2',
		brand: 'Ford',
		name: 'Bronco 2021',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',

		sections: {
			performance: [
				'Motor 2.7 V6',
				'330 cv de potência',
				'Tração 4x4 para terrenos difíceis',
			],
			technology: [
				'Sistema multimídia',
				'Câmeras de apoio',
				'Modos de condução off-road',
			],
			security: [
				'Controle de tração',
				'Assistente em descidas',
				'Monitoramento de estabilidade',
			],
			comfort: [
				'Interior resistente',
				'Boa altura do solo',
				'Espaço para passageiros',
			],
		},

		specs: {
			engine: '2.7 V6',
			power: '330 cv',
			type: 'SUV',
			consumption: '7 km/l',
			model: 'Bronco',
			brand: 'Ford',
			year: '2021',
			driveModes: 'Sport, Eco, Comfort, Off-road',
			torque: '57,6 kgfm',
			powerRpm: '5.500 rpm',
			torqueRpm: '3.100 rpm',
			transmission: 'Automática',
			drivetrain: '4x4',
			cityConsumption: '6,5 km/l',
			highwayConsumption: '8,2 km/l',
			length: '4.811 mm',
			width: '1.928 mm',
			height: '1.852 mm',
			wheelbase: '2.949 mm',
			tireType: 'All-terrain',
			rim: '17"',
			tireWidth: '285 mm',
			tireProfile: '70',
			tankCapacity: '79 L',
			fuelType: 'Gasolina',
			loadCapacity: '450 kg',
			towingCapacity: '1.580 kg',
		},
	},
};


const technicalSections = [
	{
		id: 'base',
		title: 'Dados Base',
		items: [
			['Modelo', 'model'],
			['Marca', 'brand'],
			['Ano', 'year'],
			['Modos de Condução', 'driveModes'],
		],
	},

	{
		id: 'specs',
		title: 'Especificações',
		items: [
			['Potência', 'power'],
			['Torque', 'torque'],
			['Potência RPM', 'powerRpm'],
			['Torque RPM', 'torqueRpm'],
			['Transmissão', 'transmission'],
			['Tração', 'drivetrain'],
		],
	},

	{
		id: 'consumption',
		title: 'Consumos',
		items: [
			['Cidade', 'cityConsumption'],
			['Estrada', 'highwayConsumption'],
		],
	},

	{
		id: 'dimensions',
		title: 'Dimensões',
		items: [
			['Comprimento', 'length'],
			['Largura', 'width'],
			['Altura', 'height'],
			['Entre-Eixos', 'wheelbase'],
		],
	},

	{
		id: 'tires',
		title: 'Pneus',
		verified: true,
		items: [
			['Tipo', 'tireType'],
			['Aro', 'rim'],
			['Largura', 'tireWidth'],
			['Perfil', 'tireProfile'],
		],
	},

	{
		id: 'extras',
		title: 'Extras',
		items: [
			['Capacidade do Tanque', 'tankCapacity'],
			['Tipo de Combustível', 'fuelType'],
			['Capacidade de Carga', 'loadCapacity'],
			['Capacidade de Reboque', 'towingCapacity'],
		],
	},
];


const resourceSections = [
	{
		id: 'performance',
		title: 'Performance',
		verified: true,
	},

	{
		id: 'technology',
		title: 'Tecnologia',
		verified: true,
	},

	{
		id: 'security',
		title: 'Segurança',
	},

	{
		id: 'comfort',
		title: 'Conforto',
	},
];


export default function CompareDetail() {
	const navigate = useNavigate();
	const location = useLocation();

	const [favorite, setFavorite] = useState(false);
	const [expandedSection, setExpandedSection] = useState('base');

	const firstCar =
		mockCars[location.state?.firstCar?.id] ||
		location.state?.firstCar ||
		mockCars['1'];

	const secondCar =
		mockCars[location.state?.secondCar?.id] ||
		location.state?.secondCar ||
		mockCars['2'];


	const comparisonSummary = useMemo(
		() =>
			`${firstCar.name} se destaca por uma proposta mais esportiva e focada em desempenho, enquanto ${secondCar.name} entrega mais versatilidade, robustez e capacidade para diferentes tipos de terreno. A melhor escolha depende do objetivo do usuário: emoção ao dirigir ou uso mais aventureiro e funcional.`,
		[firstCar.name, secondCar.name]
	);


	function toggleSection(sectionId) {
		setExpandedSection((current) =>
			current === sectionId ? null : sectionId
		);
	}


	return (
		<main className="compare-detail-page">
			<div className="compare-detail-container">

				{/* TOPBAR */}

				<header className="compare-detail-topbar">
					<button
						type="button"
						className="back-button"
						onClick={() => navigate(-1)}
					>
						<IoArrowBack />
						<span>Voltar</span>
					</button>

					<div className="topbar-actions">
						<button
							type="button"
							className="home-button"
							onClick={() => navigate('/home')}
							aria-label="Ir para início"
						>
							<IoHomeOutline />
						</button>

						<button
							type="button"
							className={`favorite-button ${
								favorite ? 'is-favorite' : ''
							}`}
							onClick={() => setFavorite((current) => !current)}
							aria-label="Favoritar comparação"
						>
							{favorite ? <IoStar /> : <IoStarOutline />}
						</button>
					</div>
				</header>


				{/* HEADER */}

				<section className="compare-heading">

					<h1>Comparação detalhada</h1>

					<p>
						Visualize diferenças de desempenho, tecnologia e
						eficiência entre os modelos.
					</p>
				</section>


				{/* HERO */}

				<section className="compare-hero">

					<CarPreview car={firstCar} />

					<div className="vs-wrapper">
						<span className="vs-label">VS</span>
					</div>

					<CarPreview car={secondCar} />

				</section>


				{/* IA */}

				<section className="ai-analysis-section">

					<div className="ai-analysis-header">
						<span>Análise da IA</span>

						<h2>Resumo inteligente</h2>

						<p>
							Uma leitura comparativa baseada nas características
							dos modelos selecionados.
						</p>
					</div>


					<p className="ai-summary">
						{comparisonSummary}
					</p>


					<div className="ai-insights">

						<InsightCard
							label="Melhor para desempenho"
							value={firstCar.name}
						/>

						<InsightCard
							label="Melhor para versatilidade"
							value={secondCar.name}
						/>

						<InsightCard
							label="Decisão recomendada"
							value="Depende do perfil de uso"
							featured
						/>

					</div>

				</section>


				{/* FICHA TÉCNICA */}

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
					</div>


					<div className="accordion-group">

						{technicalSections.map((section) => (
							<CompareAccordion
								key={section.id}
								title={section.title}
								firstCar={firstCar}
								secondCar={secondCar}
								items={section.items}
								open={expandedSection === section.id}
								onClick={() => toggleSection(section.id)}
								verified={section.verified}
							/>
						))}

					</div>


					<div className="resources-heading">
						<span className="section-eyebrow">
							Características
						</span>

						<h2 className="section-title">
							Recursos e Desempenho
						</h2>
					</div>


					<div className="accordion-group">

						{resourceSections.map((section) => (
							<CompareSectionAccordion
								key={section.id}
								title={section.title}
								firstCar={firstCar}
								secondCar={secondCar}
								sectionId={section.id}
								open={expandedSection === section.id}
								onClick={() => toggleSection(section.id)}
								verified={section.verified}
							/>
						))}

					</div>

				</section>

			</div>
		</main>
	);
}


/* =========================================================
   COMPONENTS
========================================================= */

function CarPreview({ car }) {
	return (
		<div className="car-preview">

			<div className="car-preview-brand">
				{car.brand}
			</div>

			<img
				src={car.image}
				alt={car.name}
			/>

			<h2>{car.name}</h2>

		</div>
	);
}


function InsightCard({ label, value, featured = false }) {
	return (
		<div className={`ai-insight ${featured ? 'featured' : ''}`}>
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}


function CompareAccordion({
	title,
	firstCar,
	secondCar,
	items,
	open,
	onClick,
	verified = false,
}) {
	return (
		<div className={`accordion ${open ? 'is-open' : ''}`}>

			<button
				type="button"
				className="accordion-trigger"
				onClick={onClick}
				aria-expanded={open}
			>

				<span className="accordion-title">
					{title}
				</span>

				{verified && (
					<span className="verified-badge">
						<IoCheckmarkCircleOutline />
						Verificado
					</span>
				)}

				<span className="accordion-arrow">
					{open ? <IoChevronUp /> : <IoChevronDown />}
				</span>

			</button>


			{open && (
				<div className="accordion-content">

					<div className="technical-list">

						{items.map(([label, key]) => (
							<div className="technical-row" key={key}>

								<span className="technical-label">
									{label}
								</span>

								<div className="technical-car-value">
									<span>{firstCar.name}</span>

									<strong>
										{firstCar.specs?.[key] ||
											firstCar[key] ||
											'Não informado'}
									</strong>
								</div>

								<div className="technical-car-value">
									<span>{secondCar.name}</span>

									<strong>
										{secondCar.specs?.[key] ||
											secondCar[key] ||
											'Não informado'}
									</strong>
								</div>

							</div>
						))}

					</div>

				</div>
			)}

		</div>
	);
}


function CompareSectionAccordion({
	title,
	firstCar,
	secondCar,
	sectionId,
	open,
	onClick,
	verified = false,
}) {
	const firstItems = firstCar.sections?.[sectionId] || [];
	const secondItems = secondCar.sections?.[sectionId] || [];

	return (
		<div className={`accordion ${open ? 'is-open' : ''}`}>

			<button
				type="button"
				className="accordion-trigger"
				onClick={onClick}
				aria-expanded={open}
			>

				<span className="accordion-title">
					{title}
				</span>

				{verified && (
					<span className="verified-badge">
						<IoCheckmarkCircleOutline />
						Verificado
					</span>
				)}

				<span className="accordion-arrow">
					{open ? <IoChevronUp /> : <IoChevronDown />}
				</span>

			</button>


			{open && (
				<div className="accordion-content">

					<div className="feature-grid">

						<FeatureCard
							car={firstCar}
							items={firstItems}
						/>

						<FeatureCard
							car={secondCar}
							items={secondItems}
						/>

					</div>

				</div>
			)}

		</div>
	);
}


function FeatureCard({ car, items }) {
	return (
		<div className="feature-card">

			<div className="feature-card-header">
				<span>{car.brand}</span>

				<strong>{car.name}</strong>
			</div>

			<ul>
				{items.map((item) => (
					<li key={item}>
						{item}
					</li>
				))}
			</ul>

		</div>
	);
}