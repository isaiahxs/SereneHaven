import { csrfFetch } from "./csrf"

//action type strings
const GET_USER_BOOKINGS = `bookings/GET_USER_BOOKINGS`

//action creators
const getUserBookings = (bookings) => ({
    type: GET_USER_BOOKINGS,
    bookings
})

//booking thunk action creators
export const userBookingsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`api/bookings/current`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserBookings(data));
        return data;
    }
}

const initialState = {};

const bookingReducer = (state = initialState, action) => {
    // let bookings;
    let newState = { ...state };

    switch (action.type) {
        case GET_USER_BOOKINGS:
            newState = action.bookings
            return newState;

        default:
            return state;
    }
}

export default bookingReducer;