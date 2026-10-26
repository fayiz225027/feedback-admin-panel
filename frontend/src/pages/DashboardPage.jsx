import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import FeedbackTable from '../components/FeedbackTable';
import EditModal from '../components/EditModal';
import DeleteModal from '../components/DeleteModal';
import { getFeedbackList, updateFeedback, deleteFeedback } from '../services/api';

const DashboardPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text: '' }

  // Modal states
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingFeedback, setDeletingFeedback] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchFeedbacks = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const res = await getFeedbackList();
      if (res.success && Array.isArray(res.data)) {
        setFeedbackList(res.data);
      } else {
        setFeedbackList([]);
      }
    } catch (err) {
      console.error('Fetch feedback failed:', err);
      setError(err.message || 'Failed to load feedbacks from backend');
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Handle Edit submission
  const handleSaveUpdate = async (id, updatedFields) => {
    setIsUpdating(true);
    try {
      const res = await updateFeedback(id, updatedFields);
      if (res.success) {
        // Immediate state update in dashboard
        setFeedbackList((prev) =>
          prev.map((item) =>
            item._id === id || item.courseId === id ? { ...item, ...res.data } : item
          )
        );
        setEditingFeedback(null);
        showToast('success', `Feedback for course ${res.data.courseName} updated successfully!`);
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to update feedback record');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete confirmation
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await deleteFeedback(id);
      if (res.success) {
        // Immediately remove record from dashboard state
        setFeedbackList((prev) =>
          prev.filter((item) => item._id !== id && item.courseId !== id)
        );
        setDeletingFeedback(null);
        showToast('success', 'Feedback record deleted successfully!');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to delete feedback record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="toast-icon" />
          ) : (
            <AlertCircle size={18} className="toast-icon" />
          )}
          <span>{toast.text}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Feedback Dashboard</h1>
          <p className="page-subtitle">
            Overview and real-time management of student course evaluations
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-icon-only"
            onClick={() => fetchFeedbacks(false)}
            title="Refresh feedback list"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'spin-icon' : ''} />
            <span className="btn-text-desktop">Refresh</span>
          </button>
          <Link to="/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Feedback</span>
          </Link>
        </div>
      </div>

      {/* Database Connection Alert if Error */}
      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={20} className="alert-icon" />
          <div className="alert-body">
            <strong>Database / Server Notice:</strong> {error}
            <div className="alert-hint">
              Ensure the backend is running on <code>http://localhost:5000</code> and your MongoDB Atlas connection string is configured in <code>backend/.env</code>.
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <SummaryCards feedbackList={feedbackList} />

      {/* Feedback Table Section */}
      <div className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">All Course Feedback Records</h2>
            <p className="section-subtitle">
              Browse, filter, update or remove course evaluations
            </p>
          </div>
        </div>

        <FeedbackTable
          feedbackList={feedbackList}
          isLoading={isLoading}
          onEdit={(item) => setEditingFeedback(item)}
          onDelete={(item) => setDeletingFeedback(item)}
        />
      </div>

      {/* Edit Feedback Modal */}
      <EditModal
        isOpen={!!editingFeedback}
        feedback={editingFeedback}
        onClose={() => setEditingFeedback(null)}
        onSave={handleSaveUpdate}
        isSubmitting={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingFeedback}
        feedback={deletingFeedback}
        onClose={() => setDeletingFeedback(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;
