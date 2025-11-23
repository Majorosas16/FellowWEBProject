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
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const userTypeObj = {
              id: firebaseUser.uid,
              name: data.name ?? "",
              phoneNumber: data.phoneNumber ?? "",
              email: data.email ?? "",
              profileImage: data.profileImage ?? "",
            };
            dispatch(setUserAdd(userTypeObj));
            console.log("Usuario cargado:", userTypeObj);
          }
        } catch (error) {
          console.error("Error al cargar usuario:", error);
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return user;
};
