import * as Actions from '../actions/transaction';

const initialState = {
  isLoading: false,
  success: false,
  error: '',
  blTrans: [],
  transId: '',
  transAutoSaveStatus: '',
  restoreLoading: false,
  restoreSuccess: false,
  restoreError: ''
};

const transReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.CREATE_TRANS_STATUS: {
    return {
      ...state,
      transAutoSaveStatus: action.state
    };
  }

  case Actions.SELECTED_BL_TRANS: {
    return {
      ...state,
      transId: action.state
    };
  }
  case Actions.CREATE_TRANS_LOADING: {
    return {
      ...state,
      isLoading: true
    };
  }
  case Actions.CREATE_TRANS_SUCCESS: {
    return {
      ...state,
      success: true,
      isLoading: false
    };
  }
  case Actions.CREATE_TRANS_ERROR: {
    return {
      ...state,
      success: false,
      isLoading: false,
      error: action.payload
    };
  }
  case Actions.GET_BL_TRANS_SUCCESS: {
    return { ...state, blTrans: action.blTrans.data };
  }
  case Actions.RESTORE_BL_TRANS_NONE: {
    return {
      ...state,
      restoreSuccess: false,
      restoreError: '',
      restoreLoading: false
    }
  }
  case Actions.RESTORE_BL_TRANS_LOADING: {
    return { ...state, restoreLoading: true };
  }
  case Actions.RESTORE_BL_TRANS_SUCCESS: {
    return {
      ...state, 
      restoreLoading: false, 
      restoreSuccess: true,
    };
  }
  case Actions.RESTORE_BL_TRANS_ERROR: {
    return {
      ...state,
      restoreSuccess: false,
      restoreError: action.payload,
      restoreLoading: false
    };
  }

  default: {
    return state;
  }
  }
};

export default transReducer;
