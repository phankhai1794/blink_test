import * as Actions from '../../actions/header';

const initialState = {
  hideAll: false,
  displayDraftBLBtn: false,
  displayEditBtn: false
};

const headerReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.DISPLAY_BTN: {
      return {
        ...state,
        hideAll: false,
        displayDraftBLBtn: false,
        displayEditBtn: false,
        ...action.state
      };
    }
    default: {
      return state;
    }
  }
};

export default headerReducer;
