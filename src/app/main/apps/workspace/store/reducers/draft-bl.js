import * as Actions from '../actions/draft-bl';

const initialState = {
  process: null,
  openSendNotification: false,
};

const draftBLReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_PROCESS: {
    return { ...state, process: action.state };
  }
  case Actions.OPEN_SEND_NOTIFICATION: {
    return { ...state, openSendNotification: action.state };
  }
  default: {
    return state;
  }
  }
};

export default draftBLReducer;
