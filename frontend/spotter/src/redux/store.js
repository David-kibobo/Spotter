import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import driversReducer from "./slices/driversSlice"
import trucksReducer from "./slices/trucksSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driversReducer,
    trucks: trucksReducer,

  },
});
