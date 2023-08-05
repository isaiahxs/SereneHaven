import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteBookingThunk } from '../../store/bookings';

import './DeleteSpot.css';

export default function DeleteBooking({ booking, onBookingDeleted }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async () => {
        try {
            await dispatch(deleteBookingThunk(booking.id));
            closeModal();
            onBookingDeleted(booking.id);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className='delete-spot-container'>
            <h1 className='delete-header'>Confirm Delete</h1>
            <p className='delete-text'>Are you sure you want to remove this reservation?</p>
            <div className='delete-buttons-container'>
                <button className='delete-button' onClick={handleSubmit}>Yes (Delete Booking)</button>
                <button className='cancel-button' onClick={closeModal}>No (Keep Booking)</button>
            </div>
        </div>
    )
}
