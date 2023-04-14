import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { deleteSpotThunk } from '../../store/spots';


import './DeleteSpot.css';

export default function DeleteSpot({spot}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {closeModal} = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpotThunk(spot.id));
        closeModal();
        history.push('/manage');
    }

    return (
        <div className='delete-spot-container'>
            <h1 className='delete-header'>Confirm Delete</h1>
            <p className='delete-text'>Are you sure you want to remove this spot from the listings?</p>
            <div className='delete-buttons'>
                <button className='delete-button' onClick={handleSubmit}>Yes (Delete Spot)</button>
                <button className='cancel-button' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
}
