export const SET_PROCESS = 'SET_PROCESS';
export const LOAD_DRAFT_CONTENT = 'LOAD_DRAFT_CONTENT';
export const OPEN_SEND_NOTIFICATION = 'OPEN_SEND_NOTIFICATION';


export function setProcess(state) {
  return {
    type: SET_PROCESS,
    state
  };
}

export function loadDraftContent(state) {
  return {
    type: LOAD_DRAFT_CONTENT,
    state
  };
}

export function toggleSendNotification(state) {
  return {
    type: OPEN_SEND_NOTIFICATION,
    state: state
  };
}