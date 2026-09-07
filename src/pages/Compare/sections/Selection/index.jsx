import {
	IoAddOutline,
	IoCarSportOutline,
	IoCloseOutline,
	IoSwapHorizontalOutline,
} from 'react-icons/io5';

import './style.css';

export default function Selection({ firstCar, secondCar, activeSlot, canCompare, setActiveSlot, removeCar, onCompare }) {
	return (
		<section className="selected-section">
			<div className="selected-section-header">
				<div><span className="section-eyebrow">SUA SELEÇÃO</span><h2>Escolha os modelos</h2></div>
				<div className="selection-status"><span className={`status-dot ${firstCar ? 'status-dot-active' : ''}`} /><span>{firstCar ? '1' : '0'} de 2 selecionados</span></div>
			</div>
			<div className="selected-area">
				<SelectedSlot label="Modelo 1" car={firstCar} active={activeSlot === 'first'} onClick={() => setActiveSlot('first')} onRemove={() => removeCar('first')} />
				<div className="vs-wrapper"><div className="vs-line" /><button type="button" className={`vs-circle ${canCompare ? 'vs-circle-ready' : ''}`} onClick={onCompare} disabled={!canCompare} aria-label="Comparar modelos"><span>VS</span><IoSwapHorizontalOutline /></button><div className="vs-line" /></div>
				<SelectedSlot label="Modelo 2" car={secondCar} active={activeSlot === 'second'} onClick={() => setActiveSlot('second')} onRemove={() => removeCar('second')} />
			</div>
		</section>
	);
}

function SelectedSlot({ label, car, active, onClick, onRemove }) {
	return (
		<button type="button" className={`slot-card ${active ? 'slot-card-active' : ''} ${car ? 'slot-card-filled' : 'slot-card-empty'}`} onClick={onClick}>
			{car ? <><div className="slot-image-wrapper">{car.image ? <img src={car.image} alt={car.name} /> : <IoCarSportOutline />}</div><div className="slot-info"><span className="slot-label">{label}</span><strong>{car.name}</strong><div className="slot-meta"><span>{car.engine}</span><span>{car.power}</span><span>{car.type}</span></div></div><button type="button" className="remove-button" onClick={(event) => { event.stopPropagation(); onRemove(); }} aria-label={`Remover ${car.name}`}><IoCloseOutline /></button></> : <div className="empty-slot"><div className="empty-slot-icon"><IoCarSportOutline /></div><div><span>{label}</span><strong>Adicionar modelo</strong></div><IoAddOutline className="empty-slot-add" /></div>}
		</button>
	);
}