import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpotThunk } from '../../store/spots';

import './DeleteSpot.css';

export default function DeleteSpot({ spot, onSpotDeleted }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async () => {
        try {
            await dispatch(deleteSpotThunk(spot.id));
            closeModal();
            onSpotDeleted(spot.id);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className='delete-spot-container'>
            <h1 className='delete-header'>Confirm Delete</h1>
            <p className='delete-text'>Are you sure you want to remove this spot from the listings?</p>
            <div className='delete-buttons-container'>
                <button className='delete-button' onClick={handleSubmit}>Yes (Delete Spot)</button>
                <button className='cancel-button' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
}
