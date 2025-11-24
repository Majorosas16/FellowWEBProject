import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
  isSameDay,
} from "date-fns";

import { es } from "date-fns/locale";

// 🔥 IMPORTACIÓN NUEVA: records diarios desde Redux
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import "./Calendar.css";

// Definición de tipos
interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  // Estado interno para manejar el mes actual visible
  const [currentDate, setCurrentDate] = useState(new Date());

  // 🔥 NUEVO: obtener estados diarios (taken/skip) desde Redux
  const dailyRecords = useSelector(
    (state: RootState) => state.medicineDaily.records
  );

  // Obtener el primer y último día del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Obtener todos los días del mes
  const daysInMonth: Date[] = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // Calcular días vacíos al inicio del mes para alineación
  const startDay: number = getDay(monthStart);
  const emptyDays: number[] = Array.from(
    { length: startDay },
    (_, i: number) => i
  );

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

  const monthYear: string = format(currentDate, "MMM yyyy", {
    locale: es,
  }).toUpperCase();

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
        {(["S", "M", "T", "W", "T", "F", "S"] as const).map(
          (day: string, index: number) => (
            <div key={index} className="weekday">
              {day}
            </div>
          )
        )}
      </div>

      {/* Grid de días */}
      <div className="days-grid">
        {/* Días vacíos al inicio */}
        {emptyDays.map((_: number, index: number) => (
          <div key={`empty-${index}`} className="day-cell empty"></div>
        ))}

        {/* Días del mes */}
        {daysInMonth.map((day: Date) => {
          // Número del día
          const dayNumber: string = format(day, "d");

          // 🔥 NUEVO: formato estándar (yyyy-MM-dd) para comparar con Redux
          const dateString: string = format(day, "yyyy-MM-dd");

          // Saber si es el día actual
          const isCurrentDay: boolean = isToday(day);

          // Saber si el usuario seleccionó este día
          const isSelected: boolean = selectedDate
            ? isSameDay(day, selectedDate)
            : false;

          // 🔥 NUEVO: buscar registros de ese día guardados en Redux
          const medsForThisDay = dailyRecords.filter(
            (r) => r.date === dateString
          );

          // 🔥 NUEVO: icono visual que se mostrará debajo del número del día
          let statusIcon: string | null = null;

          if (medsForThisDay.length > 0) {
            const hasTaken = medsForThisDay.some((r) => r.status === "taken");
            const hasSkip = medsForThisDay.some((r) => r.status === "skip");

            if (hasTaken && !hasSkip) statusIcon = "✓"; // Solo taken
            else if (hasSkip && !hasTaken) statusIcon = "✕"; // Solo skip
            else statusIcon = "⚠"; // Mezcla taken+skip
          }

          return (
            <button
              key={day.toISOString()}
              className={`day-cell ${isCurrentDay ? "today" : ""} ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              {/* Número del día */}
              {dayNumber.padStart(2, "0")}

              {statusIcon && <span className="day-status">{statusIcon}</span>}
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <div className="skipped-list-container">
          {(() => {
            const dateString = format(selectedDate, "yyyy-MM-dd");

            const skippedMeds = dailyRecords
              .filter((r) => r.date === dateString && r.status === "skip")
              .map((r) => r.medication); // Asegúrate de que en tu record guardas el nombre de la medicina

            if (skippedMeds.length === 0) {
              return (
                <p className="no-skipped">
                  No skipped medication for this date
                </p>
              );
            }

            return (
              <div>
                <h4 className="skipped-title">Skipped medication:</h4>
                <ul className="skipped-list">
                  {skippedMeds.map((med, idx) => (
                    <li key={idx}>{med}</li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
