import { sendmail, getSuggestMail } from 'app/services/mailService';
import { loadComment } from 'app/services/inquiryService';
import axios from 'axios';

import { loadInquiry } from '../actions';
import * as InquiryActions from '../actions/inquiry';

export const SENDMAIL_NONE = 'SENDMAIL_NONE';
export const SENDMAIL_LOADING = 'SENDMAIL_LOADING';
export const SENDMAIL_ERROR = 'SENDMAIL_ERROR';
export const SENDMAIL_SUCCESS = 'SENDMAIL_SUCCESS';

export const SUGGEST_MAIL_NONE = 'SUGGEST_MAIL_NONE';
export const SUGGEST_MAIL_ERROR = 'SUGGEST_MAIL_ERROR';
export const SUGGEST_MAIL_SUCCESS = 'SUGGEST_MAIL_SUCCESS';

export const VALIDATE_MAIL = 'VALIDATE_MAIL';
export const SET_TAGS = 'SET_TAGS'

export const sendMail =
  ({ myblId, from, toCustomer, toCustomerCc, toCustomerBcc, toOnshore, toOnshoreCc, toOnshoreBcc, subject, content, inquiries }) =>
    async (dispatch) => {
      const replyInqs = [];
      const inquiriesPendingProcess = inquiries.filter(op => op.process === 'pending');
      const listComment = await axios.all(inquiriesPendingProcess.map(q => loadComment(q.id)));
      listComment.map((comment, index) => comment.length && replyInqs.push(inquiries[index].id));
      dispatch({ type: SENDMAIL_LOADING });
      sendmail(myblId, from, toCustomer, toCustomerCc, toCustomerBcc, toOnshore, toOnshoreCc, toOnshoreBcc, subject, content, replyInqs)
        .then((res) => {
          if (res.status === 200) {
            dispatch(InquiryActions.checkSend(false));
            // dispatch(loadInquiry(myblId));
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

export const suggestMail = (keyword) => async (dispatch) => {
  getSuggestMail(keyword)
    .then((res) => {
      if (res.status === 200) {
        return dispatch({
          type: SUGGEST_MAIL_SUCCESS,
          mails: res.data
        });
      }
    })
    .catch((error) => {
      return dispatch({
        type: SUGGEST_MAIL_ERROR,
        payload: error
      });
    });
};

export function validateMail(state) {
  return {
    type: VALIDATE_MAIL,
    state: state
  };
}


export function setTags(state) {
  return {
    type: SET_TAGS,
    state: state
  };
}