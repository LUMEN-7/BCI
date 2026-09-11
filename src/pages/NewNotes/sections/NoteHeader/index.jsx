import { IoDocumentTextOutline, IoPricetagOutline } from 'react-icons/io5';
import './style.css';

export default function NoteHeader({ title, setTitle, tag, setTag }) {
    return (
        <div className="note-heading">
            <div className="note-heading-icon">
                <IoDocumentTextOutline />
            </div>

            <input
                type="text"
                className="note-title-input"
                placeholder="Título da anotação"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />

            <div className="note-meta">
                <IoPricetagOutline />
                <input
                    type="text"
                    placeholder="Adicionar tag..."
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                />
            </div>
        </div>
    );
}