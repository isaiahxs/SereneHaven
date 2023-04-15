//following similar structure as session.js
//---------------------------------------------------

//handles the CSRF token required for making requests to backend server
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

// const addImgToSpot = ({url, spotId}) => ({
//     type: ADD_IMG_TO_SPOT,
//     payload: {url, spotId}
// })

const updateSpot = (updatedSpot) => ({
    type: UPDATE_SPOT,
    updatedSpot
})

//second attempt
// const updateSpot = (updatedSpot, spotId) => ({
//     type: UPDATE_SPOT,
//     spot: {
//         id: spotId,
//         ...updatedSpot
//     }
// })

export const deleteSpot = (deletedSpot) => ({
    type: DELETE_SPOT,
    deletedSpot
})

export const clearDetails = () => ({
    type: CLEAR_DETAILS
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

// other attempt
// export const userSpotsThunk = () => async (dispatch) => {
//     const response = await csrfFetch('/api/spots/current');

//     if (response.ok) {
//         const data = await response.json();
//         dispatch(getUserSpots(data));
//         return data;
//     } else {
//         return {};
//     }
// }

//additional notes: when you make a request to the server using csrfFetch, it returns a response object that contains information such as the response status code, headers, and the body of the response as a string
//in order to work with the data returned by the server, we need to parse the response body as JSON
    //this returns a promise that resolves to the parsed JSON data, which we are currently assigning to the data variable
//to ensure that the spotDetails thunk action creator returns the correct data, the final return should be the data variable
//that way, any code that calls spotDetails and awaits its resolution will receive the parsed JSON data as the resolved value of the returned promise
export const spotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    //after response from AJAX call comes back, parse the JSON body of the response
    if (response.ok) {
        const data = await response.json();
        dispatch(getDetails(data));
        return data;
    }
}

//ORIGINAL ORIGINAL
// export const createSpotThunk = (newSpot, prevImg) => async (dispatch) => {
//     const response = await csrfFetch('/api/spots', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newSpot)
//         // body: JSON.stringify({
//         //     url: prevImg.url,
//         //     preview: true
//         // })
//     })

//     if (response.ok) {
//         const data = await response.json();
//         const imgResponse = await csrfFetch(`/api/spots/${data.id}/images`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 url: prevImg.url,
//                 preview: true
//             })
//             // body: JSON.stringify(newSpot)
//         })

//         if (imgResponse.ok) {
//             const imgData = await imgResponse.json();
//             data.prevImg = imgData.url;
//             dispatch(addSpot(data));
//             return data;
//         }
//     }
// }

//need to find a way to add the other smaller images into SpotDetails page
export const createSpotThunk = (newSpot, prevImage, images) => async (dispatch) => {

    //make a post request to the server to create a new spot
    const response = await csrfFetch(`/api/spots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSpot),
    });

    //if the response is successful, parse the response as JSON and store it in the data variable
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


//one possible way

// export const createSpotThunk = ({country, address, city, state, lat, lng, description, name, price}) => async (dispatch) => {
//     const spotObject = {
//         country,
//         address,
//         city,
//         state,
//         lat,
//         lng,
//         description,
//         name,
//         price
//     }

//     const response = await csrfFetch('/api/spots', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(spotObject)
//     })
//     const data = await response.json();
//     dispatch(addSpot(data));
//     return data;
// }

// export const addImgToSpotThunk = (url, previewImg, spotId) => async (dispatch) => {
//     const addImageToSpotObject = {
//         url,
//         previewImg,
//     }

//     const response = await csrfFetch(`/api/spots/${spotId}/images`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(addImageToSpotObject)
//     })
//     const data = await response.json();
//     dispatch(addImgToSpot({url: data.url, spotId: data.spotId}));
//     return data;

//     //returning data is the response from the server

//     //spotId: data.spotId because the response from the server is the data that we want to use to update the state
//     }

//WORK IN PROGRESS FOR UPDATE SPOT
export const updateSpotThunk = (updatedSpot, spotId) => async (dispatch) => {
    //what is it that we are fetching here?


    const response = await csrfFetch(`/api/spots/${spotId}/id`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSpot)
    })
    const improvedSpot = await response.json();
    // const spot = {...updatedSpot, id: spotId}
    dispatch(updateSpot(improvedSpot, spotId));

    return improvedSpot;
}

//I NEED TO MAKE MY UPDATE SPOT THUNK TAKE IN FOUR ARGUMENTS IF I WANT TO ALLOW THE USER TO UPDATE THEIR IMAGES AS WELL. ALSO I WILL NEED TO ADD AN ADDITIONAL ARGUMENT INTO THE DISPATCHER FUNCTION AND ALSO MAKE SURE THAT ALL MY ARUGMENTS ARE IN THE RIGHT ORDER



export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(response.ok){
        dispatch(deleteSpot(spotId));
        //no need to return anything since we're not using the return of this thunk action creator anywhere
    }
}

//going to refactor reducer

//the initialState object is defined as an empty object, which will be used as the initial state for the spotReducer

const initialState = {}

// reducer function that takes in a state object and an action object, and returns a new state object based on the action type
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

        case ADD_SPOT:
            console.log('this is add spot')
            const addSpot = action.newSpot;
            return addSpot;

        case ADD_IMG_TO_SPOT:
            console.log('this is add img to spot')
            newState['spotDetails'] = action.spot;
            return newState;
            //this seems like it would override the spotDetails key in the Redux store with the spot object that we're passing in as the payload of the action object


        case UPDATE_SPOT:
            // console.log('this is update spot')
            // newState['spotDetails'] = action.updatedSpot;
            // return newState;
            const updatedSpot = action.spot
            const newAllSpots = {...state.allSpots, [updatedSpot.id]: updatedSpot};
            return {...state, allSpots: newAllSpots};

            //in the UPDATE_SPOT case, we need to assign the updatedSpot to the spotDetails key of the newState object because we want to update the spotDetails key in the Redux store with the updated spot details

        case DELETE_SPOT:
            console.log('this is delete spot')
            const deleted = action.spotId;
            delete newState.userSpots[deleted];
            return newState;

        case GET_USER_SPOTS:
            console.log('this is get user spots')
            newState['userSpots'] = action.spots
            return newState;
            // const userSpots = {};
            // console.log('this is get user spots')
            // action.spots.Spots.forEach((spot) => (
            //     userSpots[spot.id] = spot
            // ))
            // newState['userSpots'] = userSpots;
            // return newState;

        case CLEAR_DETAILS:
            console.log('now clearing details');
            newState['spotDetails'] = null;
            return newState;


        default:
            return state;
    }
}

export default spotReducer;

//going to make this reducer more like my reviews reducer

// const initialState = {landingSpots: null, userSpots: null, currentSpot: null};

// const spotReducer = (state=initialState, action) => {
//     let spots;
//     switch (action.type) {
//         case GET_SPOTS:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: null}
//         let landingSpots = {};
//         for (let spot of action.spots.Spots) {
//             landingSpots[spot.id] = spot;
//         }
//         spots.landingSpots = landingSpots;
//         return spots;

//         case GET_DETAILS:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: {...state.currentSpot}}
//             spots.currentSpot = action.spot;
//             return spots;

//         case ADD_SPOT:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: {...state.currentSpot}}
//             spots.landingSpots[action.spot.id] = action.spot;
//             spots.userSpots[action.spot.id] = action.spot;
//             return spots;

//         case ADD_IMG_TO_SPOT:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}};
//             spots.userSpots[action.payload.spotId].previewImage = action.payload.url;
//             return spots;
//             //

//         case UPDATE_SPOT:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: {...state.currentSpot}}
//             spots.landingSpots[action.updatedSpot.id] = action.updatedSpot;
//             spots.userSpots[action.updatedSpot.id] = action.updatedSpot;
//             return spots;

//         case DELETE_SPOT:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: {...state.currentSpot}}
//             delete spots.landingSpots[action.spotId];
//             delete spots.userSpots[action.spotId];
//             return spots;

//         case GET_USER_SPOTS:
//             spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: {...state.currentSpot}}
//             let userSpots = {};
//             for (let spot of action.spots.Spots) {
//                 userSpots[spot.id] = spot;
//             }
//             spots.userSpots = userSpots;
//             return spots;
//             //we need to spread the state object and the landingSpots and userSpots objects instead of just doing spots = {landingSpots: {}, userSpots: {}, currentSpot: null} because we want to keep the current state of the landingSpots and userSpots keys in the Redux store, and we only want to update the userSpots key with the userSpots that we're passing in as the payload of the action object
//             // should have action.spots.Spots because the payload of the action object is the response from the backend, which is an object with a key of Spots, and the value of Spots is an array of spot objects

//         //need to review this one
//         // case CLEAR_DETAILS:
//         //     spots = {...state, landingSpots: {...state.landingSpots}, userSpots: {...state.userSpots}, currentSpot: {...state.currentSpot}}
//         //     spots.currentSpot = null;
//         //     return spots;

//         default:
//             return state;
//     }
// }
