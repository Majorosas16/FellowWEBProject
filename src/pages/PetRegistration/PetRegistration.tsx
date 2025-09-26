import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input/Input'
import PetPhoto from '../components/PetPhoto/PetPhoto'
import './PetRegistration.css'

/**
 * Pet registration page component
 * Handles pet information form with photo upload
 */
const PetRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [petType, setPetType] = useState<'cat' | 'dog'>('cat')

  // Form states
  const [petImage, setPetImage] = useState<string>('')
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [weight, setWeight] = useState('')

  useEffect(() => {
    const type = searchParams.get('type') as 'cat' | 'dog'
    if (type) {
      setPetType(type)
    }
  }, [searchParams])

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPetImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPetImage('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const petData = {
      type: petType,
      name,
      breed,
      gender,
      age,
      birthDate,
      weight,
      image: petImage,
    }

    console.log('Pet registration:', petData)

    // Navigate to success modal
    navigate('/success', {
      state: {
        petName: name,
        petImage: petImage,
        petType: petType,
      },
    })
  }

  const handleBackClick = () => {
    navigate('/pet-type')
  }

  return (
    <div className="pet-registration-container">
      <div className="pet-registration-content">
        <div className="pet-registration-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          <h1 className="pet-registration-title">Register your {petType}!</h1>
        </div>

        <form className="pet-registration-form" onSubmit={handleSubmit}>
          <PetPhoto imageUrl={petImage} onImageChange={handleImageChange} />

          <Input
            type="text"
            placeholder="Pet Name"
            value={name}
            onChange={setName}
            required
          />

          <Input
            type="text"
            placeholder="Breed"
            value={breed}
            onChange={setBreed}
            required
          />

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Gender</label>
              <select
                className="select-field"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={setAge}
                required
              />
            </div>
          </div>

          <Input
            type="date"
            placeholder="Birth Date"
            value={birthDate}
            onChange={setBirthDate}
            required
          />

          <Input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={setWeight}
            required
          />

          <Button variant="primary" text="Add Pet" onClick={() => {}} />
        </form>
      </div>
    </div>
  )
}

export default PetRegistration
