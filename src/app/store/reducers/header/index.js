import * as Actions from '../../actions/header';

const initialState = {
    showBtnDraftBL: false,
    showBtnEdit: false,
}

const headerReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SHOW_BTN_DRAFT_BL:
        {
            return {...state, showBtnDraftBL: action.state};
        }
        case Actions.SHOW_BTN_EDIT:
        {
            return {...state, showBtnEdit: action.state};
        }
        default:
        {
            return state;
        }
    }
};

export default headerReducer;