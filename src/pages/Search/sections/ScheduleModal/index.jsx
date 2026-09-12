import { useEffect, useMemo, useState } from 'react';
import {
  IoAlarmOutline,
  IoCalendarOutline,
  IoCarSportOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCloseOutline,
  IoNotificationsOutline,
  IoPlayOutline,
  IoRepeatOutline,
  IoSearchOutline,
  IoTimeOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import {
  deleteScheduledSearch,
  getScheduledSearches,
  saveScheduledSearch,
  toggleScheduledSearchStatus,
} from '@/utils/scheduledSearchesStorage';
import { mockCars } from '@/pages/Compare/data';
import { getRecentViewedCars } from '@/utils/recentViewedCars';
import { getFavoriteCars } from '@/utils/savedItemsStorage';

import './style.css';

const RECURRENCE_OPTIONS = [
  { id: 'once', label: 'Uma única vez' },
  { id: 'daily', label: 'Diariamente' },
  { id: 'weekly', label: 'Semanalmente' },
  { id: 'monthly', label: 'Mensalmente' },
];

export default function ScheduleModal({
  isOpen,
  onClose,
  availableCars = [],
  initialSelectedCar = null,
  onExecuteScheduledSearch,
}) {
  const [activeTab, setActiveTab] = useState('NEW'); // 'NEW' | 'LIST'
  const [scheduledList, setScheduledList] = useState([]);

  // Form states
  const [selectedCarId, setSelectedCarId] = useState('');
  const [carSearch, setCarSearch] = useState('');
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [recurrence, setRecurrence] = useState('once');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Consolidação de veículos disponíveis para seleção (garante lista rica sempre)
  const allCars = useMemo(() => {
    const map = new Map();
    const sourceLists = [
      availableCars,
      getFavoriteCars(),
      getRecentViewedCars(10),
      mockCars,
    ];

    sourceLists.forEach((list) => {
      if (Array.isArray(list)) {
        list.forEach((c) => {
          if (!c) return;
          const id = String(c.id || c.linhagemId || '');
          if (id && !map.has(id)) {
            map.set(id, {
              id,
              modelo: c.modelo || c.name || `Veículo ${id}`,
              brand: c.brand || c.marca || 'Ford',
              image: c.image || c.imagemUrl || null,
              ano: c.ano || c.year || '',
              segment: c.segment || c.categoria || c.type || 'Veículo',
            });
          }
        });
      }
    });

    return Array.from(map.values());
  }, [availableCars]);

  // Hoje no formato YYYY-MM-DD para min date
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // Sincroniza lista de agendamentos
  const refreshScheduledList = () => {
    setScheduledList(getScheduledSearches());
  };

  useEffect(() => {
    if (isOpen) {
      refreshScheduledList();
      if (initialSelectedCar) {
        setSelectedCarId(String(initialSelectedCar.id));
        setIsCarDropdownOpen(false);
      } else if (!selectedCarId && allCars.length > 0) {
        setSelectedCarId(String(allCars[0].id));
      }

      // Default date para amanhã se vazio
      if (!date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialSelectedCar, allCars]);

  useEffect(() => {
    window.addEventListener('scheduled-searches-updated', refreshScheduledList);
    window.addEventListener('storage', refreshScheduledList);
    return () => {
      window.removeEventListener('scheduled-searches-updated', refreshScheduledList);
      window.removeEventListener('storage', refreshScheduledList);
    };
  }, []);

  const selectedCar = useMemo(() => {
    return allCars.find((c) => String(c.id) === String(selectedCarId)) || allCars[0] || null;
  }, [allCars, selectedCarId]);

  const filteredCars = useMemo(() => {
    const term = carSearch.toLowerCase().trim();
    if (!term) return allCars;
    return allCars.filter((c) => {
      const name = c.modelo || c.name || '';
      const brand = c.brand || '';
      const seg = c.segment || '';
      return (
        name.toLowerCase().includes(term) ||
        brand.toLowerCase().includes(term) ||
        seg.toLowerCase().includes(term)
      );
    });
  }, [allCars, carSearch]);

  const handleSelectCar = (car) => {
    setSelectedCarId(String(car.id));
    setIsCarDropdownOpen(false);
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedCar) {
      setFormError('Selecione um modelo de veículo para a pesquisa.');
      return;
    }

    if (!date) {
      setFormError('Escolha a data da pesquisa.');
      return;
    }

    if (!time) {
      setFormError('Escolha o horário da pesquisa.');
      return;
    }

    saveScheduledSearch({
      carId: selectedCar.id,
      carName: selectedCar.modelo || selectedCar.name || 'Veículo',
      carBrand: selectedCar.brand || 'Ford',
      carImage: selectedCar.image || null,
      date,
      time,
      recurrence,
      notes: notes.trim(),
    });

    setSuccessToast(`Pesquisa agendada para ${selectedCar.modelo || selectedCar.name}!`);
    setTimeout(() => {
      setSuccessToast('');
      setActiveTab('LIST');
    }, 1200);
  };

  const handleDeleteSchedule = (id, e) => {
    e.stopPropagation();
    deleteScheduledSearch(id);
    refreshScheduledList();
  };

  const handleToggleStatus = (id, e) => {
    e.stopPropagation();
    toggleScheduledSearchStatus(id);
    refreshScheduledList();
  };

  const handleRunNow = (item, e) => {
    e.stopPropagation();
    onExecuteScheduledSearch?.(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="schedule-modal-backdrop" onClick={onClose}>
      <div
        className="schedule-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="schedule-modal-title"
      >
        {/* TOAST INTERNO DE CONFIRMAÇÃO */}
        {successToast && (
          <div className="schedule-modal-toast">
            <IoCheckmarkCircleOutline />
            <span>{successToast}</span>
          </div>
        )}

        {/* HEADER DO MODAL */}
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
                {scheduledList.length > 0 && (
                  <span className="schedule-tab-count">{scheduledList.length}</span>
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

        {/* CORPO DO MODAL */}
        <div className="schedule-modal-body">
          {activeTab === 'NEW' ? (
            <form className="schedule-form" onSubmit={handleSubmit}>
              {formError && (
                <div className="schedule-error-alert" role="alert">
                  <span>{formError}</span>
                </div>
              )}

              {/* SELEÇÃO DO MODELO ESPECÍFICO */}
              <div className="schedule-field-group">
                <div className="schedule-field-header">
                  <label className="schedule-field-label">
                    <IoCarSportOutline />
                    <span>Modelo do Veículo</span>
                  </label>
                  <button
                    type="button"
                    className="schedule-change-model-link"
                    onClick={() => setIsCarDropdownOpen((prev) => !prev)}
                  >
                    {isCarDropdownOpen ? 'Recolher lista' : 'Trocar / Escolher outro modelo'}
                  </button>
                </div>

                <div className="car-selector-box">
                  {selectedCar ? (
                    <div
                      className={`car-selected-preview ${isCarDropdownOpen ? 'is-expanded' : ''}`}
                      onClick={() => setIsCarDropdownOpen((prev) => !prev)}
                      role="button"
                      tabIndex={0}
                      title="Clique para escolher outro modelo"
                    >
                      <div className="car-preview-thumb">
                        {selectedCar.image ? (
                          <img src={selectedCar.image} alt={selectedCar.modelo || selectedCar.name} />
                        ) : (
                          <IoCarSportOutline />
                        )}
                      </div>
                      <div className="car-preview-info">
                        <span className="car-preview-brand">{selectedCar.brand || 'FORD'}</span>
                        <strong>{selectedCar.modelo || selectedCar.name}</strong>
                        <small>
                          {selectedCar.segment || 'Veículo'}
                          {selectedCar.ano ? ` · ${selectedCar.ano}` : ''}
                        </small>
                      </div>
                      <div className="car-selector-toggle-btn">
                        <span>{isCarDropdownOpen ? 'Fechar' : 'Alterar'}</span>
                        {isCarDropdownOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="car-selected-placeholder"
                      onClick={() => setIsCarDropdownOpen(true)}
                    >
                      <IoCarSportOutline />
                      <span>Clique para selecionar um modelo de veículo</span>
                      <IoChevronDownOutline />
                    </button>
                  )}

                  {/* PAINEL DE SELEÇÃO DE MODELOS */}
                  {isCarDropdownOpen && (
                    <div className="car-dropdown-panel">
                      <div className="car-dropdown-search">
                        <IoSearchOutline />
                        <input
                          type="text"
                          placeholder="Buscar por nome, marca ou categoria..."
                          value={carSearch}
                          onChange={(e) => setCarSearch(e.target.value)}
                          autoFocus
                        />
                        {carSearch && (
                          <button
                            type="button"
                            className="car-search-clear-btn"
                            onClick={() => setCarSearch('')}
                          >
                            <IoCloseOutline />
                          </button>
                        )}
                      </div>

                      <div className="car-dropdown-list">
                        {filteredCars.length > 0 ? (
                          filteredCars.map((car) => {
                            const isCur = String(car.id) === String(selectedCar?.id);
                            return (
                              <button
                                type="button"
                                key={car.id}
                                className={`car-dropdown-item ${isCur ? 'is-selected' : ''}`}
                                onClick={() => handleSelectCar(car)}
                              >
                                <div className="item-thumb">
                                  {car.image ? (
                                    <img src={car.image} alt={car.modelo || car.name} />
                                  ) : (
                                    <IoCarSportOutline />
                                  )}
                                </div>
                                <div className="item-info">
                                  <span className="item-brand">{car.brand}</span>
                                  <strong>{car.modelo || car.name}</strong>
                                  <small>
                                    {car.segment || 'Veículo'}
                                    {car.ano ? ` · ${car.ano}` : ''}
                                  </small>
                                </div>
                                {isCur ? (
                                  <span className="item-badge is-active">
                                    <IoCheckmarkOutline />
                                    <span>Selecionado</span>
                                  </span>
                                ) : (
                                  <span className="item-badge">Escolher</span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="car-dropdown-empty">
                            <p>Nenhum modelo encontrado para "{carSearch}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DATA E HORA */}
              <div className="schedule-grid-row">
                <div className="schedule-field-group">
                  <label htmlFor="schedule-date" className="schedule-field-label">
                    <IoCalendarOutline />
                    <span>Data</span>
                  </label>
                  <div className="schedule-input-wrapper">
                    <input
                      id="schedule-date"
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="schedule-field-group">
                  <label htmlFor="schedule-time" className="schedule-field-label">
                    <IoTimeOutline />
                    <span>Horário</span>
                  </label>
                  <div className="schedule-input-wrapper">
                    <input
                      id="schedule-time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* RECORRÊNCIA */}
              <div className="schedule-field-group">
                <label className="schedule-field-label">
                  <IoRepeatOutline />
                  <span>Frequência da Pesquisa</span>
                </label>
                <div className="recurrence-pills">
                  {RECURRENCE_OPTIONS.map((opt) => (
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

              {/* OBSERVAÇÕES / NOTAS OPCIONAIS */}
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

              {/* FOOTER DO FORMULÁRIO */}
              <div className="schedule-form-footer">
                <button
                  type="button"
                  className="schedule-cancel-btn"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="schedule-submit-btn"
                >
                  <IoAlarmOutline />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          ) : (
            /* LISTAGEM DE AGENDAMENTOS EXISTENTES */
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
                      RECURRENCE_OPTIONS.find((r) => r.id === item.recurrence)?.label ||
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
          )}
        </div>
      </div>
    </div>
  );
}
