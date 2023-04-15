import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {NavLink, useHistory, Link } from "react-router-dom";
import { userSpotsThunk, updateSpotThunk, spotDetails } from "../../store/spots";
// import AddSpot from "./AddSpot";
// import EditSpot from "./EditSpot";
import {ReactComponent as Star} from '../../assets/star.svg'
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteSpot";
import "./ManageSpots.css";


export default function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoaded, setIsLoaded] = useState(false);
    const [currUserSpots, setCurrUserSpots] = useState({});
    const spotsState = useSelector((state) => state.spot);
    console.log('MANAGE SPOTS STATE', spotsState)

    //when i get the error of Spots undefined, i can comment this useEffect out to get the page to load. however, it is empty aside from the header, buttonn, and nav bar.
    //when i uncomment this, the page loads with the correct spots, after x time or inputs, the page crashes with the error of Spots undefined... what is going on?
    //a: i think it is because the useEffect is running before the spots are fetched, so the spots are undefined. i need to figure out how to wait for the spots to be fetched before running the useEffect

    //original quick fix
    // useEffect(() => {
    //     const userSpots = spotsState.userSpots.Spots
    //     console.log('USER SPOTS', userSpots)
    //     if (userSpots) {
    //         setCurrUserSpots(userSpots)
    //     }
    //     setIsLoaded(true)
    // }, [spotsState])

    //i believe the problem might have been that the useEffect was trying to acces the spotsState.userSpots.Spots before it had been fetched. i added a conditional to check if the spots had been fetched before trying to access the spots
    //this will hopefull ensure that the useEffect doesn't try to access the spots before they have been fetched which is what results in an undefined error
    useEffect(() => {
        if(spotsState.userSpots) {
            const userSpots = spotsState.userSpots.Spots
            console.log('USER SPOTS', userSpots)
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
        console.log(e);
        e.preventDefault();
        // e.stopImmediatePropagation();
        // e.stopPropagation();
        await dispatch(spotDetails(id)).then(() => history.push(`/spots/${id}/edit`))
    }

    //if there is no session user, redirect to the home page, otherwise, get the current user's spots
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

    //display user's spots after they are fetched
    return isLoaded && (
        <>
        <div id='manage-header' className='manage-header'>
            <h1>Manage Spots</h1>
        </div>
        <div className='no-current-spots'>
            {/* <button className="manage-create">
                    <Link to='/host'>
                    Create a New Spot
                    </Link>
            </button> */}
            {usersSpots.length === 0 ? (
                <>
                    <p>Looks like you don't have any spots yet! Would you like to create one?</p>
                    <button className='manage-create-spot'>
                        <NavLink to='/host'>
                            Create a New Spot
                        </NavLink>
                    </button>
                </>
            ) : null}
        </div>
        <div className='landing-container'>
            {usersSpots.map((spot) => {
                return (
                    <div key={spot.id} className="spot-card">
                        <div onClick={(e) => {spotDetails(e, spot.id)}}>
                        <div className='spot-card-img'>
                            <img className="spot-img" src={spot.previewImage} alt={spot.name} />
                        </div>
                        <div className="spot-info">
                            <div className='location-stars'>
                                <p className='location'>
                                    {spot.city}, {spot.state}
                                </p>
                                <div className='stars'>
                                    <Star alt='little-star'/>
                                    {Number(spot.avgRating).toFixed(1) ? Number(spot.avgRating).toFixed(1) : "New"}
                                </div>
                            </div>
                            <div className="price">
                                <span className="amount">${spot.price}</span>night
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
