import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
  type DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import {
  setEvents,
  clearEvents,
  type UserEvent,
  type EventType,
} from "../redux/slices/eventsSlice";
import type { AppDispatch } from "../redux/store";

const normalizeCreatedAt = (value: unknown): string => {
  if (!value) return new Date().toISOString();
  if (
    (value as Timestamp).toDate &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

export const useEventsListener = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const eventsRef = collection(db, "users", user.uid, "events");

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const events: UserEvent[] = snapshot.docs
        .map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();

          const rawType = data.type;
          const type: EventType | undefined =
            rawType === "medicine" || rawType === "event" ? rawType : undefined;
          if (!type) return null;

          // build typed UserEvent
          const ev: UserEvent = {
            id: doc.id,
            petId: typeof data.petId === "string" ? data.petId : "",
            type,
            title: typeof data.title === "string" ? data.title : undefined,
            name: typeof data.name === "string" ? data.name : undefined,
            description:
              typeof data.description === "string" ? data.description : "",
            date: typeof data.date === "string" ? data.date : "",
            time: typeof data.time === "string" ? data.time : undefined,
            createdAt: normalizeCreatedAt(data.createdAt),
          };

          return ev;
        })
        .filter((e): e is UserEvent => e !== null);

      dispatch(setEvents(events));
    });

    return () => {
      unsubscribe();
      dispatch(clearEvents());
    };
  }, [dispatch]);
};
