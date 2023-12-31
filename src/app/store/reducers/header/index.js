import * as Actions from '../../actions/header';

const initialState = {
  allowAccess: true,
  validToken: true
};

const headerReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.CHECK_ALLOW: {
    return { ...state, allowAccess: action.state };
  }
  case Actions.CHECK_AUTH_TOKEN: {
    return { ...state, validToken: action.state };
  }
  default: {
    return state;
  }
  }
};

export default headerReducer;
