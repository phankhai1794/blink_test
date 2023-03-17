import { sendmail, getSuggestMail } from 'app/services/mailService';
import { loadComment } from 'app/services/inquiryService';
import axios from 'axios';
import { PRE_CARRIAGE, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY } from '@shared/keyword';
import * as AppActions from 'app/main/apps/workspace/store/actions';

import * as InquiryActions from '../actions/inquiry';

export const SENDMAIL_NONE = 'SENDMAIL_NONE';
export const SENDMAIL_LOADING = 'SENDMAIL_LOADING';
export const SENDMAIL_ERROR = 'SENDMAIL_ERROR';
export const SENDMAIL_SUCCESS = 'SENDMAIL_SUCCESS';

export const SUGGEST_MAIL_NONE = 'SUGGEST_MAIL_NONE';
export const SUGGEST_MAIL_ERROR = 'SUGGEST_MAIL_ERROR';
export const SUGGEST_MAIL_SUCCESS = 'SUGGEST_MAIL_SUCCESS';

export const INPUT_MAIL = 'INPUT_MAIL';
export const SET_TAGS = 'SET_TAGS';

export const SET_CC = 'SET_CC';
export const SENDMAIL_SET_FORM = 'SENDMAIL_SET_FORM';


export const sendMail =
  ({ myblId, tab, bkgNo, inquiries, user, header, ...form }) =>
    async (dispatch) => {
      const replyInqs = [];
      const inquiriesPendingProcess = inquiries.filter(op => op.process === 'pending');
      const listComment = await axios.all(inquiriesPendingProcess.map(q => loadComment(q.id)));
      listComment.forEach((comment, index) => comment.length && inquiries[index].receiver[0] === tab && replyInqs.push(inquiries[index].id));
      dispatch({ type: SENDMAIL_LOADING });
      sendmail({ myblId, replyInqs, user, header, ...form })
        .then((res) => {
          if (res.status === 200) {
            const cloneInquiries = [...inquiries];
            const inqsOpenState = inquiries.filter(op => op.process === 'pending' && op.state === 'OPEN');
            const draftReply = inquiries.filter(op => op.process === 'draft' && op.state === 'REP_DRF');
            if (draftReply.length > 0) {
              // BQ: Offshore replied on BL Draft
              if (form.toCustomer) //  RO: Return to Customer via BLink
                dispatch(AppActions.updateOpusStatus(bkgNo, "BQ", "RO"));
              if (form.toOnshore) // TO: Return to Onshore via BLink
                dispatch(AppActions.updateOpusStatus(bkgNo, "BQ", "TO"));
            } 

            if (inqsOpenState.length > 0 || replyInqs.length > 0) {
              if (form.toCustomer) //BI: BL Inquiried,  RO: Return to Customer via BLink. 
                dispatch(AppActions.updateOpusStatus(bkgNo, "BI", "RO"));//Send inquiries to customer
              if (form.toOnshore) //BI: BL Inquiried,  RW: Return to Onshore via BLink
                dispatch(AppActions.updateOpusStatus(bkgNo, "BI", "RW")); //Send inquiries to Onshore
            }
           
            cloneInquiries.forEach((q) => {
              if (q.receiver[0] === tab) {
                if (q.state === 'OPEN') q.state = 'INQ_SENT'; // inquiry
                else if (q.state === 'REP_Q_DRF') q.state = 'REP_Q_SENT'; // inquiry
                else if (q.state === 'REP_DRF') q.state = 'REP_SENT'; // amendment
              }
            });
            dispatch(InquiryActions.setInquiries(cloneInquiries));
            dispatch(InquiryActions.checkSend(false));
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

export function inputMail(state) {
  return {
    type: INPUT_MAIL,
    state: state
  };
}

export function setCc(state) {
  return {
    type: SET_CC,
    state: state
  };
}

export function setTags(state) {
  return {
    type: SET_TAGS,
    state: state
  };
}

export const autoSendMail = (mybl, inquiries, inqCustomer, inqOnshore, metadata, content, form) => async (dispatch) => {
  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };

  const getValueField = (content, keyword) => {
    return content[getField(keyword)] || ''
  };
  const cloneInquiries = [...inquiries];
  cloneInquiries.forEach(q => {
    if (q.state === 'OPEN') q.state = 'INQ_SENT'; // inquiry
    else if (q.state === 'REP_Q_DRF') q.state = 'REP_Q_SENT'; // inquiry
    else if (q.state === 'REP_DRF') q.state = 'REP_SENT'; // amendment
  });

  let subjectOns = ''
  let contentOns = ''
  let subjectCus = ''
  let contentCus = ''
  const hasCustomer = inquiries.some(inq => inq.receiver[0] === 'customer')
  const hasOnshore = inquiries.some(inq => inq.receiver[0] === 'onshore')
  const preVvd = getValueField(content, PRE_CARRIAGE)
  const pod = getValueField(content, PORT_OF_DISCHARGE)
  const del = getValueField(content, PLACE_OF_DELIVERY)
  const bkgNo = mybl.bkgNo
  dispatch(InquiryActions.setInquiries(cloneInquiries));

  if (hasOnshore && form.toOnshore && inqOnshore.length > 0) {
    const formOnshore = { ...form };
    formOnshore['toCustomer'] = '';
    subjectOns = `[Onshore - BL Query]_[${inqOnshore.join(', ')}] ${bkgNo}: VVD(${preVvd}) + POD(${pod}) + DEL(${del})`
    contentOns = `Dear Onshore, \n\nWe need your assistance for BL completion.\nPending issue: [${inqOnshore.join(', ')}]`
    dispatch(sendMail({ myblId: mybl.id, bkgNo, ...formOnshore, subject: subjectOns, content: contentOns, inquiries: inquiries }));
  }

  if (hasCustomer && form.toCustomer && inqCustomer.length > 0) {
    const formCustomer = { ...form };
    formCustomer['toOnshore'] = '';
    subjectCus = `[Customer BL Query]_[${inqCustomer.join(', ')}] ${bkgNo}: VVD(${preVvd}) + POD(${pod}) + DEL(${del})`
    contentCus = `Dear Customer, \n\nWe found discrepancy between SI and OPUS booking details or missing/ incomplete information on some BL's fields as follows: [${inqCustomer.join(', ')}]`
    dispatch(sendMail({ myblId: mybl.id, bkgNo, ...formCustomer, subject: subjectCus, content: contentCus, inquiries: inquiries }));
  }
};
