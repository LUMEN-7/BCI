import { IoArrowForward, IoSearchOutline } from 'react-icons/io5';

import './style.css';

export default function EmptyState({ onClear }) {
    return (
        <section className="empty-state">
            <div className="empty-icon"><IoSearchOutline /></div>
            <span className="section-label">NENHUM RESULTADO</span>
            <h2>NENHUM MODELO ENCONTRADO.</h2>
            <p>Não encontramos veículos para os filtros selecionados. Tente alterar sua pesquisa.</p>
            <button type="button" className="empty-button" onClick={onClear}>
                LIMPAR FILTROS
                <IoArrowForward />
            </button>
        </section>
    );
}
