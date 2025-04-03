
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";



// Async Thunks
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/token/login/", credentials);
      
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  });
  
  export const signupUser = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/token/signup/carrier/", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Signup failed");
    }
  });
  export const createDriver = createAsyncThunk(
    "drivers/create",
    async (driverData, { rejectWithValue }) => {
      try {
        const response = await API.post("/api/user/drivers/create/", driverData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Driver creation failed");
      }
    }
  );
  export const fetchDrivers = createAsyncThunk(
    "drivers/fetch",
    async (_, { rejectWithValue }) => {
      try {
        const response = await API.get("/api/user/drivers/get/");
        return response.data; // Assuming response.data is an array of drivers
      } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Failed to fetch drivers");
      }
    }
  );
  
  export const logoutUser = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("session_cookie");  // Clear stored JWT token
    sessionStorage.clear();

  
    return null;
  });

  // Fetch current user
  export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/user/me/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch user");
    }
  });

  // ✅ Fetch trucks
  
  export const fetchTrucks = createAsyncThunk("trucks/fetchTrucks", async (_, { rejectWithValue }) => {
    try {
        const response = await API.get("api/trucks/");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Error fetching trucks");
    }
});

// ✅ Add a new truck
export const addTruck = createAsyncThunk("trucks/addTruck", async (truckData, { rejectWithValue }) => {
    try {
        const response = await API.post("api/trucks/", truckData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Error adding truck");
    }
});


// ✅ Update a truck
export const updateTruck = createAsyncThunk("trucks/updateTruck", async ({ id, truckData }, { rejectWithValue }) => {
  try {
      const response = await API.put(`api/trucks/${id}/`, truckData);
      return response.data;
  } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating truck");
  }
});

// ✅ Delete a truck
export const deleteTruck = createAsyncThunk("trucks/deleteTruck", async (id, { rejectWithValue }) => {
  try {
      await API.delete(`api/trucks/${id}/`);
      return id;
  } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting truck");
  }
});