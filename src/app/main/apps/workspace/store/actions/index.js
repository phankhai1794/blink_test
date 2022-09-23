import { filterMetadata } from '@shared';
import { handleError } from '@shared/handleError';
import { getInquiryById, getMetadata } from 'app/services/inquiryService';
import { createBL, getBlInfo } from 'app/services/myBLService';
import { getFieldContent, getCommentDraftBl } from 'app/services/draftblService';
import axios from 'axios';

import {
  setMyBL,
  setOrgContent,
  setContent,
  saveField,
  setInquiries,
  saveMetadata,
  setListCommentDraft,
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

export const loadContent = (myBL_Id, inquiries) => async (dispatch) => {
  const amendments = inquiries.filter(i => i.process === 'draft');
  getBlInfo(myBL_Id)
    .then((res) => {
      const { content } = res.myBL;
      dispatch(setOrgContent(res.myBL.content));

      const cloneContent = { ...content };
      amendments && amendments.map(a => cloneContent[a.field] = a.content);
      dispatch(setContent(cloneContent));
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

    const inquiries = JSON.parse(JSON.stringify([...resInq, ...lastestCommentDraft]))
    dispatch(setInquiries(inquiries));

    dispatch(loadContent(myBL_Id, inquiries));

    const responseCommentDraft = await axios.all(lastestCommentDraft.map(q => getCommentDraftBl(myBL_Id, q.field)));
    dispatch(setListCommentDraft(responseCommentDraft.flat()));

    const field_list = [...resInq.map((e) => e.field), ...resDraft.map((e) => e.field)];
    dispatch(saveField(field_list));

    const optionTabs = [
      { id: 'inquiryList', field: 'INQUIRY_LIST' },
      { id: 'attachmentList', field: 'ATTACHMENT_LIST' },
      { id: 'email', field: 'EMAIL' },
      { id: 'inquiryForm', field: 'INQUIRY_FORM' },
      { id: 'inquiryReview', field: 'INQUIRY_REVIEW' },
      { id: 'amendmentForm', field: 'AMENDMENT_FORM' },
    ];
    const listMinimize = [...resInq, ...resDraft, ...optionTabs];
    dispatch(InquiryActions.setListMinimize(listMinimize));
  }
  catch (err) {
    handleError(dispatch, err);
  }
};