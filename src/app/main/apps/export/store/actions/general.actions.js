import * as bookingActions from './booking.actions'
export const CHANGE_EXPORT_TYPE = "[EXPORT APP] CHANGE EXPORT TYPE";

export const changeExportType = (type) => {
    return dispatch => {
        dispatch({
            type: CHANGE_EXPORT_TYPE,
            payload: type
        })

        dispatch(bookingActions.resetBookingStep());
    }
}