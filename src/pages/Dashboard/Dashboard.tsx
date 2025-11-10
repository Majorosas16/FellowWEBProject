import React from "react";
import { useSelector } from "react-redux";
import LeftNavigation from "../../components/LeftNavigation/LeftNavigation";
import HealthEventCard from "../../components/HealthEventCard/HealthEventCard";
import MedicationCard from "../../components/MedicationCard/MedicationCard";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import "./Dashboard.css";
import type { RootState } from "../../redux/store";
import { useFetchPets } from "../../hook/useFetchPets";
import { useAuthUser } from "../../hook/useAuthUser";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  useFetchPets();
  const pets = useSelector((state: RootState) => state.pets.pets);
  console.log(pets);
  const user = useAuthUser();
  console.log(user);

  const navigate = useNavigate();

  const healthEvents = [
    {
      petName: "Pepe",
      petImage: "/images/cat-tabby.webp",
      event: "Vomited",
      date: "10/07/2025",
    },
    {
      petName: "Oscar",
      petImage: "/images/dog-golden-retriever.webp",
      event: "Checkup",
      date: "09/07/2025",
    },
  ];

  const medications = [
    {
      petName: "Pepe",
      petImage: "/images/cat-tabby.webp",
      medication: "Cortizol",
      onSkip: () => console.log("Skip medication"),
      onTaken: () => console.log("Medication taken"),
    },
    {
      petName: "Pepe",
      petImage: "/images/cat-tabby.webp",
      medication: "Supplement",
      onSkip: () => console.log("Skip supplement"),
      onTaken: () => console.log("Supplement taken"),
    },
  ];

  const sortedPets = [...pets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="dashboard-layout">
      <LeftNavigation pets={sortedPets} />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-header-text">
              <h2 className="dashboard-title">
                Hi, {user?.name || "User"}
              </h2>
              <p className="dashboard-subtitle">How is your day?</p>
            </div>
            <img
              src="/images/Calendar.png"
              alt="Calendar"
              className="calendar-icon"
              onClick={() => navigate("/calendar")}
            />
          </div>
          <div className="dashboard-sections">
            <div className="section">
              <h3 className="section-title">Health events</h3>
              <div className="scrollable-cards">
                {healthEvents.map((event, index) => (
                  <HealthEventCard
                    key={index}
                    petName={event.petName}
                    petImage={event.petImage}
                    event={event.event}
                    date={event.date}
                  />
                ))}
              </div>
            </div>
            <div className="section">
              <h3 className="section-title">Medication</h3>
              <div className="scrollable-cards">
                {medications.map((med, index) => (
                  <MedicationCard
                    key={index}
                    petName={med.petName}
                    petImage={med.petImage}
                    medication={med.medication}
                    onSkip={med.onSkip}
                    onTaken={med.onTaken}
                  />
                ))}
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
