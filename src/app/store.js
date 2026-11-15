import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projects/projectSlice";
import userReducer from "../features/users/userSlice";

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    users: userReducer,
  },
});
