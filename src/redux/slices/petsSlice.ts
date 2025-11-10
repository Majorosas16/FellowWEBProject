import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PetType } from "../../types/petsType";

// interface Pet {
//   id: string;
//   name: string;
//   type: string;
//   age?: string;
//   image?: string;
//   color?: string;
//   vaccines?: string;
//   medicines?: string;
// }

interface PetsState {
  pets: PetType[];
}

const initialState: PetsState = {
  pets: [],
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<PetType[]>) => {
      state.pets = action.payload;
    },
    addPet: (state, action: PayloadAction<PetType>) => {
      state.pets.push(action.payload);
    },
    clearPets: (state) => {
      state.pets = [];
    },
  },
});

export const { setPets, addPet, clearPets } = petsSlice.actions;
export default petsSlice.reducer;
