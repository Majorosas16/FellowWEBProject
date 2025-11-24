import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConfig";
import Input from "../Input/Input";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { editPet } from "../../redux/slices/petsSlice";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { PetType } from "../../types/petsType";
import { useAuthUser } from "../../hook/useAuthUser";
import "../ProfileEditPanel/ProfileEditPanel.css";
import type { RootState } from "../../redux/store";

const DEFAULT_PET_IMG =
  "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-pet%2Fdog.png?alt=media&token=ab846319-ee77-4dc0-98f4-7d2ac52af91a";

const PetEditPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { petId } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Obtener el usuario autenticado
  const user = useAuthUser();

  // Obtener las mascotas desde Redux
  const pets = useSelector((state: RootState) => state.pets.pets);
  
  // Buscar la mascota específica por ID
  const petFromRedux = pets?.find((p: PetType) => p.id === petId);

  const [pet, setPet] = useState<PetType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [breed, setBreed] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Cargar mascota desde Redux
  useEffect(() => {
    if (petFromRedux) {
      setPet(petFromRedux);
      setName(petFromRedux.name || "");
      setGender(petFromRedux.gender || "");
      setAge(petFromRedux.age || "");
      setBirthDate(petFromRedux.birthDate || "");
      setBreed(petFromRedux.breed || "");
      setImageUrl(petFromRedux.image || DEFAULT_PET_IMG);
    } else if (petId && pets && pets.length > 0) {
      // Si no se encuentra la mascota y ya cargaron las mascotas
      console.error("Pet not found with ID:", petId);
      // Opcional: redirigir al dashboard
      // navigate("/dashboard");
    }
  }, [petFromRedux, petId, pets]);

  const handleBackClick = () => navigate(-1);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    if (!petId || !pet || !user?.id) return;
    setIsSaving(true);
    try {
      const newPetData: PetType = {
        ...pet,
        id: petId,
        name,
        gender,
        age,
        birthDate,
        breed,
        image: imageUrl,
      };

      // Actualizar en Firestore con la ruta correcta: users/{userId}/pets/{petId}
      const petRef = doc(db, "users", user.id, "pets", petId);
      await updateDoc(petRef, {
        name,
        gender,
        age,
        birthDate,
        breed,
        image: imageUrl,
      });

      // Actualizar en Redux
      dispatch(editPet(newPetData));
      
      setIsEditing(false);
      alert("Pet data updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating pet data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePicture = () => fileInputRef.current?.click();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !petId || !user?.id) return;

    setIsImageLoading(true);
    try {
      const storageRef = ref(storage, `profile-pet/${petId}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setImageUrl(downloadURL);

      // Actualizar en Firestore con la ruta correcta
      const petRef = doc(db, "users", user.id, "pets", petId);
      await updateDoc(petRef, { image: downloadURL });

      // Actualizar en Redux si quieres que el cambio sea inmediato
      if (pet) {
        dispatch(editPet({ ...pet, image: downloadURL }));
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    }
    setIsImageLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Mostrar loading mientras se carga
  if (!pets || pets.length === 0) {
    return (
      <div className="profile-edit-panel">
        <LoadingScreen text="Loading pets..." />
      </div>
    );
  }

  if (!pet && petId) {
    return (
      <div className="profile-edit-panel">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Pet not found</h2>
          <button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="profile-edit-panel">
        <LoadingScreen text="Loading pet data..." />
      </div>
    );
  }

  return (
    <div className="profile-edit-panel">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
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
            <LoadingScreen text="Cargando foto..." />
          ) : (
            <img
              src={imageUrl || DEFAULT_PET_IMG}
              alt={name}
              className="profile-picture-desktop"
            />
          )}
        </button>
        <h2 className="profile-name-desktop" style={{ marginBottom: 0 }}>
          {name}
        </h2>
      </div>

      <div className="edit-profile-section">
        <h3 className="edit-profile-title" style={{ color: "#ffe57f" }}>
          Edit
        </h3>
        <div className="edit-profile-form" style={{ position: "relative" }}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={setName}
            disabled={!isEditing}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <Input
              type="text"
              placeholder="Male"
              value={gender}
              onChange={setGender}
              disabled={!isEditing}
            />
            <Input
              type="text"
              placeholder="18 Months"
              value={age}
              onChange={setAge}
              disabled={!isEditing}
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Input
              type="text"
              placeholder="05/04/2024"
              value={birthDate}
              onChange={setBirthDate}
              disabled={!isEditing}
            />
            <Input
              type="text"
              placeholder="Shih Tzu"
              value={breed}
              onChange={setBreed}
              disabled={!isEditing}
            />
          </div>
          <button
            className="btn-save-desktop"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            disabled={isSaving}
            type="button"
            style={{ marginTop: 30 }}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          {isSaving && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                background: "rgba(35,35,59,0.77)",
                borderRadius: "24px",
              }}
            >
              <LoadingScreen text="Guardando cambios..." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetEditPanel;