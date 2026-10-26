import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Search, Filter, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import StarRating from './StarRating';

const FeedbackTable = ({ feedbackList = [], onEdit, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('ALL');
  const [expandedComments, setExpandedComments] = useState({});

  const toggleComment = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter and search logic
  const filteredList = useMemo(() => {
    return feedbackList.filter((item) => {
      const matchesSearch =
        item.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseDuration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.feedbackComments?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        selectedRatingFilter === 'ALL' ||
        Math.floor(Number(item.feedbackRating)) === Number(selectedRatingFilter);

      return matchesSearch && matchesRating;
    });
  }, [feedbackList, searchTerm, selectedRatingFilter]);

  if (isLoading) {
    return (
      <div className="table-card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading course feedbacks from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by course ID, name, or comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Ratings (1 - 5)</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>
        </div>
      </div>

      {/* Table Component */}
      <div className="table-responsive">
        <table className="feedback-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '13%' }}>Course ID</th>
              <th scope="col" style={{ width: '22%' }}>Course Name</th>
              <th scope="col" style={{ width: '14%' }}>Duration</th>
              <th scope="col" style={{ width: '20%' }}>Overall Rating</th>
              <th scope="col" style={{ width: '17%' }}>Comments</th>
              <th scope="col" style={{ width: '14%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  <div className="empty-state">
                    <MessageSquare size={36} className="empty-icon" />
                    <h4>No feedback records found</h4>
                    <p>
                      {searchTerm || selectedRatingFilter !== 'ALL'
                        ? 'Try adjusting your search query or rating filter.'
                        : 'No feedbacks have been added yet. Click "Add Feedback" above to create one!'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredList.map((feedback) => {
                const isExpanded = !!expandedComments[feedback._id];
                const comments = feedback.feedbackComments || '';
                const isLong = comments.length > 55;

                return (
                  <tr key={feedback._id || feedback.courseId} className="table-row">
                    <td>
                      <span className="badge-course-id">{feedback.courseId}</span>
                    </td>
                    <td>
                      <span className="course-name-text">{feedback.courseName}</span>
                    </td>
                    <td>
                      <span className="duration-tag">{feedback.courseDuration}</span>
                    </td>
                    <td>
                      <div className="rating-cell">
                        <StarRating rating={feedback.feedbackRating} readOnly={true} size={16} />
                        <span className="rating-badge">
                          {Number(feedback.feedbackRating).toFixed(1)} / 5
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="comments-cell">
                        <p className={`comment-text ${isExpanded ? 'expanded' : 'clamped'}`}>
                          {comments}
                        </p>
                        {isLong && (
                          <button
                            type="button"
                            className="expand-comment-toggle"
                            onClick={() => toggleComment(feedback._id)}
                          >
                            {isExpanded ? (
                              <>
                                Less <ChevronUp size={12} />
                              </>
                            ) : (
                              <>
                                More <ChevronDown size={12} />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn-action btn-update"
                          onClick={() => onEdit(feedback)}
                          title="Update feedback"
                        >
                          <Edit2 size={15} />
                          <span>Update</span>
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => onDelete(feedback)}
                          title="Delete feedback"
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="table-footer">
        <span>
          Showing <strong>{filteredList.length}</strong> of <strong>{feedbackList.length}</strong> total records
        </span>
      </div>
    </div>
  );
};

export default FeedbackTable;
