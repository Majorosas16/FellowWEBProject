import React from 'react';
import './Input.css';

export interface InputProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'number';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  label?: string;
}

/**
 * Reusable Input component for forms
 * Designed for mobile-first responsive design
 */
const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  label
}) => {
  return (
    <div className={`input-container ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="input-field"
      />
    </div>
  );
};

export default Input;
