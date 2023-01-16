import React from 'react';
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { submitInquiryAnswer } from 'app/services/inquiryService';
import * as AppActions from 'app/main/apps/workspace/store/actions';
import { getBlInfo } from 'app/services/myBLService';

import * as InquiryActions from "../store/actions/inquiry";
import * as FormActions from "../store/actions/form";


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
  const [inquiries, myBL, isShowBackground, enableSubmit] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.isShowBackground,
    workspace.inquiryReducer.enableSubmit,
  ]);
  const user = useSelector(({ user }) => user);

  const dispatch = useDispatch();
  const classes = useStyles();

  const handleConfirm = async () => {
    const inqs = [...inquiries];
    const fields = [];

    const lstInq = inqs.map((item) => {
      if (
        (props.field === "INQUIRY_LIST" || props.field === item.field)
        && item.answerObj
        && !['OPEN', 'INQ_SENT', 'ANS_SENT', 'AME_SENT', 'COMPL', 'UPLOADED'].includes(item.state)
      ) {
        return { inquiryId: item.id, currentState: item.state, field: item.field, process: item.process };
      }
      return null;
    });
    lstInq.filter(x => x !== null).forEach(item => {
      if (!fields.includes(item.field)) {
        fields.push(item.field);
      }
    });
    await submitInquiryAnswer({ lstInq: lstInq.filter(x => x !== null), fields });

    const inqsPending = lstInq?.filter(inq => inq !== null && inq.process === 'pending' && inq.currentState === 'ANS_DRF');
    const inqsDraft = lstInq?.filter(inq => inq !== null && inq.process === 'draft' && inq.currentState === 'AME_DRF');
    const inqsReply = lstInq?.filter(inq => inq !== null && inq.process === 'pending' && inq.currentState === 'REP_A_DRF');
    const draftReply = lstInq?.filter(inq => inq !== null && inq.process === 'draft' && inq.currentState === 'REP_DRF');
    if(draftReply.length > 0){
      // BK. Reply from Customer, Onshore
      const inqType = user.userType === 'CUSTOMER' ? "BP" : "BQ"; // BP: Customer Amendment Reply, BO: Offshore Amendment Inquiry
      const userType = user.userType=== 'CUSTOMER' ? "TO" : "RO"; // TO: Return to Customer via BLink, RO: Return to Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, inqType, userType));
    }
    else if (inqsReply.length > 0 ){
      // BK. Reply from Customer, Onshore
      const inqType = user.userType === 'CUSTOMER' ? "BK" : "BO"; // BK: Reply from Customer, BO: Reply from Onshore
      const userType = user.userType === 'CUSTOMER' ? "TO" : "TW"; // TO: Return to Customer via BLink, TW: Return to Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, inqType, userType));
    }
    else if (inqsPending.length > 0 || inqsDraft.length > 0) {
      const inqType = inqsPending.length > 0 ? "BI" : "AN"; // AN: Amendment Notification, BI: BLink BL Inquired
      const userType = user.userType === 'CUSTOMER' ? "RO" : "RW"; // RO: Return to Customer via BLink, RW: Return to Onshore via BLink
      dispatch(AppActions.updateOpusStatus(myBL.bkgNo, inqType, userType));
    }

    const listIdInq = lstInq.filter(x => x !== null).map((inq) => inq.inquiryId);
    inqs.forEach((item) => {
      if (listIdInq.includes(item.id)) {
        if (item.state === 'ANS_DRF') item.state = 'ANS_SENT';
        else if (item.state === 'REP_A_DRF') item.state = 'REP_A_SENT';
        else if (item.state === 'AME_DRF') item.state = 'AME_SENT';
        else if (item.state === 'REP_DRF') item.state = 'REP_SENT';
      }
    });
    dispatch(InquiryActions.setInquiries(inqs));
    props.handleCheckSubmit();
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
    if (props.field === 'INQUIRY_LIST') {
      dispatch(FormActions.toggleAllInquiry(false));
    } else {
      dispatch(InquiryActions.setOneInq({}));
    }
    dispatch(InquiryActions.checkSubmit(!enableSubmit));
    dispatch(FormActions.toggleOpenNotificationSubmitAnswer(true));
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
          <p>Are you sure you want to submit your query?</p>
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