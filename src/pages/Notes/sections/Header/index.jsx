import { IoAddOutline } from "react-icons/io5";
import "./style.css";

export default function NotesHeader({ onCreate }) {
  return (
    <header className="notes-header">
      <div className="notes-heading">
        <span className="notes-eyebrow">Workspace</span>
        <h1>Anotações</h1>
        <p>
          Organize ideias, observações e análises dos veículos em um espaço
          simples e visual.
        </p>
      </div>
      <button type="button" className="new-note-button" onClick={onCreate}>
        <IoAddOutline />
        <span>Nova nota</span>
      </button>
    </header>
  );
}
