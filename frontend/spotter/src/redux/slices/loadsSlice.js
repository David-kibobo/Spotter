import { createSlice } from "@reduxjs/toolkit";
import { createLoad, fetchLoads, updateLoad, deleteLoad } from "../../api/endPoints";

const initialState = {
  loads: [],
  loading: false,
  error: null,
};

const loadsSlice = createSlice({
  name: "loads",
  initialState,
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
        state.loads = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(fetchLoads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch loads";
      })

      // Create Load
      .addCase(createLoad.fulfilled, (state, action) => {
        const newLoad = action.payload;
        if (newLoad && typeof newLoad === "object") {
          state.loads = [...state.loads, newLoad];
        }
      })

      // Update Load
      .addCase(updateLoad.fulfilled, (state, action) => {
        const updatedLoad = action.payload;
        state.loads = state.loads.map((load) =>
          load.id === updatedLoad.id ? updatedLoad : load
        );
      })

      // Delete Load
      .addCase(deleteLoad.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.loads = state.loads.filter((load) => load.id !== deletedId);
      });
  },
});

export const { clearLoadsError } = loadsSlice.actions;
export default loadsSlice.reducer;
