import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projects/projectSlice";
import userReducer from "../features/users/userSlice";
import issueReducer from "../features/issues/issueSlice";

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    users: userReducer,
    issues: issueReducer,
  },
});
