import * as Actions from '../actions/form';

const initialState = {
  fullscreen: false,
  openDialog: false,
  openAllInquiry: false,
  showSaveInquiry: false,
  showAddInquiry: true,
  openAttachment: false,
  openEmail: false,
  eventClickContNo: { status: false, questionId: '', isHasActionClick: false },
  openInqReview: false,
  openNotificationInquiryList: false,
  openNotificationAttachmentList: false,
  openNotificationAmendmentList: false,
  openNotificationSubmitAnswer: false,
  openNotificationDeleteReply: false,
  openNotificationSubmitPreview: false,
  openNotificationDeleteAmendment: false,
  openNotificationUploadOpus: { status: false, message: '', icon: '' },
  openWarningCDCMContainerNo: { status: false, contentsWarning: [], warningType: '' },
  enableSaveInquiriesList: true,
  openAmendmentList: false,
  openPreviewListSubmit: false,
  openConfirmPopup: false,
  confirmPopupMsg: '',
  confirmPopupType: '',
  confirmClick: false,
  openAmendmentForm: false,
  openNotificationBLWarning: { status: false, userName: '' },
  openNotificationBLReloadWarning: false,
  inqViewerFocus: null,
  validateInput: { isValid: true, prohibitedInfo: null, handleConfirm: null },
  isLoading: 0,
  openPreviewFiles: false,
  currentInqPreview: {},
  currentFilePreview: {},
  isLoadingProcess: false,
  dirtyReload: {},
  scrollInquiry: '',
  tabs: 0,
  fileRemoveIndex: -1,
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
  case Actions.TOGGLE_AMENDMENTS_LIST: {
    return { ...state, openAmendmentList: action.state };
  }
  case Actions.TOGGLE_PREVIEW_SUBMIT_LIST: {
    return { ...state, openPreviewListSubmit: action.state };
  }
  case Actions.TOGGLE_ADD_INQUIRY: {
    return { ...state, showAddInquiry: action.state };
  }
  case Actions.OPEN_ATTACHMENT: {
    return { ...state, openAttachment: action.state };
  }
  case Actions.RELOAD: {
    return {
      ...state,
      openEmail: false,
      openDialog: false,
      openAllInquiry: false,
      openAttachment: false,
      openPreviewListSubmit: false,
      openAmendmentForm: false,
      openAmendmentList: false,
      openNotificationAttachmentList: false,
      openNotificationInquiryList: false,
      openNotificationAmendmentList: false
    };
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
  case Actions.OPEN_NOTIFICATION_INQUIRY_LIST: {
    return { ...state, openNotificationInquiryList: action.state };
  }
  case Actions.OPEN_NOTIFICATION_AMENDMENT_LIST: {
    return { ...state, openNotificationAmendmentList: action.state };
  }
  case Actions.OPEN_NOTIFICATION_SUBMIT_ANSWER: {
    return { ...state, openNotificationSubmitAnswer: action.state };
  }
  case Actions.OPEN_NOTIFICATION_DELETE_REPLY: {
    return { ...state, openNotificationDeleteReply: action.state };
  }
  case Actions.OPEN_NOTIFICATION_DELETE_AMENDMENT: {
    return { ...state, openNotificationDeleteAmendment: action.state };
  }
  case Actions.OPEN_NOTIFICATION_PREVIEW_SUBMIT: {
    return { ...state, openNotificationSubmitPreview: action.state };
  }
  case Actions.TOGGLE_OPEN_BL_WARNING: {
    return { ...state, openNotificationBLWarning: action.state };
  }
  case Actions.TOGGLE_OPEN_RELOAD_WARNING: {
    return { ...state, openNotificationBLReloadWarning: action.state };
  }
  case Actions.ENABLE_SAVE_INQUIRIES: {
    return { ...state, enableSaveInquiriesList: action.state };
  }
  case Actions.OPEN_CONFIRM_POPUP: {
    return { ...state, ...action.state };
  }
  case Actions.CONFIRM_POPUP_CLICK: {
    return { ...state, openConfirmPopup: false, confirmClick: action.state };
  }
  case Actions.OPEN_CREATE_AMENDMENT: {
    return { ...state, openAmendmentForm: action.state };
  }
  case Actions.OPEN_WARNING_CD_CM: {
    return { ...state, openWarningCDCMContainerNo: action.state };
  }
  case Actions.INQUIRY_VIEWER_FOCUS: {
    return { ...state, inqViewerFocus: action.state };
  }
  case Actions.VALIDATE_INPUT: {
    return { ...state, validateInput: action.state };
  }
  case Actions.INCREASE_LOADING: {
    return { ...state, isLoading: state.isLoading + 1 };
  }
  case Actions.DECREASE_LOADING: {
    return { ...state, isLoading: state.isLoading - 1 };
  }
  case Actions.PROCESS_LOADING: {
    return { ...state, isLoadingProcess: action.state };
  }
  case Actions.RESET_LOADING: {
    return { ...state, isLoading: 0 };
  }
  case Actions.OPEN_WARNING_UPLOAD_OPUS: {
    return { ...state, openNotificationUploadOpus: action.state };
  }
  case Actions.OPEN_PREVIEW_FILES: {
    return { ...state, openPreviewFiles: action.state.openPreviewFiles, currentInqPreview: action.state.currentInqPreview };
  }
  case Actions.CURRENT_FILE_PREVIEW: {
    return { ...state, currentFilePreview: action.state };
  }
  case Actions.EVENT_CLICK_CONT_NO: {
    return { ...state, eventClickContNo: action.state };
  }
  case Actions.SET_DIRTY_RELOAD: {
    return { ...state, dirtyReload: { ...state.dirtyReload, ...action.state } };
  }
  case Actions.SCROLL_INQ: {
    return {...state, scrollInquiry: action.state}
  }
  case Actions.SET_TAB: {
    return {...state, tabs: action.state}
  }
  case Actions.FILE_REMOVE_INDEX: {
    return {...state, fileRemoveIndex: action.state}
  }
  default: {
    return state;
  }
  }
};

export default formReducer;
