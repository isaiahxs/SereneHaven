import React, { useState } from 'react';
import './ReviewModal.css';

function ReviewModal() {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit your review
  };

  const isSubmitDisabled = comment.length < 10 || !rating;

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="rating-container">
        <label htmlFor="rating">Stars</label>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => setRating(starValue)}
              />
              <span className="star">&#9733;</span>
            </label>
          );
        })}
      </div>
      <textarea
        className="comment-textarea"
        value={comment}
        onChange={handleCommentChange}
        placeholder="Your comment here..."
      />
      <button type="submit" disabled={isSubmitDisabled}>
        Submit Your Review
      </button>
    </form>
  );
}

export default ReviewModal;
