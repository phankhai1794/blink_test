export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_USER_PROCESSING_BY = 'SET_USER_PROCESSING_BY';

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