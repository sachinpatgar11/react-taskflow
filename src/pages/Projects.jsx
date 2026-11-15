import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { fetchProjects } from "../features/projects/projectSlice";
import {
  selectProjects,
  selectProjectLoading,
  selectProjectError,
} from "../features/projects/projectSelectors";
import CreateProjectModal from "../components/project/CreateProjectModal";

function Projects() {
  const dispatch = useDispatch();

  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (projects.length === 0 && !loading) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length, loading]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Projects</h1>
          <p>Manage and track all your workspace projects.</p>
        </div>

        <button
          className="create-button"
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          <span>New project</span>
        </button>
      </div>

      {loading && <p role="status">Loading projects...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-card-top">
                <div
                  className="project-color"
                  style={{ backgroundColor: project.color }}
                >
                  {project.key}
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
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="empty-state">
          No projects found. Create your first project.
        </p>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </section>
  );
}

export default Projects;
