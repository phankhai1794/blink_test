import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Button, Dialog, Divider } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { getInquiryById } from 'app/services/inquiryService';
import { getBlInfo } from 'app/services/myBLService';

import * as Actions from '../store/actions';
import * as FormActions from '../store/actions/form';
import * as TransActions from '../store/actions/transaction';

const mainColor = '#BD0F72';
const darkColor = '#132535';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: '14px 20px 15px 20px'
  },
  dialogContent: {
    width: '562px',
    textAlign: 'center',
    padding: 30
  },
  firstSentence: {
    position: 'relative',
    color: mainColor,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '20px',
    paddingLeft: 11.67,
    '&:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'translateX(-50%)',
      width: 16.67,
      height: 16.67,
      content: '""',
      backgroundImage: 'url("assets/images/icons/warning.svg")',
      backgroundSize: 'cover'
    }
  },
  secondSentence: {
    color: darkColor,
    fontSize: 15,
    lineHeight: '18px'
  },
  container: {
    textAlign: 'center',
    paddingBottom: 30
  }
}));

const BLProcessNotification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const reload = useSelector(({ workspace }) => workspace.formReducer.reload);

  const startBLProcess = () => {
    dispatch(TransActions.setStatusTransaction('start'));
    dispatch(Actions.loadInquiry(myBL.id));
    dispatch(Actions.loadContent(myBL.id));
  };

  const checkBLProcess = async () => {
    const [lengthInq, lengthContent] = [
      await getInquiryById(myBL.id).then((res) => res.length),
      await getBlInfo(myBL.id).then((res) => Object.keys(res.myBL.content).length)
    ];
    if (!lengthInq && !lengthContent) setOpen(true);
    else startBLProcess();
  };

  const handleClose = () => {
    setOpen(false);
    startBLProcess();
  };

  const handleAddInquiry = () => {
    handleClose();
    dispatch(FormActions.toggleCreateInquiry(true));
  };

  useEffect(() => {
    if (myBL.id) checkBLProcess();
  }, [reload, myBL]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <MuiDialogTitle disableTypography className={classes.root}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '70%' }}>
            <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600' }}>
              Notifications
            </div>
          </div>
          <div style={{ width: '30%', textAlign: 'right' }}>
            <IconButton aria-label="close" size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </MuiDialogTitle>
      <Divider classes={{ root: classes.divider }} />
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <span className={classes.firstSentence}>
          Bill of Lading has not been generated for this booking.
        </span>
        <br />
        <span className={classes.secondSentence}>Please add inquiry for missing information.</span>
      </MuiDialogContent>
      <div className={classes.container}>
        <Button
          style={{
            width: 145,
            height: 40,
            color: '#FFFFFF',
            backgroundColor: mainColor,
            borderRadius: 8,
            padding: '10px 13px',
            textTransform: 'none',
            fontFamily: 'Montserrat',
            fontSize: 16,
            fontWeight: 600
          }}
          onClick={handleAddInquiry}>
          Add Inquiry
        </Button>
      </div>
    </Dialog>
  );
};

export default BLProcessNotification;
