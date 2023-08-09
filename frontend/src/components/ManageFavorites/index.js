import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import './ManageFavorites.css';
import { getFavorites } from '../../store/favorites';

function ManageFavorites() {
    const dispatch = useDispatch();
    const history = useHistory();

    const userFavorites = useSelector((state) => state.favorites);
    // console.log(userFavorites);

    useEffect(() => {
        dispatch(getFavorites())
    }, [dispatch]);

    const spotDetails = (e, id) => {
        e.preventDefault();
        history.push(`/spots/${id}`)
    }

    if (userFavorites) {
        return (
            <>
                <div id='manage-header' className="manage-header">
                    <h1>Manage Favorites</h1>
                </div>

                <div className='no-current-spots'>
                    {userFavorites?.length === 0 &&
                        <h2>Looks like you don't have any favorites yet! Once you have some, you can view them here.</h2>
                    }
                </div>

                <div className='landing-container'>
                    {userFavorites?.length > 0 &&
                        <>
                            {userFavorites.map((favorite) => (
                                <div key={favorite.id} className='spot-card'>
                                    <>
                                        <div onClick={(e) => { spotDetails(e, favorite.id) }}>
                                            <div className='spot-card-img'>
                                                <img className='spot-image' src={favorite?.previewImage} alt={favorite?.name} />
                                            </div>
                                            <div className='manage-card-container'>
                                                <div className='manage-spot-info'>
                                                    {favorite?.city}, {favorite?.state}
                                                </div>
                                                <div className='manage-price'>
                                                    <span className='location-price'>${favorite?.price}</span> night
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                </div>
                            ))}
                        </>
                    }
                </div>
            </>
        )
    } else {
        return (
            <div className='loading'>Loading...</div>
        )
    }
}

export default ManageFavorites;