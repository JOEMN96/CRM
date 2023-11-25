import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  id: number;
  email: string;
  role: string;
}

const initialState: CounterState = {
  email: "",
  role: "",
  id: 0,
};

export const profileSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateBasicProfile: (state, action: PayloadAction<CounterState | null | undefined>) => {
      if (action.payload) {
        state.email = action.payload.email;
        state.id = action.payload.id;
        state.role = action.payload.role;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateBasicProfile } = profileSlice.actions;

export default profileSlice.reducer;
