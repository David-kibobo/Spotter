import { createSlice } from "@reduxjs/toolkit";
import { loginUser, fetchCurrentUser, signupUser, logoutUser } from "../../api/endPoints";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    loading: false,  // General loading state
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("access_token", action.payload.message.access); 
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 SIGNUP USER
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        if (state.status === "idle") { // ✅ Prevents unnecessary refetching
          state.status = "loading";
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;  // ✅ Remove user if fetch fails
        state.error = action.payload || "Failed to fetch user";
      })

      // 🔹 LOGOUT USER
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";  // ✅ Reset status to allow re-fetching after logout
      });
  },
});

export default authSlice.reducer;
