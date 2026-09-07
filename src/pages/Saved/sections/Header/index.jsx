import { IoAlertCircleOutline, IoCarSportOutline, IoGitCompareOutline } from 'react-icons/io5';
import './style.css';

export default function SavedHeader({ activeTab, carCount, comparisonCount, onChangeTab }) {
	return <><header className="saved-header"><div><span className="saved-eyebrow">Minha coleção</span><h1>Salvos</h1><p>Acesse rapidamente seus veículos favoritos e comparações salvas.</p></div></header><div className="saved-tabs"><button type="button" className={activeTab === 'cars' ? 'active' : ''} onClick={() => onChangeTab('cars')}><IoCarSportOutline /><span>Modelos</span><strong>{carCount}</strong></button><button type="button" className={activeTab === 'comparisons' ? 'active' : ''} onClick={() => onChangeTab('comparisons')}><IoGitCompareOutline /><span>Comparações</span><strong>{comparisonCount}</strong></button></div></>;
}

export function SavedAttention() { return <div className="saved-attention"><div className="saved-attention-icon"><IoAlertCircleOutline /></div><div><strong>Atualizações disponíveis</strong><span>Alguns itens salvos possuem informações novas.</span></div></div>; }
