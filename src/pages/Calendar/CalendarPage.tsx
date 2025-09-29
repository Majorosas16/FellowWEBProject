import React, { useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import "./CalendarPage.css";

// Definición de tipos
interface Appointment {
  id: number;
  date: string; // formato YYYY-MM-DD
  time: string;
  person: string;
  description: string;
  color: string;
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Datos de ejemplo para las citas
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2025-01-24", // Fecha de ejemplo
      time: "11:00",
      person: "Pepe",
      description: "Vomited",
      color: "#6366f1",
    },
    {
      id: 2,
      date: "2025-01-24",
      time: "12:00",
      person: "Oli",
      description: "jump from the third floor",
      color: "#6366f1",
    },
    {
      id: 3,
      date: "2025-01-24",
      time: "18:35",
      person: "Pepe",
      description: "got hurt",
      color: "#6366f1",
    },
    {
      id: 4,
      date: "2025-01-24",
      time: "20:00",
      person: "Luna",
      description: "take the Cortizol Med",
      color: "#6366f1",
    },
    {
      id: 5,
      date: "2025-01-25", // Otro día
      time: "09:00",
      person: "Max",
      description: "Checkup",
      color: "#6366f1",
    },
    {
      id: 6,
      date: "2025-01-26",
      time: "14:30",
      person: "Bella",
      description: "Vaccination",
      color: "#6366f1",
    },
  ]);

  // Función que se ejecuta cuando seleccionas una fecha
  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
  };

  // Filtrar citas por fecha seleccionada
  const getAppointmentsForDate = (date: Date | null): Appointment[] => {
    if (!date) return [];

    const dateString = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    return appointments.filter(
      (appointment) => appointment.date === dateString
    );
  };

  const appointmentsToShow = getAppointmentsForDate(selectedDate);

  return (
    <div className="calendar-page">
      {/* Header con notch space para móvil */}
      <div className="calendar-page-header">
        <div className="status-bar-space"></div>
      </div>

      {/* Contenedor principal */}
      <div className="calendar-container">
        {/* Componente Calendar */}
        <div className="calendar-section">
          <Calendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>

        {/* Lista de citas */}
        <div className="appointments-section">
          <div className="appointments-header">
            <h3>Booked Appointment List</h3>
          </div>

          {appointmentsToShow.length > 0 ? (
            <div className="appointments-list">
              {appointmentsToShow.map((appointment: Appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <span className="appointment-time">{appointment.time}</span>
                  <div
                    className="appointment-indicator"
                    style={{ backgroundColor: appointment.color }}
                  ></div>
                  <span className="appointment-person">
                    {appointment.person}:
                  </span>
                  <span className="appointment-description">
                    {appointment.description}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>No appointments scheduled for this date</p>
            </div>
          )}
        </div>
      </div>
      
      <NotificationButton />
    </div>
  );
};

export default CalendarPage
