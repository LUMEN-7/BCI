import React from 'react';
import { IoAlarmOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useScheduleModal, RECURRENCE_OPTIONS } from './hooks/useScheduleModal';
import { HeaderSection } from './sections/HeaderSection';
import { VehicleSelectorSection } from './sections/VehicleSelectorSection';
import { DateTimeSection } from './sections/DateTimeSection';
import { RecurrenceSection } from './sections/RecurrenceSection';
import { NotesSection } from './sections/NotesSection';
import { ScheduledListSection } from './sections/ScheduledListSection';
import './style.css';

export default function ScheduleModal(props) {
  const { isOpen, onClose } = props;
  const { state, actions } = useScheduleModal(props);

  if (!isOpen) return null;

  return (
    <div className="schedule-modal-backdrop" onClick={onClose}>
      <div
        className="schedule-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="schedule-modal-title"
      >
        {state.successToast && (
          <div className="schedule-modal-toast">
            <IoCheckmarkCircleOutline />
            <span>{state.successToast}</span>
          </div>
        )}

        <HeaderSection
          activeTab={state.activeTab}
          scheduledListCount={state.scheduledList.length}
          setActiveTab={actions.setActiveTab}
          onClose={onClose}
        />

        <div className="schedule-modal-body">
          {state.activeTab === 'NEW' ? (
            <form className="schedule-form" onSubmit={actions.handleSubmit}>
              {state.formError && (
                <div className="schedule-error-alert" role="alert">
                  <span>{state.formError}</span>
                </div>
              )}

              <VehicleSelectorSection
                selectedCar={state.selectedCar}
                isUnreleased={state.isUnreleased}
                unreleasedName={state.unreleasedName}
                unreleasedBrand={state.unreleasedBrand}
                unreleasedYear={state.unreleasedYear}
                brandOptions={state.brandOptions}
                isCarDropdownOpen={state.isCarDropdownOpen}
                carSearch={state.carSearch}
                filteredCars={state.filteredCars}
                setIsUnreleased={actions.setIsUnreleased}
                setUnreleasedName={actions.setUnreleasedName}
                setUnreleasedBrand={actions.setUnreleasedBrand}
                setUnreleasedYear={actions.setUnreleasedYear}
                setIsCarDropdownOpen={actions.setIsCarDropdownOpen}
                setCarSearch={actions.setCarSearch}
                handleSelectCar={actions.handleSelectCar}
              />

              <DateTimeSection
                date={state.date}
                time={state.time}
                todayStr={state.todayStr}
                setDate={actions.setDate}
                setTime={actions.setTime}
              />

              <RecurrenceSection
                recurrence={state.recurrence}
                setRecurrence={actions.setRecurrence}
                recurrenceOptions={RECURRENCE_OPTIONS}
              />

              <NotesSection
                notes={state.notes}
                setNotes={actions.setNotes}
              />

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
            <ScheduledListSection
              scheduledList={state.scheduledList}
              recurrenceOptions={RECURRENCE_OPTIONS}
              handleRunNow={actions.handleRunNow}
              handleToggleStatus={actions.handleToggleStatus}
              handleDeleteSchedule={actions.handleDeleteSchedule}
              setActiveTab={actions.setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
}