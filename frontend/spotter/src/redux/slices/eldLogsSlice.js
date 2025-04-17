import { createSlice } from "@reduxjs/toolkit";
import { createELDLog, fetchELDLogs, fetchELDLogsByDriver, fetchELDLogsByTrip } from "../../api/endPoints";

const eldLogsSlice = createSlice({
  name: "eldLogs",
  initialState: {
    eldLogs: [],
    driverEldLogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearEldLogsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ELD Logs
      .addCase(fetchELDLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchELDLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.eldLogs = action.payload;
        state.error = null; // Clear any previous error on success
      })
      .addCase(fetchELDLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch ELD logs.";
      })
      // Fetch ELD Logs by Driver
      .addCase(fetchELDLogsByDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchELDLogsByDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driverEldLogs = action.payload;
        state.error = null; // Clear any previous error on success
      })
      .addCase(fetchELDLogsByDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch ELD logs for the driver.";
      })
      // Fetch ELD Logs by Trip
      .addCase(fetchELDLogsByTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchELDLogsByTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.eldLogs = action.payload;
        state.error = null; // Clear any previous error on success
      })
      .addCase(fetchELDLogsByTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch ELD logs for the trip.";
      })
      // Create ELD Log
      .addCase(createELDLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createELDLog.fulfilled, (state, action) => {
        state.loading = false;
        // Handle success by pushing new log into the eldLogs array
        alert(action.payload?.message); // Optional alert
        if (Array.isArray(state.eldLogs)) {
          state.eldLogs.push(action.payload);
        } else {
          console.error('eldLogs is not an array', state.eldLogs);
        }
        state.error = null; // Clear any previous error on success
      })
      .addCase(createELDLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create ELD log.";
        alert(action.payload)
      });
  },
});

export const { clearEldLogsError } = eldLogsSlice.actions;
export default eldLogsSlice.reducer;
