import React from 'react';
import './HealthEventCard.css';

export interface HealthEventCardProps {
  petName: string;
  petImage: string;
  event: string;
  date: string;
  className?: string;
}

/**
 * Health event card component for displaying pet health events
 * Shows pet image, name, event type, and date
 */
const HealthEventCard: React.FC<HealthEventCardProps> = ({
  petName,
  petImage,
  event,
  date,
  className = ''
}) => {
  return (
    <div className={`health-event-card ${className}`}>
      <div className="pet-image-container">
        <img src={petImage} alt={petName} className="pet-image" />
      </div>
      <div className="event-details">
        <h4 className="pet-name">{petName}</h4>
        <p className="event-type">{event}</p>
        <p className="event-date">{date}</p>
      </div>
    </div>
  );
};

export default HealthEventCard;
