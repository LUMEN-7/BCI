import { IoNotificationsOutline } from 'react-icons/io5';

export function NotesSection({ notes, setNotes }) {
  return (
    <div className="schedule-field-group">
      <label htmlFor="schedule-notes" className="schedule-field-label">
        <IoNotificationsOutline />
        <span>Foco da pesquisa (Opcional)</span>
      </label>
      <div className="schedule-input-wrapper">
        <input
          id="schedule-notes"
          type="text"
          placeholder="Ex: Verificar atualizações de versões, preços ou concorrentes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={140}
        />
      </div>
    </div>
  );
}
