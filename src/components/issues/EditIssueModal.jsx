import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { updateIssue } from "../../features/issues/issueSlice";

const initialFormData = {
  title: "",
  description: "",
  projectId: "",
  assigneeId: "",
  priority: "Medium",
  status: "To Do",
};

const EditIssueModal = ({ isOpen, issue, onClose }) => {
  const dispatch = useDispatch();

  const { updating, updateError } = useSelector((state) => state.issues);

  const { items: projects } = useSelector((state) => state.projects);

  const { items: users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState("");

  // Populate the form whenever the selected issue changes
  useEffect(() => {
    if (isOpen && issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        projectId: String(issue.projectId || ""),
        assigneeId: String(issue.assigneeId || ""),
        priority: issue.priority || "Medium",
        status: issue.status || "To Do",
      });

      setValidationError("");
    }
  }, [isOpen, issue]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setValidationError("");
  };

  const validateForm = () => {
    if (formData.title.trim().length < 3) {
      return "Title must contain at least 3 characters.";
    }

    if (formData.title.trim().length > 100) {
      return "Title cannot exceed 100 characters.";
    }

    if (!formData.description.trim()) {
      return "Description is required.";
    }

    if (!formData.projectId) {
      return "Please select a project.";
    }

    if (!formData.assigneeId) {
      return "Please select an assignee.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validateForm();

    if (error) {
      setValidationError(error);
      return;
    }

    if (!issue) return;

    const updatedIssue = {
      ...issue,
      title: formData.title.trim(),
      description: formData.description.trim(),
      projectId: formData.projectId,
      assigneeId: formData.assigneeId,
      priority: formData.priority,
      status: formData.status,
    };

    try {
      await dispatch(
        updateIssue({
          id: issue.id,
          updates: updatedIssue,
        }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update issue:", error);
    }
  };

  const handleClose = () => {
    if (updating) return;

    setFormData(initialFormData);
    setValidationError("");
    onClose();
  };

  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Issue">
      <form className="create-issue-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-issue-title">Issue Title</label>

          <input
            id="edit-issue-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter issue title"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-issue-description">Description</label>

          <textarea
            id="edit-issue-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue"
            rows={4}
          />
        </div>

        <div className="issue-form-row">
          <div className="form-group">
            <label htmlFor="edit-issue-project">Project</label>

            <select
              id="edit-issue-project"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select project</option>

              {projects.map((project) => (
                <option key={project.id} value={String(project.id)}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-issue-assignee">Assignee</label>

            <select
              id="edit-issue-assignee"
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
            >
              <option value="">Select assignee</option>

              {users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="issue-form-row">
          <div className="form-group">
            <label htmlFor="edit-issue-priority">Priority</label>

            <select
              id="edit-issue-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-issue-status">Status</label>

            <select
              id="edit-issue-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {validationError && (
          <p className="form-error" role="alert">
            {validationError}
          </p>
        )}

        {updateError && (
          <p className="form-error" role="alert">
            {updateError}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleClose}
            disabled={updating}
          >
            Cancel
          </button>

          <button type="submit" className="create-button" disabled={updating}>
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditIssueModal;
