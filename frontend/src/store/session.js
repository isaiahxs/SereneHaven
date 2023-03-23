//this file will contain all the actions specific to the session user's information and the session user's Redux reducer
import { csrfFetch } from "./csrf";

//create two POJO action creators; one that will set the session user and another that will remove
const SET_USER = `session/SET_USER`;
const REMOVE_USER = `session/REMOVE_USER`;

const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

const removeUser = () => ({
    type: REMOVE_USER,
})

//will need to call the API to log in then set the session user from the response, so add a thunk action for the POST /api/session
    //make sure to use the custom csrfFetch function
    //the POST /api/session route expects the request body to have a key of credential with an existing username or email to have a key of credential with an existing username or email and a key of password
export const login = (user) => async (dispatch) => {
    const {credential, password} = user;

    //if response does not give error but is not returning everything you want, check back end route
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    })
    //after the response from the AJAX call comes back, parse the JSON body of the response
    const data = await response.json();
    //and dispatch the action for setting the session user to the user in the response's body
    dispatch(setUser(data.user));
    return response;
}

//add a thunk that will call the GET /api/session
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session');
    //parse the JSON body of the response
    const data = await response.json();
    //then dispatch the action for setting the session use to the user in the response's body
    dispatch(setUser(data.user));
    return response;
}

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE',
    })
    dispatch(removeUser());
    return response;
}

//if there is no session user, then the session slice of state should look like `{user: null}`
    //aka, the initial state
const initialState = {user: null};

//session reducer that will hold the current session user's information
const sessionReducer = (state=initialState, action) => {
    let newState = {...state};
    switch (action.type) {
        case SET_USER:
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState.user = null;
            return newState;
        default:
            return state;
    }
}

export default sessionReducer;
