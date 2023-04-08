import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk, addReviewThunk, updateReviewThunk, deleteReviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import './SpotId.css'
import { clearDetails } from '../../store/spots';


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

    const [reviewCount, setReviewCount] = useState(0);


    // const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    //retrieve spotId from parameter from URL
    const {spotId} = useParams();

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
        //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);

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
    }, [dispatch, spotId, reviewChanged, reviewCount])
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


// IMPORTANT: IS THIS SOMETHING I'M GOING TO HAVE TO CHECK FOR LATER?
    // if (!detailState) return null;

    //noticed this one was not appearing so i realized it was the line above that was making it not appear
    // console.log('5+5');

// IMPORTANT: GOING TO HAVE TO MAKE SMALL EDITS DEPENDING ON WHETHER OR NOT THERE IS A USER

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

        setReviewCount(reviewCount + 1);
        setReviewEdit(reviewEdit);
        setRatingEdit(ratingEdit);
        setShowEdit(false);
        setReviewChanged(true);
    }


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

    const editReview = (review) => {
        setShowEdit(!showEdit);
        //going to try both
        // setReviewEdit(reviewState[reviewId].review);
        // setRatingEdit(reviewState[reviewId].stars);

        setRatingEdit(review.stars)
        setReviewEdit(review.review)
    }

    const deleteHandler = (reviewId) => {
        dispatch(deleteReviewThunk(reviewId));
        //i might need the following line so that it causes the immediate re-rendering of the component
        setReviewChanged(true);
        setReviewCount(reviewCount - 1);
    }


    //should i be checking for reviewArray here?
    //did changing this to reviewArray fix the problem of rapid repeated rendering?
    if(detailState && reviewState) {
        return (
            <div className='outer-container'>
                <div className='inner-container'>

                    <div className='name'>{detailState.name}</div>

                    <div className='heading'>
                        {/* <div>{detailState.avgStarRating}</div>
                        <div>{detailState.numReviews}</div> */}
                        <div>{detailState.city}</div>
                        <div>{detailState.state}</div>
                        <div>{detailState.country}</div>
                    </div>


                    <img className='detail-image' src={detailState.SpotImages[0].url} alt='preview'/>
                    <div>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</div>
                    <div>{detailState.description}</div>

                    <div className='reserve-container'>
                        <div className='upper'></div>
                        {/* <div className='button'></div> */}
                    </div>

                    <div className='review-container'>
                        <div>Reviews</div>
                        <div className='add-review' onClick={addingReview}>Add Review</div>
                        {addReview && (
                            <div className='review-form'>
                                <form onSubmit={submitHandler}>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder='Write a review'
                                        required
                                        maxLength={200}
                                    />
                                    <input
                                    type='number'
                                    value={stars}
                                    onChange={(e) => setStars(e.target.value)}
                                    min={1}
                                    max={5}
                                    required
                                    placeholder='Rating'
                                    />
                                    <button type='submit'>Submit</button>
                                </form>
                            </div>
                        )}
                        {reviewArray.map((review) => {
                            // console.log('Review:', review)
                            return (
                                <div key={review.id}>
                                    <div>{review.User?.firstName} {review.User?.lastName}</div>
                                    {/* <div>{review.createdAt}</div> */}
                                    <div>Star rating: {review.stars}</div>
                                    <div>Review: {review.review}</div>
                                    {/* need to create a button / area that the user can click and submit to edit their review */}
                                    {/* {sessionUser && sessionUser.id === review.userId && ( */}
                                    {sessionUser && sessionUser.id === review.userId && (
                                        <div>
                                            <button onClick={() => editReview(review)}>Edit Review</button>
                                            <button onClick={() => deleteHandler(review.id)}>Delete</button>
                                        </div>
                                    )}
                                    {sessionUser && sessionUser.id === review.userId && showEdit && (
                                        <div className='review-form'>
                                            <form onSubmit={(e) => editSubmitHandler(e, review.id)}>
                                                <textarea
                                                    value={reviewEdit}
                                                    onChange={(e) => setReviewEdit(e.target.value)}
                                                    placeholder='Write a review'
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
            <div>Loading...</div>
        )
    }
}

//q: when i'm signed in and go to a spot where i have not made a review already, then i click on submit, i get an error saying "cannot read properties of firtName" of undefined. why is this happening? i thought i was passing in the userId as a foreign key in the review table
    //i think i resolved this. put a question mark after review.User in the divs

//----------------------- NEW ITERATION -----------------------


//----------------------- OLD ITERATION -----------------------

// my old return before i reorganized it:
    // return (
    //     <div className='spot-details'>
    //     {/* render detailed view of a spot. use data from Redux store through useSelector hook to display spot's name, avg rating, number of reviews, city, state, country*/}
    //     {/* render images of the location through the spotImages*/}
    //     {/* have a section for the reviews */}
    //     {/* <h1>{detailState.name}</h1>
    //         <p>Rating: {detailState.avgRating}</p>
    //         <p>City: {detailState.city}</p>
    //         <p>State: {detailState.state}</p>
    //         <p>Country: {detailState.country}</p> */}
    //     {detailState && (
    //         <>
    //             <div>hiiii</div>
    //             <div>{detailState.name}</div>
    //             {/* <div>{detailState.city}</div> */}
    //         </>
    //     )}
    //     </div>
    // )