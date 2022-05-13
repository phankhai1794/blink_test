import { createBlTrans, getMyBLTrans } from 'app/services/transaction';

export const TRANSACTION_NONE = 'TRANSACTION_NONE';
export const TRANSACTION_LOADING = 'TRANSACTION_LOADING';
export const TRANSACTION_ERROR = 'TRANSACTION_ERROR';
export const TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS';
export const TRANSACTION_STATUS = 'TRANSACTION_SUCCESS';

export const GET_BL_TRANS_ERROR = 'GET_BL_TRANS_ERROR';
export const GET_BL_TRANS_SUCCESS = 'GET_BL_TRANS_SUCCESS';


export const BlTrans =
  ( mybl, content ) =>
  async (dispatch) => {
    createBlTrans(mybl, content)
      .then((res) => {
        if (res.status === 200) {
          return dispatch({
            type: TRANSACTION_SUCCESS,
            payload: res.data,
          });
        } else {
          return dispatch({
            type: TRANSACTION_ERROR,
            payload: res
          });
        }
      })
      .catch((error) => {
        return dispatch({
          type: TRANSACTION_ERROR,
          payload: error
        });
      });
      
     
  };

  export const getBlTrans =
  ( mybl ) =>
  async (dispatch) => {
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
}

export function setStatusTransaction(state) {
    return {
        type: TRANSACTION_STATUS,
        state: state
    };
}