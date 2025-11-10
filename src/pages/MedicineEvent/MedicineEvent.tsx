import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createUserEvent } from "../../services/createUserEvent";
import "./MedicineEvent.css";

const MedicineEvent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    medicine: "",
    medicineDate: "",
    medicineDescription: "",
  });

  const petId = searchParams.get("petId");
  const petName = searchParams.get("petName");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petId || !petName) {
      alert("Missing pet information");
      return;
    }

    try {
      // 🔥 Guarda el evento de medicina en Firebase
      await createUserEvent({
        petId,
        type: "medicine",
        title: formData.medicine,
        description: formData.medicineDescription,
        date: formData.medicineDate,
      });

      // Navega a la pantalla de éxito
      navigate(
        `/success-event?petId=${petId}&petName=${petName}&eventType=medicine`
      );
    } catch (error) {
      console.error("Error creating medicine event:", error);
      alert(
        "There was a problem saving your medicine event. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="medicine-event-container">
      <div className="medicine-event-content">
        <div className="medicine-event-header">
          <h1 className="medicine-event-title">What happened?</h1>
        </div>

        <div className="medicine-event-icon">
          <div className="medicine-icon-circle">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
              <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
              <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
            </svg>
          </div>
        </div>

        <form className="medicine-event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="medicine"
              placeholder="Medicine"
              value={formData.medicine}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="date"
              name="medicineDate"
              value={formData.medicineDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="medicineDescription"
              placeholder="Medicine description"
              value={formData.medicineDescription}
              onChange={handleInputChange}
              className="form-textarea"
              rows={3}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>

        <div className="cancel-link">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineEvent;
