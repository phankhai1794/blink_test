export const SAVE_INQUIRY = 'SAVE_INQUIRY';
export const EDIT_INQUIRY = 'EDIT_INQUIRY';
export const SAVE_FIELD = 'SAVE_FIELD';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_QUESTION1 = 'ADD_QUESTION1';
export const SET_ORIGINAL_INQUIRY = 'SET_ORIGINAL_INQUIRY';
export const REMOVE_SELECTED_OPTION = 'REMOVE_SELECTED_OPTION';
export const DISPLAY_COMMENT = 'DISPLAY_COMMENT';
export const SET_MYBL = 'SET_MYBL';
export const SAVE_METADATA = 'SAVE_METADATA';
export const VALIDATE = 'VALIDATE';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_QUESTION = 'SET_QUESTION';
export const SET_REPLY = 'SET_REPLY';
export const SET_EDIT = 'SET_EDIT';
export const SET_EDIT_INQUIRY = 'SET_EDIT_INQUIRY';
export const SET_UPLOAD_FILE = 'SET_UPLOAD_FILE';
export const SET_ONE_INQUIRY = 'SET_ONE_INQUIRY';
export const SET_LIST_MINIMIZE_INQUIRY = 'SET_LIST_MINIMIZE_INQUIRY';
export const SET_LIST_MINIMIZE = 'SET_LIST_MINIMIZE';

export function saveInquiry() {
  return {
    type: SAVE_INQUIRY
  };
}

export function editInquiry(question) {
  return {
    type: EDIT_INQUIRY,
    state: question
  };
}

export function saveField(state) {
  return {
    type: SAVE_FIELD,
    state: state
  };
}

export function addQuestion() {
  return {
    type: ADD_QUESTION
  };
}

export function addQuestion1() {
  return {
    type: ADD_QUESTION1
  };
}

export function setOriginalInquiry(state) {
  return {
    type: SET_ORIGINAL_INQUIRY,
    state: state
  };
}

export function removeSelectedOption(state) {
  return {
    type: REMOVE_SELECTED_OPTION,
    state: state
  };
}

export function setDisplayComment(state) {
  return {
    type: DISPLAY_COMMENT,
    state: state
  };
}

export function setMyBL(state) {
  return {
    type: SET_MYBL,
    state: state
  };
}

export function saveMetadata(state) {
  return {
    type: SAVE_METADATA,
    state: state
  };
}

export function validate(state) {
  return {
    type: VALIDATE,
    state: state
  };
}

export function setField(state) {
  return {
    type: SET_CURRENT_FIELD,
    state: state
  };
}

export function setQuestion(question) {
  return {
    type: SET_QUESTION,
    state: question
  };
}

export function setReply(question) {
  return {
    type: SET_REPLY,
    state: question
  };
}

export function setEdit(state) {
  return {
    type: SET_EDIT,
    state: state
  };
}

export function setEditInq(state) {
  return {
    type: SET_EDIT_INQUIRY,
    state: state
  };
}

export function setOneInq(state) {
  return {
    type: SET_ONE_INQUIRY,
    state: state
  };
}

export function setListInqMinimize(state) {
  return {
    type: SET_LIST_MINIMIZE_INQUIRY,
    state: state
  };
}

export function setListMinimize(state) {
  return {
    type: SET_LIST_MINIMIZE,
    state: state
  };
}
