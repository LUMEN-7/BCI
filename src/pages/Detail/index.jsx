import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	IoArrowBack,
	IoStar,
	IoStarOutline,
	IoChevronDown,
	IoChevronUp,
	IoCheckmarkCircleOutline
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

const comparisonSections = [
	{
		id: 'performance',
		title: 'Performance',
	},
	{
		id: 'technology',
		title: 'Tecnologia',
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
	const [expandedSection, setExpandedSection] = useState('performance');

	const firstCar =
	mockCars[location.state?.firstCar?.id] ||
	location.state?.firstCar ||
	mockCars['1'];

	const secondCar =
		mockCars[location.state?.secondCar?.id] ||
		location.state?.secondCar ||
		mockCars['2'];

	const comparisonSummary = useMemo(() => {
		return `${firstCar.name} se destaca por uma proposta mais esportiva e focada em desempenho, enquanto ${secondCar.name} entrega mais versatilidade, robustez e capacidade para diferentes tipos de terreno. A melhor escolha depende do objetivo do usuário: emoção ao dirigir ou uso mais aventureiro e funcional.`;
	}, [firstCar, secondCar]);

	function toggleSection(sectionId) {
		setExpandedSection((current) =>
			current === sectionId ? null : sectionId
		);
	}

	function getAdvantage(sectionId) {
		const firstCount = firstCar.sections?.[sectionId]?.length || 0;
		const secondCount = secondCar.sections?.[sectionId]?.length || 0;

		if (firstCount > secondCount) return 'first';
		if (secondCount > firstCount) return 'second';

		return 'tie';
	}

return (
	<main className="compare-detail-page">
		<section className="compare-detail-container">
			<header className="compare-detail-topbar">
				<button
					type="button"
					className="back-button"
					onClick={() => navigate('/compare')}
				>
					<IoArrowBack />
					Voltar
				</button>

				<button
					type="button"
					className="favorite-button"
					onClick={() => setFavorite(!favorite)}
				>
					{favorite ? <IoStar /> : <IoStarOutline />}
				</button>
			</header>

			<h1>Comparação detalhada</h1>

			<p className="compare-subtitle">
				Visualize diferenças de desempenho, tecnologia e eficiência entre os modelos.
			</p>

			<section className="compare-hero">
				<div className="car-side">
					<img src={firstCar.image} alt={firstCar.name} />
					<h2>{firstCar.name}</h2>
				</div>

				<div className="vs-circle">VS</div>

				<div className="car-side">
					<img src={secondCar.image} alt={secondCar.name} />
					<h2>{secondCar.name}</h2>
				</div>
			</section>

			<section className="summary-card">
				<div className="summary-header">
					<span>Análise da IA</span>
					<h2>Resumo inteligente</h2>
				</div>

				<p className="summary-main">
					{comparisonSummary}
				</p>

				<div className="summary-insights">
					<div>
						<span>Melhor para desempenho</span>
						<strong>{firstCar.name}</strong>
					</div>

					<div>
						<span>Melhor para versatilidade</span>
						<strong>{secondCar.name}</strong>
					</div>

					<div>
						<span>Decisão recomendada</span>
						<strong>Depende do perfil de uso</strong>
					</div>
				</div>
			</section>

			<section className="technical-section">
				<h2 className="section-title">Ficha Técnica</h2>

				<div className="accordion-group">
					<CompareAccordion
						title="Dados Base"
						firstCar={firstCar}
						secondCar={secondCar}
						items={[
							['Modelo', 'model'],
							['Marca', 'brand'],
							['Ano', 'year'],
							['Modos de Condução', 'driveModes'],
						]}
						open={expandedSection === 'base'}
						onClick={() => toggleSection('base')}
					/>

					<CompareAccordion
						title="Especificações"
						firstCar={firstCar}
						secondCar={secondCar}
						items={[
							['Potência', 'power'],
							['Torque', 'torque'],
							['Potência RPM', 'powerRpm'],
							['Torque RPM', 'torqueRpm'],
							['Transmissão', 'transmission'],
							['Tração', 'drivetrain'],
						]}
						open={expandedSection === 'specs'}
						onClick={() => toggleSection('specs')}
					/>

					<CompareAccordion
						title="Consumos"
						firstCar={firstCar}
						secondCar={secondCar}
						items={[
							['Cidade', 'cityConsumption'],
							['Estrada', 'highwayConsumption'],
						]}
						open={expandedSection === 'consumption'}
						onClick={() => toggleSection('consumption')}
					/>

					<CompareAccordion
						title="Dimensões"
						firstCar={firstCar}
						secondCar={secondCar}
						items={[
							['Comprimento', 'length'],
							['Largura', 'width'],
							['Altura', 'height'],
							['Entre-Eixos', 'wheelbase'],
						]}
						open={expandedSection === 'dimensions'}
						onClick={() => toggleSection('dimensions')}
					/>

					<CompareAccordion
						title="Pneus"
						firstCar={firstCar}
						secondCar={secondCar}
						items={[
							['Tipo', 'tireType'],
							['Aro', 'rim'],
							['Largura', 'tireWidth'],
							['Perfil', 'tireProfile'],
						]}
						open={expandedSection === 'tires'}
						onClick={() => toggleSection('tires')}
						verified
					/>

					<CompareAccordion
						title="Extras"
						firstCar={firstCar}
						secondCar={secondCar}
						items={[
							['Capacidade do Tanque', 'tankCapacity'],
							['Tipo de Combustível', 'fuelType'],
							['Capacidade de Carga', 'loadCapacity'],
							['Capacidade de Reboque', 'towingCapacity'],
						]}
						open={expandedSection === 'extras'}
						onClick={() => toggleSection('extras')}
					/>
				</div>

				<h2 className="section-title">Recursos e Desempenho</h2>

				<div className="accordion-group">
					{comparisonSections.map((section) => (
						<CompareSectionAccordion
							key={section.id}
							title={section.title}
							firstCar={firstCar}
							secondCar={secondCar}
							sectionId={section.id}
							open={expandedSection === section.id}
							onClick={() => toggleSection(section.id)}
							verified={
								section.id === 'performance' ||
								section.id === 'technology'
							}
						/>
					))}
				</div>
			</section>
		</section>
	</main>
);
}

function InfoCard({ car, items, advantage }) {
	return (
		<div className={`info-card ${advantage ? 'info-card-advantage' : ''}`}>
			<div className="info-card-header">
				<h3>{car.name}</h3>

				{advantage && <span className="winner-badge">Melhor</span>}
			</div>

			<ul>
				{items.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
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
	verified,
}) {
	return (
		<div className="comparison-accordion">
			<button
				type="button"
				className="accordion-button"
				onClick={onClick}
			>
				<span className="accordion-title">
					{title}
					{verified && <IoCheckmarkCircleOutline className="verified-icon" />}
				</span>

				{open ? <IoChevronUp /> : <IoChevronDown />}
			</button>

			{open && (
				<div className="compare-table">
					{items.map(([label, key]) => (
						<div className="compare-row" key={key}>
							<span>{label}</span>

							<strong>
								{firstCar.specs?.[key] ||
									firstCar[key] ||
									'Não informado'}
							</strong>

							<strong>
								{secondCar.specs?.[key] ||
									secondCar[key] ||
									'Não informado'}
							</strong>
						</div>
					))}
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
	verified,
}) {
	return (
		<div className="comparison-accordion">
			<button
				type="button"
				className="accordion-button"
				onClick={onClick}
			>
				<span className="accordion-title">
					{title}
					{verified && <IoCheckmarkCircleOutline className="verified-icon" />}
				</span>

				{open ? <IoChevronUp /> : <IoChevronDown />}
			</button>

			{open && (
				<div className="dual-cards">
					<InfoCard
						car={firstCar}
						items={firstCar.sections?.[sectionId] || []}
					/>

					<InfoCard
						car={secondCar}
						items={secondCar.sections?.[sectionId] || []}
					/>
				</div>
			)}
		</div>
	);
}