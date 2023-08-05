import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userBookingsThunk, addBookingThunk } from '../../store/bookings';

export default function AddBooking({ spotId }) {
    const dispatch = useDispatch();
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
        <div>
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