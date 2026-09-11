import {
    IoAddOutline,
    IoTrashOutline,
    IoDocumentTextOutline,
    IoImageOutline,
    IoCarSportOutline,
    IoChevronDownOutline,
    IoRemoveOutline,
} from 'react-icons/io5';
import './style.css';

export default function BlockRenderer({
    block,
    index,
    vehicle,
    onUpdate,
    onRemove,
    onAddAfter,
    onOpenImagePicker,
    onOpenVehiclePicker,
}) {
    return (
        <div className="editor-block-wrapper">
            <div className="block-hover-actions">
                <button type="button" onClick={() => onAddAfter(index, 'text')} title="Adicionar bloco">
                    <IoAddOutline />
                </button>
            </div>

            {block.type === 'heading' && (
                <div className="editor-block heading-block">
                    <div className="block-type-icon">
                        <IoDocumentTextOutline />
                    </div>
                    <input
                        type="text"
                        value={block.content}
                        onChange={(event) => onUpdate(block.id, { content: event.target.value })}
                        placeholder="Título da seção"
                        className="heading-input"
                    />
                    <button type="button" className="remove-block-button" onClick={() => onRemove(block.id)}>
                        <IoTrashOutline />
                    </button>
                </div>
            )}

            {block.type === 'text' && (
                <div className="editor-block text-block">
                    <textarea
                        value={block.content}
                        onChange={(event) => onUpdate(block.id, { content: event.target.value })}
                        placeholder="Escreva alguma coisa..."
                        rows={1}
                        onInput={(event) => {
                            event.target.style.height = 'auto';
                            event.target.style.height = `${event.target.scrollHeight}px`;
                        }}
                    />
                    <button type="button" className="remove-block-button" onClick={() => onRemove(block.id)}>
                        <IoTrashOutline />
                    </button>
                </div>
            )}

            {block.type === 'image' && (
                <div className="editor-block image-block">
                    {block.src ? (
                        <div className="uploaded-image-wrapper">
                            <img src={block.src} alt={block.alt || 'Imagem da nota'} />
                            <div className="image-overlay">
                                <button type="button" onClick={() => onOpenImagePicker(block.id)}>
                                    <IoImageOutline /> Trocar imagem
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" className="image-upload-area" onClick={() => onOpenImagePicker(block.id)}>
                            <span className="image-upload-icon"><IoImageOutline /></span>
                            <strong>Adicionar imagem</strong>
                            <small>Clique para selecionar uma imagem</small>
                        </button>
                    )}
                    <button type="button" className="remove-block-button" onClick={() => onRemove(block.id)}>
                        <IoTrashOutline />
                    </button>
                </div>
            )}

            {block.type === 'vehicle' && (
                <div className="editor-block vehicle-block">
                    {vehicle ? (
                        <div className="vehicle-note-card">
                            <div className="vehicle-note-image">
                                <img src={vehicle.image} alt={vehicle.name} />
                            </div>
                            <div className="vehicle-note-info">
                                <span>{vehicle.brand}</span>
                                <h3>{vehicle.name}</h3>
                                <div className="vehicle-note-specs">
                                    <span>{vehicle.engine}</span>
                                    <span>{vehicle.power}</span>
                                    <span>{vehicle.type}</span>
                                </div>
                            </div>
                            <button type="button" className="change-vehicle-button" onClick={() => onOpenVehiclePicker(block.id)}>
                                Trocar
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="vehicle-placeholder" onClick={() => onOpenVehiclePicker(block.id)}>
                            <span><IoCarSportOutline /></span>
                            <div>
                                <strong>Adicionar veículo</strong>
                                <small>Insira um veículo salvo na sua anotação</small>
                            </div>
                            <IoChevronDownOutline />
                        </button>
                    )}
                    <button type="button" className="remove-block-button" onClick={() => onRemove(block.id)}>
                        <IoTrashOutline />
                    </button>
                </div>
            )}

            {block.type === 'divider' && (
                <div className="editor-block divider-block">
                    <div />
                    <button type="button" className="remove-block-button" onClick={() => onRemove(block.id)}>
                        <IoTrashOutline />
                    </button>
                </div>
            )}
        </div>
    );
}