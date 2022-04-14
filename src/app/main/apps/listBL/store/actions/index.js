export const SET_MYBLS = 'SET_MYBLS';
export const SAVE_USER = 'SAVE_USER';
export const SAVE_METADATA = 'SAVE_METADATA';
export const DISPLAY_SUCCESS = 'DISPLAY_SUCCESS';
export const DISPLAY_FAIL = 'DISPLAY_FAIL';
export const RELOAD = 'RELOAD';

export function setMyBLs(state) {
  return {
    type: SET_MYBLS,
    state: state
  };
}
export function saveUser(state) {
  return {
    type: SAVE_USER,
    state: state
  };
}
export function saveMetadata(state) {
  return {
    type: SAVE_METADATA,
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
