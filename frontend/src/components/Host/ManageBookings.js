import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, Link } from "react-router-dom";
import { userSpotsThunk } from "../../store/spots";
import { ReactComponent as Star } from '../../assets/star.svg'
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteSpot";
import "./ManageSpots.css";

export default function ManageBookings() {
    return (
        <div>hi</div>
    )
}
