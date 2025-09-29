import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './EventType.css'

type EventType = 'medicine' | 'generic'

/**
 * EventType page component
 * Second step in event creation flow - select if it's a medicine or generic event
 */
const EventType: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedType, setSelectedType] = useState<EventType | null>(null)

  const petId = searchParams.get('petId')
  const petName = searchParams.get('petName')

  const handleTypeSelect = (type: EventType) => {
    setSelectedType(type)
  }

  const handleContinue = () => {
    if (selectedType && petId && petName) {
      if (selectedType === 'medicine') {
        navigate(`/medicine-event?petId=${petId}&petName=${petName}`)
      } else {
        navigate(`/generic-event?petId=${petId}&petName=${petName}`)
      }
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="event-type-container">
      <div className="event-type-content">
        <div className="event-type-header">
          <h1 className="event-type-title">What event is this?</h1>
        </div>

        <div className="event-type-options">
          <div
            className={`event-option ${selectedType === 'medicine' ? 'selected' : ''}`}
            onClick={() => handleTypeSelect('medicine')}
          >
            <div className="event-option-icon medicine-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
              </svg>
            </div>
            <h3 className="event-option-label">Medicine</h3>
          </div>

          <div
            className={`event-option ${selectedType === 'generic' ? 'selected' : ''}`}
            onClick={() => handleTypeSelect('generic')}
          >
            <div className="event-option-icon generic-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="event-option-label">Event</h3>
          </div>
        </div>

        <div className="event-type-actions">
          <button
            className="continue-button"
            onClick={handleContinue}
            disabled={!selectedType}
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

export default EventType
