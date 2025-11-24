import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ButtonCopy";
import Input from "../../components/Input/Input";
import PetPhoto from "../../components/PetPhoto/PetPhoto";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebaseConfig";
import "./PetRegistration.css";

import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "../../services/firebaseConfig";
import { addPet, setPets } from "../../redux/slices/petsSlice";
import type { PetType } from "../../types/petsType";
import type { RootState } from "../../redux/store";

const PetRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const petsFromState = useSelector((state: RootState) => state.pets.pets);

  const [petType, setPetType] = useState<"cat" | "dog">("cat");
  const [petImage, setPetImage] = useState<string>("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");

  const DEFAULT_IMAGES = {
    cat: "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-pet%2Fcat.png?alt=media&token=6ee9b4ac-cf43-46b2-ac9e-6ed0d6ed2041",
    dog: "https://firebasestorage.googleapis.com/v0/b/fellow-774ff.firebasestorage.app/o/images%2Fprofile-pet%2Fdog.png?alt=media&token=ab846319-ee77-4dc0-98f4-7d2ac52af91a",
  };

  // Sincroniza todas las mascotas desde Firebase al montar el componente
  useEffect(() => {
    const fetchPets = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const petsRef = collection(db, "users", user.uid, "pets");
      const snapshot = await getDocs(petsRef);

      const petsList: PetType[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          let createdAtStr = "";
          if (data.createdAt instanceof Timestamp) {
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === "string") {
            createdAtStr = data.createdAt;
          }
          return {
            id: doc.id,
            type: data.type,
            name: data.name,
            breed: data.breed,
            gender: data.gender,
            age: data.age,
            birthDate: data.birthDate,
            weight: data.weight,
            image: data.image,
            createdAt: createdAtStr,
          };
        }
      );

      dispatch(setPets(petsList));
    };

    fetchPets();
  }, [dispatch]);

  useEffect(() => {
    const type = searchParams.get("type") as "cat" | "dog";
    if (type) {
      setPetType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("Estado global mascotas:", petsFromState);
  }, [petsFromState]);

  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        // Crear referencia en Storage
        const storageRef = ref(
          storage,
          `pets/${auth.currentUser?.uid}/${file.name}`
        );

        // Subir archivo
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        setPetImage(downloadURL); // Guardar la URL para mostrar la imagen
      } catch (error) {
        console.error("Error subiendo la imagen:", error);
        alert("No se pudo subir la imagen. Inténtalo nuevamente.");
        setPetImage("");
      }
    } else {
      setPetImage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const petData: Omit<PetType, "id"> = {
      type: petType,
      name,
      breed,
      gender,
      age,
      birthDate,
      weight,
      image: petImage || DEFAULT_IMAGES[petType], // Si petImage está vacío, pone la imagen por tipo
      createdAt: new Date().toISOString(),
    };

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Debes iniciar sesión para registrar una mascota.");
        return;
      }

      const petsRef = collection(db, "users", user.uid, "pets");
      const docRef = await addDoc(petsRef, petData);

      // Agrega al estado global Redux con el id generado por Firebase
      const petWithId: PetType = { id: docRef.id, ...petData };
      dispatch(addPet(petWithId));

      // Opcional: vuelve a sincronizar todas las mascotas después de agregar
      const snapshot = await getDocs(petsRef);
      const petsList: PetType[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          let createdAtStr = "";
          if (data.createdAt instanceof Timestamp) {
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === "string") {
            createdAtStr = data.createdAt;
          }
          return {
            id: doc.id,
            type: data.type,
            name: data.name,
            breed: data.breed,
            gender: data.gender,
            age: data.age,
            birthDate: data.birthDate,
            weight: data.weight,
            image: data.image,
            createdAt: createdAtStr,
          };
        }
      );
      dispatch(setPets(petsList));

      navigate("/success", {
        state: {
          petName: name,
          petImage: petImage,
          petType: petType,
        },
      });
    } catch (error) {
      console.error("Error al registrar la mascota:", error);
      alert("Ocurrió un error al guardar la mascota. Inténtalo nuevamente.");
    }
  };

  const handleBackClick = () => {
    navigate("/pet-type");
  };

  return (
    <div className="pet-registration-container">
      <div className="pet-registration-content">
        <div className="pet-registration-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          <h1 className="pet-registration-title">Register your {petType}!</h1>
        </div>

        <form className="pet-registration-form" onSubmit={handleSubmit}>
          <PetPhoto
            imageUrl={petImage || DEFAULT_IMAGES[petType]}
            onImageChange={handleImageChange}
          />

          <Input
            type="text"
            placeholder="Pet Name"
            value={name}
            onChange={setName}
            required
          />

          <Input
            type="text"
            placeholder="Breed"
            value={breed}
            onChange={setBreed}
            required
          />

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Gender</label>
              <select
                className="select-field"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={setAge}
                required
              />
            </div>
          </div>

          <Input
            type="date"
            placeholder="Birth Date"
            value={birthDate}
            onChange={setBirthDate}
            required
          />

          <Input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={setWeight}
            required
          />

          <Button variant="primary" text="Add Pet" onClick={() => {}} />
        </form>
      </div>
    </div>
  );
};

export default PetRegistration;
