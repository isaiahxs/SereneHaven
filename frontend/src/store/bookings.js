import { csrfFetch } from "./csrf"

//action type strings
const GET_BOOKINGS = 'bookings/GET_BOOKINGS'

//action creators
const getBookings = (bookings) => ({
    type: GET_BOOKINGS,
    bookings
})

//booking thunk action creators
export const getBookingThunk = (booking) => async (dispatch) => {
    const response = await csrfFetch(`api/bookings/current`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getBookings(data));
        return data;
    }
}

const initialState = { currSpotBookings: null };

const bookingReducer = (state = initialState, action) => {
    let bookings;

    switch (action.type) {
        case GET_BOOKINGS:
            bookings = {
                ...state, currSpotBookings: {
                    ...state.currSpotBookings
                }
            }

            let bookingObject = {};

            let bookingArray = action.bookings.Bookings;
            bookingArray.forEach((booking) => (bookingObject[booking.id] = booking));

            bookings.currSpotBookings = { ...bookingObject };

            return bookings;

        default:
            return state;
    }
}

export default bookingReducer;