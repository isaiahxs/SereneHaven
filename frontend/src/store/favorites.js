//actions
const SET_FAVORITES = 'favorites/SET_FAVORITES';

export const setFavorites = (favorites) => {
    return {
        type: SET_FAVORITES,
        payload: favorites
    }
}

//thunk action
export const getFavorites = () => async (dispatch) => {
    const response = await fetch('/api/favorites', {
        headers: {
            'Content-Type': "application/json",
        },
    })

    if (response.ok) {
        const { favorites } = await response.json();
        dispatch(setFavorites(favorites));
    }
}

const initialState = [];

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_FAVORITES:
            return action.payload ? action.payload : [];

        default:
            return state;
    }
}