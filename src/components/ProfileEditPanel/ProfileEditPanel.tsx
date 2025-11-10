import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser } from '../../hook/useAuthUser'
import { useDispatch } from 'react-redux'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword } from 'firebase/auth'
import { auth, db } from '../../services/firebaseConfig'
import { setUserAdd } from '../../redux/slices/userSlice'
import Input from '../Input/Input'
import './ProfileEditPanel.css'

const ProfileEditPanel: React.FC = () => {
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

  const handleBackClick = () => {
    navigate(-1)
  }

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
            // Password update might fail if user hasn't signed in recently
            // This is a Firebase security requirement
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

  if (!user) {
    return (
      <div className="profile-edit-panel">
        <p>Loading user data...</p>
      </div>
    )
  }

  return (
    <div className="profile-edit-panel">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        className="back-button-desktop"
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

      <div className="profile-info-section">
        <button
          className="profile-picture-container-desktop"
          onClick={handleChangePicture}
          type="button"
        >
          <img
            src={profileImage || '/images/carolina.jpg'}
            alt={user.name || 'User'}
            className="profile-picture-desktop"
          />
        </button>
        <h2 className="profile-name-desktop">{user.name || 'User'}</h2>
        <p className="profile-email-desktop">{user.email || ''}</p>
      </div>

      <div className="edit-profile-section">
        <h3 className="edit-profile-title">Edit your profile</h3>
        <div className="edit-profile-form">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={setName}
            disabled={!isEditing}
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            disabled={!isEditing}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            disabled={!isEditing}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            disabled={!isEditing}
          />
          <button
            className="btn-save-desktop"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            disabled={isSaving}
            type="button"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditPanel


