import api from "./api";

const getActivities = async () => {
  const response = await api.get("/activities");
  return response.data;
};

const createActivity = async (activityData) => {
  const response = await api.post("/activities", activityData);
  return response.data;
};

export default {
  getActivities,
  createActivity,
};
