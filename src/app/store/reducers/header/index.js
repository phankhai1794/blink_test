import * as Actions from '../../actions/header';

const initialState = {
  allow: true
};

const headerReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.CHECK_ALLOW: {
      return { ...state, allow: action.state };
    }
    default: {
      return state;
    }
  }
};

export default headerReducer;
