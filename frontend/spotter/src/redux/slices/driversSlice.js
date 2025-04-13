import { createSlice } from "@reduxjs/toolkit";
import {
  createDriver,
  fetchDrivers,
  updateDriver,
  fetchDriverHosStats,
} from "../../api/endPoints";

const driverSlice = createSlice({
  name: "drivers",
  initialState: {
    drivers: [],
    hosStats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearHosStats: (state) => {
      state.hosStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 CREATE DRIVER
      .addCase(createDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers.push(action.payload);
        state.error = null;
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 FETCH DRIVERS
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
        state.error = null;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 UPDATE DRIVER
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.drivers.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 FETCH DRIVER HOS STATS
      .addCase(fetchDriverHosStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverHosStats.fulfilled, (state, action) => {
        state.loading = false;
        state.hosStats = action.payload;
        state.error = null;
      })
      .addCase(fetchDriverHosStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearHosStats } = driverSlice.actions;
export default driverSlice.reducer;
