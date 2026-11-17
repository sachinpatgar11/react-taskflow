import api from "./api";

const getIssues = async () => {
  const response = await api.get("/issues");
  return response.data;
};

const createIssue = async (issueData) => {
  const response = await api.post("/issues", issueData);
  return response.data;
};

const updateIssue = async (id, issueData) => {
  const response = await api.put(`/issues/${id}`, issueData);
  return response.data;
};

const deleteIssue = async (id) => {
  const response = await api.delete(`/issues/${id}`);
  return response.data;
};

export default {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
};
