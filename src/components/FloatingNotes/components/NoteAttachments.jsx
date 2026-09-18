import { IoCloseOutline } from 'react-icons/io5';
import { getNoteImage } from '@/utils/noteAttachments';
import VehicleCard from './VehicleCard';

/** Exibe anexos de uma nota nos modos de edição e visualização. */
export default function NoteAttachments({
  cars = [],
  images = [],
  editable = false,
  onNavigateCar,
  onPreviewImage,
  onRemoveCar,
  onRemoveImage,
}) {
  if (!cars.length && !images.length) return null;

  if (!editable) {
    return (
      <>
        {cars.length > 0 && (
          <div className="note-card-cars-grid">
            {cars.map((car) => (
              <VehicleCard key={car.id} car={car} onNavigate={onNavigateCar} />
            ))}
          </div>
        )}
        {images.length > 0 && (
          <div className="note-card-images-grid">
            {images.map((image) => {
              const { id, url, name } = getNoteImage(image);
              return (
                <button
                  key={id}
                  type="button"
                  className="note-card-image-item"
                  onClick={() => onPreviewImage(image)}
                  title="Clique para expandir"
                >
                  <img src={url} alt={name} />
                </button>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="notes-attachments-preview">
      {cars.length > 0 && (
        <div className="attachment-row">
          <span className="attachment-label">Veículos vinculados:</span>
          <div className="attached-vehicles-list">
            {cars.map((car) => (
              <VehicleCard key={car.id} car={car} onNavigate={onNavigateCar} onRemove={onRemoveCar} />
            ))}
          </div>
        </div>
      )}
      {images.length > 0 && (
        <div className="attachment-row">
          <span className="attachment-label">Imagens anexadas:</span>
          <div className="attachment-thumbs-list">
            {images.map((image) => {
              const { id, url, name } = getNoteImage(image, 'Foto');
              return (
                <div key={id} className="attachment-thumb-card" onClick={() => onPreviewImage(image)} title="Clique para expandir">
                  <img src={url} alt={name} />
                  <button
                    type="button"
                    className="attachment-thumb-remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveImage(id);
                    }}
                    title="Remover imagem"
                  >
                    <IoCloseOutline />
                  </button>
                  <span className="attachment-thumb-name">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
