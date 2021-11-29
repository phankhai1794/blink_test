import axios from 'axios';
export const GET_BOOKINGS_LIST = "[EXPORT APP] GET BOOKINGS LIST";
export const DESELECTED_ALL_BOOKINGS = "[EXPORT APP] DESELECTED ALL BOOKINGS";

export const getBookingsList = () => {
    let request = axios.get('/api/booking');
    return dispatch => {
        request.then(res => {
            dispatch({
                type: GET_BOOKINGS_LIST,
                payload: res.data
            })
        })
    }
}

export const deSelectAllBookings = () => {
    return {
        type: DESELECTED_ALL_BOOKINGS
    }
}
