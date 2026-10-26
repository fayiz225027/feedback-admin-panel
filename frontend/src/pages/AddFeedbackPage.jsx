import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Clock,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import StarRating from '../components/StarRating';
import { createFeedback } from '../services/api';

const AddFeedbackPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: '',
    courseDuration: '',
    feedbackComments: '',
    feedbackRating: 5,
    customCourseId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const durationPresets = ['4 Weeks', '8 Weeks', '12 Weeks', '16 Weeks', '6 Months', '40 Hours'];

  const ratingDescriptions = {
    1: '1 - Poor (Requires significant course redesign)',
    2: '2 - Fair (Below expectations, needs improvement)',
    3: '3 - Good (Satisfactory content and pace)',
    4: '4 - Very Good (Strong delivery and practical skills)',
    5: '5 - Excellent (Outstanding course and instruction)',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      feedbackRating: val,
    }));
  };

  const handleReset = () => {
    setFormData({
      courseName: '',
      courseDuration: '',
      feedbackComments: '',
      feedbackRating: 5,
      customCourseId: '',
    });
    setError(null);
    setSuccessResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.courseName.trim()) {
      setError('Please enter a Course Name');
      return;
    }
    if (!formData.courseDuration.trim()) {
      setError('Please provide the Course Duration');
      return;
    }
    if (!formData.feedbackComments.trim()) {
      setError('Please write Feedback Comments');
      return;
    }
    if (formData.feedbackRating < 1 || formData.feedbackRating > 5) {
      setError('Feedback rating must be between 1 and 5');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        courseName: formData.courseName.trim(),
        courseDuration: formData.courseDuration.trim(),
        feedbackComments: formData.feedbackComments.trim(),
        feedbackRating: Number(formData.feedbackRating),
      };

      if (formData.customCourseId.trim()) {
        payload.courseId = formData.customCourseId.trim().toUpperCase();
      }

      const res = await createFeedback(payload);
      if (res.success) {
        setSuccessResult(res.data);
        handleReset();
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit feedback. Check server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Top Breadcrumb & Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-link">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
          <h1 className="page-title">Submit Course Feedback</h1>
          <p className="page-subtitle">
            Record comprehensive student feedback and ratings into MongoDB Atlas
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successResult && (
        <div className="alert alert-success">
          <CheckCircle size={22} className="alert-icon" />
          <div className="alert-body">
            <strong>Feedback Successfully Saved!</strong>
            <p>
              Course <strong>{successResult.courseName}</strong> has been saved with Course ID{' '}
              <span className="badge-course-id">{successResult.courseId}</span>.
            </p>
            <div className="success-banner-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSuccessResult(null)}
              >
                Add Another Feedback
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/')}
              >
                View in Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={20} className="alert-icon" />
          <div className="alert-body">
            <strong>Submission Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Main Grid: Form + Live Preview Card */}
      <div className="form-layout-grid">
        {/* Form Card */}
        <div className="card form-card">
          <div className="card-header">
            <div className="card-header-icon bg-indigo">
              <PlusCircle size={20} />
            </div>
            <div>
              <h2 className="card-title">Feedback Form</h2>
              <p className="card-subtitle">Fill in the course details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            {/* Course Name */}
            <div className="form-group">
              <label htmlFor="courseName" className="form-label">
                <BookOpen size={16} className="label-icon" />
                <span>Course Name</span>
                <span className="required-star">*</span>
              </label>
              <input
                id="courseName"
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g. Full Stack MERN Development"
                required
                className="form-input"
              />
            </div>

            {/* Course Duration */}
            <div className="form-group">
              <label htmlFor="courseDuration" className="form-label">
                <Clock size={16} className="label-icon" />
                <span>Course Duration</span>
                <span className="required-star">*</span>
              </label>
              <input
                id="courseDuration"
                type="text"
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleChange}
                placeholder="e.g. 12 Weeks or 60 Hours"
                required
                className="form-input"
              />
              <div className="duration-quick-presets">
                <span className="preset-label">Quick presets:</span>
                {durationPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`preset-pill ${formData.courseDuration === preset ? 'preset-active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, courseDuration: preset }))}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Course ID (Optional Custom ID or Auto Generated) */}
            <div className="form-group">
              <label htmlFor="customCourseId" className="form-label">
                <Sparkles size={16} className="label-icon" />
                <span>Course ID (Optional)</span>
                <span className="optional-tag">Auto-generated if left blank</span>
              </label>
              <input
                id="customCourseId"
                type="text"
                name="customCourseId"
                value={formData.customCourseId}
                onChange={handleChange}
                placeholder="e.g. CRS-2024 or leave blank for automatic ID"
                className="form-input"
              />
            </div>

            {/* Overall Feedback Rating */}
            <div className="form-group">
              <label className="form-label">
                <span>Overall Feedback Rating (1 to 5 Stars)</span>
                <span className="required-star">*</span>
              </label>
              <div className="rating-select-container">
                <StarRating
                  rating={formData.feedbackRating}
                  onChange={handleRatingChange}
                  size={32}
                />
                <span className="rating-desc-text">
                  {ratingDescriptions[formData.feedbackRating]}
                </span>
              </div>
            </div>

            {/* Feedback Comments */}
            <div className="form-group">
              <label htmlFor="feedbackComments" className="form-label">
                <MessageSquare size={16} className="label-icon" />
                <span>Feedback Comments</span>
                <span className="required-star">*</span>
              </label>
              <textarea
                id="feedbackComments"
                name="feedbackComments"
                rows={4}
                value={formData.feedbackComments}
                onChange={handleChange}
                placeholder="Provide student feedback on course structure, instructors, assignments, and key takeaways..."
                required
                className="form-textarea"
              />
              <div className="char-count">
                {formData.feedbackComments.length} characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview / Help Card */}
        <div className="preview-column">
          <div className="card preview-card">
            <div className="card-header">
              <div className="card-header-icon bg-amber">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="card-title">Live Preview</h3>
                <p className="card-subtitle">How this record will look on the dashboard</p>
              </div>
            </div>

            <div className="preview-body">
              <div className="preview-row">
                <span className="preview-label">Course ID</span>
                <span className="badge-course-id">
                  {formData.customCourseId.trim().toUpperCase() || 'CRS-AUTO'}
                </span>
              </div>

              <div className="preview-row">
                <span className="preview-label">Course Name</span>
                <span className="preview-val-bold">
                  {formData.courseName.trim() || 'Course name preview...'}
                </span>
              </div>

              <div className="preview-row">
                <span className="preview-label">Duration</span>
                <span className="duration-tag">
                  {formData.courseDuration.trim() || 'Duration'}
                </span>
              </div>

              <div className="preview-row">
                <span className="preview-label">Overall Rating</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating rating={formData.feedbackRating} readOnly={true} size={18} />
                  <span className="rating-badge">
                    {Number(formData.feedbackRating).toFixed(1)} / 5
                  </span>
                </div>
              </div>

              <div className="preview-comment-block">
                <span className="preview-label">Comments</span>
                <p className="preview-comment-text">
                  {formData.feedbackComments.trim() || 'Student comments and feedback will appear here...'}
                </p>
              </div>
            </div>
          </div>

          <div className="card tips-card">
            <div className="card-header" style={{ padding: '14px 18px', borderBottom: 'none' }}>
              <HelpCircle size={18} className="tips-icon" />
              <h4 className="tips-title">Evaluation Tips</h4>
            </div>
            <ul className="tips-list">
              <li>Each course receives a unique Course ID stored in MongoDB.</li>
              <li>Ratings range from 1 to 5 and recalculate the dashboard metrics immediately.</li>
              <li>You can update or delete this record anytime from the Dashboard.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeedbackPage;
