import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, feedback, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !feedback) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-delete-card">
        <div className="delete-modal-icon-box">
          <AlertTriangle size={36} className="delete-warning-icon" />
        </div>

        <h3 className="delete-modal-title">Delete Course Feedback</h3>
        <p className="delete-modal-text">
          Are you sure you want to permanently delete feedback for{' '}
          <strong>{feedback.courseName}</strong> (ID: <code>{feedback.courseId}</code>)?
        </p>
        <p className="delete-modal-warning">
          This record will be removed from MongoDB Atlas and cannot be restored.
        </p>

        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(feedback._id || feedback.courseId)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="btn-spinner"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={18} />
                <span>Yes, Delete Record</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
