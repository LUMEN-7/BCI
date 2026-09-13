import React from 'react';
import {
  IoCarSportOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoRepeatOutline,
  IoPlayOutline,
  IoTrashOutline,
  IoAlarmOutline,
} from 'react-icons/io5';

export function ScheduledListSection({
  scheduledList,
  recurrenceOptions,
  handleRunNow,
  handleToggleStatus,
  handleDeleteSchedule,
  setActiveTab,
}) {
  return (
    <div className="scheduled-list-view">
      {scheduledList.length > 0 ? (
        <div className="scheduled-cards-grid">
          {scheduledList.map((item) => {
            const formattedDate = item.date
              ? new Date(`${item.date}T00:00:00`).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Data não definida';

            const recLabel =
              recurrenceOptions.find((r) => r.id === item.recurrence)?.label ||
              'Uma única vez';

            return (
              <article
                key={item.id}
                className={`scheduled-card-item ${!item.active ? 'is-paused' : ''}`}
              >
                <div className="scheduled-card-thumb">
                  {item.carImage ? (
                    <img src={item.carImage} alt={item.carName} />
                  ) : (
                    <IoCarSportOutline />
                  )}
                </div>

                <div className="scheduled-card-body">
                  <div className="scheduled-card-header">
                    <div>
                      <span className="scheduled-card-brand">{item.carBrand || 'FORD'}</span>
                      <h4>{item.carName}</h4>
                    </div>

                    <span className={`scheduled-status-badge ${item.active ? 'active' : 'paused'}`}>
                      {item.active ? 'Agendado' : 'Pausado'}
                    </span>
                  </div>

                  <div className="scheduled-card-meta">
                    <div className="meta-item">
                      <IoCalendarOutline />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="meta-item">
                      <IoTimeOutline />
                      <span>{item.time || '09:00'}</span>
                    </div>
                    <div className="meta-item">
                      <IoRepeatOutline />
                      <span>{recLabel}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="scheduled-card-notes">"{item.notes}"</p>
                  )}

                  <div className="scheduled-card-actions">
                    <button
                      type="button"
                      className="scheduled-action-run"
                      onClick={(e) => handleRunNow(item, e)}
                      title="Buscar agora no catálogo"
                    >
                      <IoPlayOutline />
                      <span>Buscar agora</span>
                    </button>

                    <button
                      type="button"
                      className="scheduled-action-toggle"
                      onClick={(e) => handleToggleStatus(item.id, e)}
                      title={item.active ? 'Pausar pesquisa' : 'Ativar pesquisa'}
                    >
                      {item.active ? 'Pausar' : 'Ativar'}
                    </button>

                    <button
                      type="button"
                      className="scheduled-action-delete"
                      onClick={(e) => handleDeleteSchedule(item.id, e)}
                      title="Excluir agendamento"
                      aria-label="Excluir agendamento"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="scheduled-empty-state">
          <div className="empty-icon-wrap">
            <IoCalendarOutline />
          </div>
          <h4>Nenhuma pesquisa agendada</h4>
          <p>
            Programe buscas recorrentes ou alertas de novidades para modelos específicos do catálogo.
          </p>
          <button
            type="button"
            className="schedule-empty-create-btn"
            onClick={() => setActiveTab('NEW')}
          >
            <IoAlarmOutline />
            <span>Criar primeiro agendamento</span>
          </button>
        </div>
      )}
    </div>
  );
}