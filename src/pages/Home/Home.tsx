import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Home.css";

/**
 * Home page component with Login and Register buttons
 * Entry point of the application
 */

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth?mode=login");
  };

  const handleRegisterClick = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <img
            src="/images/Logo-1.png"
            alt="Fellow Logo"
            className="home-logo"
          />
        </div>

        <div className="home-buttons">
          <Button variant="primary" text="Login" onClick={handleLoginClick} />
          <Button
            variant="secondary"
            text="Register"
            onClick={handleRegisterClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
