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
    padding: '14px 20px 15px 20px'
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
    lineHeight: '18px',
    marginTop: 10,
    display: 'block',
    fontWeight: 500,
  },
  dialogContent: {
    width: '562px',
    textAlign: 'center',
    padding: 30
  },
  container: {
    textAlign: 'center',
    paddingBottom: 30
  }
}))

const AttachmentListNotification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openNotification = useSelector(({ workspace }) => workspace.formReducer.openNotificationAttachmentList);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const [isExistingMedia, setExistingMedia] = useState(false);

  useEffect(() => {
    let isExistMedia = false;
    inquiries.forEach(inq => {
      if(inq.mediaFile.length > 0) {
        isExistMedia = true;
        return;
      }
    });
    if (!isExistMedia) {
      setExistingMedia(true)
    }
  }, []);

  const handleClose = () => {
    dispatch(FormActions.toggleOpenNotificationAttachmentList(false))
  };

  const handleAddAttachment = () => {
    dispatch(FormActions.toggleAllInquiry(true));
    handleClose();
  };

  return (
    <Dialog open={openNotification} onClose={handleClose} maxWidth="md">
      <MuiDialogTitle disableTypography className={classes.root}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '70%' }}>
            <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600' }}>
                Attachment List
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
          No Attachments Right Now!
        </span>
        <span className={classes.secondSentence}>Please add attachment for missing information.</span>
      </MuiDialogContent>
      {inquiries.length > 0 && isExistingMedia && (
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
            onClick={handleAddAttachment}>
              Add Attachment
          </Button>
        </div>
      )}
    </Dialog>
  );
};

export default AttachmentListNotification;
