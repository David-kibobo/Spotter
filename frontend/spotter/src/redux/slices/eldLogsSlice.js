import { createSlice } from "@reduxjs/toolkit";
import { createELDLog, fetchELDLogs, fetchELDLogsByDriver, fetchELDLogsByTrip } from "../../api/endPoints";

const eldLogsSlice = createSlice({
  name: "eldLogs",
  initialState: {
    eldLogs: [],
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
      })
      .addCase(fetchELDLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ELD Logs by Driver
      .addCase(fetchELDLogsByDriver.fulfilled, (state, action) => {
        state.eldLogs = action.payload;
      })
      // Fetch ELD Logs by Trip
      .addCase(fetchELDLogsByTrip.fulfilled, (state, action) => {
        state.eldLogs = action.payload;
      })
      // Create ELD Log
      .addCase(createELDLog.fulfilled, (state, action) => {
        state.eldLogs.push(action.payload);
      });
  },
});

export const { clearEldLogsError } = eldLogsSlice.actions;
export default eldLogsSlice.reducer;
