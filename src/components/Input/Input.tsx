import React from "react";
import "./Input.css";

export interface InputProps {
  type: "text" | "email" | "password" | "tel" | "date" | "number";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  label,
  disabled,
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
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
