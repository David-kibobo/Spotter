import { createSlice } from "@reduxjs/toolkit";
import { createDriver, fetchDrivers } from "../../api/endPoints";

const driverSlice = createSlice({
  name: "drivers",
  initialState: {
    drivers: [],  
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.drivers.push(action.payload); // ✅ Add new driver
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
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = driverSlice.actions;
export default driverSlice.reducer;
