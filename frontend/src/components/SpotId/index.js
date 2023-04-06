import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';
import './SpotId.css'

export default function SpotId() {
    console.log('yooo');

    const dispatch = useDispatch();
    //retrieve spotId from parameter from URL
    const {spotId} = useParams();

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
        //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);


    //dispatch two thunks to fetch the spot details and reviews using dispatch and the thunks for getting the location's details as well as the thunk for getting the reviews
    //use useEffect which run on mount and update whenever the dispatch or spotId dependencies change
    useEffect(() => {
        dispatch(spotDetails(spotId));
    }, [dispatch, spotId])


    useEffect(() => {
        dispatch(reviewThunk(spotId));
    }, [dispatch, spotId])

// IMPORTANT: IS THIS SOMETHING I'M GOING TO HAVE TO CHECK FOR LATER?
    // if (!detailState) return null;

    //noticed this one was not appearing so i realized it was the line above that was making it not appear
    // console.log('5+5');


    return (
        <div className='spot-details'>
        {/* render detailed view of a spot. use data from Redux store through useSelector hook to display spot's name, avg rating, number of reviews, city, state, country*/}
        {/* render images of the location through the spotImages*/}
        {/* have a section for the reviews */}
        {/* <h1>{detailState.name}</h1>
            <p>Rating: {detailState.avgRating}</p>
            <p>City: {detailState.city}</p>
            <p>State: {detailState.state}</p>
            <p>Country: {detailState.country}</p> */}
        <div>hiiii</div>
        </div>
    )
}
