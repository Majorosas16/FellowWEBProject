import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Pet {
  id: string;
  name: string;
  type: string;
  age?: string;
  image?: string;
  color?: string;
  vaccines?: string;
  medicines?: string;
}

interface PetsState {
  pets: Pet[];
}

const initialState: PetsState = {
  pets: [],
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    clearPets: (state) => {
      state.pets = [];
    },
  },
});

export const { setPets, addPet, clearPets } = petsSlice.actions;
export default petsSlice.reducer;
