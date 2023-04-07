import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk, addReviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import './SpotId.css'
import { clearDetails } from '../../store/spots';


export default function SpotId() {
    console.log('yooo');

    const [review, setReview] = useState('');
    const [stars, setStars] = useState(1);
    const [addReview, setAddReview] = useState(false);
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    //retrieve spotId from parameter from URL
    const {spotId} = useParams();

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
        //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);

    const reviewState = useSelector(state => state.review.currSpotReviews);
    //using singular review instead of reviews because the currSpotReviews property is an object with the review objects as the values, and the review id as the key

    const sessionUser = useSelector(state => state.session.user);
    const allSpots = useSelector(state => state.spot.allSpots);

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
    }, [dispatch, spotId])

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
            userId: sessionUser.id
        }
        dispatch(addReviewThunk(payload));

        setAddReview(false);
        setReview('');
        setStars(1);
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


    //should i be checking for reviewArray here?
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
                            return (
                                <div key={review.id}>
                                    <div>{review.User.firstName} {review.User.lastName}</div>
                                    {/* <div>{review.createdAt}</div> */}
                                    <div>{review.stars}</div>
                                    <div>{review.review}</div>
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
