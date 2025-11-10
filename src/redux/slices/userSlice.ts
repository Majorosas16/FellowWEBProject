import { createSlice } from "@reduxjs/toolkit";
import type { UserType } from "../../types/userType";

interface InitialState {
  user: UserType | null;
}
const initialState: InitialState = { user: null };

const userSlice = createSlice({
  name: "userAdd",
  initialState,
  reducers: {
    setUserAdd(state, action) {
      state.user = action.payload as UserType;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});


export const { setUserAdd, clearUser } = userSlice.actions;
export default userSlice.reducer;

