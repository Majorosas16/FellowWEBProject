import React from "react";
import "./ModalError.css";

interface ModalErrorProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ModalError: React.FC<ModalErrorProps> = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-error-overlay">
      <div className="modal-error-content">
        <p>{message}</p>
        <button className="modal-error-close-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalError;
