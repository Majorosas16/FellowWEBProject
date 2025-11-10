import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeftNavigation.css";

interface LeftNavigationPet {
  id?: string;
  name: string;
  image: string;
  createdAt: string;
}

interface LeftNavigationProps {
  pets: LeftNavigationPet[] | null;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ pets }) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside className="your-pets">
      <div className="pets-section">
        <div className="logo-container">
          <img
            src="../src/assets/LogoWEB.png"
            alt="Fellow Logo"
            className="logo-fellow-img"
          />
        </div>
        <h2 className="pets-title">
          {pets && pets.length > 0
            ? `Your pets (${pets.length})`
            : "Loading your pets..."}
        </h2>
        <div className="pets-list">
          {pets && pets.length > 0 ? (
            pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-item${
                  hoveredId === pet.id ? " pet-item--hover" : ""
                }`}
                onMouseEnter={() => setHoveredId(pet.id || "")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="pet-avatar-container">
                  <img
                    src={pet.image || "/images/placeholder.jpg"}
                    alt={pet.name}
                    className="pet-image"
                  />
                </div>
                <div className="pet-info">
                  <div className="pet-header">
                    <span className="pet-name">{pet.name}</span>
                    <span className="pet-date">
                      {pet.createdAt
                        ? new Date(pet.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <span className="pet-status">No updates</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-pets-message">
              Espera, tus mascotas ya aparecerán.
            </p>
          )}
        </div>
      </div>
      <div className="add-pet-container">
        <button className="add-pet-btn" onClick={() => navigate("/add-pet")}>
          Add a pet +
        </button>
      </div>
      <div className="profile-area" onClick={() => navigate("/profile")}>
        <img
          src="/images/carolina.jpg"
          alt="Carolina"
          className="profile-avatar"
        />
        <div className="profile-info">
          <span className="profile-name">Carolina</span>
          <span className="profile-email">Carolina145lopezg@gmail.com</span>
        </div>
      </div>
    </aside>
  );
};

export default LeftNavigation;
