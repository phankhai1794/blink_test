export const SAVE_INQUIRY = 'SAVE_INQUIRY';
export const EDIT_INQUIRY = 'EDIT_INQUIRY';
export const SAVE_FIELD = 'SAVE_FIELD';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_AMENDMENT = 'ADD_AMENDMENT';
export const SET_INQUIRY = 'SET_INQUIRY';
export const REMOVE_SELECTED_OPTION = 'REMOVE_SELECTED_OPTION';
export const DISPLAY_COMMENT = 'DISPLAY_COMMENT';
export const SET_MYBL = 'SET_MYBL';
export const SAVE_METADATA = 'SAVE_METADATA';
export const SET_ORG_CONTENT = 'SET_ORG_CONTENT';
export const SET_CONTENT = 'SET_CONTENT';
export const VALIDATE = 'VALIDATE';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_QUESTION = 'SET_QUESTION';
export const SET_REPLY = 'SET_REPLY';
export const SET_EDIT_INQUIRY = 'SET_EDIT_INQUIRY';
export const SET_UPLOAD_FILE = 'SET_UPLOAD_FILE';
export const SET_ONE_INQUIRY = 'SET_ONE_INQUIRY';
export const SET_LIST_MINIMIZE_INQUIRY = 'SET_LIST_MINIMIZE_INQUIRY';
export const SET_LIST_MINIMIZE = 'SET_LIST_MINIMIZE';
export const SET_LIST_ATTACHMENT = 'SET_LIST_ATTACHMENT';
export const VALIDATE_ATTACHMENT = 'VALIDATE_ATTACHMENT';
export const SET_LAST_FIELD = 'SET_LAST_FIELD';
export const SET_OPENED_INQ_FORM = 'SET_OPENED_INQ_FORM';
export const SET_BACKGROUND_ATTACHMENT_LIST = 'SET_BACKGROUND_ATTACHMENT_LIST';
export const CHECK_SUBMIT = 'CHECK_SUBMIT';
export const CHECK_SEND = 'CHECK_SEND';
export const SET_LIST_COMMENT_DRAFT = 'SET_LIST_COMMENT_DRAFT';
export const SET_NEW_AMENDMENT = 'SET_NEW_AMENDMENT';
export const SET_CONTENT_BL = 'SET_CONTENT_BL';

export function saveInquiry() {
  return {
    type: SAVE_INQUIRY
  };
}

export function saveField(state) {
  return {
    type: SAVE_FIELD,
    state
  };
}

export function addQuestion(state) {
  return {
    type: ADD_QUESTION,
    state
  };
}

export function addAmendment(state = undefined) {
  return {
    type: ADD_AMENDMENT,
    state
  };
}

export function setInquiries(state) {
  return {
    type: SET_INQUIRY,
    state
  };
}

export function removeSelectedOption(state) {
  return {
    type: REMOVE_SELECTED_OPTION,
    state
  };
}

export function setDisplayComment(state) {
  return {
    type: DISPLAY_COMMENT,
    state
  };
}

export function setMyBL(state) {
  return {
    type: SET_MYBL,
    state
  };
}

export function setContentBL(state) {
  return {
    type: SET_CONTENT_BL,
    state
  };
}

export function saveMetadata(state) {
  return {
    type: SAVE_METADATA,
    state
  };
}

export function setOrgContent(state) {
  return {
    type: SET_ORG_CONTENT,
    state
  };
}

export function setContent(state) {
  return {
    type: SET_CONTENT,
    state
  };
}

export function validate(state) {
  return {
    type: VALIDATE,
    state
  };
}

export function setField(state) {
  return {
    type: SET_CURRENT_FIELD,
    state
  };
}

export function setQuestion(state) {
  return {
    type: SET_QUESTION,
    state
  };
}

export function setReply(state) {
  return {
    type: SET_REPLY,
    state
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

export function setListAttachment(state) {
  return {
    type: SET_LIST_ATTACHMENT,
    state: state
  };
}

export function validateAttachment(state) {
  return {
    type: VALIDATE_ATTACHMENT,
    state: state
  };
}

export function setLastField(state) {
  return {
    type: SET_LAST_FIELD,
    state: state
  };
}

export function setOpenedInqForm(state) {
  return {
    type: SET_OPENED_INQ_FORM,
    state: state
  };
}

export function setShowBackgroundAttachmentList(state) {
  return {
    type: SET_BACKGROUND_ATTACHMENT_LIST,
    state: state
  };
}

export function checkSubmit(state) {
  return {
    type: CHECK_SUBMIT,
    state: state
  };
}

export function checkSend(state) {
  return {
    type: CHECK_SEND,
    state: state
  };
}

export function setListCommentDraft(state) {
  return {
    type: SET_LIST_COMMENT_DRAFT,
    state: state
  };
}
export function setNewAmendment(state) {
  return {
    type: SET_NEW_AMENDMENT,
    state: state
  };
}

