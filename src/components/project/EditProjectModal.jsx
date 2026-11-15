import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { updateProject } from "../../features/projects/projectSlice";

function EditProjectModal({ isOpen, onClose, project }) {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.items);
  const updating = useSelector((state) => state.projects.updating);
  const updateError = useSelector((state) => state.projects.updateError);

  const [form, setForm] = useState({
    name: "",
    key: "",
    description: "",
    color: "#635bdb",
  });

  const [errors, setErrors] = useState({});

  // Populate the form whenever a project is selected.
  useEffect(() => {
    if (isOpen && project) {
      setForm({
        name: project.name || "",
        key: project.key || "",
        description: project.description || "",
        color: project.color || "#635bdb",
      });

      setErrors({});
    }
  }, [isOpen, project]);

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
        (item) =>
          String(item.id) !== String(project.id) &&
          item.key.toLowerCase() === form.key.toLowerCase(),
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

    const updates = {
      ...project,
      name: form.name.trim(),
      key: form.key,
      description: form.description.trim(),
      color: form.color,
    };

    try {
      await dispatch(
        updateProject({
          id: project.id,
          updates,
        }),
      ).unwrap();

      onClose();
    } catch {
      // Redux stores the API error for display.
    }
  };

  const handleClose = () => {
    if (updating) return;

    setErrors({});
    onClose();
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit project">
      <form className="project-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="edit-project-name">Project name</label>
          <input
            id="edit-project-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Project name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "edit-name-error" : undefined}
          />
          {errors.name && (
            <span id="edit-name-error" className="field-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="edit-project-key">Project key</label>
          <input
            id="edit-project-key"
            name="key"
            value={form.key}
            onChange={handleChange}
            maxLength={6}
            placeholder="e.g. WEB"
            aria-invalid={Boolean(errors.key)}
            aria-describedby={errors.key ? "edit-key-error" : undefined}
          />
          {errors.key && (
            <span id="edit-key-error" className="field-error">
              {errors.key}
            </span>
          )}
          <small>Used to identify issues in this project.</small>
        </div>

        <div className="form-field">
          <label htmlFor="edit-project-description">Description</label>
          <textarea
            id="edit-project-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Project description"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "edit-description-error" : undefined
            }
          />
          {errors.description && (
            <span id="edit-description-error" className="field-error">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="edit-project-color">Project color</label>
          <input
            id="edit-project-color"
            className="color-input"
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </div>

        {updateError && (
          <p className="form-error" role="alert">
            {updateError}
          </p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleClose}
            disabled={updating}
          >
            Cancel
          </button>

          <button type="submit" className="submit-button" disabled={updating}>
            {updating ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProjectModal;
