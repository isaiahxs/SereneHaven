import { csrfFetch } from "./csrf"

//action type strings
const ADD_BOOKING = `bookings/ADD_BOOKING`
const GET_ALL_BOOKINGS = `bookings/GET_ALL_BOOKINGS`
const GET_USER_BOOKINGS = `bookings/GET_USER_BOOKINGS`
const DELETE_BOOKING = `bookings/DELETE_BOOKING`
const UPDATE_BOOKING = `bookings/UPDATE_BOOKING`

//action creators
const getAllBookings = (allBookings) => ({
    type: GET_ALL_BOOKINGS,
    allBookings
})

const getUserBookings = (bookings) => ({
    type: GET_USER_BOOKINGS,
    bookings
})

const addBooking = (newBooking) => ({
    type: ADD_BOOKING,
    newBooking
})

const updateBooking = (updatedBooking) => ({
    type: UPDATE_BOOKING,
    updatedBooking
})

export const deleteBooking = (bookingId) => ({
    type: DELETE_BOOKING,
    bookingId
})

//booking thunk action creators
export const spotBookingsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getAllBookings(data));
        // return data;
        return Promise.resolve(data);
    }
}

export const userBookingsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/current`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserBookings(data));
        return data;
    }
}

export const addBookingThunk = (spotId, startDate, endDate) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
    });

    if (response.ok) {
        const newBooking = await response.json();
        dispatch(addBooking(newBooking));
    }
}

export const updateBookingThunk = (bookingId, startDate, endDate) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
    });

    if (response.ok) {
        const updatedBooking = await response.json();
        dispatch(updateBooking(updatedBooking));
    }
}

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        dispatch(deleteBooking(bookingId));
    }
}


const initialState = {};

const bookingReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_ALL_BOOKINGS:
            newState = action.allBookings
            return newState;

        case GET_USER_BOOKINGS:
            newState = action.bookings
            return newState;

        case ADD_BOOKING:
            newState.Bookings = [...newState.Bookings, action.newBooking];
            return newState;

        case UPDATE_BOOKING:
            const updatedBookingId = action.updatedBooking.id;
            newState.Bookings = newState.Bookings.map(booking => {
                if (booking.id === updatedBookingId) {
                    return {
                        ...booking, // Keep all existing properties of the booking
                        ...action.updatedBooking, // Overwrite only the updated fields
                        Spot: booking.Spot // Explicitly keep the existing Spot information
                    };
                }
                return booking;
            });
            return newState;

        case DELETE_BOOKING:
            const deletedBookingId = action.bookingId;
            newState.Bookings = newState.Bookings.filter(booking => booking.id !== deletedBookingId);
            return newState;

        default:
            return state;
    }
}

export default bookingReducer;