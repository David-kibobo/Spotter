import { createSlice, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLoading: false,
    loadingCount: 0, // optional: allows multiple concurrent requests
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.loadingCount += 1;
        state.isLoading = true;
      })
      .addMatcher(isFulfilled, (state) => {
        state.loadingCount -= 1;
        state.isLoading = state.loadingCount > 0;
      })
      .addMatcher(isRejected, (state) => {
        state.loadingCount -= 1;
        state.isLoading = state.loadingCount > 0;
      });
  },
});

export default uiSlice.reducer;
