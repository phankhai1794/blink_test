import * as bookingActions from './booking.actions'
export const CHANGE_IMPORT_TYPE = "[IMPORT APP] CHANGE IMPORT TYPE";

export const changeImportType = (type) => {
    return dispatch => {
        dispatch({
            type: CHANGE_IMPORT_TYPE,
            payload: type
        })

        dispatch(bookingActions.resetBookingStep());
    }
}