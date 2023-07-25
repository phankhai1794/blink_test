import * as Actions from '../actions';

const initialState = {
  metadata: {},
  myBL: {},
  orgContent: {},
  content: {},
  isPreviewingDraftPage: true,
  currentField: '',
  currentAmendField: '',
  reload: false,
  enableSendDraftBl: false,
  openSendNotification: false,
  edit: false,
  drfView: localStorage.getItem("drfView") || "MD",
};

const draftBL = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_METADATA: {
    return { ...state, metadata: action.state };
  }
  case Actions.SET_BL: {
    return { ...state, myBL: { ...state.myBL, ...action.state } };
  }
  case Actions.SET_ORG_CONTENT: {
    return { ...state, orgContent: action.state };
  }
  case Actions.SET_CONTENT: {
    return { ...state, content: action.state };
  }
  case Actions.SET_PREVIEWING_DRAFT_BL: {
    return { ...state, isPreviewingDraftPage: action.state };
  }
  case Actions.SET_CURRENT_FIELD: {
    return { ...state, currentField: action.state };
  }
  case Actions.SET_AMENDMENT_FIELD: {
    return { ...state, currentAmendField: action.state };
  }
  case Actions.RELOAD: {
    return { ...state, reload: !state.reload, edit: false };
  }
  case Actions.SET_SEND_DRAFT_BL: {
    return { ...state, enableSendDraftBl: action.state };
  }
  case Actions.OPEN_SEND_NOTIFICATION: {
    return { ...state, openSendNotification: action.state };
  }
  case Actions.SET_EDIT_INQUIRY: {
    return { ...state, edit: action.state };
  }
  case Actions.SET_DRF_VIEW: {
    return { ...state, drfView: action.state }
  }
  default: {
    return state;
  }
  }
};

export default draftBL;
