export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_USER_PROCESSING_BY = 'SET_USER_PROCESSING_BY';
export const IS_SYNCING_INQUIRY = 'IS_SYNCING_INQUIRY';
export const IS_SYNCING_COMMENT = 'IS_SYNCING_COMMENT';

export function setUser(state) {
  return {
    type: SET_USER,
    state
  };
}

export function removeUser() {
  return {
    type: REMOVE_USER
  };
}

export function userProcessingBy(state) {
  return {
    type: SET_USER_PROCESSING_BY,
    state
  };
}

export function isSyncingInquiry(state) {
  return {
    type: IS_SYNCING_INQUIRY,
    state
  };
}

export function isSyncingComment(state) {
  return {
    type: IS_SYNCING_COMMENT,
    state
  };
}