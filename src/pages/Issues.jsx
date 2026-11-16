import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  ListTodo,
  RefreshCw,
  Plus,
} from "lucide-react";
import "../styles/issues.scss";

import CreateIssueModal from "../components/issues/CreateIssueModal";

import { fetchIssues } from "../features/issues/issueSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";

import {
  selectIssues,
  selectIssuesLoading,
  selectIssuesError,
} from "../features/issues/issueSelectors";

const statusConfig = {
  todo: {
    label: "To Do",
    className: "todo",
    icon: Circle,
  },
  "in-progress": {
    label: "In Progress",
    className: "in-progress",
    icon: Clock,
  },
  review: {
    label: "In Review",
    className: "review",
    icon: AlertCircle,
  },
  done: {
    label: "Done",
    className: "done",
    icon: CheckCircle2,
  },
};

const priorityConfig = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const normalizeValue = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

const Issues = () => {
  const dispatch = useDispatch();

  const issues = useSelector(selectIssues);
  const loading = useSelector(selectIssuesLoading);
  const error = useSelector(selectIssuesError);

  const projects = useSelector((state) => state.projects.items);
  const projectsLoading = useSelector((state) => state.projects.loading);

  const users = useSelector((state) => state.users.items);
  const usersLoading = useSelector((state) => state.users.loading);

  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredIssues = issues.filter((issue) => {
    const matchesProject =
      projectFilter === "all" || String(issue.projectId) === projectFilter;

    const matchesStatus =
      statusFilter === "all" ||
      normalizeValue(issue.status) === normalizeValue(statusFilter);

    const matchesPriority =
      priorityFilter === "all" ||
      normalizeValue(issue.priority) === priorityFilter;

    return matchesProject && matchesStatus && matchesPriority;
  });

  const resetFilters = () => {
    setProjectFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  useEffect(() => {
    dispatch(fetchIssues());

    if (projects.length === 0 && !projectsLoading) {
      dispatch(fetchProjects());
    }

    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, projects.length, projectsLoading, users.length, usersLoading]);

  const getProject = (projectId) =>
    projects.find((project) => String(project.id) === String(projectId));

  const getAssignee = (assigneeId) =>
    users.find((user) => String(user.id) === String(assigneeId));

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (loading) {
    return (
      <div className="issues-loading" role="status">
        <RefreshCw size={22} className="loading-icon" />
        <p>Loading issues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="issues-error" role="alert">
        <AlertCircle size={24} />
        <p>{error}</p>
        <button type="button" onClick={() => dispatch(fetchIssues())}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="issues-page">
      <div className="issues-page-header">
        <div>
          <h1>Issues</h1>
          <p>Track, organize, and manage your team's work.</p>
        </div>
        <div className="issues-header-actions">
          <div className="issues-count">
            <ListTodo size={18} />
            <span>{issues.length} Issues</span>
          </div>
          <button
            type="button"
            className="create-button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            Create Issue
          </button>
        </div>
      </div>
      <div className="issues-filter-bar">
        <div className="filter-group">
          <label htmlFor="project-filter">Project</label>
          <select
            id="project-filter"
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
          >
            <option value="all">All Projects</option>

            {projects.map((project) => (
              <option key={project.id} value={String(project.id)}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <button
          type="button"
          className="reset-filter-button"
          onClick={resetFilters}
          disabled={
            projectFilter === "all" &&
            statusFilter === "all" &&
            priorityFilter === "all"
          }
        >
          Reset filters
        </button>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="issues-empty">
          <ListTodo size={36} />

          <h2>
            {issues.length === 0 ? "No issues found" : "No matching issues"}
          </h2>

          <p>
            {issues.length === 0
              ? "There are currently no issues to display."
              : "Try changing your filters to see more issues."}
          </p>

          {issues.length > 0 && (
            <button
              type="button"
              className="reset-filter-button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="issues-list">
          {filteredIssues.map((issue) => {
            const project = getProject(issue.projectId);
            const assignee = getAssignee(issue.assigneeId);

            const status =
              statusConfig[normalizeValue(issue.status)] || statusConfig.todo;
            const priority = normalizeValue(issue.priority);

            const StatusIcon = status.icon;

            return (
              <article className="issue-card" key={issue.id}>
                <div className="issue-card-main">
                  <div className="issue-title-row">
                    <h2>{issue.title}</h2>

                    <span className={`issue-priority priority-${priority}`}>
                      {priorityConfig[priority] || issue.priority}
                    </span>
                  </div>

                  <p className="issue-description">{issue.description}</p>

                  <div className="issue-metadata">
                    <span className="issue-project">
                      <span
                        className="project-color-dot"
                        style={{
                          backgroundColor: project?.color || "#94a3b8",
                        }}
                      />
                      {project?.name || "Unknown project"}
                    </span>

                    <span className="issue-date">
                      <CalendarDays size={14} />
                      {issue.createdAt || "No date"}
                    </span>
                  </div>
                </div>

                <div className="issue-card-footer">
                  <span className={`issue-status status-${status.className}`}>
                    <StatusIcon size={14} />
                    {status.label}
                  </span>

                  <div className="issue-assignee">
                    {assignee ? (
                      <>
                        <span className="user-avatar">
                          {assignee.avatar || getInitials(assignee.name)}
                        </span>
                        <span>{assignee.name}</span>
                      </>
                    ) : (
                      <span>Unassigned</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Issues;
