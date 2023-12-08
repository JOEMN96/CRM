import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ProfileState {
  profile: { userId: number; profilePicFilePath: String };
  user: {
    id: number;
    name: String;
    role: String;
    email: string;
  };
}

const initialState: ProfileState = {
  profile: {
    userId: 0,
    profilePicFilePath: "",
  },
  user: {
    id: 0,
    name: "",
    role: "",
    email: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileInit: (state, action: PayloadAction<ProfileState | null | undefined>) => {
      if (action.payload) {
        return {
          ...state,
          ...action.payload,
        };
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProfileInit } = profileSlice.actions;

export default profileSlice.reducer;
