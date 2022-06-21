import { getMetadata } from 'app/services/inquiryService';
import { getBlInfo } from 'app/services/myBLService';
import { filterMetadata } from '@shared';

export const SET_METADATA = 'SAVE_METADATA';
export const SET_BL = 'SET_BL';
export const SET_CONTENT = 'SET_CONTENT';

export const loadMetadata = () => (dispatch) => {
  getMetadata()
    .then((res) => {
      const data = filterMetadata(res);
      dispatch(setMetadata(data));
    })
    .catch((err) => console.error(err));
};

export const loadContent = () => (dispatch) => {
  const bl = window.location.pathname.split('/')[3];
  if (bl) {
    dispatch(setBL(bl));
    getBlInfo(bl)
      .then((res) => {
        dispatch(setContent(res.myBL.content));
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
