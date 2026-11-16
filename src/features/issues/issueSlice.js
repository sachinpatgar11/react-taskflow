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

export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (issueData, { rejectWithValue }) => {
    try {
      return await issueService.createIssue(issueData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create issue.",
      );
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
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
      })
      .addCase(createIssue.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || "Failed to create issue.";
      });
  },
});

export default issueSlice.reducer;
