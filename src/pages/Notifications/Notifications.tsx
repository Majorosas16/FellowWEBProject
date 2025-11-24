import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { differenceInDays, parseISO, isPast, isToday } from 'date-fns'
import ProfileEditPanel from '../../components/ProfileEditPanel/ProfileEditPanel'
import NotificationButton from '../../components/NotificationButton/NotificationButton'
import { useFetchPets } from '../../hook/useFetchPets'
import { useEventsListener } from '../../hook/useEventsListener'
import type { RootState } from '../../redux/store'
import type { UserEvent } from '../../redux/slices/eventsSlice'
import './Notifications.css'

interface NotificationEvent {
  id: string
  petName: string
  petImage: string
  type: 'medicine' | 'event'
  eventTitle: string
  description: string
  date: string
  time?: string
  daysRemaining: number | null
  isPast: boolean
  isToday: boolean
}

/**
 * Calculate days remaining until event date
 */
const calculateDaysRemaining = (dateString: string): number | null => {
  try {
    const eventDate = parseISO(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    eventDate.setHours(0, 0, 0, 0)
    
    if (isPast(eventDate) && !isToday(eventDate)) {
      return null // Event is in the past
    }
    
    const days = differenceInDays(eventDate, today)
    return days >= 0 ? days : null
  } catch {
    return null
  }
}

const Notifications: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch pets and events
  useFetchPets()
  useEventsListener()
  
  const pets = useSelector((state: RootState) => state.pets.pets)
  const events = useSelector((state: RootState) => state.events.events)

  // Transform events into notification format
  const notifications = useMemo<NotificationEvent[]>(() => {
    return events
      .map((event: UserEvent) => {
        const pet = pets.find((p) => p.id === event.petId)
        const eventDate = parseISO(event.date)
        const daysRemaining = calculateDaysRemaining(event.date)
        
        return {
          id: event.id,
          petName: pet?.name || 'Unknown Pet',
          petImage: pet?.image || '/images/dog-default.webp',
          type: event.type,
          eventTitle: event.type === 'medicine' ? event.name || 'Medication' : event.title || 'Event',
          description: event.description,
          date: event.date,
          time: event.time,
          daysRemaining,
          isPast: isPast(eventDate) && !isToday(eventDate),
          isToday: isToday(eventDate),
        }
      })
      .filter((notification) => !notification.isPast) // Only show future or today events
      .sort((a, b) => {
        // Sort by days remaining (ascending), then by date
        if (a.daysRemaining !== null && b.daysRemaining !== null) {
          return a.daysRemaining - b.daysRemaining
        }
        if (a.daysRemaining === null) return 1
        if (b.daysRemaining === null) return -1
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
  }, [events, pets])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const filteredNotifications = notifications.filter((notification) =>
    notification.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDaysRemaining = (days: number | null, isToday: boolean): string => {
    if (isToday) return 'Today'
    if (days === null) return 'Past event'
    if (days === 0) return 'Tomorrow'
    if (days === 1) return '1 day left'
    return `${days} days left`
  }

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

              {filteredNotifications.length === 0 ? (
                <div className="no-notifications">
                  <p>No upcoming events</p>
                </div>
              ) : (
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
                          <div className="notification-bell active">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6A3FFC"
                              strokeWidth="2"
                            >
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="#6A3FFC"
                              className="bell-plus"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                        </div>
                        <p className="notification-type">
                          {notification.type === 'medicine' ? 'Medication' : 'Event'}
                        </p>
                        <p className="notification-medication">
                          {notification.eventTitle}
                        </p>
                        <p className="notification-frequency">
                          {formatDaysRemaining(notification.daysRemaining, notification.isToday)}
                          {notification.time && ` • ${notification.time}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

              {filteredNotifications.length === 0 ? (
                <div className="no-notifications">
                  <p>No upcoming events</p>
                </div>
              ) : (
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
                          <div className="notification-bell active">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6A3FFC"
                              strokeWidth="2"
                            >
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="#6A3FFC"
                              className="bell-plus"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                        </div>
                        <p className="notification-type">
                          {notification.type === 'medicine' ? 'Medication' : 'Event'}
                        </p>
                        <p className="notification-medication">
                          {notification.eventTitle}
                        </p>
                        <p className="notification-frequency">
                          {formatDaysRemaining(notification.daysRemaining, notification.isToday)}
                          {notification.time && ` • ${notification.time}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationButton />
    </>
  )
}

export default Notifications

