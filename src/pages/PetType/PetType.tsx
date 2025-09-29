import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import './PetType.css'

export type PetType = 'cat' | 'dog' | 'skip'

/**
 * Pet type selection page component
 * Allows users to choose between Cat and Dog
 */
const PetType: React.FC = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<PetType | null>(null)

  const handleTypeSelect = (type: PetType) => {
    setSelectedType(type)
    // If user selects "skip", redirect immediately to dashboard
    if (type === 'skip') {
      navigate('/dashboard')
    }
  }

  const handleContinue = () => {
    if (selectedType === 'skip') {
      navigate('/dashboard')
    } else if (selectedType) {
      navigate(`/pet-registration?type=${selectedType}`)
    }
  }

  const handleBackClick = () => {
    navigate('/auth')
  }

  return (
    <div className="pet-type-container">
      <div className="pet-type-content">
        <div className="pet-type-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          <h1 className="pet-type-title">Register your pet!</h1>
        </div>

        <div className="pet-type-options">
          <div
            className={`pet-option ${selectedType === 'cat' ? 'selected' : ''}`}
            onClick={() => handleTypeSelect('cat')}
          >
            <div className="pet-option-image cat-image">
              <img
                src="/images/cat-default.webp"
                alt="Cat"
                className="pet-type-image"
              />
            </div>
            <h3 className="pet-option-title">Cat</h3>
          </div>

          <div
            className={`pet-option ${selectedType === 'dog' ? 'selected' : ''}`}
            onClick={() => handleTypeSelect('dog')}
          >
            <div className="pet-option-image dog-image">
              <img
                src="/images/dog-default.webp"
                alt="Dog"
                className="pet-type-image"
              />
            </div>
            <h3 className="pet-option-title">Dog</h3>
          </div>

          <div className="skip-text-container">
            <button
              className={`skip-text ${
                selectedType === 'skip' ? 'selected' : ''
              }`}
              onClick={() => handleTypeSelect('skip')}
            >
              Do it later
            </button>
          </div>
        </div>

        <div className="pet-type-actions">
          <Button
            variant="primary"
            text="Continue"
            onClick={handleContinue}
            disabled={!selectedType}
          />
        </div>
      </div>
    </div>
  )
}

export default PetType
