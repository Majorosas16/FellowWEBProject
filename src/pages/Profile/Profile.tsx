import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  // Toma los datos del usuario desde Redux
  const user = useSelector((state: RootState) => state.userAdd.user);

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
        <form className="profile-edit-form">
          <label className="edit-label">Edit your profile</label>
          <input
            type="text"
            className="profile-input"
            placeholder="Name"
            defaultValue={user?.name}
          />
          <input
            type="tel"
            className="profile-input"
            placeholder="Phone"
            defaultValue={user?.phoneNumber}
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
            className="profile-input"
            placeholder="Email"
            defaultValue={user?.email}
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
