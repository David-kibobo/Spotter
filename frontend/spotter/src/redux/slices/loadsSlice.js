import { createSlice } from "@reduxjs/toolkit";
import { createLoad, fetchLoads, updateLoad, deleteLoad } from "../../api/endPoints";

const loadsSlice = createSlice({
  name: "loads",
  initialState: {
    loads: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLoadsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Loads
      .addCase(fetchLoads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoads.fulfilled, (state, action) => {
        state.loading = false;
        state.loads = action.payload;
      })
      .addCase(fetchLoads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Load
      .addCase(createLoad.fulfilled, (state, action) => {
        state.loads.push(action.payload);
      })
      // Update Load
      .addCase(updateLoad.fulfilled, (state, action) => {
        const index = state.loads.findIndex((load) => load.id === action.payload.id);
        if (index !== -1) {
          state.loads[index] = action.payload;
        }
      })
      // Delete Load
      .addCase(deleteLoad.fulfilled, (state, action) => {
        state.loads = state.loads.filter((load) => load.id !== action.payload);
      });
  },
});

export const { clearLoadsError } = loadsSlice.actions;
export default loadsSlice.reducer;
