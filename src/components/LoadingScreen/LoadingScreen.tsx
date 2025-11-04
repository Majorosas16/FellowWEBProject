import React from "react";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text }) => (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
    <p className="loading-text">{text || "Cargando..."}</p>
  </div>
);

export default LoadingScreen;
