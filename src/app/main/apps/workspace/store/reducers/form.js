import * as Actions from '../actions/form';

const initialState = {
  minimize: false,
  fullscreen: false,
  openDialog: false,
  openAllInquiry: false,
  showSaveInuiry: false,
  openInquiry: false,
  openAttachment: false,
  anchorEl: null,
  reload: false,
  openTrans: false,
  openEmail: false,

}

const formReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.MINIMIZE: {
      return { ...state, minimize: action.state };
    }
    case Actions.SET_FULLSCREEN: {
      return { ...state, fullscreen: action.state };
    }
    case Actions.OPEN_CREATE_INQUIRY: {
      return { ...state, openDialog: action.state };
    }
    case Actions.OPEN_ALL_INQUIRY: {
      return { ...state, openAllInquiry: action.state };
    }
    case Actions.OPEN_INQUIRY: {
      return { ...state, openInquiry: action.state };
    }
    case Actions.TOGGLE_SAVE_INQUIRY: {
      return { ...state, showSaveInuiry: action.state };
    }
    case Actions.OPEN_ATTACHMENT: {
      return { ...state, openAttachment: action.state };
    }
    case Actions.SET_ANCHOR_EL: {
      return { ...state, anchorEl: action.state };
    }
    case Actions.RELOAD: {
      return { ...state, reload: !state.reload, openDialog: false, openInquiry: false, openAllInquiry: false };
    }
    case Actions.OPEN_TRANSACTION: {
      return { ...state, openTrans: !state.openTrans };
    }
    case Actions.OPEN_EMAIL: {
      return { ...state, openEmail: action.state };
    }
    default: {
      return state;
    }
  }
}

export default formReducer;
