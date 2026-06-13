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
	IoHardwareChipOutline
} from 'react-icons/io5';

import './style.css';

const cars = [
	{
		id: '1',
		brand: 'Ford',
		name: 'Mustang GT 2024',
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		description:
			'O Mustang GT combina potência, design esportivo e tecnologia para entregar uma experiência de direção marcante.',
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
		sections: {
			performance: [
				'0 a 100 km/h em cerca de 4,2 segundos',
				'Tração traseira',
				'Câmbio automático de alta performance',
			],
			security: [
				'Controle de estabilidade',
				'Assistente de frenagem',
				'Airbags múltiplos',
			],
			technology: [
				'Painel digital',
				'Central multimídia',
				'Apple CarPlay e Android Auto',
			],
			comfort: [
				'Bancos esportivos',
				'Ar-condicionado digital',
				'Acabamento premium',
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
			bestUse: 'Estrada, condução esportiva e uso recreativo',
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
		image: 'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		description:
			'O Bronco é um SUV robusto, feito para aventura, com presença forte e capacidade off-road.',
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
		sections: {
			performance: [
				'Tração 4x4',
				'Modos de terreno',
				'Suspensão preparada para off-road',
			],
			security: [
				'Controle de tração',
				'Assistente em descidas',
				'Monitoramento de estabilidade',
			],
			technology: [
				'Sistema multimídia',
				'Câmeras de apoio',
				'Conectividade embarcada',
			],
			comfort: [
				'Interior resistente',
				'Boa altura do solo',
				'Espaço para passageiros',
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
			bestUse: 'Off-road, aventura, trilhas e viagens',
			competitors: [
				'Jeep Wrangler',
				'Toyota 4Runner',
				'Land Rover Defender',
			],
		},
	},
];

export default function Information() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [favorite, setFavorite] = useState(false);
	const [openSection, setOpenSection] = useState(null);

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
		setOpenSection((current) => (current === section ? null : section));
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
				<header className="information-topbar">
					<button
						className="back-button"
						onClick={() => navigate(-1)}
					>
						<IoArrowBack />
						Voltar
					</button>

					<button
						className="favorite-button"
						onClick={() => setFavorite(!favorite)}
					>
						{favorite ? <IoStar /> : <IoStarOutline />}
					</button>
				</header>

				<section className="information-hero">
					<div className="car-preview">
						<img src={car.image} alt={car.name} />
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
						</button>
					</div>
				</section>

				<section className="specs-grid">
					<SpecCard
						icon={<IoSpeedometerOutline />}
						label="Motor"
						value={car.specs.engine}
					/>

					<SpecCard
						icon={<IoFlashOutline />}
						label="Potência"
						value={car.specs.power}
					/>

					<SpecCard
						icon={<IoCarSportOutline />}
						label="Tipo"
						value={car.specs.type}
					/>

					<SpecCard
						icon={<IoWaterOutline />}
						label="Consumo"
						value={car.specs.consumption}
					/>
				</section>
				<section className="technical-section">
					<h2 className="section-title">
						Ficha Técnica
					</h2>

					<div className="accordion-group">
						<Accordion
							title="Dados Base"
							items={[
								`Modelo: ${car.specs.model}`,
								`Marca: ${car.specs.brand}`,
								`Ano: ${car.specs.year}`,
								`Modos de Condução: ${car.specs.driveModes}`,
							]}
							open={openSection === 'base'}
							onClick={() => toggleSection('base')}
						/>

						<Accordion
							title="Especificações"
							items={[
								`Potência: ${car.specs.power}`,
								`Torque: ${car.specs.torque}`,
								`Potência RPM: ${car.specs.powerRpm}`,
								`Torque RPM: ${car.specs.torqueRpm}`,
								`Transmissão: ${car.specs.transmission}`,
								`Tração: ${car.specs.drivetrain}`,
							]}
							open={openSection === 'specs'}
							onClick={() => toggleSection('specs')}
						/>

						<Accordion
							title="Consumos"
							items={[
								`Cidade: ${car.specs.cityConsumption}`,
								`Estrada: ${car.specs.highwayConsumption}`,
							]}
							open={openSection === 'consumption'}
							onClick={() => toggleSection('consumption')}
							iaGen
						/>

						<Accordion
							title="Dimensões"
							items={[
								`Comprimento: ${car.specs.length}`,
								`Largura: ${car.specs.width}`,
								`Altura: ${car.specs.height}`,
								`Entre-Eixos: ${car.specs.wheelbase}`,
							]}
							open={openSection === 'dimensions'}
							onClick={() => toggleSection('dimensions')}
						/>

						<Accordion
							title="Pneus"
							items={[
								`Tipo: ${car.specs.tireType}`,
								`Aro: ${car.specs.rim}`,
								`Largura: ${car.specs.tireWidth}`,
								`Perfil: ${car.specs.tireProfile}`,
							]}
							open={openSection === 'tires'}
							onClick={() => toggleSection('tires')}
							verified
						/>

						<Accordion
							title="Extras"
							items={[
								`Capacidade do Tanque: ${car.specs.tankCapacity}`,
								`Tipo de Combustível: ${car.specs.fuelType}`,
								`Capacidade de Carga: ${car.specs.loadCapacity}`,
								`Capacidade de Reboque: ${car.specs.towingCapacity}`,
							]}
							open={openSection === 'extras'}
							onClick={() => toggleSection('extras')}
						/>
					</div>

					<h2 className="section-title">
						Recursos e Desempenho
					</h2>

					<div className="accordion-group">
						<Accordion
							title="Performance"
							items={car.sections.performance}
							open={openSection === 'performance'}
							onClick={() => toggleSection('performance')}
							verified
						/>

						<Accordion
							title="Segurança"
							items={car.sections.security}
							open={openSection === 'security'}
							onClick={() => toggleSection('security')}
						/>

						<Accordion
							title="Tecnologia"
							items={car.sections.technology}
							open={openSection === 'technology'}
							onClick={() => toggleSection('technology')}
							verified
						/>

						<Accordion
							title="Conforto"
							items={car.sections.comfort}
							open={openSection === 'comfort'}
							onClick={() => toggleSection('comfort')}
						/>
					</div>
				</section>
				<section className="ai-analysis-section">
					<div className="ai-analysis-header">
						<span>Análise inteligente</span>
						<h2>Análise da IA</h2>
						<p>
							Resumo gerado com base nas características técnicas,
							perfil de uso e posicionamento do modelo.
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
							<h3>Melhor uso</h3>
							<p>{car.aiAnalysis.bestUse}</p>
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

function SpecCard({ icon, label, value }) {
	return (
		<div className="spec-card">
			<div className="spec-icon">{icon}</div>
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}

function TechnicalGroup({ title, items }) {
	return (
		<div className="technical-group">
			<h3>{title}</h3>

			<div className="technical-list">
				{items.map(([label, value]) => (
					<div className="technical-row" key={label}>
						<span>{label}</span>
						<strong>{value}</strong>
					</div>
				))}
			</div>
		</div>
	);
}

function Accordion({ title, items, open, onClick, verified, iaGen }) {
	return (
		<div className="accordion">
			<button onClick={onClick}>
				<span className="accordion-title">
					{title}

					{verified && (
						<span className="verified-badge">
							<IoCheckmarkCircleOutline
							className="verified-icon"
						/>
						</span>
					)}
					{
						iaGen && (
							<span className="iaGen-badge">
								<IoHardwareChipOutline
								className="iaGen-icon"
								/>
								</span>
						)
					}
				</span>

				{open ? <IoChevronUp /> : <IoChevronDown />}
			</button>

			{open && (
				<ul>
					{items.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			)}
		</div>
	);
}

function AiAnalysisCard({ title, items }) {
	return (
		<div className="ai-analysis-card">
			<h3>{title}</h3>

			<ul>
				{items.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	);
}