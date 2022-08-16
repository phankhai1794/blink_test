export const SET_FULLSCREEN = 'SET_FULLSCREEN';
export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ATTACHMENT = 'OPEN_ATTACHMENT';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const TOGGLE_SAVE_INQUIRY = 'TOGGLE_SAVE_INQUIRY';
export const TOGGLE_ADD_INQUIRY = 'TOGGLE_ADD_INQUIRY';
export const RELOAD = 'RELOAD';
export const OPEN_TRANSACTION = 'OPEN_TRANSACTION';
export const OPEN_EMAIL = 'OPEN_EMAIL';
export const OPEN_INQUIRY_REVIEW = 'OPEN_INQUIRY_REVIEW';
export const OPEN_NOTIFICATION_ATTACHMENT_LIST = 'OPEN_NOTIFICATION_ATTACHMENT_LIST';
export const OPEN_NOTIFICATION_SUBMIT_ANSWER = 'OPEN_NOTIFICATION_SUBMIT_ANSWER';
export const ENABLE_SAVE_INQUIRIES = 'ENABLE_SAVE_INQUIRIES';

export function setFullscreen(state) {
  return {
    type: SET_FULLSCREEN,
    state: state
  };
}

export function toggleCreateInquiry(state) {
  return {
    type: OPEN_CREATE_INQUIRY,
    state: state
  };
}

export function toggleAllInquiry(state) {
  return {
    type: OPEN_ALL_INQUIRY,
    state: state
  };
}

export function toggleInquiry(state) {
  return {
    type: OPEN_INQUIRY,
    state: state
  };
}

export function toggleSaveInquiry(state) {
  return {
    type: TOGGLE_SAVE_INQUIRY,
    state: state
  };
}

export function toggleAddInquiry(state) {
  return {
    type: TOGGLE_ADD_INQUIRY,
    state: state
  };
}

export function toggleAttachment(state) {
  return {
    type: OPEN_ATTACHMENT,
    state: state
  };
}


export function toggleReload() {
  return {
    type: RELOAD
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
    state: state
  };
}

export function toggleOpenInquiryReview(state) {
  return {
    type: OPEN_INQUIRY_REVIEW,
    state: state
  };
}

export function toggleOpenNotificationAttachmentList(state) {
  return {
    type: OPEN_NOTIFICATION_ATTACHMENT_LIST,
    state: state
  };
}

export function toggleOpenNotificationSubmitAnswer(state) {
  return {
    type: OPEN_NOTIFICATION_SUBMIT_ANSWER,
    state: state
  };
}

export function setEnableSaveInquiriesList(state) {
  return {
    type: ENABLE_SAVE_INQUIRIES,
    state: state
  };
}