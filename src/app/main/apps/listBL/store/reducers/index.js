import * as Actions from '../actions';

const initialState = {
  myBLs: [],
  user: {},
  metadata: {},
  success: false,
  fail: false,
  reload: false
};

const listBlReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_MYBLS: {
      return { ...state, myBLs: action.state };
    }
    case Actions.SAVE_USER: {
      return { ...state, user: action.state };
    }
    case Actions.SAVE_METADATA: {
      return { ...state, metadata: action.state };
    }
    case Actions.DISPLAY_SUCCESS: {
      return { ...state, success: action.state };
    }
    case Actions.DISPLAY_FAIL: {
      return { ...state, fail: { openDialog: action.state, error: action.message } };
    }
    case Actions.RELOAD: {
      return { ...state, reload: !state.reload, openInquiry: false };
    }
    default: {
      return state;
    }
  }
};

export default listBlReducer;
