import React from 'react';
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import { submitInquiryAnswer } from 'app/services/inquiryService';

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
  const [inquiries, isShowBackground] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.isShowBackground,
  ]);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleConfirm = async () => {
    const inqs = [... inquiries];
    const lstInq = inqs.map((item) => {
      if ((props.field === "INQUIRY_LIST" || props.field === item.field) &&
          (item.answerObj && (!['OPEN', 'INQ_SENT', 'COMPL', 'UPLOADED'].includes(item.state)))
      ) {
        return {inquiryId: item.id, currentState: item.state};
      }
      return null;
    });
    await submitInquiryAnswer({ lstInq: lstInq.filter(x => x !== null) });
    //
    const listIdInq = lstInq.filter(x => x !== null).map((inq) => inq.inquiryId);
    inqs.forEach((item) => {
      if (listIdInq.includes(item.id)) {
        if (item.state === 'ANS_DRF') item.state = 'ANS_SENT';
        if (item.state === 'REP_A_DRF') item.state = 'REP_A_SENT';
      }
    });
    dispatch(InquiryActions.setInquiries(inqs));
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
    if (props.field === 'INQUIRY_LIST') {
      dispatch(FormActions.toggleAllInquiry(false));
    } else {
      dispatch(InquiryActions.setOneInq({}));
    }
    dispatch(FormActions.toggleOpenNotificationSubmitAnswer(true));
  };

  const handleCancelConfirm = () => {
    props.handleCheckSubmit();
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
  };

  return (
    <>
      {isShowBackground && (
        <div className={classes.dialogConfirm}>
          <p>Are you sure you want to submit these inquiries?</p>
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