import React, { useEffect } from 'react';
import { ReactComponent as Star } from '../../assets/star.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { spots } from '../../store/spots';
import './HomePage.css';

export default function Spots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotsState = useSelector(state => state?.spot?.allSpots);

    useEffect(() => {
        dispatch(spots())
    }, [dispatch])

    if (!spotsState) return null;

    const landingSpots = Object.values(spotsState);

    const clickHandler = spotsId => {
        history.push(`/spots/${spotsId}`);
    }

    return (
        <div className='container'>
            {landingSpots.map((landingSpot) => {
                return (

                    <div className='spot' key={landingSpot.id} onClick={() => clickHandler(landingSpot.id)}>
                        <div className='preview'>
                            <img
                                className='spot-image'
                                src={landingSpot.previewImage}
                                alt={`${landingSpot.name}`}
                            />
                        </div>

                        <div className='spots-container'>
                            <p className='loc'>
                                {landingSpot.city}, {landingSpot.state}
                                {/* <span className='rating'>
                                    <Star alt='little-star' className='star-icon' />
                                    {Number(landingSpot.avgRating)
                                        ? Number(landingSpot.avgRating).toFixed(1)
                                        : 'New'}
                                </span> */}
                                <div className='stars'>
                                    <Star alt='little-star' className='star-icon' />
                                    {landingSpot.avgRating > 0 ? Number(landingSpot.avgRating).toFixed(1) : "New"}
                                </div>
                            </p>

                            <p className='price'>
                                <span className='location-price'>${landingSpot.price}</span> night
                            </p>
                        </div>
                        <span className='tooltip'>{landingSpot.name}</span>
                    </div>
                )
            })}
        </div>
    )
}
