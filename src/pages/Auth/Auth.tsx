import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input/Input'
import './Auth.css'

/**
 * Authentication page component with Login/Signup toggle
 * Handles both login and registration forms
 */
const Auth: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Form states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'login' || urlMode === 'signup') {
      setMode(urlMode)
    }
  }, [searchParams])

  // const handleModeToggle = () => {
  //   const newMode = mode === 'login' ? 'signup' : 'login';
  //   setMode(newMode);
  //   // Clear form when switching modes
  //   setName('');
  //   setPhone('');
  //   setEmail('');
  //   setPassword('');
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'login') {
      // Handle login logic
      console.log('Login:', { email, password })
      // For demo purposes, navigate to pet type selection
      navigate('/pet-type')
    } else {
      // Handle signup logic
      console.log('Signup:', { name, phone, email, password })
      // For demo purposes, navigate to pet type selection
      navigate('/pet-type')
    }
  }

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-logo">
          <img 
            src="/images/Logo.png" 
            alt="Fellow Logo" 
            className="auth-logo-img"
          />
        </div>
        
        <div className="auth-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
        </div>

        <div className="auth-toggle">
          <button
            className={`toggle-button ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`toggle-button ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome Back' : 'Welcome to Fellow'}
          </h1>
          {mode === 'signup' && (
            <>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={setName}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={setPhone}
                required
              />
            </>
          )}

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={setEmail}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required
          />

          <Button
            variant="primary"
            text={mode === 'login' ? 'Login' : 'Register'}
            onClick={() => {}}
          />
        </form>
      </div>
    </div>
  )
}

export default Auth
