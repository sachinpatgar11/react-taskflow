import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import activityService from "../../services/activityService";

export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      return await activityService.getActivities();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activities.",
      );
    }
  },
);

export const createActivity = createAsyncThunk(
  "activities/createActivity",
  async (activityData, { rejectWithValue }) => {
    try {
      return await activityService.createActivity(activityData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create activity.",
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

const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export default activitySlice.reducer;
