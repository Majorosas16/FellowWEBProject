import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type EventType = "medicine" | "event";

export interface UserEvent {
  id: string;
  petId: string;
  type: EventType;
  title?: string;
  name?: string;
  description: string;
  date: string;
  time?: string;
  createdAt: string;
}

interface EventsState {
  events: UserEvent[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<UserEvent[]>) => {
      state.events = action.payload;
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
});

export const { setEvents, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
