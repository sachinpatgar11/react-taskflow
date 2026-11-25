import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projects/projectSlice";
import userReducer from "../features/users/userSlice";
import issueReducer from "../features/issues/issueSlice";
import activityReducer from "../features/activities/activitySlice";

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    users: userReducer,
    issues: issueReducer,
    activities: activityReducer,
  },
});
