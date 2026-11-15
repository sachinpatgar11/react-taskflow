import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { fetchProjects } from "../features/projects/projectSlice";
import {
  selectProjects,
  selectProjectLoading,
  selectProjectError,
} from "../features/projects/projectSelectors";
import CreateProjectModal from "../components/project/CreateProjectModal";
import EditProjectModal from "../components/project/EditProjectModal";
import DeleteProjectModal from "../components/project/DeleteProjectModal";

function Projects() {
  const dispatch = useDispatch();

  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleEditProject = (project) => {
    setSelectedProject(project);
  };

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
  };

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
                <div className="project-card-actions">
                  <span className={`status ${project.status}`}>
                    {project.status}
                  </span>

                  {project.status !== "completed" && (
                    <button
                      type="button"
                      className="project-edit-button"
                      onClick={() => handleEditProject(project)}
                      aria-label={`Edit ${project.name}`}
                      title="Edit project"
                    >
                      <Pencil size={16} />
                    </button>
                  )}

                  <button
                    type="button"
                    className="project-delete-button"
                    onClick={() => handleDeleteProject(project)}
                    aria-label={`Delete ${project.name}`}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3>{project.name}</h3>
              <p>{project.description}</p>

              <div className="progress-info">
                <span>Progress</span>
                <strong style={{ width: `${project.progress ?? 0}%` }}>
                  {project.progress ?? 0}%
                </strong>
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
        <div className="empty-state">
          <p>No projects found. Create your first project.</p>

          <button
            type="button"
            className="create-button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            Create project
          </button>
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditProjectModal
        isOpen={Boolean(selectedProject)}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <DeleteProjectModal
        isOpen={Boolean(projectToDelete)}
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
      />
    </section>
  );
}

export default Projects;
