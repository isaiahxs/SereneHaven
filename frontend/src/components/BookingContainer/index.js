import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userBookingsThunk, addBookingThunk } from '../../store/bookings';
import './BookingContainer.css'

export default function BookingContainer({ spotId }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const userBookings = useSelector((state) => state.booking.Bookings);
    // console.log('THESE ARE OUR USERBOOKINGS', userBookings)
    // console.log('first spot id', userBookings[1].spotId)

    // console.log('THIS IS THE SPOTID PASSED FROM THE SPOTID COMPONENT', spotId)

    const bookingsForThisSpot = userBookings?.filter(booking => Number(booking.spotId) === Number(spotId));
    // console.log('BOOKINGS FOR THIS SPOT', bookingsForThisSpot)

    // useEffect(() => {
    //     dispatch(userBookingsThunk())
    // }, [dispatch])

    function formatDate(inputDate) {
        const parts = inputDate.split('-');
        return `${parts[1]}-${parts[2]}-${parts[0]}`;
    }

    return (
        <div className="review-container">
            {!sessionUser &&
                <div className='bookings-signed-out'>
                    <h3 className='bookings-message'>Please sign in to place a reservation or leave a review.</h3>
                </div>
            }

            {bookingsForThisSpot?.length > 0 && sessionUser &&
                <div>
                    <h3 className='bookings-message'>Upcoming Bookings:</h3>
                    {bookingsForThisSpot.map((booking) => (
                        <div key={booking.id}>
                            <p className='individual-bookings'>From {formatDate(booking.startDate)} to {formatDate(booking.endDate)}</p>
                        </div>
                    ))}
                </div>
            }

            {bookingsForThisSpot?.length === 0 && sessionUser &&
                <h3 className='bookings-message no-bookings'>You have no upcoming bookings for this location.</h3>
            }
        </div>
    )
}