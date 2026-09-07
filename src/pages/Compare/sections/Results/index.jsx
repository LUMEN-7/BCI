import { IoAddOutline, IoCarSportOutline, IoCheckmarkOutline } from 'react-icons/io5';

import './style.css';

export default function Results({ results, search, firstCar, secondCar, onSelect, onClear }) {
	return (
		<section className="results-section">
			<div className="results-header"><div><span className="section-eyebrow">MODELOS DISPONÍVEIS</span><h2>{search ? `${results.length} resultado${results.length !== 1 ? 's' : ''}` : 'Todos os modelos'}</h2></div></div>
			{results.length > 0 ? <div className="results-grid">{results.map((car) => <ResultCard key={car.id} car={car} selected={firstCar?.id === car.id || secondCar?.id === car.id} selectedSlot={firstCar?.id === car.id ? 'Modelo 1' : secondCar?.id === car.id ? 'Modelo 2' : null} onSelect={onSelect} />)}</div> : <EmptyResults onClear={onClear} />}
		</section>
	);
}

function ResultCard({ car, selected, selectedSlot, onSelect }) {
	return <button type="button" className={`result-card ${selected ? 'result-card-selected' : ''}`} onClick={() => onSelect(car)}><div className="result-image-wrapper">{car.image ? <img src={car.image} alt={car.name} /> : <IoCarSportOutline />}</div><div className="result-info"><span className="result-brand">{car.brand}</span><h3>{car.name}</h3><div className="result-specs"><span>{car.engine}</span><span>{car.power}</span><span>{car.type}</span></div></div><div className={`add-button ${selected ? 'add-button-selected' : ''}`}>{selected ? <IoCheckmarkOutline /> : <IoAddOutline />}</div>{selected && <span className="selected-label">{selectedSlot}</span>}</button>;
}

function EmptyResults({ onClear }) {
	return <div className="empty-box"><div className="empty-icon"><IoCarSportOutline /></div><h3>Nenhum modelo encontrado</h3><p>Tente pesquisar por outra marca, modelo, motor ou tipo de veículo.</p><button type="button" onClick={onClear}>Ver todos os modelos</button></div>;
}