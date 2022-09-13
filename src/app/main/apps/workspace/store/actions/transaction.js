import { createBlTrans, getMyBLTrans, getInqsTrans, restoreBLTransAPI } from 'app/services/transaction';

import { saveField } from './inquiry'

export const CREATE_TRANS_NONE = 'CREATE_TRANS_NONE';
export const CREATE_TRANS_LOADING = 'CREATE_TRANS_LOADING';
export const CREATE_TRANS_ERROR = 'CREATE_TRANS_ERROR';
export const CREATE_TRANS_SUCCESS = 'CREATE_TRANS_SUCCESS';
export const CREATE_TRANS_STATUS = 'CREATE_TRANS_SUCCESS';

export const GET_BL_TRANS_ERROR = 'GET_BL_TRANS_ERROR';
export const GET_BL_TRANS_SUCCESS = 'GET_BL_TRANS_SUCCESS';

export const SELECTED_BL_TRANS = 'SELECTED_BL_TRANS';

export const RESTORE_BL_TRANS_NONE = 'RESTORE_BL_TRANS_NONE';
export const RESTORE_BL_TRANS_ERROR = 'RESTORE_BL_TRANS_ERROR';
export const RESTORE_BL_TRANS_LOADING = 'RESTORE_BL_TRANS_LOADING';
export const RESTORE_BL_TRANS_SUCCESS = 'RESTORE_BL_TRANS_SUCCESS';

export const BlTrans = (mybl, content) => async (dispatch) => {
  dispatch({ type: CREATE_TRANS_LOADING });
  createBlTrans(mybl, content)
    .then((res) => {
      if (res.status === 200) {
        return dispatch({
          type: CREATE_TRANS_SUCCESS,
          payload: res.data
        });
      } else {
        return dispatch({
          type: CREATE_TRANS_ERROR,
          payload: res
        });
      }
    })
    .catch((error) => {
      return dispatch({
        type: CREATE_TRANS_ERROR,
        payload: error
      });
    });
};

export const getInqTrans = (id) => async (dispatch) => {
  getInqsTrans(id)
    .then((res) => {
      const field_list = res.data.map(e => e.field);
      dispatch(saveField(field_list));
    })
    .catch((e) => {
      console.error(e)
    });
};

export const getBlTrans = (mybl) => async (dispatch) => {
  getMyBLTrans(mybl)
    .then((res) => {
      if (res.status === 200) {
        return dispatch({
          type: GET_BL_TRANS_SUCCESS,
          blTrans: res.data
        });
      } else {
        return dispatch({
          type: GET_BL_TRANS_ERROR,
          payload: res
        });
      }
    })
    .catch((error) => {
      return dispatch({
        type: GET_BL_TRANS_ERROR,
        payload: error
      });
    });
};

export const restoreBLTrans = (mybl, transId) => async (dispatch) => {
  restoreBLTransAPI(mybl, transId)
    .then((res) => {
      if (res.status === 200) {
        return dispatch({
          type: RESTORE_BL_TRANS_SUCCESS,
        });
      } else {
        return dispatch({
          type: RESTORE_BL_TRANS_ERROR,
          payload: res
        });
      }
    })
    .catch((error) => {
      return dispatch({
        type: RESTORE_BL_TRANS_ERROR,
        payload: error
      });
    });
};

export function setStatusTransaction(state) {
  return {
    type: CREATE_TRANS_STATUS,
    state: state
  };
}

export function setBlTransSelected(state) {
  return {
    type: SELECTED_BL_TRANS,
    state: state
  };
}
