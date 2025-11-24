// components/LayoutWithNavigation/LayoutWithNavigation.jsx
import React from 'react';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import './LayoutWithNavigation.css';

export interface LayoutWithNavigationProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout component that includes the bottom navigation
 * Used for routes that require the navigation bar
 */
const LayoutWithNavigation: React.FC<LayoutWithNavigationProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`layout-with-navigation ${className}`}>
      <main className="layout-content">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default LayoutWithNavigation;