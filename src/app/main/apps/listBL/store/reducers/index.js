import * as Actions from '../actions';

const initialState = {
  myBLs: [],
  loading: false
};

const listBlReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_MYBLS_SUCCESS: {
    return { ...state, myBLs: action.state, loading: false };
  }
  case Actions.SET_MYBLS_ERROR: {
    return { ...state, loading: false };
  }
  default: {
    return state;
  }
  }
};

export default listBlReducer;
