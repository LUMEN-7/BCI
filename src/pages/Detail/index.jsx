import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	IoArrowBack,
	IoStar,
	IoStarOutline,
	IoChevronDown,
	IoChevronUp,
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

	const firstCar = location.state?.firstCar || mockCars['1'];
	const secondCar = location.state?.secondCar || mockCars['2'];

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
					<span>Resumo inteligente</span>

					<p>{comparisonSummary}</p>
				</section>

				<section className="comparison-list">
					{comparisonSections.map((section) => {
						const isOpen = expandedSection === section.id;
						const advantage = getAdvantage(section.id);

						return (
							<div className="comparison-section" key={section.id}>
								<button
									type="button"
									className="section-header"
									onClick={() => toggleSection(section.id)}
								>
									<span>{section.title}</span>

									{isOpen ? <IoChevronUp /> : <IoChevronDown />}
								</button>

								{isOpen && (
									<div className="dual-cards">
										<InfoCard
											car={firstCar}
											items={firstCar.sections?.[section.id] || []}
											advantage={advantage === 'first'}
										/>

										<InfoCard
											car={secondCar}
											items={secondCar.sections?.[section.id] || []}
											advantage={advantage === 'second'}
										/>
									</div>
								)}
							</div>
						);
					})}
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