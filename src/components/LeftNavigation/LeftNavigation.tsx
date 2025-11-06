import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LeftNavigation.css';

interface Pet {
  id: string;
  name: string;
  image: string;
  date: string;
  status: string;
}

const petsData: Pet[] = [
  {
    id: '1',
    name: 'Toby',
    image: '/images/toby.jpg', // Ajusta estos paths según tu proyecto
    date: '10/07/2025',
    status: 'Vomited',
  },
  {
    id: '2',
    name: 'Luna',
    image: '/images/luna.jpg',
    date: '10/07/2025',
    status: 'No updates',
  },
  {
    id: '3',
    name: 'Oli',
    image: '/images/oli.jpg',
    date: '10/07/2025',
    status: 'Break the leg',
  },
];

const LeftNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside className="your-pets">

      <div className="pets-section">
      <div className="logo-container">
        <img src="../src/assets/LogoWEB.png" alt="Fellow Logo" className="logo-fellow-img" />
      </div>
      <h2 className="pets-title">Your pets ({petsData.length})</h2>
      <div className="pets-list">
        {petsData.map((pet) => (
          <div
            key={pet.id}
            className={`pet-item${hoveredId === pet.id ? ' pet-item--hover' : ''}${pet.name === 'Oli' ? ' pet-item--highlight' : ''}`}
            onMouseEnter={() => setHoveredId(pet.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img src={pet.image} alt={pet.name} className="pet-image" />
            <div className="pet-info">
              <div className="pet-header">
                <span className="pet-name">{pet.name}</span>
                <span className="pet-date">{pet.date}</span>
              </div>
              <span className="pet-status">{pet.status}</span>
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="add-pet-container">
      <button className="add-pet-btn" onClick={() => navigate('/add-pet')}>
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

