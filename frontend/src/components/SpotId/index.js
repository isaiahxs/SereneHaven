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
import ReviewContainer from '../ReviewContainer';
import { useModal } from '../../context/Modal';
import './SpotId.css'


export default function SpotId() {

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


    //need to show small images ONLY if they exist in SpotDetails
    const prevImg = detailState?.SpotImages?.find(img => img.preview);
    const smallImages = detailState?.SpotImages?.filter(img => !img.preview);


    //original
    const reviewState = useSelector(state => state.review.currSpotReviews);

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

        if (reviewArray.length > 0) {
            const totalStars = reviewArray.reduce((acc, review) => acc + review.stars, 0);
            const avgStars = totalStars / reviewArray.length;
            setAvgStarRating(avgStars);
            setNumReviews(reviewArray.length);
        } else {
            setAvgStarRating(null);
            setNumReviews(0);
        }
    }, [dispatch, spotId, reviewChanged, reviewCount])

    useEffect(() => {
        if (!reviewState) return;
        const numReviews = Object.keys(reviewState).length;
        if (numReviews !== reviewArray.length) {
            dispatch(reviewThunk(spotId));
        }
    }, [dispatch, reviewArray.length, reviewState, spotId]);

    useEffect(() => {
        if (reviewToDelete !== null) {
            setShowDeleteModal(true);
        }
    }, [reviewToDelete])


    if (detailState && reviewState) {

        return (
            <div className='outer-container'>
                <div className='inner-container'>

                    <h1 className='name'>{detailState.name}</h1>

                    <h2 className='heading'>
                        <div>{detailState.city}, {detailState.state}, {detailState.country}</div>
                    </h2>
                    <div className='images-container'>
                        <div className='large-image-container'>
                            <img className='preview-image' src={prevImg.url} alt={`${detailState.name}`} />
                        </div>
                        <div className='small-image-container'>

                            {smallImages.map((image, i) => (
                                <img key={i} src={image.url} alt={detailState.name} className='small-images' />
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
                                </div>
                                <div className='total-reviews-container'>
                                    {Number(detailState.avgStarRating) ? (
                                        <div className='reviews'>
                                            <div className='stars'>
                                                <Star className='star-icon' alt='little-star' />
                                                {Number(detailState.avgStarRating).toFixed(1)}
                                                <span className='dot'>•</span>
                                            </div>
                                            <div className='review-count'>
                                                {detailState.numReviews === 1 ? '1 Review' : `${detailState.numReviews} Reviews`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='stars'>
                                            <Star alt='little-star' />
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className='reserve-button' onClick={() => window.alert('Feature coming soon!')}>Reserve</button>
                        </div>
                    </div>
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
