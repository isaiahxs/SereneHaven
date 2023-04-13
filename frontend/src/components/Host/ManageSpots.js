import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link, useHistory } from "react-router-dom";
import { userSpotsThunk } from "../../store/spots";
import AddSpot from "./AddSpot";
import EditSpot from "./EditSpot";
import "./ManageSpots.css";

export default function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);


    const state = useSelector((state) => state)
    console.log('state', state)

    const userSpots = useSelector(state => state.spot.userSpots.Spots);

    useEffect(() => {
        if (!sessionUser) {
            history.push('/')
        }
    }, [sessionUser, history]);

    useEffect(() => {
        if (sessionUser) {
            dispatch(userSpotsThunk(sessionUser.id));
        }
    }, [dispatch, sessionUser]);

    if (!sessionUser) return <Redirect to="/" />;

    return (
        <div className="manage-spots-container">
            <div className='manage-header'>
                <h1>Manage Your Spots</h1>
            </div>
            <div className='manage-outer-container'>
                <div className='inner-container'>
                    {userSpots.map((spot) => (
                        <div key={spot.id} className="spot-card">
                        <img src={spot.previewImage} alt={spot.name} />
                        <div className="spot-info">
                            <h3>{spot.name}</h3>
                            <p>
                            {spot.city}, {spot.state}
                            </p>
                            <div className="manage-buttons">
                            <Link to={`/spots/${spot.id}/edit`}>Edit</Link>
                            <button>Delete</button>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div>
                <h1>Your Spots</h1>
                {userSpots.map(spot => (
                <div key={spot.id}>
                    <h2>{spot.title}</h2>
                    <p>{spot.description}</p>
                </div>
                ))}
            </div> */}
        </div>
    );
}
