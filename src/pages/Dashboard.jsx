import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  CircleCheck,
  Clock3,
  TrendingUp,
  ClipboardList,
  Circle,
  Activity,
  CircleDot,
  CirclePlus,
  RefreshCw,
  UserPlus,
  FolderPlus,
  Pencil,
  FolderX,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { fetchProjects } from "../features/projects/projectSlice";
import {
  selectProjects,
  selectProjectLoading,
  selectProjectError,
} from "../features/projects/projectSelectors";

import { fetchIssues } from "../features/issues/issueSlice";
import {
  selectIssues,
  selectIssuesLoading,
  selectIssuesError,
} from "../features/issues/issueSelectors";

import { fetchActivities } from "../features/activities/activitySlice";
import {
  selectActivities,
  selectActivitiesLoading,
  selectActivitiesError,
} from "../features/activities/activitySelectors";

import { fetchUsers } from "../features/users/userSlice";
import { selectUsers } from "../features/users/userSelectors";

const activityIconConfig = {
  issue_created: {
    icon: CirclePlus,
    color: "issue-created",
  },
  status_changed: {
    icon: RefreshCw,
    color: "status-changed",
  },
  issue_assigned: {
    icon: UserPlus,
    color: "issue-assigned",
  },
  project_created: {
    icon: FolderPlus,
    color: "project-created",
  },
  project_updated: {
    icon: Pencil,
    color: "project-updated",
  },
  project_deleted: {
    icon: FolderX,
    color: "project-deleted",
  },
};

// Normalize status values such as "In Progress" and "in-progress"
const normalizeStatus = (status = "") =>
  String(status)
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

const getRelativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (Number.isNaN(seconds)) return "Unknown time";
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

function Dashboard() {
  const dispatch = useDispatch();

  // Project state
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);

  // Issue state
  const issues = useSelector(selectIssues);
  const issuesLoading = useSelector(selectIssuesLoading);
  const issuesError = useSelector(selectIssuesError);

  // Activities state
  const activities = useSelector(selectActivities);
  const activitiesLoading = useSelector(selectActivitiesLoading);
  const activitiesError = useSelector(selectActivitiesError);

  const users = useSelector(selectUsers);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchIssues());
    dispatch(fetchActivities());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Project statistics
  const stats = useMemo(() => {
    const active = projects.filter(
      (project) => project.status === "active",
    ).length;

    const completed = projects.filter(
      (project) => project.status === "completed",
    ).length;

    const averageProgress = projects.length
      ? Math.round(
          projects.reduce(
            (total, project) => total + (Number(project.progress) || 0),
            0,
          ) / projects.length,
        )
      : 0;

    return [
      {
        label: "Total projects",
        value: projects.length,
        icon: FolderKanban,
        color: "purple",
      },
      {
        label: "Active projects",
        value: active,
        icon: Clock3,
        color: "blue",
      },
      {
        label: "Completed projects",
        value: completed,
        icon: CircleCheck,
        color: "green",
      },
      {
        label: "Average progress",
        value: `${averageProgress}%`,
        icon: TrendingUp,
        color: "orange",
      },
    ];
  }, [projects]);

  // Issue statistics
  const issueStats = useMemo(() => {
    const todo = issues.filter(
      (issue) => normalizeStatus(issue.status) === "todo",
    ).length;

    const inProgress = issues.filter(
      (issue) => normalizeStatus(issue.status) === "inprogress",
    ).length;

    const completed = issues.filter(
      (issue) => normalizeStatus(issue.status) === "done",
    ).length;

    return [
      {
        label: "Total issues",
        value: issues.length,
        icon: ClipboardList,
        color: "purple",
      },
      {
        label: "To Do",
        value: todo,
        icon: Circle,
        color: "orange",
      },
      {
        label: "In Progress",
        value: inProgress,
        icon: Clock3,
        color: "blue",
      },
      {
        label: "Completed issues",
        value: completed,
        icon: CircleCheck,
        color: "green",
      },
    ];
  }, [issues]);

  const issueStatusData = useMemo(() => {
    const statusConfig = [
      { name: "To Do", key: "todo", color: "#94a3b8" },
      { name: "In Progress", key: "inprogress", color: "#3b82f6" },
      { name: "In Review", key: "review", color: "#f59e0b" },
      { name: "Done", key: "done", color: "#10b981" },
    ];

    return statusConfig.map((status) => ({
      name: status.name,
      value: issues.filter(
        (issue) => normalizeStatus(issue.status) === status.key,
      ).length,
      color: status.color,
    }));
  }, [issues]);

  const issuePriorityData = useMemo(() => {
    const priorityConfig = [
      { name: "Critical", key: "critical", color: "#ef4444" },
      { name: "High", key: "high", color: "#f97316" },
      { name: "Medium", key: "medium", color: "#eab308" },
      { name: "Low", key: "low", color: "#22c55e" },
    ];

    return priorityConfig.map((priority) => ({
      name: priority.name,
      count: issues.filter(
        (issue) => normalizeStatus(issue.priority) === priority.key,
      ).length,
      color: priority.color,
    }));
  }, [issues]);

  const handleRetry = () => {
    dispatch(fetchProjects());
    dispatch(fetchIssues());
    dispatch(fetchActivities());
    dispatch(fetchUsers());
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Welcome back, Alex 👋</h1>
          <p>Here's what's happening across your workspace.</p>
        </div>
      </div>

      {(loading || issuesLoading) && (
        <p className="state-message" role="status">
          Loading dashboard...
        </p>
      )}

      {(error || issuesError) && (
        <div className="error-message" role="alert">
          {error || issuesError}
          <button onClick={handleRetry}>Try again</button>
        </div>
      )}

      {!loading && !issuesLoading && !error && !issuesError && (
        <>
          {/* Project statistics */}
          <div className="stats-grid">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <article className="stat-card" key={label}>
                <div className={`stat-icon ${color}`}>
                  <Icon size={21} />
                </div>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          {/* Issue statistics */}
          <div className="section-heading">
            <div>
              <h2>Issue Overview</h2>
              <p>Current status of issues across your workspace.</p>
            </div>
          </div>

          <div className="stats-grid">
            {issueStats.map(({ label, value, icon: Icon, color }) => (
              <article className="stat-card" key={label}>
                <div className={`stat-icon ${color}`}>
                  <Icon size={21} />
                </div>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <div className="dashboard-charts">
            <article className="chart-card">
              <div className="section-heading">
                <div>
                  <h2>Issue Status Distribution</h2>
                  <p>Breakdown of issues by their current status.</p>
                </div>
              </div>

              <div className="status-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {issueStatusData.map((entry) => (
                        <Cell
                          key={entry.key || entry.name}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>
            <article className="chart-card">
              <div className="section-heading">
                <div>
                  <h2>Issue Priority Distribution</h2>
                  <p>Breakdown of issues by their priority level.</p>
                </div>
              </div>

              <div className="priority-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={issuePriorityData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {issuePriorityData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          {/* Recent projects */}
          <div className="section-heading">
            <div>
              <h2>Recent projects</h2>
              <p>Overview of your workspace projects.</p>
            </div>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card-top">
                  <div
                    className="project-color"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.key.slice(0, 2)}
                  </div>

                  <span className={`status ${project.status}`}>
                    {project.status}
                  </span>
                </div>

                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <div className="progress-info">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label={`${project.name} progress`}
                  aria-valuenow={project.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </article>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="empty-state">No projects available yet.</p>
          )}

          <section className="activity-section">
            <div className="section-heading">
              <div>
                <h2>Recent Activity</h2>
                <p>Latest updates across your workspace.</p>
              </div>
            </div>

            {activitiesLoading && (
              <p className="state-message" role="status">
                Loading activities...
              </p>
            )}

            {activitiesError && (
              <div className="error-message" role="alert">
                {activitiesError}
                <button onClick={() => dispatch(fetchActivities())}>
                  Try again
                </button>
              </div>
            )}

            {!activitiesLoading && !activitiesError && (
              <div className="activity-list">
                {activities.length > 0 ? (
                  activities
                    .slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    .slice(0, 5)
                    .map((activity) => {
                      const user = users.find(
                        (item) => String(item.id) === String(activity.userId),
                      );
                      const linkedIssue = activity.issueId
                        ? issues.find(
                            (issue) =>
                              String(issue.id) === String(activity.issueId),
                          )
                        : null;

                      const linkedProject = activity.projectId
                        ? projects.find(
                            (project) =>
                              String(project.id) === String(activity.projectId),
                          )
                        : null;

                      // Prefer the issue link when the activity belongs to an issue.
                      const entityRoute = activity.issueId
                        ? linkedIssue
                          ? `/issues/${linkedIssue.id}`
                          : null
                        : linkedProject
                          ? `/projects/${linkedProject.id}`
                          : null;

                      const activityConfig = activityIconConfig[
                        activity.type
                      ] || {
                        icon: Activity,
                        color: "default",
                      };

                      const ActivityIcon = activityConfig.icon;

                      return (
                        <article className="activity-item" key={activity.id}>
                          <div className="activity-avatar-wrapper">
                            <div className="activity-avatar">
                              {user?.avatar || "?"}
                            </div>

                            <div
                              className={`activity-type-icon ${activityConfig.color}`}
                            >
                              <ActivityIcon size={14} />
                            </div>
                          </div>

                          <div className="activity-content">
                            <p>
                              <strong>{user?.name || "Unknown user"}</strong>{" "}
                              {activity.message}
                            </p>

                            {entityRoute ? (
                              <Link
                                to={entityRoute}
                                className="activity-entity activity-entity-link"
                                aria-label={`View details for ${activity.entityName}`}
                              >
                                {activity.entityName}
                              </Link>
                            ) : (
                              <span className="activity-entity">
                                {activity.entityName}
                              </span>
                            )}
                          </div>

                          <time
                            className="activity-time"
                            dateTime={activity.createdAt}
                          >
                            {getRelativeTime(activity.createdAt)}
                          </time>
                        </article>
                      );
                    })
                ) : (
                  <p className="empty-state">No recent activity available.</p>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default Dashboard;
