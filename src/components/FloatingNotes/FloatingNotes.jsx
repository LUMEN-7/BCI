import { useState } from "react";
import {
    IoCloseOutline,
    IoCreateOutline,
    IoSaveOutline,
} from "react-icons/io5";

import "./style.css";

export default function FloatingNotes() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTitle("");
        setContent("");
        setIsOpen(false);
    };

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            return;
        }

        // Por enquanto, apenas para testar o funcionamento.
        console.log("Nova anotação:", {
            title,
            content,
        });

        setTitle("");
        setContent("");
        setIsOpen(false);
    };

    return (
        <div className={`floating-notes ${isOpen ? "is-open" : ""}`}>
            {/* =====================================================
          NOTES PANEL
      ===================================================== */}

            <aside className="notes-panel">
                <div className="notes-panel-header">
                    <div className="notes-panel-title">
                        <div className="notes-icon">
                            <IoCreateOutline />
                        </div>

                        <div>
                            <span>BCI</span>
                            <h2>Nova anotação</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="notes-close-button"
                        onClick={handleClose}
                        aria-label="Fechar anotações"
                    >
                        <IoCloseOutline />
                    </button>
                </div>

                {/* ===================================================
            FORM
        =================================================== */}

                <div className="notes-form">
                    <div className="notes-field">
                        <label htmlFor="note-title">TÍTULO</label>

                        <input
                            id="note-title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Ex: Ponto importante"
                            maxLength={80}
                        />
                    </div>

                    <div className="notes-field notes-content-field">
                        <label htmlFor="note-content">ANOTAÇÃO</label>

                        <textarea
                            id="note-content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="Escreva sua anotação..."
                        />
                    </div>
                </div>

                {/* ===================================================
            ACTIONS
        =================================================== */}

                <div className="notes-footer">
                    <button
                        type="button"
                        className="notes-cancel-button"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="notes-save-button"
                        onClick={handleSave}
                        disabled={!title.trim() && !content.trim()}
                    >
                        <IoSaveOutline />
                        <span>Salvar</span>
                    </button>
                </div>
            </aside>

            {/* =====================================================
          FLOATING BUTTON
      ===================================================== */}

            <button
                type="button"
                className="floating-notes-button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Fechar nova anotação" : "Nova anotação"}
                aria-expanded={isOpen}
            >
                <IoCreateOutline />
            </button>
        </div>
    );
}