import * as Actions from 'app/store/actions';

export const handleError = (dispatch, err) => {
  console.error(err);
  let status, message;
  if ( err.response ) {
    status = err.response.data.error.status;
    message = err.response.data.error.message;
  }
  if (!message) message = err.message || "Your token has expired";
  if (status === 401) {
    dispatch(Actions.checkAuthToken(false));
    dispatch(Actions.checkAllow(false));
  }
  dispatch(Actions.showMessage({ message, variant: 'error' }));
  return [status, message];
};
