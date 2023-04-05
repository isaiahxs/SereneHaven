//following similar structure as spots.js
import { csrfFetch } from "./csrf";

//action type strings
const GET_REVIEWS = `reviews/GET_REVIEWS`;

//action creators
const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

//reviews thunk action creators defined as async functions
export const reviewThunk = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${review}/reviews`);

    //after response from the AJAX call comes back, parse the JSON body of the response
    const data = await response.json();
    dispatch(getReviews(data));
    return data;
}

//the initialState object is defined as an empty object, which will be used as the initial state for the reviewReducer
const initialState = {};

//reducer function that takes in a state object and an action object, and returns a new state object based on the action type
const reviewReducer = (state=initialState, action) => {
    let newState = {...state};
    switch (action.type) {
        //when GET_REVIEWS is dispatched, create a new empty object
        //go into action.reviews to get Reviews property and iterate through each review object
        //add it to the empty array with the id of the review as the key
        //in the newState object's spotReviews property, set it to a copy of the spotReviews array, with each review object replacing the correspoding object in the reviews object
        //return newState
        case GET_REVIEWS:
            const allReviews = {};
            const spotReviews = action.reviews.Reviews;
            spotReviews.forEach((review) => (allReviews[review.id] = review));
            newState["spotReviews"] = {...spotReviews};
            return newState;

        default:
            return state;
    }
}
