import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import { toast } from "react-toastify";

// Async Thunks

// Authentication
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/token/login/", credentials);
    return response.data;
  } catch (error) {
    toast.error("❌ Login failed. Please make sure you are using the correct details.");
    return rejectWithValue(error.response?.data?.error || "Login failed");
  }
});

export const signupUser = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/token/signup/carrier/", userData);
    toast.success(" ✅ Signup was successful. Please login to access your account.")
    return response.data;
  } catch (error) {

    return rejectWithValue(error.response?.data?.error || "Signup failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("access_token");  // Clear stored JWT token
  sessionStorage.clear();
  return null;
});

export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/user/me/");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch user");
  }
});



export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ current_password, new_password, confirm_password }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/user/change-password/", {
        current_password,
        new_password,
        confirm_password,
      });
       toast.success(" ✅ You changed your password.")
      return response.data.message; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to change password"
      );
    }
  }
);


// Drivers
export const createDriver = createAsyncThunk("drivers/create", async (driverData, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/user/drivers/create/", driverData);
    toast.success("✅ Driver created successfully. Don't forget to provide them with their login details.");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Driver creation failed");
  }
});

export const fetchDrivers = createAsyncThunk("drivers/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/user/drivers/get/");
    return response.data; // Assuming response.data is an array of drivers
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch drivers");
  }
});

export const updateDriver = createAsyncThunk("drivers/updateDriver", async ({ id, driverData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`api/user/drivers/${id}/update/`, driverData);
    toast.success("✅ Driver details updated successfully!");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating driver");
  }
});
export const fetchDriverHosStats = createAsyncThunk(
  "drivers/fetchHosStats",
  async ({ driverId, date }, { rejectWithValue }) => {
    try {
      const url = date
        ? `api/logistics/hos/stats/${driverId}/?date=${date}`
        : `api/logistics/hos/stats/${driverId}/`;

      const response = await API.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch HOS stats");
    }
  }
);

// Trucks
export const fetchTrucks = createAsyncThunk("trucks/fetchTrucks", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("api/trucks/");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Error fetching trucks");
  }
});

export const addTruck = createAsyncThunk("trucks/addTruck", async (truckData, { rejectWithValue }) => {
  try {
    const response = await API.post("api/trucks/", truckData);
    toast.success("✅ Truck created successfully!");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Error adding truck");
  }
});

export const updateTruck = createAsyncThunk("trucks/updateTruck", async ({ id, truckData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`api/trucks/${id}/`, truckData);
    toast.success("✅ Truck updated successfully!");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating truck");
  }
});

export const deleteTruck = createAsyncThunk("trucks/deleteTruck", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`api/trucks/${id}/`);
    toast.success("✅ Truck deleted successfully!");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error deleting truck");
  }
});


// Trips

export const createTrip = createAsyncThunk(
  "logistics/createTrip",
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/logistics/trips/", tripData);
      toast.success("✅ Trip created successfully!");
      return response.data;
    } catch (error) {
      // Log error for debugging in dev tools
      console.error("Create Trip Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || "Failed to create trip");
    }
  }
);

export const fetchTrips = createAsyncThunk("logistics/fetchTrips", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/logistics/trips/");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch trips");
  }
});

export const fetchActiveTrips = createAsyncThunk(
  "logistics/fetchActiveTrips",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/logistics/active-trips/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch active trips"
      );
    }
  }
);

export const updateTrip = createAsyncThunk(
  "logistics/updateTrip",
  async ({ id, tripData }, { rejectWithValue }) => {
    try {

      const response = await API.patch(`/api/logistics/trips/${id}/`, tripData);
      toast.success("✅ Trip updated successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update trip");
    }
  }
);

export const deleteTrip = createAsyncThunk("logistics/deleteTrip", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/api/logistics/trips/${id}/`);
    toast.success("✅ Trip deleted successfully!");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete trip");
  }
});


// Trip Logs
export const createTripLog = createAsyncThunk(
  "logistics/createTripLog",
  async ({ currentTripId, tripLogData }, { rejectWithValue }) => {
    console.log("endpointTripId", currentTripId);
    try {
      const response = await API.post(`/api/logistics/trips/${currentTripId}/logs/`, tripLogData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create trip log");
    }
  },
  {
    // 🔥 Add this to prevent the spinner from showing for this action
    getPendingMeta: () => ({ ignoreLoading: true }),
  }
);


export const fetchTripLogs = createAsyncThunk(
  "logistics/fetchTripLogs",
  async (tripId = null, { rejectWithValue }) => {
    try {
      const endpoint = tripId
        ? `/api/logistics/trips/${tripId}/logs/`
        : `/api/logistics/trip-logs/`;

      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch trip logs"
      );
    }
  }
);

export const fetchDriverTrips = createAsyncThunk("logistics/fetchDriverTrips", async (driver_id, { rejectWithValue, getState }) => {
  try {
    // const user = getState().auth.user;
    // if (!user?.driver_profile) {
    //   return rejectWithValue("User is not a driver.");
    // }

    // Fetch trips assigned to the specific driver
    const response = await API.get(`/api/logistics/driver-trips/${driver_id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch driver trips");
  }
});


export const updateTripLog = createAsyncThunk("logistics/updateTripLog", async ({ tripId, logId, logData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/logistics/trips/${tripId}/logs/${logId}/`, logData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to update trip log");
  }
});

export const deleteTripLog = createAsyncThunk("logistics/deleteTripLog", async ({ tripId, logId }, { rejectWithValue }) => {
  try {
    await API.delete(`/api/logistics/trips/${tripId}/logs/${logId}/`);
    return logId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete trip log");
  }
});


// ELD Logs
export const createELDLog = createAsyncThunk("logistics/createELDLog", async (eldLogData, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/logistics/eld-logs/", eldLogData);
    return response.data;
  } catch (error) {

    return rejectWithValue(error.response?.data?.error || "Failed to create ELD log");
  }
});

export const fetchELDLogs = createAsyncThunk("logistics/fetchELDLogs", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/logistics/eld-logs/");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch ELD logs");
  }
});

export const fetchELDLogsByDriver = createAsyncThunk(
  "logistics/fetchELDLogsByDriver",
  async ({ driverId, date = null }, { rejectWithValue }) => {
    try {
      const url = date
        ? `/api/logistics/eld-logs/driver/${driverId}/?date=${date}`
        : `/api/logistics/eld-logs/driver/${driverId}/`;

      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch ELD logs by driver"
      );
    }
  }
);


export const fetchELDLogsByTrip = createAsyncThunk("logistics/fetchELDLogsByTrip", async (tripId, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/logistics/eld-logs/trip/${tripId}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch ELD logs by trip");
  }
});
// Update ELD Log
export const updateELDLog = createAsyncThunk(
  "logistics/updateELDLog",
  async ({ eldLogId, eldLogData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/api/logistics/eld-logs/${eldLogId}/`, eldLogData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update ELD log");
    }
  }
);

// Delete ELD Log
export const deleteELDLog = createAsyncThunk(
  "logistics/deleteELDLog",
  async (eldLogId, { rejectWithValue }) => {
    try {
      await API.delete(`/api/logistics/eld-logs/${eldLogId}/`);
      return eldLogId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete ELD log");
    }
  }
);


// Loads
export const createLoad = createAsyncThunk("logistics/createLoad", async ({ loadData, tripId }, { rejectWithValue }) => {
  try {
    const response = await API.post(`/api/logistics/loads/${tripId}/`, loadData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to create load");
  }
});

export const fetchLoads = createAsyncThunk("logistics/fetchLoads", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/logistics/loads/");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch loads");
  }
});

export const updateLoad = createAsyncThunk("logistics/updateLoad", async ({ loadId, loadData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/logistics/loads/${loadId}/`, loadData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to update load");
  }
});

export const deleteLoad = createAsyncThunk("logistics/deleteLoad", async (loadId, { rejectWithValue }) => {
  try {
    await API.delete(`/api/logistics/loads/${loadId}/`);
    return loadId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete load");
  }
});





