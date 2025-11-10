import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { setEvents } from "../redux/slices/eventsSlice";

export const useFetchEvents = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const eventsRef = collection(db, "users", user.uid, "events");
    const q = query(eventsRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          petId: data.petId,
          type: data.type,
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time || "",
          createdAt: data.createdAt?.toDate().toISOString() || "",
        };
      });

      dispatch(setEvents(events));
    });

    return () => unsubscribe();
  }, [dispatch]);
};
