import * as Actions from '../actions/CREATE_TRANS';

const initialState = {
  isloading: false,
  success: false,
  error: '',
  blTrans:[],

  transAutoSaveStatus: ''
};

const transReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.CREATE_TRANS_STATUS: {
      return {
        ...state,
        transAutoSaveStatus: action.state,
      };
    }
    case Actions.CREATE_TRANS_LOADING: {
      return {
        ...state,
        isloading: true
      };
    }
    case Actions.CREATE_TRANS_SUCCESS: {
      return {
        ...state,
        success: true,
        isloading: false
      };
    }
    case Actions.CREATE_TRANS_ERROR: {
      return {
        ...state,
        success: false,
        isloading: false,
        error: action.payload
      };
    }
    case Actions.GET_BL_TRANS_SUCCESS: {
      return { ...state, blTrans: action.blTrans.data };
    }
    default: {
      return state;
    }
  }
};

export default transReducer;
