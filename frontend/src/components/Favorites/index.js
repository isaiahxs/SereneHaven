import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getFavorites, createFavorite, deleteFavorite } from '../../store/favorites';
import './Favorites.css'

function Favorites({ spotId }) {
    const dispatch = useDispatch();
    const userFavorites = useSelector((state) => state.favorites);
    console.log('spotid from spotid comp', spotId);
    console.log('these are the user favorites', userFavorites);

    const isFavorite = userFavorites.some((favorite) => Number(favorite.id) === Number(spotId));

    useEffect(() => {
        dispatch(getFavorites());
    }, [dispatch])

    const handleAddFavorite = () => {
        dispatch(createFavorite(spotId));
        dispatch(getFavorites());
    }

    const handleRemoveFavorite = () => {
        dispatch(deleteFavorite(spotId));
        dispatch(getFavorites());
    }

    return (
        <div className='favorite-container'>
            {isFavorite ? (
                <button onClick={handleRemoveFavorite} className='remove-favorite-button'>Remove Favorite</button>
            ) : (
                <button onClick={handleAddFavorite} className='add-favorite-button'>Favorite this Spot</button>
            )}
        </div>
    )
}

export default Favorites;