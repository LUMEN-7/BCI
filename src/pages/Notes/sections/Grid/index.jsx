import {
  IoCarSportOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoOpenOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import MarkdownRenderer from "@/components/FloatingNotes/components/MarkdownRenderer";
import useNotesGridController from "../../hooks/useNotesGridController";
import "./style.css";

export default function NotesGrid({ notes, search, onDelete }) {
  const {
    selectedNote,
    isEditingInModal,
    setIsEditingInModal,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    deletingNote,
    setDeletingNote,
    previewImage,
    setPreviewImage,
    toastMessage,
    handleOpenModal,
    handleCloseModal,
    handleStartEdit,
    handleSaveEdit,
    handlePromptDelete,
    handleConfirmDelete,
    handleNavigateCar,
  } = useNotesGridController({ onDelete });

  if (!notes.length)
    return (
      <section className="notes-empty">
        <div className="notes-empty-icon">
          <IoDocumentTextOutline />
        </div>
        <h2>Nenhuma anotação encontrada</h2>
        <p>
          {search
            ? "Tente buscar por outro termo."
            : "Use o botão de Anotações no canto da tela para criar sua primeira nota."}
        </p>
      </section>
    );

  return (
    <div className="notes-grid-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="notes-page-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <section className="notes-grid">
        {notes.map((note) => {
          const rawContent = note.rawNote?.content || note.description || "";

          return (
            <article
              key={note.id}
              className="note-card"
              onClick={() => handleOpenModal(note)}
            >
              <div className="note-card-top">
                <div className="note-icon">
                  <IoDocumentTextOutline />
                </div>

                <div className="note-card-top-actions">
                  <button
                    type="button"
                    className="delete-note-button"
                    onClick={(e) => handlePromptDelete(note, e)}
                    aria-label={`Excluir nota ${note.title}`}
                    title="Excluir nota"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>

              <div className="note-content">
                <div className="note-meta">
                  <span className="note-tag">{note.tag || "Anotação BCI"}</span>
                  <span className="note-date">{note.date}</span>
                </div>

                <h2>{note.title}</h2>

                <p className="note-snippet-text">
                  {rawContent
                    ? rawContent.replace(/[#*`_>\[\]\(\)]/g, "").slice(0, 120)
                    : "Sem conteúdo..."}
                </p>
              </div>

              <div className="note-card-bottom-bar">
                <div className="note-card-badges-row">
                  {note.rawNote?.savedCars?.length > 0 && (
                    <span className="note-badge-indicator" title="Veículos vinculados">
                      <IoCarSportOutline />
                      {note.rawNote.savedCars.length}
                    </span>
                  )}
                  {note.rawNote?.images?.length > 0 && (
                    <span className="note-badge-indicator" title="Imagens anexadas">
                      <IoImageOutline />
                      {note.rawNote.images.length}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="note-open-button"
                  onClick={() => handleOpenModal(note)}
                >
                  <span>Abrir anotação</span>
                  <IoOpenOutline />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Modal de Detalhes / Edição / Visualização da Nota */}
      {selectedNote && (
        <div className="note-detail-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="note-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="note-modal-title"
          >
            <header className="note-detail-modal-header">
              <div className="note-detail-modal-title">
                <div className="note-detail-modal-icon">
                  <IoDocumentTextOutline />
                </div>
                <div>
                  <span>Anotação</span>
                  <h3 id="note-modal-title">
                    {isEditingInModal ? "Editando Nota" : selectedNote.title || "Sem título"}
                  </h3>
                </div>
              </div>

              <div className="note-detail-modal-actions">
                {!isEditingInModal ? (
                  <>
                    <button
                      type="button"
                      className="note-modal-btn edit"
                      onClick={handleStartEdit}
                      title="Editar anotação"
                    >
                      <IoPencilOutline />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className="note-modal-btn delete"
                      onClick={(e) => handlePromptDelete(selectedNote, e)}
                      title="Excluir anotação"
                    >
                      <IoTrashOutline />
                      <span>Excluir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="note-modal-btn cancel"
                      onClick={() => setIsEditingInModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="note-modal-btn save"
                      onClick={handleSaveEdit}
                    >
                      Salvar
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="note-detail-modal-close"
                  onClick={handleCloseModal}
                  aria-label="Fechar modal"
                >
                  <IoCloseOutline />
                </button>
              </div>
            </header>

            <div className="note-detail-modal-body">
              {isEditingInModal ? (
                <div className="note-modal-edit-form">
                  <div className="note-modal-input-group">
                    <label htmlFor="modal-note-title">Título</label>
                    <input
                      id="modal-note-title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Título da anotação..."
                    />
                  </div>
                  <div className="note-modal-input-group flex-1">
                    <label htmlFor="modal-note-content">Conteúdo (Markdown)</label>
                    <textarea
                      id="modal-note-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Escreva sua anotação..."
                    />
                  </div>
                </div>
              ) : (
                <div className="note-detail-rendered-wrapper">
                  <div className="note-detail-meta-header">
                    <span className="note-tag">{selectedNote.tag || "Anotação BCI"}</span>
                    <span className="note-date">{selectedNote.date}</span>
                  </div>
                  <h2 className="note-detail-view-title">{selectedNote.title}</h2>
                  <div className="note-detail-markdown-content">
                    <MarkdownRenderer
                      content={selectedNote.rawNote?.content || selectedNote.description}
                      onNavigateCar={handleNavigateCar}
                      onImageClick={(img) => setPreviewImage(img)}
                    />

                    {selectedNote.rawNote?.savedCars?.length > 0 && (
                      <div className="note-card-cars-grid">
                        {selectedNote.rawNote.savedCars.map((car) => (
                          <div
                            key={car.id}
                            className="note-card-car-item"
                            onClick={() => handleNavigateCar(car.id)}
                            title="Ver ficha técnica"
                          >
                            <IoCarSportOutline />
                            <span>{car.name || car.model}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedNote.rawNote?.images?.length > 0 && (
                      <div className="note-card-images-grid">
                        {selectedNote.rawNote.images.map((img) => (
                          <div
                            key={img.id}
                            className="note-card-image-item"
                            onClick={() => setPreviewImage(img)}
                            title="Clique para expandir"
                          >
                            <img src={img.url} alt={img.name || "Imagem"} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deletingNote && (
        <div
          className="notes-delete-modal-backdrop"
          onClick={() => setDeletingNote(null)}
        >
          <div
            className="notes-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="notes-page-delete-title"
          >
            <div className="delete-modal-icon">
              <IoTrashOutline />
            </div>
            <h3 id="notes-page-delete-title">Excluir anotação?</h3>
            <p>
              Você está prestes a remover <strong>"{deletingNote.title || 'Sem título'}"</strong>. Essa ação não poderá ser desfeita.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => setDeletingNote(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="delete-modal-confirm"
                onClick={handleConfirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX DE IMAGEM */}
      {previewImage && (
        <div
          className="notes-image-lightbox-backdrop"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-label="Visualização de imagem"
        >
          <div
            className="notes-image-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="notes-image-lightbox-close"
              onClick={() => setPreviewImage(null)}
              aria-label="Fechar visualização"
            >
              <IoCloseOutline />
            </button>
            <img src={previewImage.url} alt={previewImage.name || 'Visualização da imagem'} />
            {previewImage.name && previewImage.name !== 'Foto' && (
              <span className="notes-image-lightbox-caption">{previewImage.name}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}