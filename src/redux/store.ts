import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import petsReducer from "./slices/petsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pets: petsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
