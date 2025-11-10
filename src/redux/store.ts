import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import petsReducer from "./slices/petsSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pets: petsReducer,
    userAdd: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
