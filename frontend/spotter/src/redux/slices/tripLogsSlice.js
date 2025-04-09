import { createSlice } from "@reduxjs/toolkit";
import {
  createTripLog,
  fetchTripLogs,
  updateTripLog,
  deleteTripLog,
} from "../../api/endPoints";

const tripLogsSlice = createSlice({
  name: "tripLogs",
  initialState: {
    tripLogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTripLogsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trip Logs
      .addCase(fetchTripLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.tripLogs = Array.isArray(action.payload?.data) ? action.payload?.data : [];
      })
      .addCase(fetchTripLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch trip logs";
      })

      // Create Trip Log
      .addCase(createTripLog.fulfilled, (state, action) => {
        if (Array.isArray(state.tripLogs)) {
          state.tripLogs.push(action.payload);
        } else {
          console.error("tripLogs is not an array", state.tripLogs);
        }
      })

      // Update Trip Log
      .addCase(updateTripLog.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.tripLogs.findIndex((log) => log.id === updated.id);
        if (index !== -1) {
          state.tripLogs[index] = updated;
        }
      })

      // Delete Trip Log
      .addCase(deleteTripLog.fulfilled, (state, action) => {
        const id = action.payload;
        state.tripLogs = state.tripLogs.filter((log) => log.id !== id);
      });
  },
});

export const { clearTripLogsError } = tripLogsSlice.actions;
export default tripLogsSlice.reducer;
