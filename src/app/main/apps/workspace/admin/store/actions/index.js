import { filterMetadata } from '@shared';
import { getInquiryById, getMetadata } from 'app/services/inquiryService';
import { createBL } from 'app/services/myBLService';

export const SET_MYBL = 'SET_MYBL';
export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_QUESTION = 'SET_QUESTION';
export const SET_REPLY = 'SET_REPLY';
export const SET_EDIT = 'SET_EDIT';
export const SET_EDIT_INQUIRY = 'SET_EDIT_INQUIRY';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_QUESTION1 = 'ADD_QUESTION1';
export const EDIT_INQUIRY = 'EDIT_INQUIRY';
export const SAVE_FIELD = 'SAVE_FIELD';
export const RELOAD = 'RELOAD';
export const SAVE_INQUIRY = 'SAVE_INQUIRY';
export const DISPLAY_SUCCESS = 'DISPLAY_SUCCESS';
export const DISPLAY_FAIL = 'DISPLAY_FAIL';
export const SAVE_METADATA = 'SAVE_METADATA';
export const VALIDATE = 'VALIDATE';
export const REMOVE_SELECTED_OPTION = 'REMOVE_SELECTED_OPTION';
export const SET_ORIGINAL_INQUIRY = 'SET_ORIGINAL_INQUIRY';
export const DISPLAY_COMMENT = 'DISPLAY_COMMENT';
// export * from './mail.actions';

export const initBL = (bkgNo) => async (dispatch) => {
  createBL(bkgNo)
    .then((res) => {
      if (res) dispatch(setMyBL(res.myBL));
    })
    .catch((err) => console.log(err));
};

export const loadMetadata = () => async (dispatch) => {
  getMetadata().then((res) => {
    const data = filterMetadata(res);
    dispatch(saveMetadata(data));
  }).catch((err) => console.log(err));
};


export const loadInquiry = (myBL_Id) => async (dispatch) => {
  getInquiryById(myBL_Id).then((res) => {
    const field_list = res.map(e => e.field);
    dispatch(saveField(field_list));
    dispatch(editInquiry(res));
    dispatch(setOriginalInquiry(JSON.parse(JSON.stringify(res))));
  }).catch((err) => console.log(err));
};

export function setMyBL(state) {
  return {
    type: SET_MYBL,
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

export function toggleReload() {
  return {
    type: RELOAD
  };
}

export function toggleInquiry(state) {
  return {
    type: OPEN_INQUIRY,
    state: state
  };
}

export function setAnchor(state) {
  return {
    type: SET_ANCHOR_EL,
    state: state
  };
}

export function setField(state) {
  return {
    type: SET_CURRENT_FIELD,
    state: state
  };
}

export function setDisplayComment(state) {
  return {
    type: DISPLAY_COMMENT,
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

export function editInquiry(question) {
  return {
    type: EDIT_INQUIRY,
    state: question
  };
}

export function saveInquiry() {
  return {
    type: SAVE_INQUIRY
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

export function saveField(state) {
  return {
    type: SAVE_FIELD,
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

export function removeSelectedOption(state) {
  return {
    type: REMOVE_SELECTED_OPTION,
    state: state
  };
}

export function setOriginalInquiry(state) {
  return {
    type: SET_ORIGINAL_INQUIRY,
    state: state
  };
}
