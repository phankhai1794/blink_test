import { createBlTrans, getMyBLTrans } from 'app/services/transaction';

export const CREATE_TRANS_NONE = 'CREATE_TRANS_NONE';
export const CREATE_TRANS_LOADING = 'CREATE_TRANS_LOADING';
export const CREATE_TRANS_ERROR = 'CREATE_TRANS_ERROR';
export const CREATE_TRANS_SUCCESS = 'CREATE_TRANS_SUCCESS';
export const CREATE_TRANS_STATUS = 'CREATE_TRANS_SUCCESS';

export const GET_BL_TRANS_ERROR = 'GET_BL_TRANS_ERROR';
export const GET_BL_TRANS_SUCCESS = 'GET_BL_TRANS_SUCCESS';


export const BlTrans =
  ( mybl, content ) =>
  async (dispatch) => {
    createBlTrans(mybl, content)
      .then((res) => {
        if (res.status === 200) {
          return dispatch({
            type: CREATE_TRANS_SUCCESS,
            payload: res.data,
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
        type: CREATE_TRANS_STATUS,
        state: state
    };
}