import React, { useState, useEffect } from 'react';
import { reviewThunk, addReviewThunk } from '../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';

import './ReviewModal.css';

function ReviewModal({spotId}) {
  // console.log('ReviewModal spotId: ', spotId)
  const dispatch = useDispatch();
  // const {spotId} = useParams();

  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //----------------------SIMILAR TO SPOT ID----------------------
  //consts below are from SpotId transfer
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(null);
  const [addReview, setAddReview] = useState(false);
  const [reviewChanged, setReviewChanged] = useState(false);

  //following are for immediate renders of reviews
  const [avgStarRating, setAvgStarRating] = useState(null);
  const [numReviews, setNumReviews] = useState(0);

  const [reviewCount, setReviewCount] = useState(0);

  const [uploadError, setUploadError] = useState('');
  const {closeModal} = useModal();

  const detailState = useSelector(state => state.spot.spotDetails);
  const reviewState = useSelector(state => state.review.currSpotReviews);

  const sessionUser = useSelector(state => state.session.user);

  let reviewArray = [];
  if (reviewState) reviewArray = Object.values(reviewState);


  useEffect(() => {
    dispatch(reviewThunk(spotId));
    setReviewChanged(false);

    if(reviewArray.length > 0) {
        const totalStars = reviewArray.reduce((acc, review) => acc + review.stars, 0);
        const avgStars = totalStars / reviewArray.length;
        setAvgStarRating(avgStars);
        setNumReviews(reviewArray.length);
    } else {
        setAvgStarRating(null);
        setNumReviews(0);
    }
  }, [dispatch, spotId, reviewChanged, reviewCount, avgStarRating, numReviews])

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
    console.log('SUBMIT HANDLER CALLED')
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
        setUploadError('Sorry, seems we were unable to upload your review. Please try again.')
      });
  }

  const isSubmitDisabled = review.length < 10 || stars === null;

  if (detailState && reviewState) {
  return (

      <div className='review-form'>
          <form onSubmit={submitHandler}>
              <h2 className='review-question'>How was your stay?</h2>
              {uploadError && (
                <div className='error-message'>{uploadError}</div>
              )}
              <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder='Leave your review here...'
                  required
                  maxLength={200}
              />
              <div className='rating-container'>
              {/* <input
              className='review-input'
              type='number'
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              min={1}
              max={5}
              // name='rating'
              required
              placeholder='Rating'
              /> */}

              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <label key={starValue}>
                    <input
                      type="radio"
                      name="rating"
                      value={starValue}
                      onClick={() => setStars(starValue)}
                    />
                    <span className="star">&#9733;</span>
                  </label>
                );
              })}
              <label htmlFor="rating">Stars</label>
              </div>
              <button disabled={isSubmitDisabled} type='submit'>Submit Your Review</button>
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
