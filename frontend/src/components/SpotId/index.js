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
import SpotImages from '../SpotImages/SpotImages.js';
import Favorites from '../Favorites';
import './SpotId.css'
import { userBookingsThunk, spotBookingsThunk } from '../../store/bookings';
import { getFavorites } from '../../store/favorites';

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
    const sessionUser = useSelector(state => state.session.user)
    // const userBookings = useSelector((state) => state.booking.Bookings);

    //dispatch two thunks to fetch the spot details and reviews using dispatch and the thunks for getting the location's details as well as the thunk for getting the reviews
    //use useEffect which run on mount and update whenever the dispatch or spotId dependencies change
    // useEffect(() => {
    //     dispatch(spotBookingsThunk(spotId));
    //     dispatch(spotDetails(spotId));
    //     dispatch(reviewThunk(spotId));
    //     dispatch(userBookingsThunk());
    //     // dispatch(getFavorites());

    //     // clear the spot details when the component unmounts
    //     return () => {
    //         dispatch(clearDetails())
    //     }
    // }, [dispatch, spotId])

    useEffect(() => {
        if (sessionUser) {
            let fetchData = async () => {
                // Wait for spotBookingsThunk to resolve before proceeding
                await dispatch(spotBookingsThunk(spotId));
                dispatch(spotDetails(spotId));
                dispatch(reviewThunk(spotId));
                // dispatch(userBookingsThunk());
            };
            fetchData();
        } else {
            let fetchData = async () => {
                dispatch(spotDetails(spotId));
                dispatch(reviewThunk(spotId));
            };
            fetchData();
        }

        // Clear the spot details when the component unmounts
        return () => {
            dispatch(clearDetails());
        }
    }, [dispatch, sessionUser, spotId]);

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
                    <div className='spot-detail-header'>
                        <h2 className='heading'>
                            <div>{detailState.city}, {detailState.state}, {detailState.country}</div>
                        </h2>
                    </div>

                    {sessionUser && detailState.Owner.id !== sessionUser.id &&
                        <Favorites spotId={spotId} />
                    }

                    <SpotImages />
                    <div className='details-bottom-container'>
                        <div className='owner-info'>
                            {!sessionUser &&
                                <h2 className='host-name'>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</h2>
                            }

                            {sessionUser && detailState.Owner.id !== sessionUser.id &&
                                <h2 className='host-name'>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</h2>
                            }

                            {sessionUser && detailState.Owner.id === sessionUser.id &&
                                <h2 className='host-name'>Hosted by you</h2>
                            }
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
                                            <div className='review-stars'>
                                                <Star className='star-icon' alt='little-star' />
                                                {Number(averageStars).toFixed(1)}
                                                <span className='dot'>•</span>
                                            </div>
                                            <div className='review-count'>
                                                {currentSpotReviewsArray.length === 1 ? '1 Review' : `${currentSpotReviewsArray.length} Reviews`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='review-stars'>
                                            <Star alt='little-star' className='star-icon' />
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                            {sessionUser && detailState.Owner.id !== sessionUser.id &&
                                <AddBooking spotId={spotId} />
                            }
                        </div>
                    </div>
                    <div>
                        <BookingContainer spotId={spotId} />
                    </div>
                    <div>
                        <ReviewContainer />
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
