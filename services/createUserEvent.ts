import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import type { EventType } from "../redux/slices/eventsSlice";

export interface CreateUserEventInput {
  petId: string;
  type: EventType;
  title?: string;
  name?: string;
  description: string;
  date: string;
  time?: string;
}

export const createUserEvent = async (
  input: CreateUserEventInput
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const eventsRef = collection(db, "users", user.uid, "events");

  await addDoc(eventsRef, {
    petId: input.petId,
    type: input.type,
    title: input.title ?? null,
    name: input.name ?? null,
    description: input.description,
    date: input.date,
    time: input.time ?? null,
    createdAt: serverTimestamp(),
  });
};
