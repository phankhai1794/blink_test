import * as Actions from '../actions/draft-bl';

const initialState = {
  process: null,
};

const draftBLReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_PROCESS: {
    return { ...state, process: action.state };
  }
  default: {
    return state;
  }
  }
};

export default draftBLReducer;
