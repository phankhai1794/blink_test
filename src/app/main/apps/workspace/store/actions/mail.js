import { sendmail } from 'app/services/mailService';

export const SENDMAIL_NONE = 'SENDMAIL_NONE';
export const SENDMAIL_LOADING = 'SENDMAIL_LOADING';
export const SENDMAIL_ERROR = 'SENDMAIL_ERROR';
export const SENDMAIL_SUCCESS = 'SENDMAIL_SUCCESS';

export const sendMail =
  ({ myblId, toCustomer, toOnshore, from, subject, content }) =>
    async (dispatch) => {
      dispatch({ type: SENDMAIL_LOADING });
      sendmail(myblId, from, toCustomer, toOnshore, subject, content)
        .then((res) => {
          if (res.status === 200) {
            return dispatch({
              type: SENDMAIL_SUCCESS
            });
          } else {
            return dispatch({
              type: SENDMAIL_ERROR,
              payload: res
            });
          }
        })
        .catch((error) => {
          return dispatch({
            type: SENDMAIL_ERROR,
            payload: error
          });
        });
    };
