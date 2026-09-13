import React from 'react';
import { IoRepeatOutline } from 'react-icons/io5';

export function RecurrenceSection({ recurrence, setRecurrence, recurrenceOptions }) {
  return (
    <div className="schedule-field-group">
      <label className="schedule-field-label">
        <IoRepeatOutline />
        <span>Frequência da Pesquisa</span>
      </label>
      <div className="recurrence-pills">
        {recurrenceOptions.map((opt) => (
          <button
            type="button"
            key={opt.id}
            className={`recurrence-pill ${recurrence === opt.id ? 'is-active' : ''}`}
            onClick={() => setRecurrence(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}