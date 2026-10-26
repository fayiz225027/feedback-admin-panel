import React, { useState, useEffect } from 'react';
import { X, Save, Lock, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';

const EditModal = ({ isOpen, feedback, onClose, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseDuration: '',
    feedbackComments: '',
    feedbackRating: 5,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (feedback) {
      setFormData({
        courseName: feedback.courseName || '',
        courseDuration: feedback.courseDuration || '',
        feedbackComments: feedback.feedbackComments || '',
        feedbackRating: feedback.feedbackRating || 5,
      });
      setError('');
    }
  }, [feedback]);

  if (!isOpen || !feedback) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      feedbackRating: rating,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseName.trim()) {
      setError('Course Name cannot be empty');
      return;
    }
    if (!formData.courseDuration.trim()) {
      setError('Course Duration cannot be empty');
      return;
    }
    if (!formData.feedbackComments.trim()) {
      setError('Feedback Comments cannot be empty');
      return;
    }

    setError('');
    onSave(feedback._id || feedback.courseId, formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Update Course Feedback</h3>
            <p className="modal-subtitle">Modify course details and submitted rating</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ margin: '16px 24px 0' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Course ID <span className="locked-badge"><Lock size={12} /> Unique Identifier</span>
            </label>
            <input
              type="text"
              value={feedback.courseId}
              disabled
              className="form-input form-input-disabled"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Course Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. Advanced React & Full Stack Architecture"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Course Duration <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="courseDuration"
              value={formData.courseDuration}
              onChange={handleChange}
              placeholder="e.g. 12 Weeks, 45 Hours"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Overall Feedback Rating <span className="required-star">*</span>
            </label>
            <div className="rating-picker-box">
              <StarRating
                rating={formData.feedbackRating}
                onChange={handleRatingChange}
                size={28}
              />
              <span className="rating-value-label">
                <strong>{formData.feedbackRating}</strong> / 5 Stars
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Feedback Comments <span className="required-star">*</span>
            </label>
            <textarea
              name="feedbackComments"
              rows={4}
              value={formData.feedbackComments}
              onChange={handleChange}
              placeholder="Enter comprehensive student feedback and observations..."
              required
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
