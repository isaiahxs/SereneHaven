import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import './SpotId.css'
import { clearDetails } from '../../store/spots';


export default function SpotId() {
    console.log('yooo');

    const dispatch = useDispatch();
    //retrieve spotId from parameter from URL
    const {spotId} = useParams();

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
        //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);

    const reviewState = useSelector(state => state.review.currSpotReviews);
    //using singular review instead of reviews because the currSpotReviews property is an object with the review objects as the values, and the review id as the key

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

    {/* render detailed view of a spot. use data from Redux store through useSelector hook to display spot's name, avg rating, number of reviews, city, state, country*/}
            {/* render images of the location through the spotImages*/}
            {/* have a section for the reviews */}
            {/* <h1>{detailState.name}</h1>
                <p>Rating: {detailState.avgRating}</p>
                <p>City: {detailState.city}</p>
                <p>State: {detailState.state}</p>
                <p>Country: {detailState.country}</p> */}

    //should i be checking for reviewArray here?
    if(detailState && reviewState) {
        return (
            <div className='outer-container'>
                <div className='inner-container'>

                    <div className='name'>{detailState.name}</div>

                    <div className='body'>
                        <div>{detailState.avgStarRating}</div>
                        <div>{detailState.numReviews}</div>
                        <div>{detailState.city}</div>
                        <div>{detailState.state}</div>
                        <div>{detailState.country}</div>
                    </div>


                    <img className='detail-image' src={detailState.SpotImages[0].url} alt='preview'/>
                    <div>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</div>
                    <div>{detailState.description}</div>

                    <div className='review-container'>
                        <div>Reviews</div>
                        {reviewArray.map((review) => {
                            return (
                                <div key='review.id'>
                                    <div>{review.User.firstName} {review.User.lastName}</div>
                                    {/* <div>{review.createdAt}</div> */}
                                    <div>{review.starRating}</div>
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
