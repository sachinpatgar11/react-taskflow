import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProjects,
  createProject as createProjectApi,
} from "../../services/projectService";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      return await getProjects();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch projects.",
      );
    }
  },
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (project, { rejectWithValue }) => {
    try {
      return await createProjectApi(project);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to create project.",
      );
    }
  },
);

const projectSlice = createSlice({
  name: "projects",

  initialState: {
    items: [],
    loading: false,
    creating: false,
    error: null,
    createError: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProject.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export default projectSlice.reducer;
