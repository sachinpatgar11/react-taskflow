import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProjects,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
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

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateProjectApi(id, updates);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project.",
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
    updating: false,
    updateError: null,
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
      })
      .addCase(updateProject.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updating = false;

        const updatedProject = action.payload;

        const index = state.items.findIndex(
          (project) => String(project.id) === String(updatedProject.id),
        );

        if (index !== -1) {
          state.items[index] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || action.error.message;
      });
  },
});

export default projectSlice.reducer;
