import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { updateBookingThunk, userBookingsThunk } from '../../store/bookings';
import './UpdateBooking.css';

export default function UpdateBooking({ booking }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

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
            closeModal();
        } else {
            alert('Please select both start and end dates.');
        }
    };

    //disabling days before today will reduce a lot of errors and frustrations with ux
    const today = new Date().toISOString().split('T')[0];

    const nextStartDate = new Date(startDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);
    const minEndDate = nextStartDate.toISOString().split('T')[0];


    return (
        <div className='updating-modal'>
            <div className='updating-modal-content'>
                <h2 className='update-message'>Update Booking</h2>

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

                <div className='modal-booking-buttons'>
                    <button className='cancel' onClick={closeModal}>Cancel</button>
                    <button
                        type='submit'
                        className='confirm-button'
                        onClick={handleUpdateClick}
                        disabled={!startDate || !endDate}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
