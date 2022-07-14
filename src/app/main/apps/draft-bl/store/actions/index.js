import { getMetadata } from 'app/services/inquiryService';
import { getBlInfo, updateBL } from 'app/services/myBLService';
import { filterMetadata, draftConfirm } from '@shared';

export const SET_METADATA = 'SAVE_METADATA';
export const SET_BL = 'SET_BL';
export const SET_CONTENT = 'SET_CONTENT';
export const SET_MY_BL_STATE = 'SET_MY_BL_STATE';
export const OPEN_EDIT_DRAFT_BL = 'OPEN_EDIT_DRAFT_BL';
export const SET_CURRENT_BL_FIELD = 'SET_CURRENT_BL_FIELD';
export const SET_NEW_CONTENT = 'SET_NEW_CONTENT';
export const SET_NEW_CONTENT_CHANGED = 'SET_NEW_CONTENT_CHANGED';

export const loadMetadata = () => (dispatch) => {
  getMetadata()
    .then((res) => {
      const data = filterMetadata(res);
      dispatch(setMetadata(data));
    })
    .catch((err) => console.error(err));
};

export const loadContent = (bl) => (dispatch) => {
  if (bl) {
    getBlInfo(bl)
      .then((res) => {
        dispatch(setBL({ id: bl, bkgNo: res.myBL.bkgNo }));
        dispatch(setMyblState(res.myBL.state));
        dispatch(setContent(res.myBL.content));
        dispatch(setNewContent(res.myBL.content));
      })
      .catch((err) => console.error(err));
  }
};

export function setMetadata(state) {
  return {
    type: SET_METADATA,
    state: state
  };
}

export function setBL(state) {
  return {
    type: SET_BL,
    state: state
  };
}

export function setContent(state) {
  return {
    type: SET_CONTENT,
    state: state
  };
}

export function setMyblState(state) {
  return {
    type: SET_MY_BL_STATE,
    state: state
  };
}

export function toggleDraftBLEdit(state) {
  return {
    type: OPEN_EDIT_DRAFT_BL,
    state: state
  };
}

export const setConfirmDraftBL = () => (dispatch) => {
  const bl = window.location.pathname.split('/')[3];
  updateBL(bl, { state: draftConfirm })
    .then(() => dispatch(setMyblState(draftConfirm)))
    .catch((err) => console.error(err));
};

export function setCurrentBLField(state) {
  return {
    type: SET_CURRENT_BL_FIELD,
    state: state
  };
}

export function setNewContent(state) {
  return {
    type: SET_NEW_CONTENT,
    state: state
  };
}

export function setNewContentChanged(state) {
  return {
    type: SET_NEW_CONTENT_CHANGED,
    state: state
  };
}
