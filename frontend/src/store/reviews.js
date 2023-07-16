import { csrfFetch } from "./csrf";

//action type strings
const GET_REVIEWS = `reviews/GET_REVIEWS`;
const ADD_REVIEWS = `reviews/ADD_REVIEWS`;
const UPDATE_REVIEWS = `reviews/UPDATE_REVIEWS`;
const DELETE_REVIEWS = `reviews/DELETE_REVIEWS`;

// action creators
const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

const addReviews = (postingReview) => ({
    type: ADD_REVIEWS,
    postingReview
})

const updateReviews = (updatedReview) => ({
    type: UPDATE_REVIEWS,
    updatedReview
})

const deleteReviews = (reviewId) => ({
    type: DELETE_REVIEWS,
    reviewId
})

//reviews thunk action creators defined as async functions
export const reviewThunk = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${review}/reviews`);

    //after response from the AJAX call comes back, parse the JSON body of the response
    if (response.ok) {
        const data = await response.json();
        console.log('Review data:', data);
        dispatch(getReviews(data));
        return data;
    }
}

//thunk action creator for posting a review
export const addReviewThunk = ({ userId, spotId, stars, review }) => async (dispatch) => {
    // console.log('addReviewThunk CALLED')
    //destructure the passed object to get the userId, spotId, stars, and review
    const postingObject = {
        userId,
        spotId,
        stars,
        review
    }

    //make a POST request to the backend to create a new review
    //the review.spotId is the spotId that is passed in as a parameter to the thunk action creator
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

//thunk action creator for updating a review
export const updateReviewThunk = ({ userId, spotId, stars, review, reviewId }) => async (dispatch) => {

    //destructure the passed object to get the userId, spotId, stars, review, and reviewId
    const updatedObject = {
        userId,
        spotId,
        stars,
        review,
        // reviewId
    }

    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedObject)
    });
    const data = await response.json();
    dispatch(updateReviews(data));
    return data;
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    dispatch(deleteReviews(data));
    return data;
}


// define an initial state object with a currSpotReviews property set to null
const initialState = { currSpotReviews: null };

const reviewReducer = (state = initialState, action) => {
    let reviews;

    switch (action.type) {
        //when GET_REVIEWS is dispatched, create a copy of the current state object using spread
        case GET_REVIEWS:
            reviews = {
                ...state, currSpotReviews: {
                    ...state.currSpotReviews
                }
            }
            //create a new empty object
            let reviewObject = {};
            //loop through the reviews array in the action payload and create a new object for each review, using the review's id as the key
            let reviewArray = action.reviews.Reviews;
            reviewArray.forEach((review) => (reviewObject[review.id] = review));
            //update the currSpotReviews with the new object and return the updated state object
            reviews.currSpotReviews = { ...reviewObject };

            return reviews;

        case ADD_REVIEWS:
            reviews = {
                ...state, currSpotReviews: {
                    ...state.currSpotReviews
                }
            }

            //update the currSpotReviews property with the new review object using the review's id as the key
            reviews.currSpotReviews[action.postingReview.id] = action.postingReview;

            return reviews;

        //when UPDATE_REVIEWS is dispatched, create a copy of the current state object using spread and update the currSpotReviews property with the updated review object using the review's id as the key
        case UPDATE_REVIEWS:
            reviews = { ...state, currSpotReviews: { ...state.currSpotReviews } }
            reviews.currSpotReviews[action.updatedReview.id] = action.updatedReview;

        case DELETE_REVIEWS:
            reviews = { ...state, currSpotReviews: { ...state.currSpotReviews } }
            delete reviews.currSpotReviews[action.reviewId];
            return reviews;

        default:
            return state;
    }
}

export default reviewReducer;