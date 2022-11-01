export const SET_FULLSCREEN = 'SET_FULLSCREEN';
export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ATTACHMENT = 'OPEN_ATTACHMENT';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const TOGGLE_SAVE_INQUIRY = 'TOGGLE_SAVE_INQUIRY';
export const TOGGLE_ADD_INQUIRY = 'TOGGLE_ADD_INQUIRY';
export const TOGGLE_AMENDMENTS_LIST = 'TOGGLE_AMENDMENTS_LIST';
export const OPEN_NOTIFICATION_AMENDMENT_LIST = 'OPEN_NOTIFICATION_AMENDMENT_LIST';
export const RELOAD = 'RELOAD';
export const OPEN_TRANSACTION = 'OPEN_TRANSACTION';
export const OPEN_EMAIL = 'OPEN_EMAIL';
export const OPEN_INQUIRY_REVIEW = 'OPEN_INQUIRY_REVIEW';
export const OPEN_NOTIFICATION_ATTACHMENT_LIST = 'OPEN_NOTIFICATION_ATTACHMENT_LIST';
export const OPEN_NOTIFICATION_SUBMIT_ANSWER = 'OPEN_NOTIFICATION_SUBMIT_ANSWER';
export const OPEN_NOTIFICATION_DELETE_REPLY = 'OPEN_NOTIFICATION_DELETE_REPLY';
export const OPEN_NOTIFICATION_DELETE_AMENDMENT = 'OPEN_NOTIFICATION_DELETE_AMENDMENT';
export const TOGGLE_OPEN_BL_WARNING = 'TOGGLE_OPEN_BL_WARNING';
export const ENABLE_SAVE_INQUIRIES = 'ENABLE_SAVE_INQUIRIES';
export const OPEN_CONFIRM_POPUP = 'OPEN_CONFIRM_POPUP';
export const CONFIRM_POPUP_CLICK = 'CONFIRM_POPUP_CLICK';
export const OPEN_CREATE_AMENDMENT = 'OPEN_CREATE_AMENDMENT';
export const OPEN_NOTIFICATION_INQUIRY_LIST = 'OPEN_NOTIFICATION_INQUIRY_LIST'
export const RELOAD_INQ = 'RELOAD_INQ';

export function setFullscreen(state) {
  return {
    type: SET_FULLSCREEN,
    state
  };
}

export function toggleCreateInquiry(state) {
  return {
    type: OPEN_CREATE_INQUIRY,
    state
  };
}

export function toggleAllInquiry(state) {
  return {
    type: OPEN_ALL_INQUIRY,
    state
  };
}

export function toggleInquiry(state) {
  return {
    type: OPEN_INQUIRY,
    state
  };
}

export function toggleSaveInquiry(state) {
  return {
    type: TOGGLE_SAVE_INQUIRY,
    state
  };
}

export function toggleAmendmentsList(state) {
  return {
    type: TOGGLE_AMENDMENTS_LIST,
    state
  };
}

export function toggleAddInquiry(state) {
  return {
    type: TOGGLE_ADD_INQUIRY,
    state
  };
}

export function toggleAttachment(state) {
  return {
    type: OPEN_ATTACHMENT,
    state
  };
}

export function toggleReload() {
  return {
    type: RELOAD
  };
}

export function toggleReloadInq() {
  return {
    type: RELOAD_INQ
  };
}

export function openTrans() {
  return {
    type: OPEN_TRANSACTION
  };
}

export function toggleOpenEmail(state) {
  return {
    type: OPEN_EMAIL,
    state
  };
}

export function toggleOpenInquiryReview(state) {
  return {
    type: OPEN_INQUIRY_REVIEW,
    state
  };
}

export function toggleOpenNotificationAttachmentList(state) {
  return {
    type: OPEN_NOTIFICATION_ATTACHMENT_LIST,
    state
  };
}

export function toggleOpenNotificationInquiryList(state) {
  return {
    type: OPEN_NOTIFICATION_INQUIRY_LIST,
    state
  };
}

export function toggleOpenNotificationAmendmentList(state) {
  return {
    type: OPEN_NOTIFICATION_AMENDMENT_LIST,
    state
  };
}

export function toggleOpenNotificationSubmitAnswer(state) {
  return {
    type: OPEN_NOTIFICATION_SUBMIT_ANSWER,
    state
  };
}

export function toggleOpenNotificationDeleteReply(state) {
  return {
    type: OPEN_NOTIFICATION_DELETE_REPLY,
    state
  };
}

export function toggleOpenNotificationDeleteAmendment(state) {
  return {
    type: OPEN_NOTIFICATION_DELETE_AMENDMENT,
    state
  };
}

export function toggleOpenBLWarning(state) {
  return {
    type: TOGGLE_OPEN_BL_WARNING,
    state
  };
}

export function setEnableSaveInquiriesList(state) {
  return {
    type: ENABLE_SAVE_INQUIRIES,
    state
  };
}

export function openConfirmPopup(state) {
  return {
    type: OPEN_CONFIRM_POPUP,
    state
  };
}

export function confirmPopupClick(state) {
  return {
    type: CONFIRM_POPUP_CLICK,
    state
  };
}

export function toggleCreateAmendment(state) {
  return {
    type: OPEN_CREATE_AMENDMENT,
    state
  };
}