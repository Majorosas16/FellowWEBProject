import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { updateUserProfile } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { db } from "../../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { auth } from "../../services/firebaseConfig";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Toma los datos del usuario desde Redux
  const user = useSelector((state: RootState) => state.userAdd.user);

  // Estados locales para los campos del formulario
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
  });

  // Maneja cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Actualiza en Redux primero
    dispatch(updateUserProfile(formData));

    // Actualiza en Firebase
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("No authenticated user");

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        // No modifiques la password aquí, normalmente
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <button className="back-arrow" onClick={() => navigate(-1)}>
          {"\u2190"}
        </button>
        <div className="profile-avatar-edit">
          <img
            src={"/images/avatar-doc.png"}
            alt="User"
            className="profile-avatar-main"
          />
        </div>
        <div className="profile-username">{user?.name || "User"}</div>
        <div className="profile-email">{user?.email || "user@example.com"}</div>

        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <label className="edit-label">Edit your profile</label>

          <input
            type="text"
            name="name"
            className="profile-input"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <input
            type="tel"
            name="phoneNumber"
            className="profile-input"
            placeholder="Phone"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />

          <input
            type="password"
            className="profile-input"
            placeholder="********"
            value="********"
            readOnly
          />

          <input
            type="email"
            name="email"
            className="profile-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <button className="profile-save-btn" type="submit">
            Save
          </button>
        </form>
      </aside>

      <main className="profile-main">
        <div className="profile-appointments-card">
          <div className="profile-appointments-title">Your Appointments</div>
          <img
            src="/images/calendar-icon-purple.png"
            alt="appointments"
            className="profile-appointments-icon"
          />
        </div>

        <div className="profile-actions-list">
          <div className="profile-action-item">
            <span className="profile-action-icon">🔔</span>
            <span className="profile-action-text">Notifications</span>
            <span className="profile-action-arrow">{"\u203A"}</span>
          </div>
          <div className="profile-action-item">
            <span className="profile-action-icon">⚙️</span>
            <span className="profile-action-text">Settings</span>
            <span className="profile-action-arrow">{"\u203A"}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
