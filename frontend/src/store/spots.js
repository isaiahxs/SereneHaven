//following similar structure as session.js
//---------------------------------------------------

//handles the CSRF token required for making requests to backend server
import { csrfFetch } from "./csrf";

//action type string for retrieving spots
const GET_SPOTS = `spots/GET_SPOTS`;
const GET_DETAILS = `spots/GET_DETAILS`;
const GET_USER_SPOTS = `spots/GET_USER_SPOTS`;


//action creator that returns an object with the GET_SPOTS type and payload of retrieved spots
const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots
})

const getDetails = (spots) => ({
    type: GET_DETAILS,
    spots
})

const getUserSpots = (spots) => ({
    type: GET_USER_SPOTS,
    spots
})

//spots thunk action creator defined as async function that makes an AJAX call to the proper route on the backend server using csrfFetch, then dispatches getSpots action
export const spots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    //after response from the AJAX call comes back, parse the JSON body of the response
    const data = await response.json();
    //and dispatch the action
    dispatch(getSpots(data))
    return data;
}

export const userSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    const data = await response.json();
    dispatch(getUserSpots(data));
    return data;
}

//additional notes: when you make a request to the server using csrfFetch, it returns a response object that contains information such as the response status code, headers, and the body of the response as a string
//in order to work with the data returned by the server, we need to parse the response body as JSON
    //this returns a promise that resolves to the parsed JSON data, which we are currently assigning to the data variable
//to ensure that the spotDetails thunk action creator returns the correct data, the final return should be the data variable
//that way, any code that calls spotDetails and awaits its resolution will receive the parsed JSON data as the resolved value of the returned promise
export const spotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    //after response from AJAX call comes back, parse the JSON body of the response
    const data = await response.json();
    dispatch(getDetails(data));
    return data;
}


//the initialState object is defined as an empty object, which will be used as the initial state for the spotReducer
const initialState = {}

//reducer function that takes in a state object and an action object, and returns a new state object based on the action type
const spotReducer = (state=initialState, action) => {
    let newState = {...state};
    switch (action.type) {
        //with GET_SPOTS, update the spots property in the state object with the payload of the retrieved spots
        case GET_SPOTS:
            console.log('hiii')
            // newState.spots = action.payload;
            // return newState;
            const allSpots = {};
            const getAllSpots = action.spots.Spots;
            getAllSpots.forEach((eachSpot) => (allSpots[eachSpot.id] = eachSpot));
            newState["allSpots"] = { ...allSpots };
            return newState;

            //assign the action's 'spot' payload to the spotDetails key of the newState object
            //we'll do this so the spotDetails key in the Redux store holds the details of a single spot, as opposed to an array of spots, which would be held by the allSpots key
        case GET_DETAILS:
            console.log('hello this is get details')
            newState['spotDetails'] = action.spots;
            return newState;

        case GET_USER_SPOTS:
            console.log('this is get user spots')
            newState['userSpots'] = action.userSpots


        default:
            return state;
    }
}

export default spotReducer;
