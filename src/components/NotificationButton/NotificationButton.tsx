import React, { useState } from 'react'
import EventModal from '../EventModal/EventModal'
import './NotificationButton.css'

/**
 * NotificationButton component
 * A floating action button for notifications that appears on dashboard pages
 */
const NotificationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleNotificationClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <button className="notification-button" onClick={handleNotificationClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
      
      <EventModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default NotificationButton
