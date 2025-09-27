import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  addMonths, 
  subMonths,
  isToday,
  isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import './Calendar.css';

// Definición de tipos
interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener el primer y último día del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Obtener todos los días del mes
  const daysInMonth: Date[] = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  // Calcular días vacíos al inicio del mes para alineación
  const startDay: number = getDay(monthStart);
  const emptyDays: number[] = Array.from({ length: startDay }, (_, i: number) => i);

  // Navegación entre meses
  const goToPreviousMonth = (): void => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = (): void => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Manejar selección de fecha
  const handleDateClick = (date: Date): void => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const monthYear: string = format(currentDate, 'MMM yyyy', { locale: es }).toUpperCase();

  return (
    <div className="calendar-container">
      {/* Header del calendario */}
      <div className="calendar-header">
        <button className="nav-button" onClick={goToPreviousMonth}>
          <span className="nav-arrow">‹</span>
        </button>
        <h2 className="month-year">{monthYear}</h2>
        <button className="nav-button" onClick={goToNextMonth}>
          <span className="nav-arrow">›</span>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="weekdays">
        {(['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const).map((day: string, index: number) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="days-grid">
        {/* Días vacíos al inicio */}
        {emptyDays.map((_: number, index: number) => (
          <div key={`empty-${index}`} className="day-cell empty"></div>
        ))}
        
        {/* Días del mes */}
        {daysInMonth.map((day: Date) => {
          const dayNumber: string = format(day, 'd');
          const isCurrentDay: boolean = isToday(day);
          const isSelected: boolean = selectedDate ? isSameDay(day, selectedDate) : false;
          
          return (
            <button
              key={day.toISOString()}
              className={`day-cell ${isCurrentDay ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {dayNumber.padStart(2, '0')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;