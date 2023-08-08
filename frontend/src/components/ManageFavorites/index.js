import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import './ManageFavorites.css';
import { getFavorites } from '../../store/favorites';

function ManageFavorites() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFavorites())
    })
    return (
        <div className='manage-favorites-container'>
            <h2>Manage Favorites</h2>
        </div>
    )
}

export default ManageFavorites;