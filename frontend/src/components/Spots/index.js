import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { spots } from '../../store/spots';
import './Spots.css';

//create React functional component, export default with name of directory
export default function Spots() {
    //initialize dispatch and history
    const dispatch = useDispatch();
    const history = useHistory();

    //use useSelector hook to access the spots state object from the Redux store
    const spotsState = useSelector(state => state.spot.spots);

    //use useEffect hook to call spots action creator from the Redux store when the component mounts
    useEffect(() => {
        dispatch(spots())
        //should my dependency array be empty or have something in it?
        //i think we want dispatch in it so that the effect will re-run whenever dispatch changes
    }, [dispatch])

    //when the component first renders, check if spots is null. if it is, render nothing.
    if (!spotsState) return null;

    //if it is not null, convert spots object into an array and go over each spot in the array to render the details on the page
    const landingSpots = Object.values(spotsState);

    //for each spot, we want to display the preview image, city, state, avg rating, name, and price
        //add a click handler to the spot element that navigates us to the correct component for that spot when it is clicked by using the history and push function
            //use useHistory to manage browser history
    const clickHandler = spotsId => {
        history.push(`/spots/{spotsId}`);
    }

    //in the JSX below, return the rendered spots with the desired front end information
    return (
        <>
        <div>
            <h1>hello</h1>
        </div>
        </>
    )
}
