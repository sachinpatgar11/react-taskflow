import api from "./api";

const getIssues = async () => {
  const response = await api.get("/issues");
  return response.data;
};

export default {
  getIssues,
};
