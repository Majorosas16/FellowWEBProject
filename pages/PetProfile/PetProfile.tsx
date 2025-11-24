import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "../../hook/useAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db, storage } from "../../services/firebaseConfig";
import { editPet } from "../../redux/slices/petsSlice";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Input from "../../components/Input/Input";
import PetEditPanel from "../../components/PetEditPanel/PetEditPanel";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import type { PetType } from "../../types/petsType";
import type { RootState } from "../../redux/store";
import { deletePet } from "../../redux/slices/petsSlice";
import "./PetProfile.css";

const DEFAULT_PET_IMG =
  "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-pet%2Fdog.png?alt=media&token=ab846319-ee77-4dc0-98f4-7d2ac52af91a";

const PetProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { petId } = useParams();
  const user = useAuthUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener las mascotas desde Redux
  const pets = useSelector((state: RootState) => state.pets.pets);
  const petFromRedux = pets?.find((p: PetType) => p.id === petId);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    if (petFromRedux) {
      setName(petFromRedux.name || "");
      setGender(petFromRedux.gender || "");
      setAge(petFromRedux.age || "");
      setBirthDate(petFromRedux.birthDate || "");
      setBreed(petFromRedux.breed || "");
      setWeight(petFromRedux.weight || "");
    } else if (petId && pets && pets.length > 0) {
      console.error("Pet not found with ID:", petId);
      navigate("/dashboard");
    }
  }, [petFromRedux, petId, pets, navigate]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    if (!petId || !petFromRedux || !user?.id) return;
    setIsSaving(true);
    try {
      const updatedPetData: PetType = {
        ...petFromRedux,
        name,
        gender,
        age,
        birthDate,
        breed,
        weight,
      };

      // Actualizar en Firestore
      const petRef = doc(db, "users", user.id, "pets", petId);
      await updateDoc(petRef, {
        name,
        gender,
        age,
        birthDate,
        breed,
        weight,
      });

      // Actualizar en Redux
      dispatch(editPet(updatedPetData));

      setIsEditing(false);
      alert("Pet data updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating pet data. Please try again.");
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
    if (!file || !petId || !user?.id) return;

    // Validar tipo de archivo
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsImageLoading(true);
    try {
      // Subir a Storage en la carpeta pets/{petId}
      const fileExtension = file.name.split(".").pop();
      const storageRef = ref(storage, `pets/${petId}.${fileExtension}`);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Actualizar en Firestore
      const petRef = doc(db, "users", user.id, "pets", petId);
      await updateDoc(petRef, { image: downloadURL });

      // Actualizar en Redux
      if (petFromRedux) {
        dispatch(editPet({ ...petFromRedux, image: downloadURL }));
      }

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleMedicalRecordsClick = () => navigate(`/medical-records/${petId}`);
  const handleVaccinationsClick = () => navigate(`/vaccinations/${petId}`);
  const handleDeletePet = async () => {
    if (!petId || !petFromRedux || !user?.id) return;

    setIsDeleting(true);
    try {
      // 1. Eliminar imagen de Storage si existe y no es la imagen por defecto
      if (petFromRedux.image && petFromRedux.image !== DEFAULT_PET_IMG) {
        try {
          const imageRef = storageRef(storage, `pets/${petId}`);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn("Error deleting image from storage:", error);
          // Continuar aunque falle la eliminación de la imagen
        }
      }

      // 2. Eliminar documento de Firestore
      const petRef = doc(db, "users", user.id, "pets", petId);
      await deleteDoc(petRef);

      // 3. Eliminar del estado Redux
      dispatch(deletePet(petId));

      // 4. Mostrar mensaje y redirigir
      alert("Pet deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Error deleting pet. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleCancelDelete = () => setShowDeleteModal(false);

  if (!pets || pets.length === 0) {
    return (
      <div className="pet-profile-container">
        <div className="pet-profile-content">
          <p>Loading pets...</p>
        </div>
      </div>
    );
  }

  if (!petFromRedux) {
    return (
      <div className="pet-profile-container">
        <div className="pet-profile-content">
          <p>Pet not found</p>
          <button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div className="pet-profile-layout">
        {/* Mobile View */}
        <div className="pet-profile-mobile">
          <div className="pet-profile-container">
            <div className="pet-profile-content">
              <div className="pet-profile-header">
                <button className="back-button" onClick={() => navigate(-1)}>
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
                <h1>Edit Pet Profile</h1>
              </div>
              <div className="pet-picture-section">
                <div className="pet-picture-container">
                  {isImageLoading ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : (
                    <img
                      src={petFromRedux.image || DEFAULT_PET_IMG}
                      alt={petFromRedux.name}
                      className="pet-picture"
                    />
                  )}
                </div>
                <button
                  className="change-picture-btn"
                  onClick={handleChangePicture}
                  type="button"
                  disabled={isImageLoading}
                >
                  Change Picture
                </button>
              </div>
              <div className="pet-profile-form">
                <Input
                  type="text"
                  label="Name"
                  placeholder="Name"
                  value={name}
                  onChange={setName}
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  label="Gender"
                  placeholder="Male / Female"
                  value={gender}
                  onChange={setGender}
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  label="Age"
                  placeholder="18 Months"
                  value={age}
                  onChange={setAge}
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  label="Birth Date"
                  placeholder="05/04/2024"
                  value={birthDate}
                  onChange={setBirthDate}
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  label="Breed"
                  placeholder="Shih Tzu"
                  value={breed}
                  onChange={setBreed}
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  label="Weight"
                  placeholder="5 kg"
                  value={weight}
                  onChange={setWeight}
                  disabled={!isEditing}
                />
              </div>
              <div className="pet-profile-actions">
                <button
                  className="btn-edit"
                  onClick={handleEditClick}
                  disabled={isSaving || isEditing}
                >
                  Edit
                </button>
                <button
                  className="btn-save"
                  onClick={handleSaveClick}
                  disabled={isSaving || !isEditing}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
          <div className="back-dashboard-mobile">
            <button
              className="delete-pet-btn"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Pet"}
            </button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="pet-profile-desktop">
          <div className="pet-profile-left-panel">
            <PetEditPanel />
          </div>
          <div className="pet-profile-right-panel">
            <div className="pet-info-card">
              <h3 className="card-title">Pet Information</h3>
              <div className="pet-stats">
                <div className="stat-item">
                  <span className="stat-label">Type:</span>
                  <span className="stat-value">
                    {petFromRedux.type || "N/A"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Age:</span>
                  <span className="stat-value">{age || "N/A"}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Weight:</span>
                  <span className="stat-value">{weight || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="pet-actions-card">
              <button
                className="pet-action-item"
                onClick={handleMedicalRecordsClick}
                type="button"
              >
                <div className="action-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A3FFC"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <span className="action-text">Medical Records</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="arrow-icon"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="pet-action-item"
                onClick={handleVaccinationsClick}
                type="button"
              >
                <div className="action-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A3FFC"
                    strokeWidth="2"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </div>
                <span className="action-text">Vaccinations</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="arrow-icon"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="delete-pet-btn"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete Pet"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Pet</h2>
            <p>
              Are you sure you want to delete {petFromRedux.name}? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={handleDeletePet}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <NotificationButton />
    </>
  );
};

export default PetProfile;
