export const ADD_BOOKING = "[EXPORT APP] ADD BOOKING";
export const CHANGE_BOOKING_STEP = "[EXPORT APP] CHANGE BOOKING STEP";
export const RESET_BOOKING_STEP = "[EXPORT APP] RESET BOOKING STEP";

export const TOGGLE_LOCK_EDIT = "[EXPORT APP] TOGGLE LOCK EDIT";
export const ADD_BOOKING_STEP = "[EXPORT APP] ADD BOOKING STEP";
export const REMOVE_BOOKING_STEP = "[EXPORT APP] REMOVE BOOKING STEP";
export const SET_BOOKING_FORM = "[EXPORT APP] SET BOOKING FORM";
export const SET_BOOKING_DATA = "[EXPORT APP] SET BOOKING DATA";


export const setBookingForm = (data) => {
    return dispatch => dispatch({
        type: SET_BOOKING_FORM,
        payload: data
    })
}

export const setBookingData = (data) => {
    return dispatch => dispatch({
        type: SET_BOOKING_DATA,
        payload: data
    })
}

export const changeBookingStep = (step) => {
    return dispatch => dispatch({
        type: CHANGE_BOOKING_STEP,
        payload: step
    })
}

export const resetBookingStep = () => {
    return dispatch => dispatch({
        type: RESET_BOOKING_STEP
    })
}


export const addBookingStep = ({title, index}) => {
    return dispatch => dispatch({
        type: ADD_BOOKING_STEP,
        payload: {
            title,
            index
        }
    })
}

export const removeBookingStep = (position) => {
    return dispatch => dispatch({
        type: REMOVE_BOOKING_STEP,
        payload: position
    })
}


export const toggleLockEdit = () => {
    return dispatch => dispatch({
        type: TOGGLE_LOCK_EDIT
    })
}

