import React from 'react';
import './Button.css';

export interface ButtonProps {
  variant: 'primary' | 'secondary';
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable Button component with primary and secondary variants
 * Designed for mobile-first responsive design
 */
const Button: React.FC<ButtonProps> = ({
  variant,
  text,
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
