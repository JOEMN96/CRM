import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import * as reduxThunk from "redux-thunk/extend-redux"; // Don't remove this import this is for thunk types error

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
