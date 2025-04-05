
import { createSlice } from "@reduxjs/toolkit";
import { fetchTrucks, addTruck, deleteTruck, updateTruck } from "../../api/endPoints";

const trucksSlice = createSlice({
    name: "trucks",
    initialState: {
        trucks: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTrucksError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Trucks
            .addCase(fetchTrucks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrucks.fulfilled, (state, action) => {
                state.loading = false;
                state.trucks = action.payload;
            })
            .addCase(fetchTrucks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Truck
            .addCase(addTruck.fulfilled, (state, action) => {
                state.trucks.push(action.payload);
            })
            // Update Truck
            .addCase(updateTruck.fulfilled, (state, action) => {
                if (Array.isArray(state.trucks)) {
                  const index = state.trucks.findIndex((truck) => truck.id === action.payload.id);
                  if (index !== -1) {
                    state.trucks[index] = action.payload;
                  }
                } else {
                  console.error("Expected 'state.trucks' to be an array.");
                }
              })
              
            // Delete Truck
            .addCase(deleteTruck.fulfilled, (state, action) => {
                state.trucks = state.trucks.filter((truck) => truck.id !== action.payload);
            });
    },
});
export const { clearTrucksError } = trucksSlice.actions;
export default trucksSlice.reducer;