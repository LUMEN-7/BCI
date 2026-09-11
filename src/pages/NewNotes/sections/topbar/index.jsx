import { IoArrowBackOutline, IoSaveOutline } from 'react-icons/io5';
import './style.css';

export default function Topbar({ blocksCount, onBack, onSave }) {
    return (
        <header className="new-note-topbar">
            <button type="button" className="new-note-back" onClick={onBack}>
                <IoArrowBackOutline />
                <span>Voltar</span>
            </button>

            <div className="new-note-actions">
                <span className="block-counter">
                    {blocksCount} {blocksCount === 1 ? 'bloco' : 'blocos'}
                </span>

                <button type="button" className="save-note-button" onClick={onSave}>
                    <IoSaveOutline />
                    Salvar nota
                </button>
            </div>
        </header>
    );
}