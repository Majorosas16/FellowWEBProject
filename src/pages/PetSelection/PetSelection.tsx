import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useFetchPets } from "../../hook/useFetchPets";
import "./PetSelection.css";

interface Pet {
  id?: string;
  name: string;
  image: string;
  species?: string;
  createdAt: string;
}

const PetSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Fetch pets from Redux
  useFetchPets();
  const pets = useSelector((state: RootState) => state.pets.pets);
  console.log(pets); //doneee

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handleContinue = () => {
    if (selectedPet) {
      navigate(
        `/event-type?petId=${selectedPet.id}&petName=${selectedPet.name}`
      );
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="pet-selection-container">
      <div className="pet-selection-content">
        <div className="pet-selection-header">
          <h1 className="pet-selection-title">Who is the event for?</h1>
        </div>
        <div className="pet-selection-options">
          {pets && pets.length > 0 ? (
            pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-option ${
                  selectedPet?.id === pet.id ? "selected" : ""
                }`}
                onClick={() => handlePetSelect(pet)}
              >
                <div
                  className={`pet-option-image ${
                    pet.type === "cat" ? "cat-image" : "dog-image"
                  }`}
                >
                  <img
                    src={pet.image || "/images/placeholder.jpg"}
                    alt={pet.name}
                    className="pet-selection-image"
                  />
                </div>
                <h3 className="pet-option-name">{pet.name}</h3>
              </div>
            ))
          ) : (
            <p className="no-pets-message">
              No tienes mascotas aún. Agrega una primero.
            </p>
          )}
        </div>
        <div className="pet-selection-actions">
          <button
            className="continue-button"
            onClick={handleContinue}
            disabled={!selectedPet}
          >
            Continue
          </button>
        </div>
        <div className="cancel-link">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetSelection;
