import { getAllBl } from 'app/services/myBLService';

export const SET_MYBLS_SUCCESS = 'SET_MYBLS_SUCCESS';
export const SET_MYBLS_ERROR = 'SET_MYBLS_ERROR';

export const loadListMyBL = (type) => async (dispatch) => {
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
      const { message } = err.response.data.error;
      return dispatch({
        type: SET_MYBLS_ERROR,
        state: false,
        message
      });
    });
};
