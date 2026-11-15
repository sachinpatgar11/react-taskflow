import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { addProject } from "../../features/projects/projectSlice";

const initialForm = {
  name: "",
  key: "",
  description: "",
  color: "#635bdb",
};

function CreateProjectModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.items);
  const creating = useSelector((state) => state.projects.creating);
  const createError = useSelector((state) => state.projects.createError);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "key" ? value.toUpperCase() : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Project name is required.";
    } else if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      nextErrors.name = "Name must be between 3 and 50 characters.";
    }

    if (!/^[A-Z][A-Z0-9]{1,5}$/.test(form.key)) {
      nextErrors.key =
        "Use 2–6 uppercase letters or numbers, starting with a letter.";
    } else if (
      projects.some(
        (project) => project.key.toLowerCase() === form.key.toLowerCase(),
      )
    ) {
      nextErrors.key = "This project key is already in use.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length > 200) {
      nextErrors.description = "Maximum 200 characters allowed.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const newProject = {
      name: form.name.trim(),
      key: form.key,
      description: form.description.trim(),
      status: "active",
      color: form.color,
      ownerId: "1",
      progress: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      await dispatch(addProject(newProject)).unwrap();

      setForm(initialForm);
      setErrors({});
      onClose();
    } catch {
      // The Redux slice stores the API error for display.
    }
  };

  const handleClose = () => {
    if (creating) return;

    setForm(initialForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create new project">
      <form className="project-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Website Redesign"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span id="name-error" className="field-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="project-key">Project key</label>
          <input
            id="project-key"
            name="key"
            value={form.key}
            onChange={handleChange}
            placeholder="e.g. WEB"
            maxLength={6}
            aria-invalid={Boolean(errors.key)}
            aria-describedby={errors.key ? "key-error" : undefined}
          />
          {errors.key && (
            <span id="key-error" className="field-error">
              {errors.key}
            </span>
          )}
          <small>Used to identify issues in this project.</small>
        </div>

        <div className="form-field">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What is this project about?"
            rows={4}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <span id="description-error" className="field-error">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="project-color">Project color</label>
          <input
            id="project-color"
            className="color-input"
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </div>

        {createError && (
          <p className="form-error" role="alert">
            {createError}
          </p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleClose}
            disabled={creating}
          >
            Cancel
          </button>

          <button type="submit" className="submit-button" disabled={creating}>
            {creating ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
