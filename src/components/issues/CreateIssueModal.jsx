import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIssue } from "../../features/issues/issueSlice";
import Modal from "../common/Modal";

const initialFormData = {
  title: "",
  description: "",
  projectId: "",
  assigneeId: "",
  priority: "Medium",
  status: "To Do",
};

const CreateIssueModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.items);
  const users = useSelector((state) => state.users.items);

  const creating = useSelector((state) => state.issues.creating);
  const createError = useSelector((state) => state.issues.createError);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must contain at least 3 characters.";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project.";
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = "Please select an assignee.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const issueData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      projectId: formData.projectId,
      assigneeId: formData.assigneeId,
      priority: formData.priority,
      status: formData.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      await dispatch(createIssue(issueData)).unwrap();

      setFormData(initialFormData);
      setErrors({});
      onClose();
    } catch {
      // The Redux createError state displays the API error.
    }
  };

  const handleClose = () => {
    if (creating) return;

    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Issue">
      <form className="create-issue-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="issue-title">Issue title</label>
          <input
            id="issue-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter issue title"
            maxLength={100}
            required
            disabled={creating}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="issue-description">Description</label>
          <textarea
            id="issue-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue..."
            rows={4}
            required
            disabled={creating}
          />
          {errors.description && (
            <span className="form-error">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="issue-project">Project</label>
          <select
            id="issue-project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
            disabled={creating}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={String(project.id)}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <span className="form-error">{errors.projectId}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="issue-assignee">Assignee</label>
          <select
            id="issue-assignee"
            name="assigneeId"
            value={formData.assigneeId}
            onChange={handleChange}
            required
            disabled={creating}
          >
            <option value="">Select assignee</option>
            {users.map((user) => (
              <option key={user.id} value={String(user.id)}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.assigneeId && (
            <span className="form-error">{errors.assigneeId}</span>
          )}
        </div>

        <div className="issue-form-row">
          <div className="form-group">
            <label htmlFor="issue-priority">Priority</label>
            <select
              id="issue-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={creating}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issue-status">Status</label>
            <select
              id="issue-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={creating}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {createError && (
          <p className="form-error" role="alert">
            {createError}
          </p>
        )}

        <div className="create-issue-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleClose}
            disabled={creating}
          >
            Cancel
          </button>

          <button type="submit" className="create-button" disabled={creating}>
            {creating ? "Creating..." : "Create Issue"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateIssueModal;
