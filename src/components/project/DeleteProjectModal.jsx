import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, Trash2 } from "lucide-react";

import Modal from "../common/Modal";
import { deleteProject } from "../../features/projects/projectSlice";

function DeleteProjectModal({ isOpen, onClose, project }) {
  const dispatch = useDispatch();

  const deleting = useSelector((state) => state.projects.deleting);
  const deleteError = useSelector((state) => state.projects.deleteError);

  if (!project) return null;

  const handleClose = () => {
    if (deleting) return;
    onClose();
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(project.id)).unwrap();
      onClose();
    } catch {
      // Redux stores the API error for display.
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete project">
      <div className="delete-confirmation">
        <div className="delete-warning-icon">
          <AlertTriangle size={24} />
        </div>

        <div className="delete-confirmation-content">
          <h3>Are you sure?</h3>

          <p>
            You are about to delete <strong>{project.name}</strong>. This action
            cannot be undone.
          </p>
        </div>

        {deleteError && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete project"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteProjectModal;
