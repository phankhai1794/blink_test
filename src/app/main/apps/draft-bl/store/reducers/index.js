import * as Actions from '../actions';

const initialState = {
  metadata: {},
  myBL: {},
  content: {},
  draftContent: [],
  contentEdit: {},
  contentChanged: {},
  openDraftBL: false,
  currentBLField: '',
  reload: false,
  enableSendDraftBl: false,
  openSendNotification: false,
};

const draftBL = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_METADATA: {
    return { ...state, metadata: action.state };
  }
  case Actions.SET_BL: {
    return { ...state, myBL: { ...state.myBL, ...action.state } };
  }
  case Actions.SET_CONTENT: {
    return { ...state, content: action.state };
  }
  case Actions.SET_DRAFT_CONTENT: {
    return { ...state, draftContent: action.state };
  }
  case Actions.OPEN_EDIT_DRAFT_BL: {
    return { ...state, openDraftBL: action.state };
  }
  case Actions.SET_CURRENT_BL_FIELD: {
    return { ...state, currentBLField: action.state };
  }
  case Actions.SET_NEW_CONTENT: {
    return { ...state, contentEdit: action.state };
  }
  case Actions.SET_NEW_CONTENT_CHANGED: {
    return { ...state, contentChanged: action.state };
  }
  case Actions.RELOAD: {
    return { ...state, reload: !state.reload };
  }
  case Actions.SET_SEND_DRAFT_BL: {
    return { ...state, enableSendDraftBl: action.state };
  }
  case Actions.OPEN_SEND_NOTIFICATION: {
    return { ...state, openSendNotification: action.state };
  }
  default: {
    return state;
  }
  }
};

export default draftBL;
