import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//thunk for getting the location's details
import { spotDetails } from '../../store/spots';
//thunk for getting the location's reviews
import { reviewThunk } from '../../store/reviews';
import { useParams } from 'react-router-dom';

import './SpotId.css'

export default SpotId = () => {
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

    if (!detailState) return null;



    return (
        <div>Temporary placeholder</div>
    )
}
