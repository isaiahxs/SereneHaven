import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";
import { spotDetails, userSpotsThunk } from "../../store/spots";
import { ReactComponent as Star } from '../../assets/star.svg'
import OpenModalButton from "../OpenModalButton";
import UpdateBooking from "./UpdateBooking";
import DeleteBooking from "./DeleteBooking";
import { deleteBookingThunk, userBookingsThunk } from "../../store/bookings";
import "./ManageBookings.css";

export default function ManageBookings() {
    const history = useHistory();
    const dispatch = useDispatch();

    const userBookings = useSelector((state) => state.booking.Bookings);
    // console.log(userBookings);

    const handleBookingDeleted = (bookingId) => {
        dispatch(deleteBookingThunk(bookingId));
        // dispatch(userBookingsThunk());
    }

    useEffect(() => {
        dispatch(userBookingsThunk())
    }, [dispatch])

    const spotDetails = (e, id) => {
        e.preventDefault();
        history.push(`/spots/${id}`)
    }

    // function formatDate(inputDate) {
    //     const parts = inputDate.split('-');
    //     return `${parts[1]}-${parts[2]}-${parts[0]}`;
    // }
    function parseLocalDate(inputDate) {
        const [year, month, day] = inputDate.split('-').map(Number);
        return new Date(year, month - 1, day); // JavaScript months are 0-indexed
    }

    function formatDate(inputDate) {
        const date = parseLocalDate(inputDate);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    const today = new Date().toISOString().split('T')[0];

    if (userBookings) {
        return (
            <>
                <div id='manage-header' className="manage-header">
                    <h1>Manage Bookings</h1>
                </div>

                <div className="no-current-spots">
                    {userBookings?.length === 0 &&
                        <h2>Looks like you don't have any bookings yet! Once you have some, you can edit or delete them from here.</h2>
                    }
                </div>

                <div className="landing-container">
                    {userBookings?.length > 0 &&
                        <>
                            {userBookings.map((booking) => (
                                <div key={booking.id} className="spot-card">
                                    <>
                                        <div onClick={(e) => { spotDetails(e, booking.Spot.id) }}>
                                            <div className="spot-card-img">
                                                <img className="spot-image" src={booking.Spot?.previewImage} alt={booking.Spot?.name} />
                                            </div>
                                            <div className="manage-card-container">
                                                <div className="manage-spot-info">
                                                    {booking.Spot?.city}, {booking.Spot?.state}
                                                </div>
                                                <div className="manage-price">
                                                    <span className="location-price">${booking.Spot?.price} </span>night
                                                </div>
                                                <div className="booking-duration">
                                                    <div className="start-date">Start: {formatDate(booking.startDate)}</div>
                                                    <div className="end-date">End: {formatDate(booking.endDate)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>

                                    {booking.startDate <= today &&
                                        <div className="cannot-modify">Sorry, you cannot update or delete bookings once they've started</div>
                                    }

                                    {booking.startDate > today &&
                                        <div className="manage-buttons">
                                            {/* <UpdateBooking booking={booking} /> */}

                                            <OpenModalButton
                                                className='modal-button'
                                                buttonText='Update'
                                                modalComponent={<UpdateBooking
                                                    booking={booking}
                                                />
                                                }
                                            />

                                            <OpenModalButton
                                                className='modal-button'
                                                buttonText='Delete'
                                                modalComponent={<DeleteBooking
                                                    booking={booking}
                                                    onBookingDeleted={handleBookingDeleted}
                                                />
                                                }
                                            />
                                        </div>
                                    }
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
