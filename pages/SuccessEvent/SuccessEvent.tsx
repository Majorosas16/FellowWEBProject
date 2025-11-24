import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import "./SuccessEvent.css";

const SuccessEvent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("petId");
  const petName = searchParams.get("petName");
  const eventType = searchParams.get("eventType");

  const pets = useSelector((state: RootState) => state.pets.pets);
  const pet = pets.find((p) => String(p.id) === String(petId));
  const petImage = pet?.image;

  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="success-event-container">
      <div className="success-event-content">
        <div className="success-event-header">
          <h1 className="success-event-title">{petName}</h1>
          <h2 className="success-event-subtitle">
            successful {eventType === "medicine" ? "medicine" : "event"}!
          </h2>
        </div>
        <div className="success-event-image">
          <div className="pet-image-circle">
            <img
              src={petImage}
              alt={petName || "Pet"}
              className="success-pet-image"
            />
          </div>
        </div>
        <div className="success-event-actions">
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessEvent;
