import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userBookingsThunk, addBookingThunk } from '../../store/bookings';
import './BookingContainer.css'

export default function BookingContainer({ spotId }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const userBookings = useSelector((state) => state.booking.Bookings);
    const detailState = useSelector((state) => state.spot.spotDetails)

    //this applies for current signed in user
    const bookingsForThisSpot = userBookings?.filter(booking => Number(booking.spotId) === Number(spotId));

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

            {bookingsForThisSpot?.length > 0 && sessionUser && sessionUser.id !== detailState.Owner.id &&
                <div>
                    <h3 className='bookings-message'>Reserved Dates:</h3>
                    {bookingsForThisSpot.map((booking) => (
                        <div key={booking.id}>
                            <p className='individual-bookings'>From {formatDate(booking.startDate)} to {formatDate(booking.endDate)}</p>
                        </div>
                    ))}
                </div>
            }

            {bookingsForThisSpot?.length === 0 && sessionUser && sessionUser.id !== detailState.Owner.id &&
                <h3 className='bookings-message no-bookings'>You have no upcoming reservations for this location.</h3>
            }

            {bookingsForThisSpot?.length > 0 && sessionUser && sessionUser.id === detailState.Owner.id &&
                <div>
                    <h3 className='bookings-message'>Guest Reservations:</h3>
                    {bookingsForThisSpot.map((booking) => (
                        <div key={booking.id}>
                            <div className='individual-bookings-container'>
                                <p className='booking-guest'>{booking.User.firstName}</p>
                                <p className='individual-bookings host-bookings'>From {formatDate(booking.startDate)} to {formatDate(booking.endDate)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {bookingsForThisSpot?.length === 0 && sessionUser && sessionUser.id === detailState.Owner.id &&
                <h3 className='bookings-message no-bookings'>No one has reserved your spot yet.</h3>
            }
        </div>
    )
}