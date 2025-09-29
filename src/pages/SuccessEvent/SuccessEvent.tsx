import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './SuccessEvent.css'

/**
 * SuccessEvent page component
 * Final step showing successful event creation with pet image
 */
const SuccessEvent: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const petId = searchParams.get('petId')
  const petName = searchParams.get('petName')
  const eventType = searchParams.get('eventType')

  // Mock data to get pet image based on petId
  const getPetImage = (petId: string | null) => {
    switch (petId) {
      case '1':
        return '/images/cat-tabby.webp'
      case '2':
        return '/images/dog-golden-retriever.webp'
      default:
        return '/images/cat-default.webp'
    }
  }

  const handleContinue = () => {
    navigate('/dashboard')
  }

  return (
    <div className="success-event-container">
      <div className="success-event-content">
        <div className="success-event-header">
          <h1 className="success-event-title">
            {petName}
          </h1>
          <h2 className="success-event-subtitle">
            successful {eventType === 'medicine' ? 'medicine' : 'event'}!
          </h2>
        </div>

        <div className="success-event-image">
          <div className="pet-image-circle">
            <img
              src={getPetImage(petId)}
              alt={petName || 'Pet'}
              className="success-pet-image"
            />
          </div>
        </div>

        <div className="success-event-actions">
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessEvent
