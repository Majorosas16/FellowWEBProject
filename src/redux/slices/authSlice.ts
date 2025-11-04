import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  userID: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  userID: "",
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //guarda el ID usuario
    setUser: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
      state.isLoading = false;
    },
    //limpia el usuario
    clearUser: (state) => {
      state.userID = "";
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
