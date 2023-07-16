import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk, addReviewThunk, updateReviewThunk, deleteReviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import { ReactComponent as Star } from '../../assets/star.svg'
import { clearDetails } from '../../store/spots';
import ReviewModal from '../Review/ReviewModal';
import DeleteReviewModal from '../Review/DeleteReviewModal';
import OpenModalButton from '../../components/OpenModalButton';
import { useModal } from '../../context/Modal';
import './ReviewContainer.css';

export default function ReviewContainer() {
    const currentSpotReviews = useSelector(state => state.review.currSpotReviews);
    // console.log('currentSpotReviews', currentSpotReviews)
    const currentSpotReviewsArray = Object.values(currentSpotReviews);
    // console.log('currentSpotReviewsArray', currentSpotReviewsArray)
    // console.log(currentSpotReviewsArray.length)

    const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
    // console.log('totalStars', totalStars)
    const averageStars = totalStars / currentSpotReviewsArray.length;
    // console.log('averageStars', averageStars)

    const [review, setReview] = useState('');
    const [stars, setStars] = useState(1);
    const [addReview, setAddReview] = useState(false);

    //following are for updated review
    const [ratingEdit, setRatingEdit] = useState(1);
    const [reviewEdit, setReviewEdit] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [reviewChanged, setReviewChanged] = useState(false);

    //following are for immediate renders of reviews
    const [avgStarRating, setAvgStarRating] = useState(null);
    const [numReviews, setNumReviews] = useState(0);

    const [reviewCount, setReviewCount] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const { closeModal } = useModal();

    const dispatch = useDispatch();
    //retrieve spotId from parameter from URL
    const { spotId } = useParams();

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
    //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);
    let detailArray = [];
    // console.log('detailStateeeeeeeeee', detailState)
    if (detailState) detailArray = Object.values(detailState);

    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(spotDetails(spotId));
        // dispatch(reviewThunk(spotId));

        // clear the spot details when the component unmounts
        return () => {
            dispatch(clearDetails())
        }
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(reviewThunk(spotId));
        setReviewChanged(false);

        if (currentSpotReviewsArray.length > 0) {
            const totalStars = currentSpotReviewsArray.reduce((acc, review) => acc + review.stars, 0);
            const avgStars = totalStars / currentSpotReviewsArray.length;
            setAvgStarRating(avgStars);
            setNumReviews(currentSpotReviewsArray.length);
        } else {
            setAvgStarRating(null);
            setNumReviews(0);
        }
    }, [dispatch, spotId, reviewChanged, reviewCount])

    useEffect(() => {
        if (reviewToDelete !== null) {
            setShowDeleteModal(true);
        }
    }, [reviewToDelete])

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
        dispatch(addReviewThunk(payload));

        setReviewCount(reviewCount + 1);
        setAddReview(false);
        setReview('');
        setStars(1);
    }

    const editSubmitHandler = (e, reviewId) => {
        e.preventDefault();
        const payload = {
            review: reviewEdit,
            stars: ratingEdit,
            spotId,
            userId: sessionUser?.id,
            reviewId
        }
        dispatch(updateReviewThunk(payload));
        setReviewEdit(reviewEdit);
        setRatingEdit(ratingEdit);
        setShowEdit(false);
        setReviewChanged(true);
    }

    const addingReview = () => {
        //loop through the currentSpotReviewsArray and check if the userId of the current review matches the userId of the current sessionUser
        //if it does, then alert the user that they have already reviewed this location
        //if it does not, then set the addReview state to the opposite of what it currently is
        if (sessionUser) {
            for (let i = 0; i < currentSpotReviewsArray.length; i++) {
                if (currentSpotReviewsArray[i].userId === sessionUser.id) {
                    alert('You have already reviewed this location');
                    return;
                }
            }
            setAddReview(!addReview);
        } else {
            alert('Please sign in to add a review.');
        }
    }

    const editReview = (review) => {
        setShowEdit(!showEdit);
        setRatingEdit(review.stars)
        setReviewEdit(review.review)
    }

    const confirmDeleteHandler = (reviewId) => {
        dispatch(deleteReviewThunk(reviewId));
        setReviewChanged(true);
        setReviewCount(reviewCount - 1);
        setShowDeleteModal(false);
        closeModal();
    };

    if (detailState && currentSpotReviews) {
        const isOwner = sessionUser?.id === detailState.Owner.id;

        const showReviewButton = () => {
            if (!sessionUser) return false; //current user is not logged in
            if (isOwner) return false; //current user is the owner of the spot
            const hasPostedReview = currentSpotReviewsArray.some(review => review.userId === sessionUser.id);
            if (hasPostedReview) return false; //current user has already posted a review
            return true; //show the "Post Your Review" button
        }

        return (
            <div className='review-container'>
                <div className='review-summary'>
                    {Number(averageStars) ? (
                        <div className='stars'>
                            <Star className='star-icon' alt='little-star' />
                            {Number(averageStars).toFixed(1)}
                            <span className='dot'>•</span>
                            <p>{currentSpotReviewsArray.length === 1 ? '1 Review' : `${currentSpotReviewsArray.length} Reviews`}</p>
                        </div>
                    ) : (
                        <div className='stars'>
                            <Star alt='little-star' />
                            New
                        </div>
                    )}
                </div>
                {
                    showReviewButton() && (
                        <OpenModalButton
                            modalComponent={<ReviewModal spotId={spotId} />}
                            buttonText={currentSpotReviewsArray.length === 0 && !isOwner ? "Be the first to post a review!" : "Post Your Review"}
                            onButtonClick={addingReview}
                        />
                    )
                }
                {/* need to put a check here to render only after the data is available to avoid the firstName and lastName bug */}
                {currentSpotReviewsArray.map((review) => {
                    // console.log('Review:', review)
                    return (
                        <div key={review.id}>
                            <div className='reviewer-name'>{review.User?.firstName}</div>
                            <div>
                                {new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className='new-rev'>{review.review}</div>
                            {sessionUser && sessionUser.id === review.userId && (
                                <div>
                                    <button className='detail-edit-button' type='submit' onClick={() => editReview(review)}>Edit Review</button>

                                    <OpenModalButton
                                        modalComponent={
                                            <DeleteReviewModal
                                                reviewId={review.id}
                                                onDelete={confirmDeleteHandler}
                                                onCancel={() => setShowDeleteModal(false)}
                                            />
                                        }
                                        buttonText='Delete'
                                        // onButtonClick={() => setReviewToDelete(review.id)}
                                        onButtonClick={() => setShowDeleteModal(true)}
                                    />

                                </div>
                            )}
                            {sessionUser && sessionUser.id === review.userId && showEdit && (
                                <div className='review-form'>
                                    <form onSubmit={(e) => editSubmitHandler(e, review.id)}>
                                        <textarea
                                            value={reviewEdit}
                                            onChange={(e) => setReviewEdit(e.target.value)}
                                            placeholder='Leave your review here...'
                                            required
                                            maxLength={200}
                                        />
                                        <input
                                            type='number'
                                            value={ratingEdit}
                                            onChange={(e) => setRatingEdit(e.target.value)}
                                            min={1}
                                            max={5}
                                            required
                                            placeholder='Rating'
                                        />
                                        <button type='submit'>Submit</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return null;
    }
}