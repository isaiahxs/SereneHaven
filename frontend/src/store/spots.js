import { csrfFetch } from "./csrf";

//action type string for retrieving spots
const GET_SPOTS = `spots/GET_SPOTS`;
const GET_DETAILS = `spots/GET_DETAILS`;
const GET_USER_SPOTS = `spots/GET_USER_SPOTS`;
const ADD_SPOT = `spots/ADD_SPOT`
const ADD_IMG_TO_SPOT = `spots/ADD_IMG_TO_SPOT`
const UPDATE_SPOT = `spots/UPDATE_SPOT`
const DELETE_SPOT = `spots/DELETE_SPOT`

const CLEAR_DETAILS = 'spots/CLEAR_DETAILS';

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

const addSpot = (newSpot) => ({
    type: ADD_SPOT,
    newSpot
})

const updateSpot = (improvedSpot) => ({
    type: UPDATE_SPOT,
    spot: improvedSpot
})

export const deleteSpot = (deletedSpot) => ({
    type: DELETE_SPOT,
    deletedSpot
})

export const clearDetails = () => ({
    type: CLEAR_DETAILS
})

export const spots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    const data = await response.json();
    dispatch(getSpots(data))
    return data;
}

export const userSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    const data = await response.json();
    dispatch(getUserSpots(data));
    return data;
}

export const spotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getDetails(data));
        return data;
    }
}

export const createSpotThunk = (newSpot, prevImage, images) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpot),
    });

    if (response.ok) {
        const data = await response.json();

        //build an array of image objects, each containing the image URL and a boolean indicating whether it is a preview image
        const imagesArr = [
            {
                url: prevImage.url,
                preview: true,
            },
            ...images.map((image) => ({
                url: image.url,
                preview: false,
            })),
        ];

        //make a POST request to the server to save each image in the imagesArr array
        const imageResponses = await Promise.all(
            imagesArr.map((image) =>
                csrfFetch(`/api/spots/${data.id}/images`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(image),
                })
            )
        );

        //parse each image response as JSON and store it in the imageDataArr array
        const imageDataArr = await Promise.all(
            imageResponses.map((response) => response.json())
        );

        //find the image object in the imageDataArr array that has a preview property of true and set it as the preview image for the new spot
        const imageDataWithPreview = imageDataArr.find(
            (imageData) => imageData.preview
        );

        if (imageDataWithPreview) {
            // data.SpotImages = imageDataArr;
            data.prevImage = imageDataWithPreview.url;
        }

        //dispatch a new createSpotThunk action with data as the payload and return data
        dispatch(addSpot(data));
        return data;
    }
};

//WORK IN PROGRESS FOR UPDATE SPOT
// export const updateSpotThunk = (updatedSpot, spotId) => async (dispatch) => {
//     console.log('UPDATED SPOT', updatedSpot)
//     console.log('SPOTIDDDDDD', spotId)

//     const response = await csrfFetch(`/api/spots/${spotId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedSpot)
//     })
//     const improvedSpot = await response.json();
//     dispatch(updateSpot(improvedSpot));

//     // if (image) {
//     //     await csrfFetch(`/api/spots/${spotId}/image`, {
//     //         method: 'PUT',
//     //         headers: {
//     //             'Content-Type': 'application/json'
//     //         },
//     //         body: JSON.stringify(image)
//     //     });
//     // }

//     return improvedSpot;
// }

export const updateSpotThunk = (updatedSpot, spotId, spotImage, images) => async (dispatch) => {
    console.log('UPDATED SPOT', updatedSpot)
    console.log('SPOTIDDDDDD', spotId)
    console.log('SPOTIMAGE', spotImage)
    console.log('IMAGES', images)

    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...updatedSpot, spotImage, images })
    })
    const improvedSpot = await response.json();
    dispatch(updateSpot(improvedSpot, spotId));

    return improvedSpot;
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        dispatch(deleteSpot(spotId));
    }
}

const initialState = {}

// reducer function that takes in a state object and an action object, and returns a new state object based on the action type
const spotReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_SPOTS:
            const allSpots = {};
            const getAllSpots = action.spots.Spots;
            getAllSpots.forEach((eachSpot) => (allSpots[eachSpot.id] = eachSpot));
            newState["allSpots"] = { ...allSpots };
            return newState;

        case GET_DETAILS:
            newState['spotDetails'] = action.spots;
            return newState;

        case ADD_SPOT:
            const addSpot = action.newSpot;
            return addSpot;

        case ADD_IMG_TO_SPOT:
            newState['spotDetails'] = action.spot;
            return newState;

        case UPDATE_SPOT:
            const updatedSpot = action.spot
            const newAllSpots = { ...state.allSpots, [updatedSpot.id]: updatedSpot };
            return { ...state, allSpots: newAllSpots };
        // const updatedSpot = action.improvedSpot
        // const newAllSpots = { ...state.allSpots, [updatedSpot.id]: updatedSpot };
        // return { ...state, allSpots: newAllSpots };

        case DELETE_SPOT:
            const deleted = action.spotId;
            delete newState.userSpots[deleted];
            return newState;

        case GET_USER_SPOTS:
            newState['userSpots'] = action.spots
            return newState;

        case CLEAR_DETAILS:
            newState['spotDetails'] = null;
            return newState;

        default:
            return state;
    }
}

export default spotReducer;