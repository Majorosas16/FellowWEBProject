import React from "react";
import LeftNavigation from "../../components/LeftNavigation/LeftNavigation";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import { useSelector } from "react-redux";
import { useAuthUser } from "../../hook/useAuthUser";
import type { RootState } from "../../redux/store";
// Si usas fetch de pets vía hook:
import { useFetchPets } from "../../hook/useFetchPets"; 

const Profile: React.FC = () => {
  useFetchPets();
  const pets = useSelector((state: RootState) => state.pets.pets);
  const user = useAuthUser();

  // Datos de usuario para ProfileCard desde base real
  const userProfile = {
    userName: user?.name || "User",
    userImage: "/images/dog-golden-retriever.webp",
    userMail: user?.email || "user@example.com",
  };

  return (
    <div className="dashboard-layout">
      <LeftNavigation pets={pets} />
      <div className="dashboard-container">
        <div className="profile-content">
          <div className="profile-header">
            <h1>Is this you?</h1>
          </div>
          <div className="profile-sections">
            <div className="section">
              <div className="section-profile-card">
                <ProfileCard
                  userName={userProfile.userName}
                  userImage={userProfile.userImage}
                  userMail={userProfile.userMail}
                />
              </div>
            </div>
            <div className="section">
              <div className="section-buttons"></div>
            </div>
            <div className="section">
              <div className="section-config"></div>
            </div>
          </div>
        </div>
        <NotificationButton />
      </div>
    </div>
  );
};

export default Profile;
