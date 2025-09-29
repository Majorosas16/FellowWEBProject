// import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventModal.css'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * EventModal component
 * Modal that opens when notification button is clicked
 * Provides quick access to create events
 */
const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleCreateEvent = () => {
    onClose()
    navigate('/pet-selection')
  }

  if (!isOpen) return null

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <h2>Create Event</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="event-modal-body">
          <p>Quickly add a new event or medication for your pets</p>
          
          <button 
            className="create-event-button"
            onClick={handleCreateEvent}
          >
            Start Creating Event
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventModal
