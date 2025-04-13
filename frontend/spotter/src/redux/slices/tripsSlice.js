import { createSlice } from "@reduxjs/toolkit";
import { createTrip, fetchTrips, updateTrip, deleteTrip, fetchDriverTrips,fetchActiveTrips } from "../../api/endPoints";

const initialState = {
  trips: [],
  activeTrips: [],
  loading: false,
  activeTripsLoading: false,
  error: null,
  activeTripsError: null,
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
      
       // Fetch Active Trips
       .addCase(fetchActiveTrips.pending, (state) => {
        state.activeTripsLoading = true;
        state.activeTripsError = null;
      })
      .addCase(fetchActiveTrips.fulfilled, (state, action) => {
        state.activeTripsLoading = false;
        state.activeTrips = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
      })
      .addCase(fetchActiveTrips.rejected, (state, action) => {
        state.activeTripsLoading = false;
        state.activeTripsError =
          action.payload || "Failed to fetch active trips";
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
