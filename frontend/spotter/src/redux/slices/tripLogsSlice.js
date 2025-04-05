import { createSlice } from "@reduxjs/toolkit";
import { createTripLog, fetchTripLogs, updateTripLog, deleteTripLog } from "../../api/endPoints";

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
        state.tripLogs = action.payload;
      })
      .addCase(fetchTripLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Trip Log
      .addCase(createTripLog.fulfilled, (state, action) => {
        state.tripLogs.push(action.payload);
      })
      // Update Trip Log
      .addCase(updateTripLog.fulfilled, (state, action) => {
        const index = state.tripLogs.findIndex((log) => log.id === action.payload.id);
        if (index !== -1) {
          state.tripLogs[index] = action.payload;
        }
      })
      // Delete Trip Log
      .addCase(deleteTripLog.fulfilled, (state, action) => {
        state.tripLogs = state.tripLogs.filter((log) => log.id !== action.payload);
      });
  },
});

export const { clearTripLogsError } = tripLogsSlice.actions;
export default tripLogsSlice.reducer;
