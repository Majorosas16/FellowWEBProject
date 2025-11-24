import React, { useRef } from 'react';
import './PetPhoto.css';

export interface PetPhotoProps {
  imageUrl?: string;
  onImageChange: (file: File | null) => void;
  className?: string;
}

/**
 * Circular pet photo component with upload functionality
 * Designed for mobile-first responsive design
 */
const PetPhoto: React.FC<PetPhotoProps> = ({
  imageUrl,
  onImageChange,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
  };

  return (
    <div className={`pet-photo-container ${className}`}>
      <div className="pet-photo-circle" onClick={handleImageClick}>
        {imageUrl ? (
          <img src={imageUrl} alt="Pet" className="pet-photo-image" />
        ) : (
          <div className="pet-photo-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Add Photo</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PetPhoto;
