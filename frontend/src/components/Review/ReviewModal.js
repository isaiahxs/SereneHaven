import React, { useState, useEffect } from 'react';
import { reviewThunk, addReviewThunk } from '../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';

import './ReviewModal.css';

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  //----------------------SIMILAR TO SPOT ID----------------------
  //consts below are from SpotId transfer
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);

  const [addReview, setAddReview] = useState(false);
  const [reviewChanged, setReviewChanged] = useState(false);

  //following are for immediate renders of reviews
  const [avgStarRating, setAvgStarRating] = useState(null);
  const [numReviews, setNumReviews] = useState(0);

  const [reviewCount, setReviewCount] = useState(0);

  const [uploadError, setUploadError] = useState('');
  const { closeModal } = useModal();

  const detailState = useSelector(state => state.spot.spotDetails);
  const reviewState = useSelector(state => state.review.currSpotReviews);

  const sessionUser = useSelector(state => state.session.user);

  let reviewArray = [];
  if (reviewState) reviewArray = Object.values(reviewState);


  useEffect(() => {
    dispatch(reviewThunk(spotId));
    setReviewChanged(false);

    if (reviewArray.length > 0) {
      const totalStars = reviewArray.reduce((acc, review) => acc + review.stars, 0);
      const avgStars = totalStars / reviewArray.length;
      setAvgStarRating(avgStars);
      setNumReviews(reviewArray.length);
    } else {
      setAvgStarRating(null);
      setNumReviews(0);
    }
  }, [dispatch, spotId, reviewChanged, reviewCount])

  //NOT SURE IF THIS EVER DID ANYTHING
  useEffect(() => {
    if (!reviewState) return;
    const numReviews = Object.keys(reviewState).length;
    if (numReviews !== reviewArray.length) {
      dispatch(reviewThunk(spotId));
    }
  }, [dispatch, reviewArray.length, reviewState, spotId]);


  const submitHandler = (e) => {
    e.preventDefault();
    const payload = {
      //userId: sessionUser.id instead of just userId
      //because the userId is a foreign key in the Review table
      review,
      stars,
      spotId,
      userId: sessionUser?.id,

      //i think the problem might be here.
    }
    dispatch(addReviewThunk(payload))
      .then(() => {
        setUploadError('');
        setReviewCount(reviewCount + 1);
        setAddReview(false);
        setReview('');
        setStars(1);
        const newNumReviews = numReviews + 1;
        const newAvgStarRating = (avgStarRating * numReviews + stars) / newNumReviews;
        setNumReviews(newNumReviews);
        setAvgStarRating(newAvgStarRating);
        closeModal();
      })
      .catch(() => {
        setUploadError('Please type at least 10 characters and select a star rating.')
      });
  }

  const isSubmitDisabled = review.length < 10 || stars === null;

  if (detailState && reviewState) {
    return (
      <div className='review-form'>
        <form onSubmit={submitHandler}>
          <h2 className='review-question'>
            How was your stay?
          </h2>
          {uploadError && (
            <div className='error-message review-error-message'>{uploadError}</div>
          )}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder='Please type at least 10 characters.'
            required
            maxLength={200}
          />
          <div className='rating-container'>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <label key={starValue}>
                  <input
                    type="radio"
                    name="rating"
                    value={starValue}
                    onClick={() => setStars(starValue)}
                    onMouseOver={() => setHoveredStars(starValue)}
                    onMouseOut={() => setHoveredStars(stars)}
                  // onMouseOver={() => setHoveredStars(prevStars => prevStars)}
                  />
                  <span
                    className={`star ${hoveredStars >= starValue || stars >= starValue ? 'active' : ''}`}>
                    &#9733;
                  </span>
                </label>
              );
            })}
            <label htmlFor="rating">Stars</label>
          </div>
          <div className='submit-review-button-container'>
            <button className='cancel-review' onClick={() => closeModal()}>Cancel</button>
            <button disabled={isSubmitDisabled} type='submit'>Submit Your Review</button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className='loading'>Loading...</div>
    )
  }
}

export default ReviewModal;
