import React, { useEffect , useState } from 'react';
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
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

const PopupConfirm = (props) => {

  const [openConfirmPopup, confirmPopupMsg, confirmPopupType] = useSelector(({ workspace }) => [
    workspace.formReducer.openConfirmPopup,
    workspace.formReducer.confirmPopupMsg,
    workspace.formReducer.confirmPopupType
  ]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [popupType, setPopupType] = useState(confirmPopupType);

  const handleConfirm = async () => {
    dispatch(FormActions.confirmPopupClick(true))
  };

  const handleCancelConfirm = () => {
    dispatch(FormActions.openConfirmPopup({
      openConfirmPopup: false,
      confirmClick: false,
      confirmPopupMsg: '',
      confirmPopupType: ''
    }))
  };

  const renderContent = (popupType) => {
    return (
      (popupType === 'warningInq') ?
        <div className='btnConfirm'>
          <Button variant="outlined" style={{ textTransform: 'none', fontSize: 16 }} onClick={handleCancelConfirm}>Close</Button>
        </div> :
        <div className='btnConfirm'>
          <Button variant="outlined" style={{ marginRight: 15, textTransform: 'none', fontSize: 16 }} onClick={handleConfirm}>Confirm</Button>
          <Button variant="outlined" style={{ textTransform: 'none', fontSize: 16 }} onClick={handleCancelConfirm}>Cancel</Button>
        </div>
    )
  }

  useEffect(() => {
    setPopupType(confirmPopupType);
  }, [confirmPopupType])

  return (
    <>
      {openConfirmPopup && (
        <div className={classes.dialogConfirm}>
          <p>{confirmPopupMsg}</p>
          {renderContent(popupType)}
        </div>
      )}
      {openConfirmPopup && <div className={classes.backgroundConfirm}></div>}
    </>
  );
};

export default PopupConfirm;