import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../features/projects/projectSlice";

function ProjectDetails() {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.projects.selectedProject);

  const loading = useSelector((state) => state.projects.detailsLoading);

  const error = useSelector((state) => state.projects.detailsError);

  useEffect(() => {
    const request = dispatch(fetchProjectById(projectId));

    return () => {
      request.abort();
    };
  }, [dispatch, projectId]);

  if (loading) {
    return (
      <section className="project-details-page">
        <p role="status">Loading project details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="project-details-page">
        <Link to="/projects" className="back-link">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="project-details-message" role="alert">
          <h2>Unable to load project</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="project-details-page">
        <Link to="/projects" className="back-link">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="project-details-message">
          <h2>Project not found</h2>
          <p>The requested project does not exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="project-details-page">
      <Link to="/projects" className="back-link">
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="project-details-header">
        <div
          className="project-details-icon"
          style={{ backgroundColor: project.color }}
        >
          <FolderKanban size={28} />
        </div>

        <div className="project-details-heading">
          <span className="project-key">{project.key}</span>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>

        <span className={`status ${project.status}`}>{project.status}</span>
      </div>

      <div className="project-details-grid">
        <article className="project-details-card">
          <span className="details-label">Project status</span>
          <h3 className="details-value">{project.status}</h3>
        </article>

        <article className="project-details-card">
          <span className="details-label">Project key</span>
          <h3 className="details-value">{project.key}</h3>
        </article>

        <article className="project-details-card">
          <span className="details-label">Progress</span>
          <h3 className="details-value">{project.progress ?? 0}%</h3>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Project progress"
            aria-valuenow={project.progress ?? 0}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-fill"
              style={{
                width: `${project.progress ?? 0}%`,
              }}
            />
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProjectDetails;
