import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DailyStatus {
  medicineId: string;
  date: string;
  medication: string;
  status: "taken" | "skip";
}

interface MedicineDailyState {
  records: DailyStatus[];
}

const initialState: MedicineDailyState = {
  records: [],
};

const medicineDailySlice = createSlice({
  name: "medicineDaily",
  initialState,
  reducers: {
    setDailyStatus: (state, action: PayloadAction<DailyStatus>) => {
      const { medicineId, date } = action.payload;

      // Eliminar registros anteriores del mismo día para esta medicina
      state.records = state.records.filter(
        (item) => !(item.medicineId === medicineId && item.date === date)
      );

      // Agregar nuevo registro
      state.records.push(action.payload);
    },
  },
});

export const { setDailyStatus } = medicineDailySlice.actions;
export default medicineDailySlice.reducer;
