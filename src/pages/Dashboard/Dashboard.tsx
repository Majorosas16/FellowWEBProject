import React from "react";
import { useSelector } from "react-redux";
import LeftNavigation from "../../components/LeftNavigation/LeftNavigation";
import HealthEventCard from "../../components/HealthEventCard/HealthEventCard";
import MedicationCard from "../../components/MedicationCard/MedicationCard";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import "./Dashboard.css";
import type { RootState } from "../../redux/store";
import { useFetchPets } from "../../hook/useFetchPets";
import { useFetchEvents } from "../../hook/useFetchEvents";
import { useAuthUser } from "../../hook/useAuthUser";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  // Fetch de mascotas y eventos
  useFetchPets();
  useFetchEvents();

  const pets = useSelector((state: RootState) => state.pets.pets);
  const events = useSelector((state: RootState) => state.events.events);
  const user = useAuthUser();
  const navigate = useNavigate();

  // Ordenar mascotas por fecha creada (más recientes primero)
  const sortedPets = [...pets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Filtrar eventos por tipo
  const healthEvents = events
    .filter((e) => e.type === "event")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const medications = events
    .filter((e) => e.type === "medicine")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard-layout">
      <LeftNavigation pets={sortedPets} />

      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* HEADER */}
          <div className="dashboard-header">
            <div className="dashboard-header-text">
              <h2 className="dashboard-title">Hi, {user?.name || "User"}</h2>
              <p className="dashboard-subtitle">How is your day?</p>
            </div>
            <img
              src="/images/Calendar.png"
              alt="Calendar"
              className="calendar-icon"
              onClick={() => navigate("/calendar")}
            />
          </div>

          {/* SECCIONES */}
          <div className="dashboard-sections">
            {/* --- HEALTH EVENTS --- */}
            <div className="section">
              <h3 className="section-title">Health events</h3>
              <div className="scrollable-cards">
                {healthEvents.length > 0 ? (
                  healthEvents.map((event) => {
                    const pet = pets.find((p) => p.id === event.petId);
                    return (
                      <HealthEventCard
                        key={event.id}
                        petName={pet?.name || "Unknown Pet"}
                        petImage={pet?.image || "/images/pet-placeholder.png"}
                        event={event.description}
                        date={new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      />
                    );
                  })
                ) : (
                  <p className="no-events-text">
                    No health events recorded yet
                  </p>
                )}
              </div>
            </div>

            {/* --- MEDICATION EVENTS --- */}
            <div className="section">
              <h3 className="section-title">Medication</h3>
              <div className="scrollable-cards">
                {medications.length > 0 ? (
                  medications.map((med) => {
                    const pet = pets.find((p) => p.id === med.petId);
                    return (
                      <MedicationCard
                        key={med.id}
                        petName={pet?.name || "Unknown Pet"}
                        petImage={pet?.image || "/images/pet-placeholder.png"}
                        medication={med.description}
                        onSkip={() =>
                          console.log("Skipped medication:", med.id)
                        }
                        onTaken={() => console.log("Medication taken:", med.id)}
                      />
                    );
                  })
                ) : (
                  <p className="no-events-text">
                    No medication events recorded yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <NotificationButton />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
