import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileEditPanel from '../../components/ProfileEditPanel/ProfileEditPanel'
import NotificationButton from '../../components/NotificationButton/NotificationButton'
import './Settings.css'

interface SettingItem {
  id: string
  title: string
  description: string
  type: 'toggle' | 'select' | 'button'
  value?: boolean | string
  options?: { label: string; value: string }[]
  action?: () => void
}

const Settings: React.FC = () => {
  const navigate = useNavigate()

  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive notifications about your pets',
      type: 'toggle',
      value: true,
    },
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Receive email updates about your pets',
      type: 'toggle',
      value: false,
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Select your preferred language',
      type: 'select',
      value: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
      ],
    },
    {
      id: 'theme',
      title: 'Theme',
      description: 'Choose your app theme',
      type: 'select',
      value: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'View our privacy policy',
      type: 'button',
      action: () => {
        alert('Privacy Policy page coming soon!')
      },
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'View our terms of service',
      type: 'button',
      action: () => {
        alert('Terms of Service page coming soon!')
      },
    },
    {
      id: 'about',
      title: 'About',
      description: 'Learn more about Fellow',
      type: 'button',
      action: () => {
        alert('About page coming soon!')
      },
    },
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of your account',
      type: 'button',
      action: () => {
        if (globalThis.confirm('Are you sure you want to logout?')) {
          // TODO: Implement logout functionality
          alert('Logout functionality coming soon!')
        }
      },
    },
  ])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, value: !setting.value }
          : setting
      )
    )
  }

  const handleSelectChange = (id: string, value: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, value } : setting
      )
    )
  }

  return (
    <>
      <div className="settings-layout">
        {/* Mobile View */}
        <div className="settings-mobile">
          <div className="settings-container">
            <div className="settings-content">
              <button className="back-button" onClick={handleBackClick}>
                ← Back
              </button>

              <div className="settings-header">
                <h1>Settings</h1>
              </div>

              <div className="settings-list">
                {settings.map((setting) => (
                  <div key={setting.id} className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-title">{setting.title}</h3>
                      <p className="setting-description">
                        {setting.description}
                      </p>
                    </div>
                    <div className="setting-control">
                      {setting.type === 'toggle' && (
                        <button
                          className={`toggle-switch ${
                            setting.value ? 'active' : ''
                          }`}
                          onClick={() => handleToggle(setting.id)}
                          type="button"
                        >
                          <div className="toggle-slider" />
                        </button>
                      )}
                      {setting.type === 'select' && (
                        <select
                          className="setting-select"
                          value={setting.value as string}
                          onChange={(e) =>
                            handleSelectChange(setting.id, e.target.value)
                          }
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {setting.type === 'button' && (
                        <button
                          className="setting-button"
                          onClick={setting.action}
                          type="button"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="settings-desktop">
          <div className="settings-left-panel">
            <ProfileEditPanel />
          </div>

          <div className="settings-right-panel">
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

            <div className="settings-content-desktop">
              <div className="settings-header-desktop">
                <h1>Settings</h1>
              </div>

              <div className="settings-list-desktop">
                {settings.map((setting) => (
                  <div key={setting.id} className="setting-item-desktop">
                    <div className="setting-info-desktop">
                      <h3 className="setting-title-desktop">
                        {setting.title}
                      </h3>
                      <p className="setting-description-desktop">
                        {setting.description}
                      </p>
                    </div>
                    <div className="setting-control-desktop">
                      {setting.type === 'toggle' && (
                        <button
                          className={`toggle-switch ${
                            setting.value ? 'active' : ''
                          }`}
                          onClick={() => handleToggle(setting.id)}
                          type="button"
                        >
                          <div className="toggle-slider" />
                        </button>
                      )}
                      {setting.type === 'select' && (
                        <select
                          className="setting-select-desktop"
                          value={setting.value as string}
                          onChange={(e) =>
                            handleSelectChange(setting.id, e.target.value)
                          }
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {setting.type === 'button' && (
                        <button
                          className="setting-button-desktop"
                          onClick={setting.action}
                          type="button"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
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

export default Settings

