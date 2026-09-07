import { IoAddOutline, IoArrowForwardOutline, IoDocumentTextOutline, IoTrashOutline } from 'react-icons/io5';
import './style.css';

export default function NotesGrid({ notes, search, onDelete, onOpen, onCreate }) {
	if (!notes.length) return <section className="notes-empty"><div className="notes-empty-icon"><IoDocumentTextOutline /></div><h2>Nenhuma anotação encontrada</h2><p>{search ? 'Tente buscar por outro termo.' : 'Comece criando sua primeira anotação.'}</p>{!search && <button type="button" className="empty-create-button" onClick={onCreate}><IoAddOutline />Criar primeira nota</button>}</section>;
	return <section className="notes-grid">{notes.map((note) => <article key={note.id} className="note-card"><div className="note-card-top"><div className="note-icon"><IoDocumentTextOutline /></div><button type="button" className="delete-note-button" onClick={() => onDelete(note.id)} aria-label={`Excluir nota ${note.title}`}><IoTrashOutline /></button></div><div className="note-content"><div className="note-meta"><span className="note-tag">{note.tag}</span><span className="note-date">{note.date}</span></div><h2>{note.title}</h2><p>{note.description}</p></div><button type="button" className="note-open-button" onClick={() => onOpen(note.id)}><span>Ver nota</span><IoArrowForwardOutline /></button></article>)}</section>;
}
