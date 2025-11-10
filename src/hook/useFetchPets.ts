import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  collection,
  getDocs,
  Timestamp,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { setPets } from "../redux/slices/petsSlice";
import type { PetType } from "../types/petsType";

export const useFetchPets = () => {
  const dispatch = useDispatch();

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
};
