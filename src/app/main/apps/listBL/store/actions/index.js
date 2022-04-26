import { getAllBl } from 'app/services/myBLService';

export const PROCESSING = 'PROCESSING';
export const SET_MYBLS_SUCCESS = 'SET_MYBLS_SUCCESS';
export const SET_MYBLS_ERROR = 'SET_MYBLS_ERROR';

export const loadListMyBL = (type) => async (dispatch) => {
  dispatch({ type: PROCESSING });
  getAllBl(type)
    .then(({ myBLs: data }) => {
      if (data.length) {
        return dispatch({
          type: SET_MYBLS_SUCCESS,
          state: data
        });
      }
    })
    .catch((err) => {
      return dispatch({
        type: SET_MYBLS_ERROR,
        state: false,
        message: err
      });
    });
};
