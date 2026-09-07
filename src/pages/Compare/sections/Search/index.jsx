import { IoCloseCircleOutline, IoSearchOutline } from 'react-icons/io5';

import './style.css';

export default function Search({ activeSlot, search, setSearch }) {
	return (
		<section className="search-section">
			<div className="search-header">
				<div><span className="section-eyebrow">SELECIONAR MODELO</span><h2>Buscar para <strong>{activeSlot === 'first' ? 'modelo 1' : 'modelo 2'}</strong></h2></div>
				<span className="search-hint">{activeSlot === 'first' ? 'Primeiro veículo' : 'Segundo veículo'}</span>
			</div>
			<div className="search-box"><div className="search-icon"><IoSearchOutline /></div><input type="text" placeholder="Pesquise por marca, modelo, motor ou tipo..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Limpar busca"><IoCloseCircleOutline /></button>}</div>
		</section>
	);
}