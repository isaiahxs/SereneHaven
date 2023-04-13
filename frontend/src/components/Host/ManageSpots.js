import React, { useEffect, useState } from "react";
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
//     const currUserSpots = useSelector((state) => state.spot.userSpots.Spots);
//     const spotsArr = Object.values(currUserSpots);

//     //filter spots to only show the ones owned by the current user
//     const usersSpots = spotsArr.filter(spot => spot.ownerId === sessionUser.id);

//     //upon clicking a spot tile, redirect to the spot details page
//     const spotDetails = (e, id) => {
//         e.preventDefault();
//         history.push(`/spots/${id}`)
//     }

//     //upon clicking the update button, redirect to the edit spot page
//     const editSpot = async (e, id) => {
//         e.preventDefault();
//         await dispatch(updateSpotThunk(id)).then(() => history.push(`/spots/${id}/edit`))
//     }

//     //if there is no session user, redirect to the home page, otherwise, get the current user's spots
//     useEffect(() => {
//         if (!sessionUser) {
//             history.push('/')
//         } else {
//             dispatch(userSpotsThunk(sessionUser.id));
//         }
//     }, [dispatch])

//     //display user's spots after they are fetched
//     return currUserSpots && (
//         <>
//         <div id='manage-header' className='manage-header'>
//             <h1>Manage Spots</h1>
//             <button className="manage-create">
//                 <Link to='/host'>
//                 Create a New Spot
//                 </Link>
//             </button>
//         </div>
//         <div className='landing-container'>
//             {usersSpots.map((spot) => {
//                 return (
//                     <div key={spot.id} className="spot-card">
//                         <div className='spot-card-img' onClick={(e) => {spotDetails(e, spot.id)}}>
//                             <img className="spot-img" src={spot.previewImage} alt={spot.name} />
//                         </div>
//                         <div className="spot-info">
//                             <div className='location-stars'>
//                                 <p className='location'>
//                                     {spot.city}, {spot.state}
//                                 </p>
//                                 <div className='stars'>
//                                     <Star alt='little-star'/>
//                                     {Number(spot.avgRating).toFixed(1) ? Number(spot.avgRating).toFixed(1) : "New"}
//                                 </div>
//                             </div>
//                             <div className="price">
//                                 <span className="amount">${spot.price}</span>night
//                             </div>
//                         </div>
//                         <div className="manage-buttons">
//                             <button onClick={(e) => editSpot(e, spot.id)}>Update</button>
//                             <button>Delete</button>
//                         </div>
//                     </div>
//                 )
//             })}
//         </div>
//         </>
//     )
// }


export default function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoaded, setIsLoaded] = useState(false);
    const [currUserSpots, setCurrUserSpots] = useState({});
    const spotsState = useSelector((state) => state.spot);
    console.log('SPOTSSTATE', spotsState)

    useEffect(() => {
        const userSpots = spotsState.userSpots.Spots
        console.log('USER SPOTS', userSpots)
        if (userSpots) {
            setCurrUserSpots(userSpots)
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
        e.preventDefault();
        await dispatch(updateSpotThunk(id)).then(() => history.push(`/spots/${id}/edit`))
    }

    //if there is no session user, redirect to the home page, otherwise, get the current user's spots
    useEffect(() => {
        if (!sessionUser) {
            history.push('/')
        } else {
            dispatch(userSpotsThunk(sessionUser.id)).then(setIsLoaded(true));
        }
    }, [dispatch])

    //display user's spots after they are fetched
    return isLoaded && (
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


// export default function ManageSpots() {
//     const dispatch = useDispatch();
//     const history = useHistory();

//     const sessionUser = useSelector((state) => state.session.user);
//     const spotsState = useSelector((state) => state.spot);

//     const [loaded, setLoaded] = useState(false);
//     const [currUserSpots, setCurrUserSpots] = useState();

//     useEffect(() => {
//         const userSpots = spotsState.userSpots.Spots;

//         if (userSpots) {
//             setCurrUserSpots(userSpots);
//         }
//         setLoaded(true);
//     }, [spotsState]);

//     const usersSpots = currUserSpots
//         ? Object.values(currUserSpots).filter(
//               (spot) => spot.ownerId === sessionUser.id
//           )
//         : [];

//     const spotDetails = (e, id) => {
//         e.preventDefault();
//         history.push(`/spots/${id}`);
//     };

//     const editSpot = async (e, id) => {
//         e.preventDefault();
//         await dispatch(updateSpotThunk(id)).then(() =>
//             history.push(`/spots/${id}/edit`)
//         );
//     };

//     useEffect(() => {
//         if (!sessionUser) {
//             history.push('/');
//         } else {
//             dispatch(userSpotsThunk(sessionUser.id));
//         }
//     }, [dispatch]);

//     return loaded &&(


//             <>
//                 <div id="manage-header" className="manage-header">
//                     <h1>Manage Spots</h1>
//                     <button className="manage-create">
//                         <Link to="/host">Create a New Spot</Link>
//                     </button>
//                 </div>
//                 <div className="landing-container">
//                     {usersSpots.map((spot) => {
//                         return (
//                             <div key={spot.id} className="spot-card">
//                                <div className='spot-card-img' onClick={(e) => {spotDetails(e, spot.id)}}>
//                             <img className="spot-img" src={spot.previewImage} alt={spot.name} />
//                         </div>
//                         <div className="spot-info">
//                             <div className='location-stars'>
//                                 <p className='location'>
//                                     {spot.city}, {spot.state}
//                                 </p>
//                                 <div className='stars'>
//                                     <Star alt='little-star'/>
//                                     {Number(spot.avgRating).toFixed(1) ? Number(spot.avgRating).toFixed(1) : "New"}
//                                 </div>
//                             </div>
//                             <div className="price">
//                                 <span className="amount">${spot.price}</span>night
//                             </div>
//                         </div>
//                         <div className="manage-buttons">
//                             <button onClick={(e) => editSpot(e, spot.id)}>Update</button>
//                             <button>Delete</button>
//                         </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </>

//     );
// }
