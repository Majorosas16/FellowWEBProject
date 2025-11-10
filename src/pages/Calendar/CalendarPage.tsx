import React, { useState } from "react";
import { useSelector } from "react-redux";
import LeftNavigation from "../../components/LeftNavigation/LeftNavigation";
import Calendar from "../../components/Calendar/Calendar";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import { useFetchPets } from "../../hook/useFetchPets";
import type { RootState } from "../../redux/store";
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
  // Fetch de mascotas
  useFetchPets();
  const pets = useSelector((state: RootState) => state.pets.pets);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Datos de ejemplo para las citas
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2025-01-24",
      time: "11:00",
      person: "Pepe",
      description: "Vomited yellow",
      color: "#7159c7",
    },
    {
      id: 2,
      date: "2025-01-24",
      time: "13:00",
      person: "Oli",
      description: "Vomited yellow",
      color: "#7159c7",
    },
    {
      id: 3,
      date: "2025-01-24",
      time: "17:00",
      person: "Kiwi",
      description: "Vomited yellow",
      color: "#7159c7",
    },
  ]);

  // Función para manejar la fecha seleccionada
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

  // Ordena las mascotas por fecha creada (más recientes primero)
  const sortedPets = [...pets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="calendar-layout">
      <LeftNavigation pets={sortedPets} />
      <main className="calendar-content">
        <div className="calendar-column">
          <div className="calendar-container">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            <section className="appointments-section">
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
            </section>
          </div>
        </div>
        <NotificationButton />
      </main>
    </div>
  );
};

export default CalendarPage;