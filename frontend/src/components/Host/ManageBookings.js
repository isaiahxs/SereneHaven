import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";
import { spotDetails, userSpotsThunk } from "../../store/spots";
import { ReactComponent as Star } from '../../assets/star.svg'
import OpenModalButton from "../OpenModalButton";
import DeleteBooking from "./DeleteBooking";
import { userBookingsThunk } from "../../store/bookings";
import "./ManageBookings.css";
import "./ManageSpots.css";

export default function ManageBookings() {
    const history = useHistory();
    const dispatch = useDispatch();

    // const spotDetails = useSelector((state) => state.booking.Bookings.Spot);
    const userBookings = useSelector((state) => state.booking.Bookings);
    console.log(userBookings);

    const handleBookingDeleted = () => {
        // thunk for deleting booking here
    }

    useEffect(() => {
        dispatch(userBookingsThunk())
    }, [dispatch])

    const spotDetails = (e, id) => {
        e.preventDefault();
        history.push(`/spots/${id}`)
    }

    return (
        <>
            <h1>Manage Bookings</h1>
            {!userBookings &&
                <h2>Looks like you don't have any bookings yet! Once you have some, you can edit or delete them from here.</h2>
            }

            {userBookings?.length &&
                <>
                    <h2>These are your upcoming bookings.</h2>
                    <ul>
                        {userBookings.map((booking) => (
                            <div key={booking.id} className="spot-card">
                                <>
                                    <div onClick={(e) => { spotDetails(e, booking.Spot.id) }}>
                                        <div className="spot-card-img">
                                            <img className="spot-image" src={booking.Spot.previewImage} alt={booking.Spot.name} />
                                        </div>
                                        <div className="spot-info">
                                            <div className="location-stars">
                                                <p className="location">
                                                    {booking.Spot.city}, {booking.Spot.state}
                                                </p>
                                                {/* <div className="stars"> */}
                                                {/* <Star alt='little-star' /> */}
                                                {/* avg rating and New */}
                                                {/* </div> */}

                                            </div>
                                        </div>
                                        <div className="booking-duration">
                                            <div className="start-date">Start: {booking.startDate}</div>
                                            <div className="end-date">End: {booking.endDate}</div>
                                        </div>
                                        <div className="price">
                                            <span className="location-price">${booking.Spot.price} </span>night
                                        </div>
                                    </div>
                                </>

                                <div className="manage-buttons">
                                    {/* edit booking feature component here just like in SpotId page */}

                                    <OpenModalButton
                                        className='modal-button'
                                        buttonText='Delete'
                                        modalComponent={<DeleteBooking
                                            spot={booking.Spot}
                                            onBookingDeleted={handleBookingDeleted}
                                        />
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </ul>
                </>
            }
        </>
    )
}
