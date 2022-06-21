import * as Actions from '../actions';

const initialState = {
  metadata: {},
  bl: '',
  content: {}
};

const draftBL = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_METADATA: {
    return { ...state, metadata: action.state };
  }
  case Actions.SET_BL: {
    return { ...state, bl: action.state };
  }
  case Actions.SET_CONTENT: {
    return { ...state, content: action.state };
  }
  default: {
    return state;
  }
  }
};

export default draftBL;
