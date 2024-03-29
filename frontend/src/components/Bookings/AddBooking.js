import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userBookingsThunk, addBookingThunk, spotBookingsThunk } from '../../store/bookings';
import './AddBooking.css'

export default function AddBooking({ spotId }) {
    const dispatch = useDispatch();

    const sessionUser = useSelector((state) => state.session.user)
    const userBookings = useSelector((state) => state.booking.Bookings);

    const [showBooking, setShowBooking] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndChange = (event) => {
        setEndDate(event.target.value);
    }

    const handleCancelReserve = () => {
        setShowBooking(false);
    }

    const handleReserveClick = () => {
        setShowBooking(true);
    }

    const handleConfirmClick = () => {
        if (startDate > endDate) {
            alert('Please select an end date that comes after the start date.')
        }
        if (startDate && endDate) {
            dispatch(addBookingThunk(spotId, startDate, endDate));
            // dispatch(userBookingsThunk())
            dispatch(spotBookingsThunk(spotId));
            setShowBooking(false);
        } else {
            alert('Please select both start and end dates.');
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const nextStartDate = startDate ? new Date(startDate) : null;
    if (nextStartDate) {
        nextStartDate.setDate(nextStartDate.getDate() + 1);
    }
    const minEndDate = nextStartDate ? nextStartDate.toISOString().split('T')[0] : today;

    return (
        <div className='calendar-section'>
            {sessionUser &&
                <div className='reserve-button-container'>
                    <button className='reserve-button' onClick={handleReserveClick}>
                        Reserve
                    </button>
                </div>
            }

            {showBooking && (
                <div className='booking-section'>

                    {/* <div className='reserve-text'> */}
                    {/* Start */}
                    <div className='reserve-inputs'>
                        <div className='reserve-text'>Start</div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartChange}
                            className='reserve-input-field'
                            min={today}
                        />
                    </div>
                    {/* </div> */}

                    {/* <div className='reserve-text'>End</div> */}
                    <div className='reserve-inputs'>
                        <div className='reserve-text'>End</div>
                        <input
                            type='date'
                            value={endDate}
                            onChange={handleEndChange}
                            className='reserve-input-field'
                            min={minEndDate}
                        />
                    </div>

                    <div className='booking-buttons'>
                        <button
                            className='cancel-reserve-button'
                            onClick={handleCancelReserve}
                        >Cancel</button>

                        <button
                            type='submit'
                            className='confirm-button'
                            onClick={handleConfirmClick}
                            disabled={!startDate || !endDate}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}