import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CalendarDays,
  AlertCircle,
  Circle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Pencil,
  Trash2,
} from "lucide-react";

import EditIssueModal from "../components/issues/EditIssueModal";
import DeleteIssueModal from "../components/issues/DeleteIssueModal";

import { fetchIssues } from "../features/issues/issueSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";
import { updateIssue } from "../features/issues/issueSlice";

import "../styles/issue-details.scss";

const statusConfig = {
  todo: {
    label: "To Do",
    className: "todo",
    icon: Circle,
  },
  inprogress: {
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

const normalizeValue = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

const IssueDetails = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const issues = useSelector((state) => state.issues.items);
  const issuesLoading = useSelector((state) => state.issues.loading);
  const issuesError = useSelector((state) => state.issues.error);

  const projects = useSelector((state) => state.projects.items);
  const projectsLoading = useSelector((state) => state.projects.loading);

  const users = useSelector((state) => state.users.items);
  const usersLoading = useSelector((state) => state.users.loading);

  useEffect(() => {
    if (issues.length === 0 && !issuesLoading && !issuesError) {
      dispatch(fetchIssues());
    }

    if (projects.length === 0 && !projectsLoading) {
      dispatch(fetchProjects());
    }

    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsers());
    }
  }, [
    dispatch,
    issues.length,
    issuesLoading,
    issuesError,
    projects.length,
    projectsLoading,
    users.length,
    usersLoading,
  ]);

  const issue = issues.find((item) => String(item.id) === String(issueId));

  const project = projects.find(
    (item) => String(item.id) === String(issue?.projectId),
  );

  const assignee = users.find(
    (item) => String(item.id) === String(issue?.assigneeId),
  );

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    try {
      await dispatch(
        updateIssue({
          id: issue.id,
          updates: {
            status: newStatus,
          },
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update issue status:", error);
    }
  };

  const handleAssigneeChange = async (event) => {
    const newAssigneeId = event.target.value;

    try {
      await dispatch(
        updateIssue({
          id: issue.id,
          updates: {
            assigneeId: newAssigneeId,
          },
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update issue assignee:", error);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (
    issuesLoading ||
    (issues.length === 0 && !issuesError) ||
    projectsLoading ||
    usersLoading
  ) {
    return (
      <div className="issue-details-loading" role="status">
        <RefreshCw size={22} className="loading-icon" />
        <p>Loading issue details...</p>
      </div>
    );
  }

  if (issuesError) {
    return (
      <div className="issue-details-error" role="alert">
        <AlertCircle size={24} />
        <p>{issuesError}</p>

        <button type="button" onClick={() => dispatch(fetchIssues())}>
          Try again
        </button>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="issue-details-empty">
        <h2>Issue not found</h2>
        <p>The issue you're looking for doesn't exist.</p>

        <button type="button" onClick={() => navigate("/issues")}>
          <ArrowLeft size={16} />
          Back to Issues
        </button>
      </div>
    );
  }

  const status =
    statusConfig[normalizeValue(issue.status)] || statusConfig.todo;

  const StatusIcon = status.icon;

  const priority = normalizeValue(issue.priority);

  return (
    <div className="issue-details-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/issues")}
      >
        <ArrowLeft size={17} />
        Back to Issues
      </button>

      <div className="issue-details-header">
        <div>
          <span className="issue-details-label">ISSUE #{issue.id}</span>

          <h1>{issue.title}</h1>

          <p>Created on {issue.createdAt || "Unknown date"}</p>
        </div>

        <div className="issue-details-actions">
          <button
            type="button"
            className="issue-edit-button"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            type="button"
            className="issue-delete-button"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      <div className="issue-details-layout">
        <section className="issue-details-main">
          <div className="issue-details-card">
            <h2>Description</h2>

            <p className="issue-details-description">
              {issue.description || "No description provided."}
            </p>
          </div>

          <div className="issue-details-card">
            <h2>Issue Information</h2>

            <div className="issue-detail-row">
              <label htmlFor="issue-status">Status</label>

              <select
                id="issue-status"
                value={issue.status}
                onChange={handleStatusChange}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="issue-detail-row">
              <span>Priority</span>

              <span className={`issue-priority priority-${priority}`}>
                {issue.priority}
              </span>
            </div>

            <div className="issue-detail-row">
              <span>Created Date</span>

              <span className="issue-detail-value">
                <CalendarDays size={15} />
                {issue.createdAt || "No date"}
              </span>
            </div>
          </div>
        </section>

        <aside className="issue-details-sidebar">
          <div className="issue-details-card">
            <h2>Project</h2>

            {project ? (
              <div className="issue-project">
                <span
                  className="project-color-dot"
                  style={{
                    backgroundColor: project.color || "#94a3b8",
                  }}
                />
                {project.name}
              </div>
            ) : (
              <p>Project not found.</p>
            )}
          </div>

          <div className="issue-details-card">
            <div className="issue-detail-row">
              <label htmlFor="issue-assignee">
                <h2>Assignee</h2>
              </label>

              <select
                id="issue-assignee"
                value={issue.assigneeId || ""}
                onChange={handleAssigneeChange}
              >
                <option value="">Unassigned</option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>
      </div>

      <EditIssueModal
        isOpen={isEditModalOpen}
        issue={issue}
        onClose={() => setIsEditModalOpen(false)}
      />
      <DeleteIssueModal
        isOpen={isDeleteModalOpen}
        issue={issue}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteSuccess={() => navigate("/issues")}
      />
    </div>
  );
};

export default IssueDetails;
