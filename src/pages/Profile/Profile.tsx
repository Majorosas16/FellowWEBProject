import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { updateUserProfile } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { db } from "../../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { auth } from "../../services/firebaseConfig";
import { updatePassword } from "firebase/auth";
import { signOut } from "firebase/auth";

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
    password: "", // SIEMPRE vacío al entrar
  });

  // Maneja cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(updateUserProfile(formData));

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("No authenticated user");

      // Update Firestore profile fields
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      });

      // Update password in Firebase Authentication if new password is entered
      if (formData.password.length >= 6 && auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, formData.password);
        } catch (error) {
          // Si requiere re-auth, se lo muestras aquí
          console.error("Error updating password:", error);
          alert("You need to re-login before changing your password.");
          return;
        }
      }

      // Si está vacío o menor a 6 caracteres no hace nada, manteniendo la contraseña anterior

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handlePasswordFocus = () => {
    if (formData.password === "********") {
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // o "/login" si tienes una ruta de login específica
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        alert("Error signing out. Please try again.");
      });
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
            name="password"
            className="profile-input"
            placeholder="New password (leave blank to keep current)"
            value={formData.password}
            type="text" // usa "password" si quieres puntos
            onChange={handleInputChange}
            onFocus={handlePasswordFocus}
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
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </main>
    </div>
  );
};

export default Profile;
