import { getMetadata, getInquiryById } from 'app/services/inquiryService';
import { getFieldContent, confirmDraftBl } from 'app/services/draftblService';
import { getBlInfo, getCustomerAmendment } from 'app/services/myBLService';
import { filterMetadata, draftConfirm } from '@shared';
import { handleError } from '@shared/handleError';
import * as AppActions from 'app/main/apps/workspace/store/actions';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';

export const SET_METADATA = 'SAVE_METADATA';
export const SET_BL = 'SET_BL';
export const SET_ORG_CONTENT = 'SET_ORG_CONTENT';
export const SET_DRAFT_CONTENT = 'SET_DRAFT_CONTENT';
export const OPEN_POPUP_EDIT = 'OPEN_POPUP_EDIT';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_CONTENT = 'SET_CONTENT';
export const SET_SEND_DRAFT_BL = 'SET_SEND_DRAFT_BL';
export const OPEN_SEND_NOTIFICATION = 'OPEN_SEND_NOTIFICATION';
export const RELOAD = 'RELOAD';
export const SET_EDIT_INQUIRY = 'SET_EDIT_INQUIRY'
export const SET_DRF_VIEW = 'SET_DRF_VIEW';
export const SET_AMENDMENT_FIELD = 'SET_AMENDMENT_FIELD';
export const SET_INQUIRIES = 'SET_INQUIRIES';

export const loadMetadata = () => (dispatch) => {
  getMetadata()
    .then((res) => {
      const data = filterMetadata(res);
      dispatch(setMetadata(data));
    })
    .catch((err) => handleError(dispatch, err));
};

export const loadContent = (bl) => async (dispatch) => {
  if (bl) {
    const [blResponse, contentRespone] = [
      await getBlInfo(bl),
      await getCustomerAmendment(bl)
    ];
    const { id, bkgNo, state, content } = blResponse?.myBL;
    const { contentAmendmentRs } = contentRespone;
    dispatch(setBL({ id, bkgNo, state }));
    dispatch(setOrgContent(blResponse?.myBL.content));
    const cloneContent = { ...content };
    contentAmendmentRs?.length && contentAmendmentRs.forEach(a => cloneContent[a.field] = a.content);
    dispatch(setContent(cloneContent));
  }
};

export const loadDraftContent = (bl) => (dispatch) => {
  getFieldContent(bl)
    .then((res) => {
      const data = res.map(({ id, state, content, field, createdAt, creator, mediaFile }) => {
        return {
          id,
          state,
          field,
          createdAt,
          creator,
          content: { content, mediaFile }
        }
      });
      dispatch(setDraftContent(data));
    })
    .catch((err) => console.error(err));
};

export function setMetadata(state) {
  return {
    type: SET_METADATA,
    state
  };
}

export function setBL(state) {
  return {
    type: SET_BL,
    state
  };
}

export function setOrgContent(state) {
  return {
    type: SET_ORG_CONTENT,
    state
  };
}

export function setDraftContent(state) {
  return {
    type: SET_DRAFT_CONTENT,
    state
  };
}

export function toggleDraftBLEdit(state) {
  return {
    type: OPEN_POPUP_EDIT,
    state
  };
}

export const setConfirmDraftBL = (myBL, role) => (dispatch) => {
  confirmDraftBl(myBL.id)
    .then(() => {
      dispatch(setBL({ state: draftConfirm }));
      // BL Confirm by Customer (CC), TO: Return back from Customer via BLink, TW: Return back from Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, "BM", role === 'Guest' ? "TO" : "TW"));
    })
    .catch((err) => handleError(dispatch, err));
};

export function setCurrentField(state) {
  return {
    type: SET_CURRENT_FIELD,
    state
  };
}

export function setContent(state) {
  return {
    type: SET_CONTENT,
    state
  };
}

export function toggleReload() {
  return {
    type: RELOAD
  };
}

export function toggleSendDraftBl() {
  return {
    type: SET_SEND_DRAFT_BL
  };
}

export function toggleSendNotification(state) {
  return {
    type: OPEN_SEND_NOTIFICATION,
    state: state
  };
}

export function toggleEditInquiry(state) {
  return {
    type: SET_EDIT_INQUIRY,
    state
  };
}

export function setDrfView(state) {
  return {
    type: SET_DRF_VIEW,
    state
  };
}

export function setAmendmentField(state) {
  return {
    type: SET_AMENDMENT_FIELD,
    state
  }
}

// As same as app > main > apps > workspace > store > actions > index.js > loadInquiry()
export const setInquiries = (bl) => async (dispatch) => {
  const [resInq, resDraft] = [
    await getInquiryById(bl),
    await getFieldContent(bl)
  ];

  resInq.forEach((res) => (res.process = 'pending'));
  resDraft.forEach((res) => (res.process = 'draft'));

  [resInq, resDraft].map(ele => {
    ele.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    ele.forEach((inq) =>
      inq.answerObj?.length
      && inq.answerObj?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
    );
  });

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
  dispatch(InquiryActions.setInquiries(inquiries));
}