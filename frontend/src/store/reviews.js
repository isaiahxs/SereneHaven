//following similar structure as spots.js
import { csrfFetch } from "./csrf";

//action type strings
const GET_REVIEWS = `reviews/GET_REVIEWS`;
const ADD_REVIEWS = `reviews/ADD_REVIEWS`;

// action creators
const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

const addReviews = (postingReview) => ({
    type: ADD_REVIEWS,
    postingReview
})

//reviews thunk action creators defined as async functions
export const reviewThunk = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${review}/reviews`);

    //after response from the AJAX call comes back, parse the JSON body of the response
    const data = await response.json();
    dispatch(getReviews(data));
    return data;
}

//thunk action creator for posting a review
export const addReviewThunk = ({userId, spotId, stars, review}) => async (dispatch) => {

    //destructure the passed object to get the userId, spotId, stars, and review
    const postingObject = {
        userId,
        spotId,
        stars,
        review
    }

    //make a POST request to the backend to create a new review
    //the review.spotId is the spotId that is passed in as a parameter to the thunk action creator

    //is my path correct or should i use ${spotId}/reviews instead of review.spotId?
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postingObject)
    });

    const postingReview = await response.json();
    dispatch(addReviews(postingReview));
    return postingReview;
}


// define an initial state object with a currSpotReviews property set to null
const initialState = {currSpotReviews: null};

const reviewReducer = (state=initialState, action) => {
    let reviews;

    switch(action.type) {
        //when GET_REVIEWS is dispatched, create a copy of the current state object using spread
        case GET_REVIEWS:
            reviews = {...state, currSpotReviews: {
                ...state.currSpotReviews}
            }
            //create a new empty object
            let reviewObject = {};
            //loop through the reviews array in the action payload and create a new object for each review, using the review's id as the key
            let reviewArray = action.reviews.Reviews;
            reviewArray.forEach((review) => (reviewObject[review.id] = review));
            //update the currSpotReviews with the new object and return the updated state object
            // this part might have to be changed to take the braces off of reviewObject
            reviews.currSpotReviews = {...reviewObject};

            return reviews;

        //when ADD_REVIEWS is dispatched, create a copy of the current state object using spread
        case ADD_REVIEWS:
            reviews = {...state, currSpotReviews: {
                ...state.currSpotReviews} }

            //update the currSpotReviews property with the new review object using the review's id as the key
            reviews.currSpotReviews[action.postingReview.id] = action.postingReview;

            return reviews;

        default:
            return state;
    }
}


export default reviewReducer;

//------------------------------------------------------------ about to try something new



//------------------------------------------------------------

//MY ORIGINAL WAY

// //the initialState object is defined as an empty object, which will be used as the initial state for the reviewReducer
// const initialState = {};

// //reducer function that takes in a state object and an action object, and returns a new state object based on the action type
// const reviewReducer = (state=initialState, action) => {
//     let newState = {...state};
//     switch (action.type) {
//         //when GET_REVIEWS is dispatched, create a new empty object
//         //go into action.reviews to get Reviews property and iterate through each review object
//         //add it to the empty array with the id of the review as the key
//         //in the newState object's spotReviews property, set it to a copy of the spotReviews array, with each review object replacing the correspoding object in the reviews object
//         //return newState
//         case GET_REVIEWS:
//             const allReviews = {};
//             const spotReviews = action.reviews.Reviews;
//             spotReviews.forEach((review) => (allReviews[review.id] = review));
//             newState["spotReviews"] = {...spotReviews};
//             return newState;

//         default:
//             return state;
//     }
// }

//------------------------------------------------------------
