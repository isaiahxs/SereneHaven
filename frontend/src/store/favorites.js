import { csrfFetch } from "./csrf"

//actions
const SET_FAVORITES = 'favorites/SET_FAVORITES';
const ADD_FAVORITE = 'favorites/ADD_FAVORITE';
const REMOVE_FAVORITE = 'favorites/REMOVE_FAVORITE';

export const setFavorites = (favorites) => {
    return {
        type: SET_FAVORITES,
        payload: favorites
    }
}

export const addFavorite = (favorite) => {
    return {
        type: ADD_FAVORITE,
        payload: favorite
    }
}

export const removeFavorite = (spotId) => {
    return {
        type: REMOVE_FAVORITE,
        payload: spotId
    }
}

//thunk action
export const getFavorites = () => async (dispatch) => {
    const response = await csrfFetch('/api/favorites', {
        headers: {
            'Content-Type': "application/json",
        },
    })

    if (response.ok) {
        const { favorites } = await response.json();
        dispatch(setFavorites(favorites));
    }
}

export const createFavorite = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/favorites/${spotId}`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify({ spotId }),
    })

    if (response.ok) {
        const favorite = await response.json();
        dispatch(addFavorite(favorite));
    }
}

export const deleteFavorite = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/favorites/${spotId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': "application/json",
        },
    })

    if (response.ok) {
        dispatch(removeFavorite(spotId));
    }
}

const initialState = [];

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_FAVORITES:
            return action.payload ? action.payload : [];

        case ADD_FAVORITE:
            return [...state, action.payload];

        case REMOVE_FAVORITE:
            return state.filter(favorite => favorite.id !== action.payload);

        default:
            return state;
    }
}