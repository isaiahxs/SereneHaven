import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk, addReviewThunk, updateReviewThunk, deleteReviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import {ReactComponent as Star} from '../../assets/star.svg'
import { clearDetails } from '../../store/spots';
import ReviewModal from '../Review/ReviewModal';
import DeleteReviewModal from '../Review/DeleteReviewModal';
import OpenModalButton from '../../components/OpenModalButton';
import './SpotId.css'


export default function SpotId() {
    console.log('yooo');

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



    // const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    //retrieve spotId from parameter from URL
    const {spotId} = useParams();

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
        //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);
    let detailArray = [];
    // console.log('detailStateeeeeeeeee', detailState)
    if (detailState) detailArray = Object.values(detailState);


    //need to show small images ONLY if they exist in SpotDetails
    const prevImg = detailState?.SpotImages?.find(img => img.preview);
    const smallImages = detailState?.SpotImages?.filter(img => !img.preview);


    //original
    const reviewState = useSelector(state => state.review.currSpotReviews);
    // const reviewState = useSelector((state => {
    //     if (detailState) {return state.review?.currSpotReviews}
    //     else return;
    // }))

    //using singular review instead of reviews because the currSpotReviews property is an object with the review objects as the values, and the review id as the key

    const sessionUser = useSelector(state => state.session.user);
    // const allSpots = useSelector(state => state.spot.allSpots);

    let reviewArray = [];
    if (reviewState) reviewArray = Object.values(reviewState);


    //dispatch two thunks to fetch the spot details and reviews using dispatch and the thunks for getting the location's details as well as the thunk for getting the reviews
    //use useEffect which run on mount and update whenever the dispatch or spotId dependencies change
    useEffect(() => {
        dispatch(spotDetails(spotId));

        // clear the spot details when the component unmounts
        return () => {
            dispatch(clearDetails())
        }
    }, [dispatch, spotId])

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
    //going to take it out of here for right now

    //KIND OF SOLVED THE PROBLEM OF FIRST NAME AND LAST NAME NOT APPEARING INSTANTLY AFTER POSTING A REVIEW. HOWEVER THIS INTRODUCES A BUG THAT OCCURS SOMETIMES WHERE THE USER'S REVIEW RENDERS, THEN GOES AWAY, THEN RE-RENDERS AGAIN. I THINK IT HAS SOMETHING TO DO WITH THE REVIEW ARRAY BEING UPDATED AFTER THE REVIEW IS POSTED, BUT BEFORE THE REVIEW IS RENDERED. I THINK I NEED TO FIGURE OUT A WAY TO MAKE THE REVIEW ARRAY UPDATE AFTER THE REVIEW IS RENDERED.
    //i think i can do that by using a useEffect hook that runs whenever the reviewArray changes?
    //or maybe use clear details like i did for the spot details?

    //need to figure out how to get the first name and last name to appear immediately after posting a review

    //need to have updated review render immediately after clicking submit. currently it only renders after refreshing the page. going to have to listen for changes in the review state and then re-render the component / re-fetch reviews
    useEffect(() => {
        if (!reviewState) return;
        const numReviews = Object.keys(reviewState).length;
        if (numReviews !== reviewArray.length) {
          dispatch(reviewThunk(spotId));
        }
      }, [dispatch, reviewArray.length, reviewState, spotId]);
      //i'm getting status 200 from backend
      //not sure if this actually helped anything. need to check it again.

    useEffect(() => {
        if(reviewToDelete !== null) {
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
        const newNumReviews = numReviews + 1;
        const newAvgStarRating = (avgStarRating * numReviews + stars) / newNumReviews;
        setNumReviews(newNumReviews);
        setAvgStarRating(newAvgStarRating);
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

        //doesn't really make sense to increase reviewCount off of just an edit
        // setReviewCount(reviewCount + 1);
        setReviewEdit(reviewEdit);
        setRatingEdit(ratingEdit);
        setShowEdit(false);
        setReviewChanged(true);
    }

//--------------------GOING TO WORK ON REVIEW MODAL BELOW --------------------
//firstName and lastName issue is a timing issue. need to figure out how to get the firstName and lastName to appear immediately after posting a review think i need to add something else to the if statement
    const addingReview = () => {
        //loop through the reviewArray and check if the userId of the current review matches the userId of the current sessionUser
        //if it does, then alert the user that they have already reviewed this location
        //if it does not, then set the addReview state to the opposite of what it currently is
        if (sessionUser) {
            for (let i = 0; i < reviewArray.length; i++) {
                if (reviewArray[i].userId === sessionUser.id) {
                    alert('You have already reviewed this location');
                    return;
                }
            }
            setAddReview(!addReview);
        } else {
            alert('Please sign in to add a review.');
        }
    }

//--------------------GOING TO WORK ON REVIEW MODAL ABOVE --------------------


    const editReview = (review) => {
        setShowEdit(!showEdit);
        //going to try both
        // setReviewEdit(reviewState[reviewId].review);
        // setRatingEdit(reviewState[reviewId].stars);

        setRatingEdit(review.stars)
        setReviewEdit(review.review)
    }

    const deleteHandler = (reviewId) => {
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);


//BELOW ARE FOR BEFORE I IMPLEMENTED DELETE MODAL
        // commenting this out so it doesn't immediately delete the review
            // dispatch(deleteReviewThunk(reviewId));
        //i might need the following lines so that it causes the immediate re-rendering of the component
        // setReviewChanged(true);
        // setReviewCount(reviewCount - 1);
    }

    const confirmDeleteHandler = (reviewId) => {
        dispatch(deleteReviewThunk(reviewId));
        setReviewChanged(true);
        setReviewCount(reviewCount - 1);
        setShowDeleteModal(false);
    };

    const deleteConfirmationModal = () => {
        return (
            <div className='delete-confirmation-modal'>
                <h3>Are you sure you want to delete this review?</h3>
                <div>
                    <button onClick={confirmDeleteHandler}>Yes (Delete Review)</button>
                    <button onClick={() => setShowDeleteModal(false)}>No (Keep Review)</button>
                </div>
            </div>
        )
    }


    // console.log('DETAIL STATE PREVIEW IMAGEEEEEEEEEE', reviewArray[1])

    if(detailState && reviewState) {
        const isOwner = sessionUser?.id === detailState.Owner.id;

        const showReviewButton = () => {
            if (!sessionUser) return false; //current user is not logged in
            if (isOwner) return false; //current user is the owner of the spot
            const hasPostedReview = reviewArray.some(review => review.userId === sessionUser.id);
            if (hasPostedReview) return false; //current user has already posted a review
            return true; //show the "Post Your Review" button
        }

        return (
            <div className='outer-container'>
                <div className='inner-container'>

                    <h1 className='name'>{detailState.name}</h1>

                    <h2 className='heading'>
                        <div>{detailState.city}, {detailState.state}, {detailState.country}</div>
                    </h2>
                    <div className='images-container'>
                        <div className='large-image-container'>
                            <img className='preview-image' src={prevImg.url} alt={`${detailState.name}`}/>
                        </div>
                        <div className='small-image-container'>

                            {smallImages.map((image, i) => (
                                <img key={i} src={image.url} alt={detailState.name} className='small-images'/>
                            ))}
                        </div>
                    </div>

                    <div className='details-bottom-container'>
                        <div className='owner-info'>
                            <h2 className='host-name'>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</h2>
                            <h3 className='detail-description'>{detailState.description}</h3>
                        </div>
                        <div className='reservation-container'>
                            <div className='price-reviews-wrapper'>
                            <div className='prices-and-stars'>
                                <div className='detail-price'>
                                    <span className='amount'>${detailState.price}</span>
                                    night
                                    </div>
                                {/* ----------------------------------------- */}
                                {/* EXPERIMENTING TO TRY TO IMMEDIATELY RENDER NEW AVGSTARRATING AND NEWNUMREVIEW COUNT */}
                                {/* <div className='total-reviews-container'>
                                    {Number(avgStarRating) ? (
                                        <div className='stars'>
                                            <Star className='star-icon' alt='little-star'/>
                                            {Number(avgStarRating).toFixed(1)}
                                            <span className='dot'>•</span>
                                            <p>{numReviews === 1 ? '1 Review' : `${numReviews} Reviews`}</p>
                                        </div>
                                    ) : (
                                        <div className='stars'>
                                            <Star alt='little-star'/>
                                            New
                                        </div>
                                    )}
                                </div> */}
                            </div>
                            <div className='total-reviews-container'>
                                    {Number(detailState.avgStarRating) ? (
                                        <div className='reviews'>
                                            <div className='stars'>
                                                <Star className='star-icon' alt='little-star'/>
                                                {Number(detailState.avgStarRating).toFixed(1)}
                                                <span className='dot'>•</span>
                                            </div>
                                            <div className='review-count'>
                                                {detailState.numReviews === 1 ? '1 Review' : `${detailState.numReviews} Reviews`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='stars'>
                                            <Star alt='little-star'/>
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className='reserve-button' onClick={() => window.alert('Feature coming soon!')}>Reserve</button>
                        </div>
                    </div>


                    <div className='review-container'>
                        {/* ------------------------------------ */}
                        <div className='review-summary'>
                            {Number(detailState.avgStarRating) ? (
                                <div className='stars'>
                                    <Star className='star-icon' alt='little-star'/>
                                    {Number(detailState.avgStarRating).toFixed(1)}
                                    <span className='dot'>•</span>
                                    <p>{detailState.numReviews === 1 ? '1 Review' : `${detailState.numReviews} Reviews`}</p>
                                </div>
                            ) : (
                                <div className='stars'>
                                    <Star alt='little-star'/>
                                    New
                                    </div>
                            )}
                        </div>
                        {/* ------------------------------------ */}
                        {/* EXPERIMENTING TO TRY TO IMMEDIATELY RENDER NEW AVGSTARRATING AND NEWNUMREVIEW COUNT */}
                        {/* <div className='review-summary'>
                            {Number(avgStarRating) ? (
                                <div className='stars'>
                                    <Star className='star-icon' alt='little-star'/>
                                    {Number(avgStarRating).toFixed(1)}
                                    <span className='dot'>•</span>
                                    <p>{numReviews === 1 ? '1 Review' : `${numReviews} Reviews`}</p>
                                </div>
                            ) : (
                                <div className='stars'>
                                    <Star alt='little-star'/>
                                    New
                                    </div>
                            )}
                        </div> */}
                        {/* ------------------------------------ */}
                        {
                        showReviewButton() && (
                            <OpenModalButton
                            modalComponent={<ReviewModal spotId={spotId}/>}
                            buttonText={reviewArray.length === 0 && !isOwner ? "Be the first to post a review!" : "Post Your Review"}
                            onButtonClick={addingReview}
                            />
                            )
                        }
                        {/* ----------------------------------- */}
                        {/* need to put a check here to render only after the data is available to avoid the firstName and lastName bug */}
                        {reviewArray.map((review) => {
                            // console.log('Review:', review)
                            return (
                                <div key={review.id}>
                                    <div className='reviewer-name'>{review.User?.firstName}</div>
                                    {/* <div>{review.createdAt}</div> */}
                                    {/* my preferred method of showing the review date below */}
                                    {/* <div>{new Date(review.createdAt).toLocaleDateString()}</div> */}
                                    <div>
                                        {new Date(review.createdAt).toLocaleString('en-US', {month: 'long', year: 'numeric'})}
                                    </div>
                                    {/* <div>Star rating: {review.stars}</div> */}
                                    <div className='new-rev'>{review.review}</div>
                                    {/* need to create a button / area that the user can click and submit to edit their review */}
                                    {/* {sessionUser && sessionUser.id === review.userId && ( */}
                                    {sessionUser && sessionUser.id === review.userId && (
                                        <div>
                                            <button className='detail-edit-button' type='submit' onClick={() => editReview(review)}>Edit Review</button>

                                            {/* <OpenModalButton
                                                modalComponent={deleteConfirmationModal()}
                                                buttonText='Delete'
                                                onButtonClick={() => setReviewToDelete(review.id)}
                                            /> */}


                                            <OpenModalButton
                                                modalComponent={
                                                    <DeleteReviewModal
                                                    reviewId={review.id}
                                                    onDelete={confirmDeleteHandler}
                                                    onCancel={() =>setShowDeleteModal(false)}
                                                    />
                                                }
                                                buttonText='Delete'
                                                // onButtonClick={() => setReviewToDelete(review.id)}
                                                onButtonClick={() => setShowDeleteModal(true)}
                                            />


                                            {/* <button type='submit' onClick={() => deleteHandler(review.id)}>Delete</button>

                                            {showDeleteModal && (
                                                <div className="delete-confirmation-modal">
                                                <h3>Are you sure you want to delete this review?</h3>
                                                    <div>
                                                        <button onClick={confirmDeleteHandler}>Yes (Delete Review)</button>
                                                        <button onClick={() => setShowDeleteModal(false)}>No (Keep Review)</button>
                                                    </div>
                                                </div>
                                            )} */}
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
                </div>
            </div>
        )
    } else {
        return (
            <div className='loading'>Loading...</div>
        )
    }
}

//q: when i'm signed in and go to a spot where i have not made a review already, then i click on submit, i get an error saying "cannot read properties of firtName" of undefined. why is this happening? i thought i was passing in the userId as a foreign key in the review table
    //i think i resolved this. put a question mark after review.User in the divs
