import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "../../types/userType";

interface InitialState {
  user: UserType | null;
}

const initialState: InitialState = { user: null };

const userSlice = createSlice({
  name: "userAdd",
  initialState,
  reducers: {
    setUserAdd(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUserProfile(state, action: PayloadAction<Partial<UserType>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUserAdd, clearUser, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;