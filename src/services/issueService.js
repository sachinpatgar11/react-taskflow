import api from "./api";

const getIssues = async () => {
  const response = await api.get("/issues");
  return response.data;
};

const createIssue = async (issueData) => {
  const response = await api.post("/issues", issueData);
  return response.data;
};

export default {
  getIssues,
  createIssue,
};
