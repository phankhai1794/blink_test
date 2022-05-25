export const MINIMIZE = 'MINIMIZE';
export const SET_FULLSCREEN = 'SET_FULLSCREEN';
export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ATTACHMENT = 'OPEN_ATTACHMENT';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';
export const DISPLAY_SUCCESS = 'DISPLAY_SUCCESS';
export const DISPLAY_FAIL = 'DISPLAY_FAIL';
export const RELOAD = 'RELOAD';
export const OPEN_TRANSACTION = 'OPEN_TRANSACTION';

export function minimize(state) {
  return {
    type: MINIMIZE,
    state: state
  };
}

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

export function toggleAllInquiry() {
  return {
    type: OPEN_ALL_INQUIRY
  };
}

export function toggleInquiry(state) {
  return {
    type: OPEN_INQUIRY,
    state: state
  };
}

export function toggleAttachment(state) {
  return {
    type: OPEN_ATTACHMENT,
    state: state
  };
}

export function setAnchor(state) {
  return {
    type: SET_ANCHOR_EL,
    state: state
  };
}

export function displaySuccess(state) {
  return {
    type: DISPLAY_SUCCESS,
    state: state
  };
}

export function displayFail(state, message) {
  return {
    type: DISPLAY_FAIL,
    state: state,
    message: message
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
