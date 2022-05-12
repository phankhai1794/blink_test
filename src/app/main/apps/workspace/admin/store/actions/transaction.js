import { createBlTrans } from 'app/services/transaction';

export const TRANSACTION_NONE = 'TRANSACTION_NONE';
export const TRANSACTION_LOADING = 'TRANSACTION_LOADING';
export const TRANSACTION_ERROR = 'TRANSACTION_ERROR';
export const TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS';
export const TRANSACTION_STATUS = 'TRANSACTION_SUCCESS';

export const BlTrans =
  ( mybl, content ) =>
  async (dispatch) => {
    createBlTrans(mybl, content)
      .then((res) => {
        if (res.status === 200) {
          return dispatch({
            type: TRANSACTION_SUCCESS
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

export function setStatusTransaction(state) {
    return {
        type: TRANSACTION_STATUS,
        state: state
    };
}