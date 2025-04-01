
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";



// Async Thunks
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/auth/login/", credentials);
      localStorage.setItem("session_cookie", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  });
  
  export const signupUser = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/auth/signup/", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  });
  
  export const logoutUser = createAsyncThunk("auth/logout", async () => {
    await API.post("/api/auth/logout/");
    localStorage.removeItem("session_cookie");
    return null;
  });
  
  export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/auth/me/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  });
  