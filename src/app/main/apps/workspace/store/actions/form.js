export const MINIMIZE = 'MINIMIZE';
export const SET_FULLSCREEN = 'SET_FULLSCREEN';
export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ATTACHMENT = 'OPEN_ATTACHMENT';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const TOGGLE_SAVE_INQUIRY = 'TOGGLE_SAVE_INQUIRY';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';
export const RELOAD = 'RELOAD';
export const OPEN_TRANSACTION = 'OPEN_TRANSACTION';
export const OPEN_EMAIL = 'OPEN_EMAIL';

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