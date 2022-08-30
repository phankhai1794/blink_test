import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog, makeStyles } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { sendEditedField } from 'app/services/draftblService';
import clsx from 'clsx';
import * as AppActions from 'app/store/actions';

import * as Actions from '../store/actions';

const mainColor = '#BD0F72';
const darkColor = '#132535';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: '14px 20px 15px 20px',
  },
  dialog: {
    '& .MuiPaper-root': {
      width: 500,
      borderRadius: 6
    }
  },
  firstSentence: {
    position: 'relative',
    color: mainColor,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '20px',
    paddingLeft: 11.67
  },
  secondSentence: {
    color: darkColor,
    fontSize: 15,
    lineHeight: '18px',
    display: 'block',
    fontWeight: 500,
  },
  dialogContent: {
    textAlign: 'center',
    padding: '30px 30px 15px',
  },
  container: {
    textAlign: 'center',
    paddingBottom: 20
  },
  button: {
    margin: theme.spacing(1),
    width: 120,
    height: 40,
    color: '#FFFFFF',
    backgroundColor: mainColor,
    borderRadius: 8,
    padding: '10px 13px',
    textTransform: 'none',
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    },
  }
}))

const SendNotification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openNotification = useSelector(({ draftBL }) => draftBL.openSendNotification);
  const myBL = useSelector(({ draftBL }) => draftBL.myBL);

  const handleClose = () => {
    dispatch(Actions.toggleSendNotification(false))
  };

  const onConfirm = () => {
    handleClose();
    sendEditedField(myBL.id).then(() => {
      dispatch(
        AppActions.showMessage({ message: 'Send successfully', variant: 'success' })
      );
      dispatch(Actions.toggleReload());
    }).catch((err) => console.error(err))
  };

  return (
    <Dialog open={openNotification} onClose={handleClose} classes={{ root: classes.dialog }}>
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <span className={classes.firstSentence}>
          Your amendment is sending to ONE for checking
        </span>
        <span className={classes.secondSentence}>Do you want to proceed?</span>
      </MuiDialogContent>
      <div className={classes.container}>
        <Button
          className={classes.button}
          onClick={onConfirm}>
          Yes
        </Button>
        <Button
          className={clsx(classes.button, 'reply')}
          onClick={handleClose}>
          No
        </Button>
      </div>
    </Dialog>
  );
};

export default SendNotification;
