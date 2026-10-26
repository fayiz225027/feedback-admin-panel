import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onChange, readOnly = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className="star-rating-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={`star-btn ${readOnly ? 'star-readonly' : 'star-interactive'}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: readOnly ? 'default' : 'pointer',
              outline: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              color: isFilled ? '#f59e0b' : '#d1d5db',
              transition: 'transform 0.15s ease, color 0.15s ease',
            }}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              stroke={isFilled ? '#f59e0b' : '#9ca3af'}
              strokeWidth={1.8}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
