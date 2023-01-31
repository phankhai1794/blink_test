import { filterMetadata } from '@shared';
import { handleError } from '@shared/handleError';
import { getInquiryById, getMetadata } from 'app/services/inquiryService';
import { createBL, getBlInfo, getCustomerAmendment } from 'app/services/myBLService';
import { getFieldContent, getCommentDraftBl } from 'app/services/draftblService';
import axios from 'axios';
import { updateBlStatus } from 'app/services/opusService';

import {
  setMyBL,
  setOrgContent,
  setContent,
  saveField,
  setInquiries,
  saveMetadata,
  setListCommentDraft
} from './inquiry';
import * as InquiryActions from './inquiry';
import * as FormActions from './form';

export const initBL = (bkgNo) => async (dispatch) => {
  dispatch(FormActions.increaseLoading());
  createBL(bkgNo)
    .then((res) => {
      if (res) {
        const { id, state, bkgNo } = res.myBL;
        dispatch(setMyBL({ id, state, bkgNo }));
      }
      dispatch(FormActions.decreaseLoading());
    })
    .catch((err) => console.error(err));
};

export const loadMetadata = () => async (dispatch) => {
  dispatch(FormActions.increaseLoading());
  getMetadata()
    .then((res) => {
      const data = filterMetadata(res);
      dispatch(saveMetadata(data));
      dispatch(FormActions.decreaseLoading());
    })
    .catch((err) => handleError(dispatch, err));
};

export const loadContent = (myBL_Id, inquiries) => async (dispatch) => {
  try {
    dispatch(FormActions.increaseLoading());
    const [blResponse, contentRespone] = [
      await getBlInfo(myBL_Id),
      await getCustomerAmendment(myBL_Id)
    ];
    const { orgContent, content } = blResponse?.myBL;
    const { contentAmendmentRs } = contentRespone;
    const cloneContent = { ...content };

    dispatch(setOrgContent(orgContent));
    contentAmendmentRs?.length && contentAmendmentRs.forEach((a) => (cloneContent[a.field] = a.content));
    dispatch(setContent(cloneContent));
    dispatch(FormActions.decreaseLoading());
  } catch (err) {
    handleError(dispatch, err);
  }
};

export const updateOpusStatus = (bkgNo, blinkStsCd, rtrnCd) => async (dispatch) => {
  try {
    const [blResponse] = [
      await updateBlStatus({
        shineUrl: `${window.location.origin}/apps/workspace/${bkgNo}?usrId=admin&cntr=VN`,
        srKndCd: '',
        srNo: '',
        bkgNo: bkgNo,
        srAmdTpCd: '',
        srAmdSeq: '',
        stsCd: '',
        stsDesc: '',
        blinkStsCd: blinkStsCd,
        rtrnCd,
        shineId: "Blink User"
      }),
    ];
    console.log(blResponse);
  } catch (err) {
    handleError(dispatch, err);
  }
};

export const loadInquiry = (myBL_Id) => async (dispatch) => {
  try {
    dispatch(FormActions.increaseLoading());
    const [resInq, resDraft] = [await getInquiryById(myBL_Id), await getFieldContent(myBL_Id)];

    resInq.forEach((res) => (res.process = 'pending'));
    resDraft.forEach((res) => (res.process = 'draft'));

    [resInq, resDraft].map((res) => {
      res.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      res.forEach(
        (inq) =>
          inq.answerObj?.length &&
          inq.answerObj?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      );
    });
    //
    const lastestCommentDraft = [];
    const merge = [...new Set(resDraft.map((d) => d.field))];
    merge.forEach((m) => {
      const filterLastestComment = [];
      filterLastestComment.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      resDraft.forEach((r) => {
        if (m === r.field) {
          filterLastestComment.push(r);
        }
      });
      lastestCommentDraft.push(filterLastestComment[0]);
    });

    const inquiries = JSON.parse(JSON.stringify([...resInq, ...lastestCommentDraft]));
    dispatch(setInquiries(inquiries));

    dispatch(loadContent(myBL_Id, inquiries));

    const responseCommentDraft = await axios.all(
      lastestCommentDraft.map((q) => getCommentDraftBl(myBL_Id, q.field))
    );
    dispatch(setListCommentDraft(responseCommentDraft.flat()));

    const field_list = [...resInq.map((e) => e.field), ...resDraft.map((e) => e.field)];
    dispatch(saveField(field_list));

    dispatch(InquiryActions.checkSubmit(true));

    const optionTabs = [
      { id: 'inquiryList', field: 'INQUIRY_LIST' },
      { id: 'attachmentList', field: 'ATTACHMENT_LIST' },
      { id: 'email', field: 'EMAIL' },
      { id: 'inquiryForm', field: 'INQUIRY_FORM' },
      { id: 'inquiryReview', field: 'INQUIRY_REVIEW' },
      { id: 'amendmentForm', field: 'AMENDMENT_FORM' }
    ];
    const listMinimize = [...resInq, ...resDraft, ...optionTabs];
    dispatch(InquiryActions.setListMinimize(listMinimize));
    dispatch(FormActions.decreaseLoading());
  } catch (err) {
    handleError(dispatch, err);
  }
};