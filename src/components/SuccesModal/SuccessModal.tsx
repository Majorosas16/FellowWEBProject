import React from 'react'
import Button from '../Button'
import './SuccessModal.css'

export interface SuccessModalProps {
  petName: string
  petImage?: string
  petType: 'cat' | 'dog'
  onContinue: () => void
}

/**
 * Success modal component displayed after pet registration
 * Shows confirmation message with pet details
 */
const SuccessModal: React.FC<SuccessModalProps> = ({
  petName,
  petImage,
  onContinue,
}) => {
  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-modal-content">
          <div className="success-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>

          <h2 className="success-title">{petName}</h2>
          <p className="success-subtitle">Successful register!</p>

          {petImage && (
            <div className="success-pet-image">
              <img src={petImage} alt={petName} />
            </div>
          )}

          <Button variant="primary" text="Continue" onClick={onContinue} />
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
