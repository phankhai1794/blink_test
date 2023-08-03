import React, { useContext } from 'react';
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { submitInquiryAnswer } from 'app/services/inquiryService';
import * as AppActions from 'app/main/apps/workspace/store/actions';
import { handleError } from '@shared/handleError';
import * as Actions from 'app/store/actions';
import { SocketContext } from 'app/AppContext';

import * as InquiryActions from "../store/actions/inquiry";
import * as FormActions from "../store/actions/form";
import { CONTAINER_DETAIL, CONTAINER_MANIFEST } from "../../../../../@shared/keyword";

const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  backgroundConfirm: {
    top: 141,
    left: 0,
    position: 'absolute',
    width: 940,
    minHeight: '73%',
    background: '#ffffff85'
  },
  dialogConfirm: {
    position: 'absolute',
    top: 68,
    left: 0,
    width: '100%',
    height: 74,
    background: '#BD0F72',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& p': {
      marginLeft: '27px',
      fontSize: 16,
      fontWeight: 600,
      color: '#FFFFFF',
      letterSpacing: 1
    },
    '& .btnConfirm': {
      marginRight: '24px',
      '& .MuiButton-label': {
        color: '#BD0F72'
      },
      '& .MuiButtonBase-root': {
        background: '#FFFFFF',
        borderRadius: 6
      }
    },
  }
}));

const PopupConfirmSubmit = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const [inquiries, myBL, isShowBackground, enableSubmit] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.isShowBackground,
    workspace.inquiryReducer.enableSubmit,
  ]);

  const [openPreviewListSubmit, openAmendmentList] = useSelector(({ workspace }) => [
    workspace.formReducer.openPreviewListSubmit,
    workspace.formReducer.openAmendmentList
  ]);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);

  const user = useSelector(({ user }) => user);

  const syncData = (data, syncOptSite = "") => {
    socket.emit("sync_data", { data, syncOptSite });
  };

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };
  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];
  const handleConfirm = async () => {
    const inqs = [...inquiries];
    const fields = [];

    const lstInq = inqs
      .map((item) => {
        if (
          (
            props.field === "INQUIRY_LIST"
            ||
            (containerCheck.includes(item.field) && containerCheck.includes(props.field))
            ||
            (item.field === props.field && !containerCheck.includes(item.field))
          )
          && item.answerObj
          && !['OPEN', 'INQ_SENT', 'ANS_SENT', 'AME_SENT', 'COMPL', 'UPLOADED'].includes(item.state)
        ) {
          return { inquiryId: item.id, currentState: item.state, field: item.field, process: item.process };
        }
        return null;
      })
      .filter(x => x !== null);
    lstInq.forEach(item => {
      if (!fields.includes(item.field)) {
        fields.push(item.field);
      }
    });
    const response = await submitInquiryAnswer({ lstInq, fields, bl: myBL.id }).catch(err => handleError(dispatch, err));
    if (response && response.responseContentCDCM && Object.keys(response.responseContentCDCM).length) {
      const {responseContentCDCM} = response;
      dispatch(InquiryActions.setContent({
        ...content,
        [responseContentCDCM.fieldAutoUpdate]: responseContentCDCM.content
      }));
    }

    const inqsDraft = lstInq.filter(inq => inq !== null && inq.process === 'draft' && ['AME_DRF'].includes(inq.currentState));
    const inqsReply = lstInq.filter(inq => inq !== null && inq.process === 'pending' && ['REP_A_DRF', 'ANS_DRF'].includes(inq.currentState));
    const draftReply = lstInq.filter(inq => inq !== null && inq.process === 'draft' && ['REP_DRF'].includes(inq.currentState));
    if (draftReply.length > 0) {
      const idReply = draftReply.map(d => d.inquiryId);
      // BK. Reply from Customer, Onshore
      const inqType = user.userType === 'CUSTOMER' ? "BP" : "BQ"; // BP: Customer Amendment Reply, BO: Offshore Amendment Inquiry
      const userType = user.userType === 'CUSTOMER' ? "TO" : "RO"; // TO: Return to Customer via BLink, RO: Return to Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, inqType, userType, {idReply, process: 'draft'}));
    }
    if (inqsReply.length > 0) {
      const idReply = inqsReply.map(d => d.inquiryId);
      // BK. Reply from Customer, Onshore
      const inqType = user.userType === 'CUSTOMER' ? "BK" : "BO"; // BK: Reply from Customer, BO: Reply from Onshore
      const userType = user.userType === 'CUSTOMER' ? "TO" : "TW"; // TO: Return to Customer via BLink, TW: Return to Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, inqType, userType, {idReply, process: 'pending'}));
    }

    if (inqsDraft.length > 0) {
      const idReply = inqsDraft.map(d => d.inquiryId);
      const userType = user.userType === 'CUSTOMER' ? "TO" : "TW"; // TO: Return to Customer via BLink, TW: Return to Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, "BA", userType, {idReply, process: 'draft'}));// BA: Customer Amendment Request
    }

    const listIdInq = lstInq.map((inq) => inq.inquiryId);
    inqs.forEach((item) => {
      if (listIdInq.includes(item.id)) {
        if (item.state === 'ANS_DRF') item.state = 'ANS_SENT';
        else if (item.state === 'REP_A_DRF') item.state = 'REP_A_SENT';
        else if (item.state === 'AME_DRF') item.state = 'AME_SENT';
        else if (item.state === 'REP_DRF') item.state = 'REP_SENT';
      }
    });

    dispatch(InquiryActions.setInquiries(inqs));

    // sync submit
    syncData(
      {
        inquiries: inqs,
        ...(
          myBL.state.includes("DRF_")
          && user.userType === "CUSTOMER"
          && { content, listMinimize }
        )
      },
      "ADMIN"
    );

    props.handleCheckSubmit();
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
    if (props.field === 'INQUIRY_LIST') {
      dispatch(FormActions.toggleAllInquiry(false));
      if (openPreviewListSubmit) {
        dispatch(Actions.showMessage({ message: 'Your inquiries and amendments have been sent successfully.', variant: 'success' }));
      } else {
        dispatch(Actions.showMessage({ message: 'Your answer has been submitted successfully.', variant: 'success' }));
      }
    } else {
      dispatch(InquiryActions.setOneInq({}));
    }
    dispatch(InquiryActions.checkSubmit(!enableSubmit));
    dispatch(FormActions.toggleReload());
  };

  const handleCancelConfirm = () => {
    props.handleCheckSubmit();
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
  };

  return (
    <>
      {isShowBackground && (
        <div className={classes.dialogConfirm}>
          <p> Are you sure you want to submit your {openAmendmentList ? 'amendment' : 'responses'}?</p>
          <div className='btnConfirm'>
            <Button variant="outlined" style={{ marginRight: 15, textTransform: 'none', fontSize: 16 }} onClick={handleConfirm}>Confirm</Button>
            <Button variant="outlined" style={{ textTransform: 'none', fontSize: 16 }} onClick={handleCancelConfirm}>Cancel</Button>
          </div>
        </div>
      )}
      {isShowBackground && <div className={classes.backgroundConfirm}></div>}
    </>
  );
};

export default PopupConfirmSubmit;