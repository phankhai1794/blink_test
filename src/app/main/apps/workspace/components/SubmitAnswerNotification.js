import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Dialog, Divider, makeStyles} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogContent from "@material-ui/core/DialogContent";

import * as FormActions from '../store/actions/form';

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
    marginTop: 10,
    display: 'block',
    fontWeight: 500,
  },
  dialogContent: {
    textAlign: 'center',
    padding: 30,
  },
  container: {
    textAlign: 'center',
    paddingBottom: 30
  }
}))

const SubmitAnswerNotification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openNotification = useSelector(({ workspace }) => workspace.formReducer.openNotificationSubmitAnswer);

  const handleClose = () => {
    dispatch(FormActions.toggleOpenNotificationSubmitAnswer(false))
  };

  const handleDone = () => {
    dispatch(FormActions.toggleOpenNotificationSubmitAnswer(false))
    handleClose();
  };

  return (
    <Dialog open={openNotification} onClose={handleClose} classes={{ root: classes.dialog }}>
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <div className='icon-successful'>
          <img src={`/assets/images/icons/vector.svg`} />
        </div>
        <span className={classes.firstSentence}>
          Your answer has been submitted successfully.
        </span>
        <span className={classes.secondSentence}>Thank you!</span>
      </MuiDialogContent>
      <div className={classes.container}>
        <Button
          style={{
            width: 171,
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
          onClick={handleDone}>
          Done
        </Button>
      </div>
    </Dialog>
  );
};

export default SubmitAnswerNotification;
