import * as Actions from '../actions';

const initialState = {
  myBLs: [],
  loading: false,
  success: false,
  error: false
};

const listBlReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.PROCESSING: {
      return { ...state, loading: true };
    }
    case Actions.SET_MYBLS_SUCCESS: {
      return { ...state, myBLs: action.state, success: true, loading: false };
    }
    case Actions.SET_MYBLS_ERROR: {
      return { ...state, error: action.message, loading: false };
    }
    default: {
      return state;
    }
  }
};

export default listBlReducer;
