import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileEditPanel from '../../components/ProfileEditPanel/ProfileEditPanel'
import NotificationButton from '../../components/NotificationButton/NotificationButton'
import './Notifications.css'

interface Notification {
  id: string
  petName: string
  petImage: string
  type: string
  medicationName: string
  frequency: string
  isActive: boolean
}

const Notifications: React.FC = () => {
  const navigate = useNavigate()

  // Demo notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      petName: 'Kiwi',
      petImage: '/images/kiwi.png',
      type: 'Medication',
      medicationName: 'Cortizol',
      frequency: '2 times at day',
      isActive: false,
    },
    {
      id: '2',
      petName: 'Kiwi',
      petImage: '/images/kiwi.png',
      type: 'Medication',
      medicationName: 'Cortizol',
      frequency: '2 times at day',
      isActive: true,
    },
    {
      id: '3',
      petName: 'Kiwi',
      petImage: '/images/kiwi.png',
      type: 'Medication',
      medicationName: 'Cortizol',
      frequency: '2 times at day',
      isActive: true,
    },
    {
      id: '4',
      petName: 'Kiwi',
      petImage: '/images/kiwi.png',
      type: 'Medication',
      medicationName: 'Cortizol',
      frequency: '2 times at day',
      isActive: true,
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const filteredNotifications = notifications.filter((notification) =>
    notification.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.medicationName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <div className="notifications-layout">
        {/* Mobile View */}
        <div className="notifications-mobile">
          <div className="notifications-container">
            <div className="notifications-content">
              <button className="back-button" onClick={handleBackClick}>
                ← Back
              </button>

              <div className="notifications-header">
                <h1>Notifications</h1>
              </div>

              <div className="search-container">
                <div className="search-bar">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="search-icon"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-btn"
                      onClick={handleClearSearch}
                      type="button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="items-count">
                {filteredNotifications.length} items
              </div>

              <div className="notifications-list">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="notification-card">
                    <div className="notification-pet-image">
                      <img
                        src={notification.petImage}
                        alt={notification.petName}
                      />
                    </div>
                    <div className="notification-content">
                      <div className="notification-header-row">
                        <h3 className="notification-pet-name">
                          {notification.petName}
                        </h3>
                        <div
                          className={`notification-bell ${
                            notification.isActive ? 'active' : ''
                          }`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={
                              notification.isActive ? '#6A3FFC' : '#1a202c'
                            }
                            strokeWidth="2"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          {notification.isActive && (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="#6A3FFC"
                              className="bell-plus"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="notification-type">{notification.type}</p>
                      <p className="notification-medication">
                        {notification.medicationName}
                      </p>
                      <p className="notification-frequency">
                        {notification.frequency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="notifications-desktop">
          <div className="notifications-left-panel">
            <ProfileEditPanel />
          </div>

          <div className="notifications-right-panel">
            <button
              className="back-button-desktop-right"
              onClick={handleBackClick}
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="notifications-content-desktop">
              <div className="notifications-header-desktop">
                <h1>Notifications</h1>
              </div>

              <div className="search-container-desktop">
                <div className="search-bar-desktop">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="search-icon"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-btn"
                      onClick={handleClearSearch}
                      type="button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="items-count-desktop">
                {filteredNotifications.length} items
              </div>

              <div className="notifications-grid">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="notification-card">
                    <div className="notification-pet-image">
                      <img
                        src={notification.petImage}
                        alt={notification.petName}
                      />
                    </div>
                    <div className="notification-content">
                      <div className="notification-header-row">
                        <h3 className="notification-pet-name">
                          {notification.petName}
                        </h3>
                        <div
                          className={`notification-bell ${
                            notification.isActive ? 'active' : ''
                          }`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={
                              notification.isActive ? '#6A3FFC' : '#1a202c'
                            }
                            strokeWidth="2"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          {notification.isActive && (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="#6A3FFC"
                              className="bell-plus"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="notification-type">{notification.type}</p>
                      <p className="notification-medication">
                        {notification.medicationName}
                      </p>
                      <p className="notification-frequency">
                        {notification.frequency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationButton />
    </>
  )
}

export default Notifications

