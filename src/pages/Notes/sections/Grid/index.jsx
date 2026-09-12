import { useRef, useState } from "react";
import {
  IoAddOutline,
  IoCarSportOutline,
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoChevronUpOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoTrashOutline,
} from "react-icons/io5";
import MarkdownRenderer from "../../../../components/FloatingNotes/MarkdownRenderer";
import "./style.css";

export default function NotesGrid({
  notes,
  search,
  onDelete,
  onOpen,
  onCreate,
}) {
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const sliderRef = useRef(null);

  const toggleExpand = (id, e) => {
    e?.stopPropagation();
    setExpandedNoteId((prev) => (prev === id ? null : id));
  };

  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "prev" ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePromptDelete = (note, e) => {
    e?.stopPropagation();
    setDeletingNote(note);
  };

  const handleConfirmDelete = () => {
    if (deletingNote) {
      onDelete(deletingNote.id);
      if (expandedNoteId === deletingNote.id) {
        setExpandedNoteId(null);
      }
      setDeletingNote(null);
    }
  };

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
            : "Comece criando sua primeira anotação."}
        </p>
        {!search && (
          <button
            type="button"
            className="empty-create-button"
            onClick={onCreate}
          >
            <IoAddOutline />
            Criar primeira nota
          </button>
        )}
      </section>
    );

  return (
    <div className="notes-slider-wrapper">
      {/* Side Arrow Navigation Buttons */}
      <button
        type="button"
        className="notes-side-arrow prev"
        onClick={() => slide("prev")}
        aria-label="Anotações anteriores"
        title="Ver anotações anteriores"
      >
        <IoChevronBackOutline />
      </button>

      <section className="notes-grid" ref={sliderRef}>
        {notes.map((note) => {
          const isExpanded = expandedNoteId === note.id;
          const rawContent = note.rawNote?.content || note.description || "";

          return (
            <article
              key={note.id}
              className={`note-card ${isExpanded ? "is-expanded" : ""}`}
              onClick={(e) => toggleExpand(note.id, e)}
            >
              <div className="note-card-top">
                <div className="note-icon">
                  <IoDocumentTextOutline />
                </div>

                <div className="note-card-top-actions">
                  <span className="note-expand-pill">
                    {isExpanded ? (
                      <>
                        <span>Recolher</span>
                        <IoChevronUpOutline />
                      </>
                    ) : (
                      <>
                        <span>Expandir</span>
                        <IoChevronDownOutline />
                      </>
                    )}
                  </span>

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

                {!isExpanded ? (
                  <p className="note-snippet-text">
                    {rawContent
                      ? rawContent.replace(/[#*`_>\[\]\(\)]/g, "").slice(0, 120)
                      : "Sem conteúdo..."}
                  </p>
                ) : (
                  <div
                    className="note-expanded-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MarkdownRenderer content={rawContent} />
                  </div>
                )}
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
                  onClick={(e) => toggleExpand(note.id, e)}
                >
                  <span>{isExpanded ? "Recolher conteúdo" : "Ver conteúdo completo"}</span>
                  {isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <button
        type="button"
        className="notes-side-arrow next"
        onClick={() => slide("next")}
        aria-label="Próximas anotações"
        title="Ver próximas anotações"
      >
        <IoChevronForwardOutline />
      </button>

      {/* Confirmation Modal Without Alert */}
      {deletingNote && (
        <div
          className="notes-page-modal-backdrop"
          onClick={() => setDeletingNote(null)}
        >
          <div
            className="notes-page-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="delete-modal-icon">
              <IoTrashOutline />
            </div>
            <h3>Excluir anotação?</h3>
            <p>
              Você está prestes a excluir <strong>"{deletingNote.title}"</strong>. Essa ação não poderá ser desfeita.
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
    </div>
  );
}
