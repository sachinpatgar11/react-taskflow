import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import issueService from "../../services/issueService";

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (_, { rejectWithValue }) => {
    try {
      return await issueService.getIssues();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch issues.",
      );
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch issues.";
      });
  },
});

export default issueSlice.reducer;
