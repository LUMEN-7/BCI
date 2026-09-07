import { IoSwapHorizontalOutline } from 'react-icons/io5';

import './style.css';

export default function Footer({ canCompare, onCompare }) {
	return <footer className="compare-footer"><div className="footer-info"><span className={`footer-indicator ${canCompare ? 'ready' : ''}`} /><p>{canCompare ? 'Pronto para comparar os dois modelos' : 'Selecione dois modelos para continuar'}</p></div><button type="button" className="compare-button" disabled={!canCompare} onClick={onCompare}>Comparar modelos<IoSwapHorizontalOutline /></button></footer>;
}