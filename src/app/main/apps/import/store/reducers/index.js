import { combineReducers } from 'redux';
import booking from './booking.reducer';
import general from './general.reducer';
import bookings from './bookings.reducer'

const reducer = combineReducers({
    booking,
    bookings,
    general,
})


export default reducer;