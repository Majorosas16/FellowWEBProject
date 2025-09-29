import React from 'react'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation'
import HealthEventCard from '../../components/HealthEventCard/HealthEventCard'
import MedicationCard from '../../components/MedicationCard/MedicationCard'
import NotificationButton from '../../components/NotificationButton/NotificationButton'
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
          <img 
            src="/images/Logo-2.png" 
            alt="Fellow Logo" 
            className="home-logo"
          />
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

        <NotificationButton />
      </div>

      <BottomNavigation />
    </div>
  )
}

export default Dashboard
