import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import petsReducer from "./slices/petsSlice";
import userSlice from "./slices/userSlice";
import eventsReducer from "./slices/eventsSlice";
import medicineDailyReducer from "./slices/medicineDailySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pets: petsReducer,
    userAdd: userSlice,
    events: eventsReducer,
    medicineDaily: medicineDailyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
