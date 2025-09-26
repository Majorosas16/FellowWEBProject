import React from 'react'
import './ProfileCard.css'

export interface ProfileCardProps {
  userName: string
  userImage: string
  userMail: string
  className?: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  userImage,
  userMail,
  className = '',
}) => {
  return (
    <div className={`profile-card ${className}`}>
      <div className="user-image-container">
        <img src={userImage} alt={userName} className="user-image" />
      </div>
      <div className="user-text-container">
        <h1 className="user-name">{userName}</h1>
        <p className="user-mail">{userMail}</p>
      </div>
    </div>
  )
}

export default ProfileCard
