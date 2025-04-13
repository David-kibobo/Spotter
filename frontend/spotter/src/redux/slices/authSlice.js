import { createSlice } from "@reduxjs/toolkit";

import { signupUser, fetchCurrentUser, logoutUser, loginUser, changePassword } from "../../api/endPoints";



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // For fetching current user
    loading: false, // General loading state
    error: null,
    passwordChangeStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
    passwordChangeError: null,
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
        if (state.status === "idle") {
          state.status = "loading";
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload || "Failed to fetch user";
      })

      // 🔹 LOGOUT USER
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })

      // 🔹 CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.passwordChangeStatus = "loading";
        state.passwordChangeError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordChangeStatus = "succeeded";
        state.passwordChangeError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChangeStatus = "failed";
        state.passwordChangeError = action.payload;
      });
  },
});

export default authSlice.reducer;
