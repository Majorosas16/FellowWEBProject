import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import './Success.css';

/**
 * Success page component that displays the success modal
 * Shows after successful pet registration
 */
const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { petName, petImage, petType } = location.state || {
    petName: 'Your Pet',
    petImage: '',
    petType: 'cat'
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="success-page">
      <SuccessModal
        petName={petName}
        petImage={petImage}
        petType={petType}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default Success;
