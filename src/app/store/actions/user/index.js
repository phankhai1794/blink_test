export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

export function setUser(state) {
  return {
    type: SET_USER,
    state: state
  };
}

export function removeUser() {
  return {
    type: REMOVE_USER
  };
}
