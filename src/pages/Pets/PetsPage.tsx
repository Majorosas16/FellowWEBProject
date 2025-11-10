import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConfig";
import { setPets } from "../../redux/slices/petsSlice";
import type { RootState } from "../../redux/store";
import type { DocumentData } from "firebase/firestore";
import PetCard from "../../components/PetCard/PetCard";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import "./PetsPage.css";
import { useNavigate } from "react-router-dom";


const PetsPage: React.FC = () => {
  const dispatch = useDispatch();
  const pets = useSelector((state: RootState) => state.pets.pets);
    const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in");
      return;
    }

    // Referencia a la subcolección de mascotas del usuario
    const petsRef = collection(db, "users", user.uid, "pets");

    // Listener en tiempo real a los datos de Firestore
    const unsubscribe = onSnapshot(petsRef, (snapshot) => {
      const petsData = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name || "",
          type: data.type || "",
          age: data.age || "",
          image: data.image || "",
          color: data.color || "",
          vaccines: data.vaccines || "",
          medicines: data.medicines || "",
        };
      });

      dispatch(setPets(petsData));
    });

    // Limpieza del listener al desmontar el componente
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <div className="pets-container">
        <div className="pets-content">
          <div className="pets-header">
            <h1>Your pets are so cute!</h1>
          </div>

          <div className="pets-sections">
            {/* Sección para añadir una nueva mascota */}
            <div className="section-add">
              <div className="add-pet-card">
                <p className="add-pet-text">Let’s say hi to...</p>
                <div className="add-pet-icons">
                  <button onClick={() => navigate("/pet-type")}>
                  <img
                    src="/images/add-pet-plus.png"
                    alt="add"
                    className="add-pet-plus"
                  />
                  </button>
                  <img
                    src="/images/add-pet-silhouettes.png"
                    alt="pets"
                    className="add-pet-silhouettes"
                  />
                </div>
              </div>
            </div>

            {/* Sección donde se renderizan las mascotas */}
            <div className="section-pets">
              {pets.length === 0 ? (
                <p>No pets registered yet 🐾</p>
              ) : (
                pets.map((pet) => (
                  <div key={pet.id} className="section-pet-card">
                    <PetCard
                      name={pet.name}
                      age={pet.age || ""}
                      vaccines={pet.vaccines || ""}
                      medicines={pet.medicines || ""}
                      image={pet.image || "/images/default-pet.png"}
                      color={pet.color || "#FFE8B3"}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationButton />
    </>
  );
};

export default PetsPage;
