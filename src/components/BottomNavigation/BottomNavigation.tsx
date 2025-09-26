import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

export interface BottomNavigationProps {
  className?: string;
}

/**
 * Bottom navigation component with home, profile, pets, and calendar icons
 * Mobile-first design with active state indication
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: 'home', label: 'Home' },
    { path: '/profile', icon: 'person', label: 'Profile' },
    { path: '/pets', icon: 'pets', label: 'Pets' },
    { path: '/calendar', icon: 'calendar', label: 'Calendar' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={`bottom-navigation ${className}`}>
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => handleNavigation(item.path)}
          aria-label={item.label}
        >
          <div className="nav-icon">
            {item.icon === 'home' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            )}
            {item.icon === 'person' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
            {item.icon === 'pets' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                <path d="M19 15L20 21L12 19L4 21L5 15"/>
                <path d="M8 12L10 14L12 12L14 14L16 12"/>
              </svg>
            )}
            {item.icon === 'calendar' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            )}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
