import React from 'react';
import { IoAlarmOutline, IoCloseOutline } from 'react-icons/io5';

export function HeaderSection({ activeTab, scheduledListCount, setActiveTab, onClose }) {
  return (
    <header className="schedule-modal-header">
      <div className="schedule-modal-title">
        <div className="schedule-icon-badge">
          <IoAlarmOutline />
        </div>
        <div>
          <span className="schedule-eyebrow">PESQUISA PROGRAMADA</span>
          <h3 id="schedule-modal-title">Agendar Pesquisa</h3>
        </div>
      </div>

      <div className="schedule-header-right">
        <div className="schedule-tabs-switch">
          <button
            type="button"
            className={`schedule-tab-btn ${activeTab === 'NEW' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('NEW')}
          >
            Novo Agendamento
          </button>
          <button
            type="button"
            className={`schedule-tab-btn ${activeTab === 'LIST' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('LIST')}
          >
            <span>Agendados</span>
            {scheduledListCount > 0 && (
              <span className="schedule-tab-count">{scheduledListCount}</span>
            )}
          </button>
        </div>

        <button
          type="button"
          className="schedule-close-btn"
          onClick={onClose}
          aria-label="Fechar modal de agendamento"
        >
          <IoCloseOutline />
        </button>
      </div>
    </header>
  );
}