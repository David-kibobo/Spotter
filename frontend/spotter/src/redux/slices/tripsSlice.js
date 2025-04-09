import { createSlice } from "@reduxjs/toolkit";
import { createTrip, fetchTrips, updateTrip, deleteTrip, fetchDriverTrips } from "../../api/endPoints";

const initialState = {
  trips: [],
  loading: false,
  error: null,
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    clearTripsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch trips";
      })

      // Fetch Driver Trips
      .addCase(fetchDriverTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = Array.isArray(action.payload?.data) ? action.payload?.data : [];
      })
      .addCase(fetchDriverTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch driver trips";
      })

      // Create Trip
      .addCase(createTrip.fulfilled, (state, action) => {
        const newTrip = action.payload;
        if (newTrip && typeof newTrip === "object") {
          state.trips = [...state.trips, newTrip];
        }
      })

      // Update Trip
      .addCase(updateTrip.fulfilled, (state, action) => {
        const updatedTrip = action.payload;
        state.trips = state.trips.map((trip) =>
          trip.id === updatedTrip.id ? updatedTrip : trip
        );
      })

      // Delete Trip
      .addCase(deleteTrip.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.trips = state.trips.filter((trip) => trip.id !== deletedId);
      });
  },
});

export const { clearTripsError } = tripsSlice.actions;
export default tripsSlice.reducer;
