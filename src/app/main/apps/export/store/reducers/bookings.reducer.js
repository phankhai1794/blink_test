import * as Actions from '../actions';


const initState = {
    data: [],
    selectedBookingIds: [],
    searchText: ''
}

const bookingsReducer = (state = initState, action) => {
    switch(action.type) {
        case Actions.GET_BOOKINGS_LIST: 
        {
            return {
                ...state,
                data: action.payload
            }
        }
        default: 
        {
            return state;
        }
    }
}

export default bookingsReducer;