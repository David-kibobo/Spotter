import { createSlice } from "@reduxjs/toolkit";
import { createTrip, fetchTrips, updateTrip, deleteTrip } from "../../api/endPoints";

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTripsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Trip
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      // Update Trip
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.trips.findIndex((trip) => trip.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      // Delete Trip
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter((trip) => trip.id !== action.payload);
      });
  },
});

export const { clearTripsError } = tripsSlice.actions;
export default tripsSlice.reducer;
