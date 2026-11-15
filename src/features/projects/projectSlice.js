import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProjects,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  getProjectById,
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

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProjectApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project.",
      );
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProjectById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project details.",
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
    deleting: false,
    deleteError: null,
    selectedProject: null,
    detailsLoading: false,
    detailsError: null,
    detailsRequestId: null,
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
      })
      .addCase(deleteProject.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deleting = false;

        state.items = state.items.filter(
          (project) => String(project.id) !== String(action.payload),
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError =
          action.payload || action.error.message || "Failed to delete project.";
      })
      .addCase(fetchProjectById.pending, (state, action) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedProject = null;
        state.detailsRequestId = action.meta.requestId;
      })

      .addCase(fetchProjectById.fulfilled, (state, action) => {
        // Ignore responses from older requests.
        if (state.detailsRequestId !== action.meta.requestId) {
          return;
        }

        state.detailsLoading = false;
        state.detailsError = null;
        state.selectedProject = action.payload;
        state.detailsRequestId = null;
      })

      .addCase(fetchProjectById.rejected, (state, action) => {
        // Ignore responses from older requests.
        if (state.detailsRequestId !== action.meta.requestId) {
          return;
        }

        state.detailsLoading = false;

        // An intentional abort is not an API error.
        state.detailsError = action.meta.aborted
          ? null
          : action.payload ||
            action.error.message ||
            "Failed to fetch project details.";

        state.detailsRequestId = null;
      });
  },
});

export default projectSlice.reducer;
