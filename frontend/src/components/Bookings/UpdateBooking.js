import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBookingThunk, userBookingsThunk } from '../../store/bookings';
import './UpdateBooking.css';

export default function UpdateBooking({ booking }) {
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(booking.startDate);
    const [endDate, setEndDate] = useState(booking.endDate);

    const handleStartChange = (event) => {
        console.log(event.target.value);
        setStartDate(event.target.value);
    };

    const handleEndChange = (event) => {
        console.log(event.target.value);
        setEndDate(event.target.value);
    }

    function parseLocalDate(inputDate) {
        const [year, month, day] = inputDate.split('-').map(Number);
        return new Date(year, month - 1, day); // JavaScript months are 0-indexed
    }

    const handleUpdateClick = () => {
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        // Add one day to the parsed start and end dates to compensate for JS discrepancy with UTC
        parsedStartDate.setDate(parsedStartDate.getDate() + 1);
        parsedEndDate.setDate(parsedEndDate.getDate() + 1);

        if (parsedStartDate > parsedEndDate) {
            alert('Please select an end date that comes after the start date.');
            return;
        }

        if (parsedStartDate && parsedEndDate) {
            const formattedStartDate = parsedStartDate.toISOString().split('T')[0];
            const formattedEndDate = parsedEndDate.toISOString().split('T')[0];
            dispatch(updateBookingThunk(booking.id, formattedStartDate, formattedEndDate));
        } else {
            alert('Please select both start and end dates.');
        }
    };

    return (
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

            <div className='booking-buttons'>
                <button
                    type='submit'
                    className='confirm-button'
                    onClick={handleUpdateClick}
                    disabled={!startDate || !endDate}
                >
                    Update
                </button>
            </div>
        </div>
    );
}
