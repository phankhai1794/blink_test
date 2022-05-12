import * as Actions from '../actions/transaction';

const initialState = {
  isloading: false,
  success: false,
  error: '',
  transAutoSaveStatus: ''
};

const transReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.TRANSACTION_STATUS: {
      return {
        ...initialState,
        transAutoSaveStatus: state,
      };
    }
    case Actions.TRANSACTION_LOADING: {
      return {
        ...initialState,
        isloading: true
      };
    }
    case Actions.TRANSACTION_SUCCESS: {
      return {
        ...initialState,
        success: true,
        isloading: false
      };
    }
    case Actions.TRANSACTION_ERROR: {
      return {
        success: false,
        isloading: false,
        error: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default transReducer;
