import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createUserEvent } from "../../services/createUserEvent";
import "./GenericEvent.css";

/**
 * GenericEvent page component
 * Form for creating generic events
 */
const GenericEvent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDate: "",
    eventTime: "",
    eventDescription: "",
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
      // 🔥 Guarda el evento genérico en Firebase
      await createUserEvent({
        petId,
        type: "event",
        title: formData.eventTitle,
        description: formData.eventDescription,
        date: formData.eventDate,
        time: formData.eventTime,
      });

      // Navega a la pantalla de éxito
      navigate(
        `/success-event?petId=${petId}&petName=${petName}&eventType=generic`
      );
    } catch (error) {
      console.error("Error creating event:", error);
      alert("There was a problem saving your event. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="generic-event-container">
      <div className="generic-event-content">
        <div className="generic-event-header">
          <h1 className="generic-event-title">What happened?</h1>
        </div>

        <div className="generic-event-icon">
          <div className="generic-icon-circle">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>

        <form className="generic-event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="eventTitle"
              placeholder="Event title"
              value={formData.eventTitle}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="eventDescription"
              placeholder="Event description"
              value={formData.eventDescription}
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

export default GenericEvent;
