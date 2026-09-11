import {
    IoAddOutline,
    IoTextOutline,
    IoDocumentTextOutline,
    IoImageOutline,
    IoCarSportOutline,
    IoRemoveOutline,
} from 'react-icons/io5';
import './style.css';

export default function AddBlock({ showMenu, onToggleMenu, onAddBlock }) {
    return (
        <div className="add-block-container">
            <button type="button" className="add-block-button" onClick={onToggleMenu}>
                <IoAddOutline />
                Adicionar bloco
            </button>

            {showMenu && (
                <div className="block-menu">
                    <button type="button" onClick={() => onAddBlock('text')}>
                        <span><IoTextOutline /></span>
                        <div>
                            <strong>Texto</strong>
                            <small>Escreva uma anotação</small>
                        </div>
                    </button>

                    <button type="button" onClick={() => onAddBlock('heading')}>
                        <span><IoDocumentTextOutline /></span>
                        <div>
                            <strong>Seção</strong>
                            <small>Crie um título</small>
                        </div>
                    </button>

                    <button type="button" onClick={() => onAddBlock('image')}>
                        <span><IoImageOutline /></span>
                        <div>
                            <strong>Imagem</strong>
                            <small>Adicione uma imagem</small>
                        </div>
                    </button>

                    <button type="button" onClick={() => onAddBlock('vehicle')}>
                        <span><IoCarSportOutline /></span>
                        <div>
                            <strong>Veículo</strong>
                            <small>Insira um carro</small>
                        </div>
                    </button>

                    <button type="button" onClick={() => onAddBlock('divider')}>
                        <span><IoRemoveOutline /></span>
                        <div>
                            <strong>Divisor</strong>
                            <small>Separar conteúdos</small>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}