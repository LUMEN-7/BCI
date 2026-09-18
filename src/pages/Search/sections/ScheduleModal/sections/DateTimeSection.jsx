import { IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';

export function DateTimeSection({ date, time, todayStr, setDate, setTime }) {
  return (
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
  );
}
