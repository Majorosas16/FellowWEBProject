import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { setUserAdd, clearUser } from "../redux/slices/userSlice";
import type { RootState } from "../redux/store";

export const useAuthUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userAdd.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado
        if (!user) {
          // Solo carga si no hay usuario en Redux
          try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              console.log("Usuario cargado:", userSnap.data());
              dispatch(setUserAdd(userSnap.data()));
            }
          } catch (error) {
            console.error("Error al cargar usuario:", error);
          }
        }
      } else {
        // Usuario no autenticado
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  return user;
};