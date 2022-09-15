import { getMetadata } from 'app/services/inquiryService';
import { getFieldContent, confirmDraftBl } from 'app/services/draftblService';
import { getBlInfo } from 'app/services/myBLService';
import { filterMetadata, draftConfirm } from '@shared';

export const SET_METADATA = 'SAVE_METADATA';
export const SET_BL = 'SET_BL';
export const SET_ORG_CONTENT = 'SET_ORG_CONTENT';
export const SET_DRAFT_CONTENT = 'SET_DRAFT_CONTENT';
export const OPEN_POPUP_EDIT = 'OPEN_POPUP_EDIT';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_CONTENT = 'SET_CONTENT';
export const SET_SEND_DRAFT_BL = 'SET_SEND_DRAFT_BL';
export const OPEN_SEND_NOTIFICATION = 'OPEN_SEND_NOTIFICATION';
export const RELOAD = 'RELOAD';
export const SET_EDIT_INQUIRY = 'SET_EDIT_INQUIRY'

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
        dispatch(setBL({ id: bl, bkgNo: res.myBL.bkgNo, state: res.myBL.state }));
        dispatch(setOrgContent(res.myBL.content));
        dispatch(setContent(res.myBL.content));
      })
      .catch((err) => console.error(err));
  }
};

export const loadDraftContent = (bl) => (dispatch) => {
  getFieldContent(bl)
    .then((res) => {
      const data = res.map(({ id, state, content, field, createdAt, creator, mediaFile }) => {
        return {
          id,
          state,
          field,
          createdAt,
          creator,
          content: { content, mediaFile }
        }
      });
      dispatch(setDraftContent(data));
    })
    .catch((err) => console.error(err));
};

export function setMetadata(state) {
  return {
    type: SET_METADATA,
    state
  };
}

export function setBL(state) {
  return {
    type: SET_BL,
    state
  };
}

export function setOrgContent(state) {
  return {
    type: SET_ORG_CONTENT,
    state
  };
}

export function setDraftContent(state) {
  return {
    type: SET_DRAFT_CONTENT,
    state
  };
}

export function toggleDraftBLEdit(state) {
  return {
    type: OPEN_POPUP_EDIT,
    state
  };
}

export const setConfirmDraftBL = () => (dispatch) => {
  const bl = new URLSearchParams(window.location.search).get('bl');
  confirmDraftBl(bl)
    .then(() => dispatch(setBL({ state: draftConfirm })))
    .catch((err) => console.error(err));
};

export function setCurrentField(state) {
  return {
    type: SET_CURRENT_FIELD,
    state
  };
}

export function setContent(state) {
  return {
    type: SET_CONTENT,
    state
  };
}

export function toggleReload() {
  return {
    type: RELOAD
  };
}

export function toggleSendDraftBl() {
  return {
    type: SET_SEND_DRAFT_BL
  };
}

export function toggleSendNotification(state) {
  return {
    type: OPEN_SEND_NOTIFICATION,
    state: state
  };
}

export function toggleEditInquiry(state) {
  return {
    type: SET_EDIT_INQUIRY,
    state
  };
}