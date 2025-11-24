import React from "react";
import "./PetCard.css";

interface PetCardProps {
  name: string;
  age: string;
  vaccines: string;
  medicines: string;
  image: string;
  color: string;
}

const PetCard: React.FC<PetCardProps> = ({
  name,
  age,
  vaccines,
  medicines,
  image,
  color,
}) => {
  return (
    <div className="pet-card">
      {/* Imagen circular con fondo de color */}
      <div className="pet-avatar" style={{ backgroundColor: color }}>
        <img src={image} alt={name} className="pet-photo" />
      </div>

      {/* Información de la mascota */}
      <div className="pet-info">
        <h3 className="pet-name">{name}</h3>
        <p className="pet-age">{age}</p>
        <p className="pet-vaccines">{vaccines}</p>
        <p
          className={`pet-medicines ${
            medicines === "Without medication" ? "no-meds" : ""
          }`}
        >
          {medicines}
        </p>
      </div>
    </div>
  );
};

export default PetCard;
