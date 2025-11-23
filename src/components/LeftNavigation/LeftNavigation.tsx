import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hook/useAuthUser";
import LogoFellow from "../../assets/LogoWEB.png"; // Ajusta la ruta según tu estructura
import "./LeftNavigation.css";

interface LeftNavigationPet {
  id?: string;
  name: string;
  image: string;
  createdAt: string;
  type: string;
}

interface LeftNavigationProps {
  pets: LeftNavigationPet[] | null;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ pets }) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const user = useAuthUser();

  const DEFAULT_IMAGES = {
    cat: "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-pet%2Fcat.png?alt=media&token=6ee9b4ac-cf43-46b2-ac9e-6ed0d6ed2041",
    dog: "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-pet%2Fdog.png?alt=media&token=ab846319-ee77-4dc0-98f4-7d2ac52af91a",
  };

  return (
    <aside className="your-pets">
      <div className="pets-section">
        <div className="logo-container">
          <img
            src={LogoFellow}
            alt="Fellow Logo"
            className="logo-fellow-img"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
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
                    src={
                      pet.image
                        ? pet.image
                        : pet.type === "dog"
                        ? DEFAULT_IMAGES.dog
                        : DEFAULT_IMAGES.cat
                    }
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
        <button className="add-pet-btn" onClick={() => navigate("/pet-type")}>
          Add a pet +
        </button>
      </div>
      <div className="profile-area" onClick={() => navigate("/profile")}>
        <img
          src="/images/carolina.jpg"
          alt={user?.name || "User"}
          className="profile-avatar"
        />
        <div className="profile-info">
          <span className="profile-name">{user?.name || "User"}</span>
          <span className="profile-email">
            {user?.email || "user@example.com"}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default LeftNavigation;
