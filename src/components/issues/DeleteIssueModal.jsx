import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "../common/Modal";
import { deleteIssue } from "../../features/issues/issueSlice";

const DeleteIssueModal = ({ isOpen, issue, onClose, onDeleteSuccess }) => {
  const dispatch = useDispatch();

  const { deleting, deleteError } = useSelector((state) => state.issues);

  const handleDelete = async () => {
    if (!issue) return;

    try {
      await dispatch(deleteIssue(issue.id)).unwrap();
      onClose();
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    onClose();
  };

  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Issue">
      <div className="delete-issue-content">
        <div className="delete-issue-icon">
          <AlertTriangle size={24} />
        </div>

        <div className="delete-issue-message">
          <h3>Are you sure?</h3>

          <p>
            You are about to delete <strong>{issue.title}</strong>. This action
            cannot be undone.
          </p>
        </div>

        {deleteError && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={15} />
            {deleting ? "Deleting..." : "Delete Issue"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteIssueModal;
