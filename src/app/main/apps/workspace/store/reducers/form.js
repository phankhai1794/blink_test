import * as Actions from '../actions/form';

const initialState = {
  fullscreen: false,
  openDialog: false,
  openAllInquiry: false,
  showSaveInquiry: false,
  showAddInquiry: true,
  openAttachment: false,
  reload: false,
  openTrans: false,
  openEmail: false,
  openInqReview: false,
  openNotificationAttachmentList: false,
  openNotificationSubmitAnswer: false,
  openNotificationDeleteReply: false,
  enableSaveInquiriesList: true,
  openConfirmPopup: false,
  confirmPopupMsg: '',
  confirmPopupType: '',
  confirmClick: false,
  openAmendmentForm: false,
};

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
    return { ...state, reload: !state.reload, openDialog: false, openAllInquiry: false, openAttachment: false };
  }
  case Actions.OPEN_TRANSACTION: {
    return { ...state, openTrans: !state.openTrans };
  }
  case Actions.OPEN_EMAIL: {
    return { ...state, openEmail: action.state };
  }
  case Actions.OPEN_INQUIRY_REVIEW: {
    return { ...state, openInqReview: action.state };
  }
  case Actions.OPEN_NOTIFICATION_ATTACHMENT_LIST: {
    return { ...state, openNotificationAttachmentList: action.state };
  }
  case Actions.OPEN_NOTIFICATION_SUBMIT_ANSWER: {
    return { ...state, openNotificationSubmitAnswer: action.state };
  }
  case Actions.OPEN_NOTIFICATION_DELETE_REPLY: {
    return { ...state, openNotificationDeleteReply: action.state };
  }
  case Actions.ENABLE_SAVE_INQUIRIES: {
    return { ...state, enableSaveInquiriesList: action.state };
  }
  case Actions.OPEN_CONFIRM_POPUP: {
    return { ...state, ...action.state }
  }
  case Actions.CONFIRM_POPUP_CLICK: {
    return { ...state, openConfirmPopup: false, confirmClick: action.state }
  }
  case Actions.OPEN_CREATE_AMENDMENT: {
    return { ...state, openAmendmentForm: action.state }
  }
  default: {
    return state;
  }
  }
};

export default formReducer;
