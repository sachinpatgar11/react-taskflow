import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FolderKanban,
  CircleCheck,
  Clock3,
  TrendingUp,
  ClipboardList,
  Circle,
} from "lucide-react";

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

// Normalize status values such as "In Progress" and "in-progress"
const normalizeStatus = (status = "") =>
  String(status)
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

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

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchIssues());
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

  const handleRetry = () => {
    dispatch(fetchProjects());
    dispatch(fetchIssues());
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
        </>
      )}
    </section>
  );
}

export default Dashboard;
