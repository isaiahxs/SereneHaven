import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link, useHistory } from "react-router-dom";
import { userSpotsThunk, updateSpotThunk } from "../../store/spots";
import AddSpot from "./AddSpot";
import EditSpot from "./EditSpot";
import {ReactComponent as Star} from '../../assets/star.svg'
import "./ManageSpots.css";

// export default function ManageSpots() {
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const sessionUser = useSelector((state) => state.session.user);
//     //if i put this with state.spot, i can see '/manage' page, but it is blank. but after i do that and change it to state.spots, i can see all the spots. but when i click away, then try to navigate back to '/manage', it shows an error.

//     const currUserSpots = useSelector((state) => state.spot?.userSpots.Spots || []);

//     //this is to try a different way of accessing
//     // const currUserSpots = useSelector((state) => state.userSpots?.Spots);

//     useEffect(() => {
//         if (!sessionUser) {
//             history.push('/')
//         }
//     }, [sessionUser, history]);

//     useEffect(() => {
//         if (sessionUser) {
//             dispatch(userSpotsThunk(sessionUser.id));
//         }
//     }, [dispatch, sessionUser]);

//     if (!sessionUser) return <Redirect to="/" />;

//     console.log(currUserSpots)
//     return (
//         <div className="manage-spots-container">
//             <div className='manage-header'>
//                 <h1>Manage Your Spots</h1>
//             </div>
//             <div className='manage-outer-container'>
//                 <div className='inner-container'>
//                     {currUserSpots.map((spot) => (

//                         <div key={spot.id} className="spot-card">
//                         <img src={spot.previewImage} alt={spot.name} />
//                         <div className="spot-info">
//                             <h3>{spot.name}</h3>
//                             <p>
//                             {spot.city}, {spot.state}
//                             </p>
//                             <div className="manage-buttons">
//                             <Link to={`/spots/${spot.id}/edit`}>Edit</Link>
//                             <button>Delete</button>
//                             </div>
//                         </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

export default function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();

    const sessionUser = useSelector((state) => state.session.user);
    const currUserSpots = useSelector((state) => state.spot.userSpots.Spots);
    const spotsArr = Object.values(currUserSpots);

    //filter spots to only show the ones owned by the current user
    const usersSpots = spotsArr.filter(spot => spot.ownerId === sessionUser.id);

    //upon clicking a spot tile, redirect to the spot details page
    const spotDetails = (e, id) => {
        e.preventDefault();
        history.push(`/spots/${id}`)
    }

    //upon clicking the update button, redirect to the edit spot page
    const editSpot = async (e, id) => {
        e.preventDefault();
        await dispatch(updateSpotThunk(id)).then(() => history.push(`/spots/${id}/edit`))
    }

    //if there is no session user, redirect to the home page, otherwise, get the current user's spots
    useEffect(() => {
        if (!sessionUser) {
            history.push('/')
        } else {
            dispatch(userSpotsThunk(sessionUser.id));
        }
    }, [dispatch])

    //display user's spots after they are fetched
    return currUserSpots && (
        <>
        <div id='manage-header' className='manage-header'>
            <h1>Manage Spots</h1>
            <button className="manage-create">
                <Link to='/host'>
                Create a New Spot
                </Link>
            </button>
        </div>
        <div className='landing-container'>
            {usersSpots.map((spot) => {
                return (
                    <div key={spot.id} className="spot-card">
                        <div className='spot-card-img' onClick={(e) => {spotDetails(e, spot.id)}}>
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
                        <div className="manage-buttons">
                            <button onClick={(e) => editSpot(e, spot.id)}>Update</button>
                            <button>Delete</button>
                        </div>
                    </div>
                )
            })}
        </div>
        </>
    )
}
