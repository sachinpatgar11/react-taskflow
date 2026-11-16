import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FolderKanban, Users, Crown, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProjectById,
  updateProject,
} from "../features/projects/projectSlice";
import { fetchUsers } from "../features/users/userSlice";

function ProjectDetails() {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.projects.selectedProject);

  const loading = useSelector((state) => state.projects.detailsLoading);

  const error = useSelector((state) => state.projects.detailsError);

  const users = useSelector((state) => state.users.items);
  const usersLoading = useSelector((state) => state.users.loading);
  const usersError = useSelector((state) => state.users.error);

  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const [saveMessage, setSaveMessage] = useState("");

  const saving = useSelector((state) => state.projects.updating);

  const updateError = useSelector((state) => state.projects.updateError);

  useEffect(() => {
    if (project) {
      setSelectedOwnerId(project.ownerId || "");
      setSelectedMemberIds(project.memberIds || []);
      setSaveMessage("");
    }
  }, [project?.id]);

  useEffect(() => {
    const request = dispatch(fetchProjectById(projectId));

    return () => {
      request.abort();
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length, usersLoading]);

  const owner = users.find(
    (user) => String(user.id) === String(project?.ownerId),
  );

  const members = (project?.memberIds || [])
    .map((memberId) =>
      users.find((user) => String(user.id) === String(memberId)),
    )
    .filter(Boolean);

  const handleOwnerChange = (event) => {
    const newOwnerId = event.target.value;

    setSelectedOwnerId(newOwnerId);

    // The project owner must also be a project member.
    setSelectedMemberIds((currentMembers) => {
      if (currentMembers.includes(newOwnerId)) {
        return currentMembers;
      }

      return [...currentMembers, newOwnerId];
    });
  };

  const handleMemberChange = (userId, checked) => {
    setSelectedMemberIds((currentMembers) => {
      if (checked) {
        return currentMembers.includes(userId)
          ? currentMembers
          : [...currentMembers, userId];
      }

      return currentMembers.filter((id) => id !== userId);
    });
  };

  const handleSaveTeam = async (event) => {
    event.preventDefault();

    if (!project || !selectedOwnerId) {
      return;
    }

    try {
      setSaveMessage("");

      await dispatch(
        updateProject({
          id: project.id,
          updates: {
            ...project,
            ownerId: selectedOwnerId,
            memberIds: selectedMemberIds,
          },
        }),
      ).unwrap();

      setSaveMessage("Project team updated successfully.");
    } catch {
      // The error is available through Redux updateError.
    }
  };

  if (loading || (!project && !error)) {
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

      {/* Project team */}
      <section className="project-team-section">
        <div className="project-section-heading">
          <div>
            <h2>Project team</h2>
            <p>People responsible for this project.</p>
          </div>

          <span className="member-count">
            <Users size={16} />
            {members.length} members
          </span>
        </div>

        {usersLoading && <p role="status">Loading project team...</p>}

        {usersError && (
          <p className="form-error" role="alert">
            Unable to load team members: {usersError}
          </p>
        )}

        {!usersLoading && !usersError && (
          <div className="project-team-grid">
            <article className="team-card owner-card">
              <div className="team-card-heading">
                <Crown size={17} />
                <span>Project owner</span>
              </div>

              {owner ? (
                <div className="team-user">
                  <div className="user-avatar">
                    {owner.avatar || owner.name.charAt(0)}
                  </div>

                  <div className="team-user-info">
                    <h3>{owner.name}</h3>
                    <p>{owner.email}</p>
                  </div>
                </div>
              ) : (
                <p className="team-empty">Owner information unavailable.</p>
              )}
            </article>

            <article className="team-card members-card">
              <div className="team-card-heading">
                <Users size={17} />
                <span>Project members</span>
              </div>

              {members.length > 0 ? (
                <div className="team-member-list">
                  {members.map((member) => (
                    <div className="team-user" key={member.id}>
                      <div className="user-avatar">
                        {member.avatar || member.name.charAt(0)}
                      </div>

                      <div className="team-user-info">
                        <h3>{member.name}</h3>
                        <p>{member.email}</p>
                      </div>

                      <span className="member-role">{member.role}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="team-empty">
                  No members assigned to this project.
                </p>
              )}
            </article>
          </div>
        )}
      </section>
      <section className="team-management-section">
        <div className="project-section-heading">
          <div>
            <h2>Manage project team</h2>
            <p>Assign an owner and manage project members.</p>
          </div>
        </div>

        <form onSubmit={handleSaveTeam}>
          <div className="team-management-card">
            <div className="form-group">
              <label htmlFor="project-owner">Project owner</label>

              <select
                id="project-owner"
                value={selectedOwnerId}
                onChange={handleOwnerChange}
                disabled={usersLoading || saving}
                required
              >
                <option value="">Select project owner</option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="member-selection">
              <h3>Project members</h3>
              <p>Select the users who should have access to this project.</p>

              <div className="member-selection-list">
                {users.map((user) => (
                  <label className="member-selection-item" key={user.id}>
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(user.id)}
                      disabled={saving || selectedOwnerId === user.id}
                      onChange={(event) =>
                        handleMemberChange(user.id, event.target.checked)
                      }
                    />

                    <span className="user-avatar">
                      {user.avatar || user.name.charAt(0)}
                    </span>

                    <span className="member-selection-info">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </span>

                    {selectedOwnerId === user.id && (
                      <span className="owner-indicator">
                        <Crown size={14} />
                        Owner
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {updateError && (
              <p className="form-error" role="alert">
                {updateError}
              </p>
            )}

            {saveMessage && (
              <p className="form-success" role="status">
                {saveMessage}
              </p>
            )}

            <div className="team-management-actions">
              <button
                type="submit"
                className="create-button"
                disabled={saving || usersLoading || !selectedOwnerId}
              >
                <Save size={16} />
                {saving ? "Saving changes..." : "Save team changes"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
}

export default ProjectDetails;
