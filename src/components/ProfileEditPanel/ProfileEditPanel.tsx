import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hook/useAuthUser";
import { useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { setUserAdd } from "../../redux/slices/userSlice";
import Input from "../Input/Input";
import "./ProfileEditPanel.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebaseConfig";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const DEFAULT_IMAGES = {
  profile:
    "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-user%2Fprofile-default.png?alt=media&token=27c7b2ea-4efc-4475-93da-f07a1bb8fa4f",
};

const ProfileEditPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useAuthUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Initialize form fields (no image here, UI reads it directly from user)
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const handleBackClick = () => navigate(-1);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        name,
        phoneNumber,
        email,
      });
      dispatch(
        setUserAdd({
          ...user,
          name,
          phoneNumber,
          email,
        })
      );

      // Update password if provided
      if (password && password.length >= 6) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            await updatePassword(currentUser, password);
          } catch (error) {
            console.error(error);
            alert(
              "Password update failed. Please sign out and sign in again, then try updating your password."
            );
          }
        }
      }

      setIsEditing(false);
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsImageLoading(true);

    try {
      // Subir a Storage
      const storageRef = ref(storage, `profile-user/${user.id}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Actualiza Firestore (persistente)
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { profileImage: downloadURL });

      // Actualiza estado global
      dispatch(
        setUserAdd({
          ...user,
          profileImage: downloadURL,
        })
      );
    } catch (error) {
      alert("Error uploading image");
      console.error(error);
    }

    setIsImageLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return (
      <div className="profile-edit-panel">
        <p>Loading user data...</p>
      </div>
    );
  }
  // Render UI, image always reads from global user
  return (
    <div className="profile-edit-panel">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        className="back-button-desktop"
        onClick={handleBackClick}
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="profile-info-section">
        <button
          className="profile-picture-container-desktop"
          onClick={handleChangePicture}
          type="button"
        >
          {isImageLoading ? (
            <div
              style={{
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LoadingScreen text="Cargando foto..." />
            </div>
          ) : (
            <img
              src={user.profileImage || DEFAULT_IMAGES.profile}
              alt={user?.name || "User"}
              className="profile-picture-desktop"
            />
          )}
        </button>

        <h2 className="profile-name-desktop">{user?.name || "User"}</h2>
        <p className="profile-email-desktop">{user?.email || ""}</p>
      </div>

      <div className="edit-profile-section">
        <h3 className="edit-profile-title">Edit your profile</h3>
        <div className="edit-profile-form">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={setName}
            disabled={!isEditing}
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            disabled={!isEditing}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            disabled={!isEditing}
          />
          <div
            className="email-input-wrapper"
            onMouseEnter={() => setShowEmailTooltip(true)}
            onMouseLeave={() => setShowEmailTooltip(false)}
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              disabled={true}
            />
            {showEmailTooltip && (
              <div className="email-tooltip">
                No puedes editar el correo por seguridad.
              </div>
            )}
          </div>
          <button
            className="btn-save-desktop"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            disabled={isSaving}
            type="button"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPanel;
