export const SET_FULLSCREEN = 'SET_FULLSCREEN';
export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ATTACHMENT = 'OPEN_ATTACHMENT';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const TOGGLE_SAVE_INQUIRY = 'TOGGLE_SAVE_INQUIRY';
export const TOGGLE_ADD_INQUIRY = 'TOGGLE_ADD_INQUIRY';
export const TOGGLE_AMENDMENTS_LIST = 'TOGGLE_AMENDMENTS_LIST';
export const OPEN_NOTIFICATION_AMENDMENT_LIST = 'OPEN_NOTIFICATION_AMENDMENT_LIST';
export const TOGGLE_PREVIEW_SUBMIT_LIST = 'TOGGLE_PREVIEW_SUBMIT_LIST';
export const RELOAD = 'RELOAD';
export const OPEN_EMAIL = 'OPEN_EMAIL';
export const OPEN_INQUIRY_REVIEW = 'OPEN_INQUIRY_REVIEW';
export const OPEN_NOTIFICATION_ATTACHMENT_LIST = 'OPEN_NOTIFICATION_ATTACHMENT_LIST';
export const OPEN_NOTIFICATION_SUBMIT_ANSWER = 'OPEN_NOTIFICATION_SUBMIT_ANSWER';
export const OPEN_NOTIFICATION_DELETE_REPLY = 'OPEN_NOTIFICATION_DELETE_REPLY';
export const OPEN_NOTIFICATION_DELETE_AMENDMENT = 'OPEN_NOTIFICATION_DELETE_AMENDMENT';
export const OPEN_PREVIEW_FILES = 'OPEN_PREVIEW_FILES';
export const TOGGLE_OPEN_BL_WARNING = 'TOGGLE_OPEN_BL_WARNING';
export const OPEN_NOTIFICATION_PREVIEW_SUBMIT = 'OPEN_NOTIFICATION_PREVIEW_SUBMIT';
export const TOGGLE_OPEN_RELOAD_WARNING = 'TOGGLE_OPEN_RELOAD_WARNING';
export const ENABLE_SAVE_INQUIRIES = 'ENABLE_SAVE_INQUIRIES';
export const OPEN_CONFIRM_POPUP = 'OPEN_CONFIRM_POPUP';
export const CONFIRM_POPUP_CLICK = 'CONFIRM_POPUP_CLICK';
export const OPEN_CREATE_AMENDMENT = 'OPEN_CREATE_AMENDMENT';
export const OPEN_WARNING_CD_CM = 'OPEN_WARNING_CD_CM';
export const OPEN_NOTIFICATION_INQUIRY_LIST = 'OPEN_NOTIFICATION_INQUIRY_LIST'
export const INQUIRY_VIEWER_FOCUS = 'INQUIRY_VIEWER_FOCUS';
export const VALIDATE_INPUT = 'VALIDATE_INPUT';
export const INCREASE_LOADING = 'INCREASE_LOADING';
export const DECREASE_LOADING = 'DECREASE_LOADING';
export const RESET_LOADING = 'RESET_LOADING';
export const PROCESS_LOADING = 'PROCESS_LOADING';
export const OPEN_WARNING_UPLOAD_OPUS = 'OPEN_WARNING_UPLOAD_OPUS';
export const CURRENT_FILE_PREVIEW = 'CURRENT_FILE_PREVIEW';
export const EVENT_CLICK_CONT_NO = 'EVENT_CLICK_CONT_NO';
export const SET_DIRTY_RELOAD = 'SET_DIRTY_RELOAD';
export const SET_TAB = 'SET_TAB';

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

export function togglePreviewSubmitList(state) {
  return {
    type: TOGGLE_PREVIEW_SUBMIT_LIST,
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

export function inqViewerFocus(state) {
  return {
    type: INQUIRY_VIEWER_FOCUS,
    state
  };
}

export function eventClickContNo(state) {
  return {
    type: EVENT_CLICK_CONT_NO,
    state
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

export function toggleOpenNotificationPreviewSubmit(state) {
  return {
    type: OPEN_NOTIFICATION_PREVIEW_SUBMIT,
    state
  };
}

export function toggleOpenReloadWarning(state) {
  return {
    type: TOGGLE_OPEN_RELOAD_WARNING,
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

export function toggleWarningCDCM(state) {
  return {
    type: OPEN_WARNING_CD_CM,
    state
  };
}

export function validateInput(state) {
  return {
    type: VALIDATE_INPUT,
    state
  };
}

export function increaseLoading() {
  return {
    type: INCREASE_LOADING,
  }
}

export function decreaseLoading() {
  return {
    type: DECREASE_LOADING,
  }
}

export function isLoadingProcess(state) {
  return {
    type: PROCESS_LOADING,
    state
  }
}

export function resetLoading() {
  return {
    type: RESET_LOADING,
  }
}

export function toggleWarningUploadOpus(state) {
  return {
    type: OPEN_WARNING_UPLOAD_OPUS,
    state
  }
}

export function toggleOpenPreviewFiles(state) {
  return {
    type: OPEN_PREVIEW_FILES,
    state
  };
}

export function setCurrentFile(state) {
  return {
    type: CURRENT_FILE_PREVIEW,
    state
  };
}

export function setDirtyReload(state) {
  return {
    type: SET_DIRTY_RELOAD,
    state
  }
}

export function setTabs(state) {
  return {
    type: SET_TAB,
    state
  };
}