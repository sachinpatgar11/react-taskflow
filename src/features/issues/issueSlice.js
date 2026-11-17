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

export const updateIssue = createAsyncThunk(
  "issues/updateIssue",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await issueService.updateIssue(id, updates);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update issue.",
      );
    }
  },
);

export const deleteIssue = createAsyncThunk(
  "issues/deleteIssue",
  async (id, { rejectWithValue }) => {
    try {
      await issueService.deleteIssue(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete issue.",
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
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
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
      })
      .addCase(updateIssue.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.updating = false;

        const updatedIssue = action.payload;

        const index = state.items.findIndex(
          (issue) => String(issue.id) === String(updatedIssue.id),
        );

        if (index !== -1) {
          state.items[index] = updatedIssue;
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || "Failed to update issue.";
      })
      .addCase(deleteIssue.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })

      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.deleting = false;

        state.items = state.items.filter(
          (issue) => String(issue.id) !== String(action.payload),
        );
      })

      .addCase(deleteIssue.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || "Failed to delete issue.";
      });
  },
});

export default issueSlice.reducer;
