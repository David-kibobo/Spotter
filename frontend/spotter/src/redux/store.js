import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import driversReducer from "./slices/driversSlice";
import trucksReducer from "./slices/trucksSlice";
import tripsReducer from "./slices/tripsSlice";
import tripLogsReducer from "./slices/tripLogsSlice";
import eldLogsReducer from "./slices/eldLogsSlice";
import loadsReducer from "./slices/loadsSlice";
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driversReducer,
    trucks: trucksReducer,
    trips: tripsReducer,
    tripLogs: tripLogsReducer,
    eldLogs: eldLogsReducer,
    loads: loadsReducer,
    ui:uiReducer
  },
});
