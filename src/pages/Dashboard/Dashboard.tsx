import React from 'react'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation'
import HealthEventCard from '../../components/HealthEventCard/HealthEventCard'
import MedicationCard from '../../components/MedicationCard/MedicationCard'
import './Dashboard.css'

/**
 * Dashboard page component
 * Main user interface after successful registration
 */
const Dashboard: React.FC = () => {
  // For demo purposes, using a default username
  // In a real app, this would come from user authentication
  const userName = 'Carolina'

  // Sample health events data
  const healthEvents = [
    {
      petName: 'Pepe',
      petImage: '/images/cat-tabby.webp',
      event: 'Vomited',
      date: '10/07/2025',
    },
    {
      petName: 'Oscar',
      petImage: '/images/dog-golden-retriever.webp',
      event: 'Checkup',
      date: '09/07/2025',
    },
  ]

  // Sample medications data
  const medications = [
    {
      petName: 'Pepe',
      petImage: '/images/cat-tabby.webp',
      medication: 'Cortizol',
      onSkip: () => console.log('Skip medication'),
      onTaken: () => console.log('Medication taken'),
    },
    {
      petName: 'Pepe',
      petImage: '/images/cat-tabby.webp',
      medication: 'Supplement',
      onSkip: () => console.log('Skip supplement'),
      onTaken: () => console.log('Supplement taken'),
    },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="app-name">FELLOW</h1>
          <h2 className="dashboard-title">Hi, {userName}</h2>
          <p className="dashboard-subtitle">How is your day?</p>
        </div>

        <div className="dashboard-sections">
          <div className="section">
            <h3 className="section-title">Health events</h3>
            <div className="scrollable-cards">
              {healthEvents.map((event, index) => (
                <HealthEventCard
                  key={index}
                  petName={event.petName}
                  petImage={event.petImage}
                  event={event.event}
                  date={event.date}
                />
              ))}
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">Medication</h3>
            <div className="scrollable-cards">
              {medications.map((med, index) => (
                <MedicationCard
                  key={index}
                  petName={med.petName}
                  petImage={med.petImage}
                  medication={med.medication}
                  onSkip={med.onSkip}
                  onTaken={med.onTaken}
                />
              ))}
            </div>
          </div>
        </div>

        <button className="notification-button">
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
      </div>

      <BottomNavigation />
    </div>
  )
}

export default Dashboard
