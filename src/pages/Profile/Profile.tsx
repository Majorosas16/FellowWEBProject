import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser } from '../../hook/useAuthUser'
import { useDispatch } from 'react-redux'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword } from 'firebase/auth'
import { auth, db } from '../../services/firebaseConfig'
import { setUserAdd } from '../../redux/slices/userSlice'
import Input from '../../components/Input/Input'
import ProfileEditPanel from '../../components/ProfileEditPanel/ProfileEditPanel'
import NotificationButton from '../../components/NotificationButton/NotificationButton'
import './Profile.css'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useAuthUser()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhoneNumber(user.phoneNumber || '')

      // Load profile image from localStorage
      const savedImage = localStorage.getItem(`profileImage_${user.id}`)
      if (savedImage) {
        setProfileImage(savedImage)
      } else {
        setProfileImage('/images/carolina.jpg') // Default profile image
      }
    }
  }, [user])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const userRef = doc(db, 'users', user.id)
      const updateData: {
        name: string
        phoneNumber: string
        email: string
      } = {
        name,
        phoneNumber,
        email,
      }

      await updateDoc(userRef, updateData)

      // Update Redux store
      dispatch(
        setUserAdd({
          ...user,
          name,
          phoneNumber,
          email,
        })
      )

      // Update password if provided
      if (password && password.length >= 6) {
        const currentUser = auth.currentUser
        if (currentUser) {
          try {
            await updatePassword(currentUser, password)
          } catch (error: unknown) {
            console.error('Error updating password:', error)
            alert(
              'Password update failed. Please sign out and sign in again, then try updating your password.'
            )
          }
        }
      }

      setIsEditing(false)
      setPassword('')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePicture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Read file and convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      if (base64String && user?.id) {
        // Save to localStorage
        localStorage.setItem(`profileImage_${user.id}`, base64String)
        setProfileImage(base64String)
      }
    }
    reader.onerror = () => {
      alert('Error reading image file')
    }
    reader.readAsDataURL(file)

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAppointmentsClick = () => {
    navigate('/calendar')
  }

  const handleNotificationsClick = () => {
    navigate('/notifications')
  }

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <p>Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="profile-layout">
        {/* Mobile View */}
        <div className="profile-mobile">
          <div className="profile-container">
            <div className="profile-content">
              <div className="profile-header">
                <h1>Edit profile</h1>
              </div>

              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  <img
                    src={profileImage || '/images/carolina.jpg'}
                    alt={user.name || 'User'}
                    className="profile-picture"
                  />
                </div>
                <button
                  className="change-picture-btn"
                  onClick={handleChangePicture}
                  type="button"
                >
                  Change Picture
                </button>
              </div>

              <div className="profile-form">
                <Input
                  type="text"
                  label="Name"
                  placeholder="Name"
                  value={name}
                  onChange={setName}
                  disabled={!isEditing}
                />
                <div
                  className="email-input-wrapper"
                  onMouseEnter={() => setShowEmailTooltip(true)}
                  onMouseLeave={() => setShowEmailTooltip(false)}
                >
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChange={setEmail}
                    disabled={true}
                  />
                  {showEmailTooltip && (
                    <div className="email-tooltip">
                      No puedes editar el correo por seguridad.
                    </div>
                  )}
                </div>
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  disabled={!isEditing}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                  disabled={!isEditing}
                />
              </div>

              <div className="profile-actions">
                <button
                  className="btn-edit"
                  onClick={handleEditClick}
                  disabled={isSaving || isEditing}
                >
                  Edit
                </button>
                <button
                  className="btn-save"
                  onClick={handleSaveClick}
                  disabled={isSaving || !isEditing}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="profile-desktop">
          <div className="profile-left-panel">
            <ProfileEditPanel />
          </div>

          <div className="profile-right-panel">
            <div className="appointments-card">
              <h3 className="card-title">Your Appointments</h3>
              <button
                className="calendar-icon-container"
                onClick={handleAppointmentsClick}
                type="button"
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6A3FFC"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="8" cy="14" r="1" />
                  <circle cx="12" cy="14" r="1" />
                  <circle cx="16" cy="14" r="1" />
                  <circle cx="8" cy="18" r="1" />
                  <circle cx="12" cy="18" r="1" />
                  <circle cx="16" cy="18" r="1" />
                </svg>
              </button>
            </div>

            <div className="settings-card">
              <button
                className="settings-item"
                onClick={handleNotificationsClick}
                type="button"
              >
                <div className="settings-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A3FFC"
                    strokeWidth="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <span className="settings-text">Notifications</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="arrow-icon"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                className="settings-item"
                onClick={handleSettingsClick}
                type="button"
              >
                <div className="settings-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A3FFC"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                  </svg>
                </div>
                <span className="settings-text">Settings</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="arrow-icon"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationButton />
    </>
  )
}

export default Profile
