import { getMetadata } from 'app/services/inquiryService';
import { getFieldContent } from 'app/services/draftblService';
import { getBlInfo, updateBL } from 'app/services/myBLService';
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
      let { data } = res;
      const arr = [];
      while (data.length) {
        const first = data[0];
        const filter = data.filter(d => d.field === first.field).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        data = data.filter(d => d.field !== first.field);
        arr.push(filter[0]);
      }
      dispatch(setDraftContent(arr));
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
  const bl = window.location.pathname.split('/')[3];
  updateBL(bl, { state: draftConfirm })
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
