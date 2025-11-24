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
import "./PetEditPanel.css";
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
      navigate("/dashboard");
    }
  }, [petFromRedux, petId, pets, navigate]);

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
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsImageLoading(true);
    try {
      // Subir a Storage en la carpeta pets/{petId}
      const fileExtension = file.name.split(".").pop();
      const storageRef = ref(storage, `pets/${petId}.${fileExtension}`);

      // Subir archivo a Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);

      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Actualizar el estado local inmediatamente
      setImageUrl(downloadURL);

      // Actualizar en Firestore con la ruta correcta
      const petRef = doc(db, "users", user.id, "pets", petId);
      await updateDoc(petRef, { image: downloadURL });

      // Actualizar en Redux para mantener sincronizado el estado global
      if (pet) {
        const updatedPet = { ...pet, image: downloadURL };
        dispatch(editPet(updatedPet));
      }

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
      // Revertir cambios visuales si falla
      setImageUrl(pet?.image || DEFAULT_PET_IMG);
    } finally {
      setIsImageLoading(false);
      // Limpiar el input para permitir subir la misma imagen de nuevo
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
          className="pet-edit-profile-pic-container"
          onClick={handleChangePicture}
          type="button"
        >
          {isImageLoading ? (
            <LoadingScreen text="Cargando foto..." />
          ) : (
            <img
              src={imageUrl || DEFAULT_PET_IMG}
              alt={name}
              className="pet-edit-profile-pic"
            />
          )}
        </button>
        <h2 className="profile-name-desktop" style={{ marginBottom: 0 }}>
          {name}
        </h2>
      </div>

      <div className="edit-profile-section">
        <h3 className="edit-profile-title" style={{ color: "#ffe57f" }}>
          Edit Pet
        </h3>
        <div className="pet-edit-form">
          <Input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={setName}
            disabled={!isEditing}
          />
          <div className="pet-edit-row">
            <Input
              type="text"
              placeholder="Sexo"
              value={gender}
              onChange={setGender}
              disabled={!isEditing}
            />
            <Input
              type="text"
              placeholder="Edad"
              value={age}
              onChange={setAge}
              disabled={!isEditing}
            />
          </div>
          <div className="pet-edit-row">
            <Input
              type="date"
              placeholder="Fecha Nac."
              value={birthDate}
              onChange={setBirthDate}
              disabled={!isEditing}
            />
            <Input
              type="text"
              placeholder="Raza"
              value={breed}
              onChange={setBreed}
              disabled={!isEditing}
            />
          </div>
          <button
            className="btn-save-pet"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            disabled={isSaving}
            type="button"
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
                background: "rgba(35,35,59,0.67)",
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
