import { filterMetadata } from '@shared';
import { handleError } from '@shared/handleError';
import { getInquiryById, getMetadata } from 'app/services/inquiryService';
import { createBL, getBlInfo } from 'app/services/myBLService';

import {
  setMyBL,
  setContent,
  saveField,
  editInquiry,
  setInquiries,
  saveMetadata,
  setListAttachment
} from './inquiry';
import * as InquiryActions from './inquiry';

export const initBL = (bkgNo) => async (dispatch) => {
  createBL(bkgNo)
    .then((res) => {
      if (res) dispatch(setMyBL(res.myBL));
    })
    .catch((err) => console.error(err));
};

export const loadMetadata = () => async (dispatch) => {
  getMetadata()
    .then((res) => {
      const data = filterMetadata(res);
      dispatch(saveMetadata(data));
    })
    .catch((err) => handleError(dispatch, err));
};

export const loadInquiry = (myBL_Id) => async (dispatch) => {
  getInquiryById(myBL_Id)
    .then((res) => {
      res.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      res.forEach(
        (inq) =>
          inq.answerObj.length && inq.answerObj.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      );
      const field_list = res.map((e) => e.field);
      dispatch(saveField(field_list));
      dispatch(editInquiry(res));
      dispatch(setInquiries(JSON.parse(JSON.stringify(res))));
      const optionTabs = [
        { id: 'inquiryList', field: 'INQUIRY_LIST' },
        { id: 'attachmentList', field: 'ATTACHMENT_LIST' },
        { id: 'email', field: 'EMAIL' },
        { id: 'inquiryForm', field: 'INQUIRY_FORM' },
        { id: 'inquiryReview', field: 'INQUIRY_REVIEW' }
      ];
      const listMinimize = [...res, ...optionTabs];
      dispatch(InquiryActions.setListMinimize(listMinimize));
    })
    .catch((err) => handleError(dispatch, err));
};

export const loadContent = (myBL_Id) => async (dispatch) => {
  getBlInfo(myBL_Id)
    .then((res) => {
      dispatch(setContent(res.myBL.content));
    })
    .catch((err) => handleError(dispatch, err));
};
