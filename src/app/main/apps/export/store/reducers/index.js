import { combineReducers } from 'redux';
import booking from './booking.reducer';
import general from './general.reducer';
import bookings from './bookings.reducer';

const reducer = combineReducers({
    booking,
    general,
    bookings
})


export default reducer;