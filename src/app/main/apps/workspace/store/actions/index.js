import { filterMetadata } from '@shared';
import { handleError } from '@shared/handleError';
import { getInquiryById, getMetadata } from 'app/services/inquiryService';
import { createBL, getBlInfo } from 'app/services/myBLService';
import { getFieldContent } from 'app/services/draftblService';

import {
  setMyBL,
  setContent,
  saveField,
  setInquiries,
  saveMetadata,
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
  try {
    const [resInq, resDraft] = [
      await getInquiryById(myBL_Id),
      await getFieldContent(myBL_Id)
    ];

    resInq.forEach(res => res.process = 'pending');
    resDraft.forEach(res => res.process = 'draft');

    [resInq, resDraft].map(res => {
      res.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      res.forEach(
        (inq) =>
          inq.answerObj?.length && inq.answerObj?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      );
    });
    //
    const lastestCommentDraft = [];
    const merge = [...new Set(resDraft.map(d => d.field))];
    merge.forEach(m => {
      const filterLastestComment = [];
      filterLastestComment.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      resDraft.forEach(r => {
        if (m === r.field) {
          filterLastestComment.push(r);
        }
      });
      lastestCommentDraft.push(filterLastestComment[0]);
    });

    dispatch(setInquiries(JSON.parse(JSON.stringify([...resInq, ...lastestCommentDraft]))));

    const field_list = [...resInq.map((e) => e.field), ...resDraft.map((e) => e.field)];
    dispatch(saveField(field_list));

    const optionTabs = [
      { id: 'inquiryList', field: 'INQUIRY_LIST' },
      { id: 'attachmentList', field: 'ATTACHMENT_LIST' },
      { id: 'email', field: 'EMAIL' },
      { id: 'inquiryForm', field: 'INQUIRY_FORM' },
      { id: 'inquiryReview', field: 'INQUIRY_REVIEW' }
    ];
    const listMinimize = [...resInq, ...resDraft, ...optionTabs];
    dispatch(InquiryActions.setListMinimize(listMinimize));
  }
  catch (err) {
    handleError(dispatch, err);
  }
};

export const loadContent = (myBL_Id) => async (dispatch) => {
  getBlInfo(myBL_Id)
    .then((res) => {
      dispatch(setContent(res.myBL.content));
    })
    .catch((err) => handleError(dispatch, err));
};
