import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PetSelection.css'

interface Pet {
  id: string
  name: string
  image: string
  type: 'cat' | 'dog'
}

/**
 * PetSelection page component
 * First step in event creation flow - select which pet the event is for
 */
const PetSelection: React.FC = () => {
  const navigate = useNavigate()
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  // Mock data - same pets from dashboard
  const pets: Pet[] = [
    {
      id: '1',
      name: 'Pepe',
      image: '/images/cat-tabby.webp',
      type: 'cat'
    },
    {
      id: '2',
      name: 'Caneli',
      image: '/images/dog-golden-retriever.webp',
      type: 'dog'
    }
  ]

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet)
  }

  const handleContinue = () => {
    if (selectedPet) {
      navigate(`/event-type?petId=${selectedPet.id}&petName=${selectedPet.name}`)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="pet-selection-container">
      <div className="pet-selection-content">
        <div className="pet-selection-header">
          <h1 className="pet-selection-title">Who is the event for?</h1>
        </div>

        <div className="pet-selection-options">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className={`pet-option ${selectedPet?.id === pet.id ? 'selected' : ''}`}
              onClick={() => handlePetSelect(pet)}
            >
              <div className={`pet-option-image ${pet.type}-image`}>
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="pet-selection-image"
                />
              </div>
              <h3 className="pet-option-name">{pet.name}</h3>
            </div>
          ))}
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
  )
}

export default PetSelection
