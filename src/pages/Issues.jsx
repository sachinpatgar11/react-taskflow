import "../styles/issues.scss";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  ListTodo,
  RefreshCw,
} from "lucide-react";

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

const Issues = () => {
  const dispatch = useDispatch();

  const issues = useSelector(selectIssues);
  const loading = useSelector(selectIssuesLoading);
  const error = useSelector(selectIssuesError);

  const projects = useSelector((state) => state.projects.items);
  const projectsLoading = useSelector((state) => state.projects.loading);

  const users = useSelector((state) => state.users.items);
  const usersLoading = useSelector((state) => state.users.loading);

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

        <div className="issues-count">
          <ListTodo size={18} />
          <span>{issues.length} Issues</span>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="issues-empty">
          <ListTodo size={36} />
          <h2>No issues found</h2>
          <p>There are currently no issues to display.</p>
        </div>
      ) : (
        <div className="issues-list">
          {issues.map((issue) => {
            const project = getProject(issue.projectId);
            const assignee = getAssignee(issue.assigneeId);

            const status = statusConfig[issue.status] || statusConfig.todo;

            const StatusIcon = status.icon;

            return (
              <article className="issue-card" key={issue.id}>
                <div className="issue-card-main">
                  <div className="issue-title-row">
                    <h2>{issue.title}</h2>

                    <span
                      className={`issue-priority priority-${issue.priority}`}
                    >
                      {priorityConfig[issue.priority] || issue.priority}
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
    </div>
  );
};

export default Issues;
