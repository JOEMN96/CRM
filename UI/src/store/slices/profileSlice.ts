import { api } from "@/utils/axios.instance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async () => {
  const response = await api.get("/profile");
  return response.data;
});

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfilePicPath: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        return {
          ...state,
          profile: {
            profilePicFilePath: action.payload,
            userId: state.profile.userId,
          },
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      if (action.payload.profile) {
        state.profile = action.payload.profile;
      }
      state.user = action.payload.user;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateProfilePicPath } = profileSlice.actions;

export default profileSlice.reducer;
