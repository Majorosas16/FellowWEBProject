import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LeftNavigation.css';

interface LeftNavigationPet {
  id?: string;
  name: string;
  image: string;
  createdAt: string;
}

interface LeftNavigationProps {
  pets: LeftNavigationPet[];
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ pets }) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside className="your-pets">
      <div className="pets-section">
        <div className="logo-container">
          <img src="../src/assets/LogoWEB.png" alt="Fellow Logo" className="logo-fellow-img" />
        </div>
        <h2 className="pets-title">Your pets ({pets.length})</h2>
        <div className="pets-list">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className={`pet-item${hoveredId === pet.id ? ' pet-item--hover' : ''}`}
              onMouseEnter={() => setHoveredId(pet.id || "")}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={pet.image || "/images/placeholder.jpg"}
                alt={pet.name}
                className="pet-image"
              />
              <div className="pet-info">
                <div className="pet-header">
                  <span className="pet-name">{pet.name}</span>
                  <span className="pet-date">
                    {pet.createdAt
                      ? new Date(pet.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <span className="pet-status">
                  No updates
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="add-pet-container">
        <button
          className="add-pet-btn"
          onClick={() => navigate('/add-pet')}
        >
          Add a pet +
        </button>
      </div>
      <div className="profile-area" onClick={() => navigate('/profile')}>
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
