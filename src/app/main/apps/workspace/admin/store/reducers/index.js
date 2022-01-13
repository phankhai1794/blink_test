import * as Actions from '../actions';
const initialState = {
    open: false,
    anchorEl: null
}
const inquiryReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.OPEN_INQUIRY_FORM:
        {
            return {...state, open: action.state};
        }
        case Actions.SET_ANCHOR_EL:
        {
            return {...state, anchorEl: action.state};
        }
        default:
        {
            return state;
        }
    }
};

export default inquiryReducer;