import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";
import { userSpotsThunk } from "../../store/spots";
import { ReactComponent as Star } from '../../assets/star.svg'
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteSpot";
import "./ManageSpots.css";


export default function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoaded, setIsLoaded] = useState(false);
    const [currUserSpots, setCurrUserSpots] = useState({});
    const spotsState = useSelector((state) => state.spot);
    // console.log('MANAGE SPOTS STATE', spotsState)

    useEffect(() => {
        if (spotsState.userSpots) {
            const userSpots = spotsState.userSpots.Spots
            // console.log('USER SPOTS', userSpots)
            if (userSpots) {
                setCurrUserSpots(userSpots)
            }
        }
        setIsLoaded(true)
    }, [spotsState])


    const sessionUser = useSelector((state) => state.session.user);
    // const currUserSpots = useSelector((state) => state.spot.userSpots.Spots);
    const spotsArr = currUserSpots ? Object.values(currUserSpots) : [];
    // const spotsArr = Object.values(currUserSpots);

    //filter spots to only show the ones owned by the current user
    const usersSpots = spotsArr.filter(spot => spot.ownerId === sessionUser.id);

    //upon clicking a spot tile, redirect to the spot details page
    const spotDetails = (e, id) => {
        e.preventDefault();
        history.push(`/spots/${id}`)
    }

    //upon clicking the update button, redirect to the edit spot page
    const editSpot = async (e, id) => {
        // console.log(e);
        e.preventDefault();
        // e.stopImmediatePropagation();
        // e.stopPropagation();
        await dispatch(spotDetails(id)).then(() => history.push(`/spots/${id}/edit`))
    }

    useEffect(() => {
        if (!sessionUser) {
            history.push('/')
        } else {
            dispatch(userSpotsThunk(sessionUser.id)).then(setIsLoaded(true));
        }
    }, [dispatch])

    const handleSpotDeleted = (deletedSpotId) => {
        setCurrUserSpots(usersSpots.filter((spot) => spot.id !== deletedSpotId))
    }

    return isLoaded && (
        <>
            <div id='manage-header' className='manage-header'>
                <h1>Manage Spots</h1>
            </div>
            <div className='no-current-spots'>
                {usersSpots.length === 0 ? (
                    <>
                        <p>Looks like you don't have any spots yet! Would you like to create one?</p>
                        <button className='manage-create-spot' onClick={() => history.push('/host')}>
                            {/* <NavLink to='/host'> */}
                            Create a New Spot
                            {/* </NavLink> */}
                        </button>
                    </>
                ) : null}
            </div>
            <div className='landing-container'>
                {usersSpots.map((spot) => {
                    return (
                        <div key={spot.id} className="spot-card">
                            <div onClick={(e) => { spotDetails(e, spot.id) }}>
                                <div className='spot-card-img'>
                                    <img className="spot-image" src={spot.previewImage} alt={spot.name} />
                                </div>
                                <div className="spot-info">
                                    <div className='location-stars'>
                                        <p className='location'>
                                            {spot.city}, {spot.state}
                                        </p>
                                        <div className='stars'>
                                            <Star alt='little-star' />
                                            {spot.avgRating > 0 ? Number(spot.avgRating).toFixed(1) : "New"}
                                        </div>
                                    </div>
                                    <div className="price">
                                        <span className="location-price">${spot.price}</span>night
                                    </div>
                                </div>
                            </div>
                            <div className="manage-buttons">
                                <Link to={`/spots/${spot.id}/edit`}>
                                    <button type='button'>Update</button>
                                </Link>
                                <OpenModalButton
                                    className='modal-button'
                                    buttonText='Delete'
                                    modalComponent={<DeleteSpot
                                        spot={spot}
                                        onSpotDeleted={handleSpotDeleted}
                                    />}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
