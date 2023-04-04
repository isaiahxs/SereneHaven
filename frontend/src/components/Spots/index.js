import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { spots } from '../../store/spots';
import './Spots.css';

//create React functional component, export default with name of directory
export default function Spots() {
    const dispatch = useDispatch();

    //use useSelector hook to access the spots state object from the Redux store

    //use useEffect hook to call spots action creator from the Redux store when the component mounts

    //use useHistory to manage browser history

    //when the component first renders, check if spots is null. if it is, render nothing. if it is not null, convert spots object into an array and go over each spot in the array to render the details on the page

    //for each spot, we want to display the preview image, city, state, avg rating, name, and price
        //add a click handler to the spot element that navigates us to the correct component for that spot when it is clicked by using the history and push function

    //in the JSX below, return the rendered spots with the desired front end information
    return (
        <>
        </>
    )
}
