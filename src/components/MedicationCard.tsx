import React from "react";
import "./MedicationCard.css";

export interface MedicationCardProps {
  petName: string;
  petImage: string;
  medication: string;
  onSkip: () => void;
  onTaken: () => void;
  className?: string;
}

/**
 * Medication card component for displaying pet medications
 * Shows pet image, medication name, and action buttons
 */
const MedicationCard: React.FC<MedicationCardProps> = ({
  petName,
  petImage,
  medication,
  onSkip,
  onTaken,
  className = "",
}) => {
  return (
    <div className={`medication-card ${className}`}>
      <div className="pet-image-container">
        <img src={petImage} alt={petName} className="pet-image" />
      </div>
      <div className="medication-details">
        <h4 className="medication-name">{medication}</h4>
        <div className="medication-actions">
          <button className="skip-button" onClick={onSkip}>
            Skip
          </button>
          <button className="taken-button" onClick={onTaken}>
            Taken
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
