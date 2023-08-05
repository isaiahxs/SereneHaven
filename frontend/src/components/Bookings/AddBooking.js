import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userBookingsThunk, addBookingThunk } from '../../store/bookings';

export default function AddBooking({ spotId }) {
    const dispatch = useDispatch();
    const userBookings = useSelector((state) => state.booking.Bookings);
    // console.log('THESE ARE OUR USER BOOKINGS', userBookings);

    // console.log('THIS IS THE SPOTID BEING PASSED FROM SPOTID COMPONENT', spotId)

    const [showBooking, setShowBooking] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndChange = (event) => {
        setEndDate(event.target.value);
    }

    const handleReserveClick = () => {
        setShowBooking(true);
    }

    const handleConfirmClick = () => {
        if (startDate && endDate) {
            dispatch(addBookingThunk(spotId, startDate, endDate));
            dispatch(userBookingsThunk())
            setShowBooking(false);
        } else {
            alert('Please select both start and end dates.');
        }
    };

    return (
        <div className='calendar-section'>
            <button className='reserve-button' onClick={handleReserveClick}>
                Reserve
            </button>

            {showBooking && (
                <div>
                    <div>
                        Start
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartChange}
                        />
                    </div>

                    <div>
                        End
                        <input
                            type='date'
                            value={endDate}
                            onChange={handleEndChange}
                        />
                    </div>

                    <button className='confirm-button' onClick={handleConfirmClick}>
                        Confirm
                    </button>
                </div>
            )}
        </div>
    );
}