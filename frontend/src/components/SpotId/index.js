import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { spotDetails } from '../../store/spots';
import { reviewThunk } from '../../store/reviews';
// import { getBookingThunk } from '../../store/bookings';
import { useParams } from 'react-router-dom';
import { ReactComponent as Star } from '../../assets/star.svg'
import { clearDetails } from '../../store/spots';
import BookingContainer from '../../components/BookingContainer/index'
import ReviewContainer from '../ReviewContainer';
import AddBooking from '../Bookings/AddBooking';
import SpotImages from '../SpotImages';
import './SpotId.css'

export default function SpotId() {
    const currentSpotReviews = useSelector(state => state.review.currSpotReviews);

    let currentSpotReviewsArray = [];
    if (currentSpotReviews) {
        currentSpotReviewsArray = Object.values(currentSpotReviews);
        const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
        const averageStars = currentSpotReviewsArray.length > 0 ? totalStars / currentSpotReviewsArray.length : 0;
    }

    const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
    const averageStars = totalStars / currentSpotReviewsArray.length;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const dispatch = useDispatch();
    const { spotId } = useParams();

    const detailState = useSelector(state => state.spot.spotDetails);

    //dispatch two thunks to fetch the spot details and reviews using dispatch and the thunks for getting the location's details as well as the thunk for getting the reviews
    //use useEffect which run on mount and update whenever the dispatch or spotId dependencies change
    useEffect(() => {
        dispatch(spotDetails(spotId));
        dispatch(reviewThunk(spotId));

        // clear the spot details when the component unmounts
        return () => {
            dispatch(clearDetails())
        }
    }, [dispatch, spotId])

    useEffect(() => {
        if (reviewToDelete !== null) {
            setShowDeleteModal(true);
        }
    }, [reviewToDelete])

    if (detailState && currentSpotReviews) {
        return (
            <div className='outer-container'>
                <div className='inner-container'>

                    <h1 className='name'>{detailState.name}</h1>

                    <h2 className='heading'>
                        <div>{detailState.city}, {detailState.state}, {detailState.country}</div>
                    </h2>
                    <SpotImages />

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
                                </div>
                                <div className='total-reviews-container'>
                                    {Number(averageStars) ? (
                                        <div className='reviews'>
                                            <div className='stars'>
                                                <Star className='star-icon' alt='little-star' />
                                                {Number(averageStars).toFixed(1)}
                                                <span className='dot'>•</span>
                                            </div>
                                            <div className='review-count'>
                                                {currentSpotReviewsArray.length === 1 ? '1 Review' : `${currentSpotReviewsArray.length} Reviews`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='stars'>
                                            <Star alt='little-star' className='star-icon' />
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                            <AddBooking spotId={spotId} />
                            {/* <button className='reserve-button' onClick={() => window.alert('Feature coming soon!')}>Reserve</button> */}
                        </div>
                    </div>
                    <BookingContainer spotId={spotId} />
                    <ReviewContainer />
                </div>
            </div>
        )
    } else {
        return (
            <div className='loading'>Loading...</div>
        )
    }
}
