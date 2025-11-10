import React, { useState } from "react";
import { useSelector } from "react-redux";
import LeftNavigation from "../../components/LeftNavigation/LeftNavigation";
import Calendar from "../../components/Calendar/Calendar";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import { useFetchPets } from "../../hook/useFetchPets";
import { useFetchEvents } from "../../hook/useFetchEvents";
import type { RootState } from "../../redux/store";
import "./CalendarPage.css";

interface Appointment {
  id: string;
  date: string;
  time: string;
  person: string;
  description: string;
  color: string;
}

const CalendarPage: React.FC = () => {
  useFetchPets();
  useFetchEvents(); // 👈 Nuevo hook para escuchar eventos en tiempo real

  const pets = useSelector((state: RootState) => state.pets.pets);
  const events = useSelector((state: RootState) => state.events.events);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
  };

  // 🎨 Convertir los eventos a formato visual de calendario
  const formattedAppointments: Appointment[] = events.map((event) => {
    const pet = pets.find((p) => p.id === event.petId);
    const color = event.type === "medicine" ? "#ffb347" : "#7159c7"; // color distinto por tipo

    return {
      id: event.id,
      date: event.date,
      time: event.time || "00:00",
      person: pet?.name || "Unknown Pet",
      description: event.description,
      color,
    };
  });

  const getAppointmentsForDate = (date: Date | null): Appointment[] => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return formattedAppointments.filter((a) => a.date === dateString);
  };

  const appointmentsToShow = getAppointmentsForDate(selectedDate);

  const sortedPets = [...pets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
                  {appointmentsToShow.map((appointment) => (
                    <div key={appointment.id} className="appointment-item">
                      <span className="appointment-time">
                        {appointment.time}
                      </span>
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
