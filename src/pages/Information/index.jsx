import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	IoArrowBack,
	IoStar,
	IoStarOutline,
	IoChevronDown,
	IoChevronUp,
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
		},
		sections: {
			performance: ['0 a 100 km/h em cerca de 4,2 segundos', 'Tração traseira', 'Câmbio automático de alta performance'],
			security: ['Controle de estabilidade', 'Assistente de frenagem', 'Airbags múltiplos'],
			technology: ['Painel digital', 'Central multimídia', 'Apple CarPlay e Android Auto'],
			comfort: ['Bancos esportivos', 'Ar-condicionado digital', 'Acabamento premium'],
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
		},
		sections: {
			performance: ['Tração 4x4', 'Modos de terreno', 'Suspensão preparada para off-road'],
			security: ['Controle de tração', 'Assistente em descidas', 'Monitoramento de estabilidade'],
			technology: ['Sistema multimídia', 'Câmeras de apoio', 'Conectividade embarcada'],
			comfort: ['Interior resistente', 'Boa altura do solo', 'Espaço para passageiros'],
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
					<button className="back-button" onClick={() => navigate('/search')}>
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
					<button className="back-button" onClick={() => navigate('/search')}>
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

						<button className="compare-button" onClick={handleCompare}>
							Comparar Modelo
						</button>
					</div>
				</section>

				<section className="specs-grid">
					<SpecCard label="Motor" value={car.specs.engine} />
					<SpecCard label="Potência" value={car.specs.power} />
					<SpecCard label="Tipo" value={car.specs.type} />
					<SpecCard label="Consumo" value={car.specs.consumption} />
				</section>

				<section className="details-section">
					<Accordion
						title="Performance"
						items={car.sections.performance}
						open={openSection === 'performance'}
						onClick={() => toggleSection('performance')}
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
					/>

					<Accordion
						title="Conforto"
						items={car.sections.comfort}
						open={openSection === 'comfort'}
						onClick={() => toggleSection('comfort')}
					/>
				</section>
			</div>
		</main>
	);
}

function SpecCard({ label, value }) {
	return (
		<div className="spec-card">
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}

function Accordion({ title, items, open, onClick }) {
	return (
		<div className="accordion">
			<button onClick={onClick}>
				<span>{title}</span>
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