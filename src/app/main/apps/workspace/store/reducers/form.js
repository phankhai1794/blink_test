import * as Actions from '../actions/form';

const initialState = {
  fullscreen: false,
  openDialog: false,
  openAllInquiry: false,
  showSaveInquiry: false,
  showAddInquiry: true,
  openInquiry: false,
  openAttachment: false,
  reload: false,
  openTrans: false,
  openEmail: false,

}

const formReducer = function (state = initialState, action) {
  switch (action.type) {
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
      return { ...state, showSaveInquiry: action.state };
    }
    case Actions.TOGGLE_ADD_INQUIRY: {
      return { ...state, showAddInquiry: action.state };
    }
    case Actions.OPEN_ATTACHMENT: {
      return { ...state, openAttachment: action.state };
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
