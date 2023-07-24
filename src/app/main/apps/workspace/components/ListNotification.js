import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog, Divider, makeStyles } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from "../store/actions/inquiry";

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
  },
  button: {
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
  }
}))

const ListNotification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openNotificationAttachmentList = useSelector(({ workspace }) => workspace.formReducer.openNotificationAttachmentList);
  const openNotificationInquiryList = useSelector(({ workspace }) => workspace.formReducer.openNotificationInquiryList);
  const openNotificationAmendmentList = useSelector(({ workspace }) => workspace.formReducer.openNotificationAmendmentList);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const user = useSelector(({ user }) => user);

  const handleClose = () => {
    dispatch(FormActions.toggleOpenNotificationAttachmentList(false));
    dispatch(FormActions.toggleOpenNotificationInquiryList(false));
    dispatch(FormActions.toggleOpenNotificationAmendmentList(false));
  };

  const addAmendment = () => {
    dispatch(InquiryActions.addAmendment(null));
    dispatch(FormActions.toggleAmendmentsList(true));
    handleClose();
  };

  const addInquiry = () => {
    const isEmptyInquiry = inquiries.filter(inq => inq.process === 'pending');
    if (!isEmptyInquiry.length) {
      dispatch(FormActions.toggleCreateInquiry(true));
      dispatch(InquiryActions.addQuestion());
    } else {
      dispatch(FormActions.toggleAllInquiry(true));
    }
    handleClose();
  }

  let [label, pluralLabel] = ['', ''];
  if (openNotificationInquiryList) {
    [label, pluralLabel] = ["Inquiry", "Inquiries"];
  } else if (openNotificationAttachmentList) {
    [label, pluralLabel] = ["Attachment", "Attachments"];
  } else if (openNotificationAmendmentList) {
    [label, pluralLabel] = ["Amendment", "Amendments"];
  }

  return (
    <Dialog open={openNotificationAttachmentList || openNotificationInquiryList || openNotificationAmendmentList} onClose={handleClose} maxWidth="md">
      <MuiDialogTitle disableTypography className={classes.root}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '70%' }}>
            <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600' }}>
              {pluralLabel} List
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
          No {pluralLabel} Right Now!
        </span>
        <span className={classes.secondSentence}>Please add {label} for missing information.</span>
      </MuiDialogContent>

      <PermissionProvider
        action={PERMISSION.INQUIRY_CREATE_INQUIRY}
        extraCondition={openNotificationInquiryList && inquiries.filter(inq => inq.process === 'pending').length === 0}
      >
        <div className={classes.container}>
          <Button
            className={classes.button}
            onClick={addInquiry}>
            Add {label}
          </Button>
        </div>
      </PermissionProvider>

      <PermissionProvider
        action={PERMISSION.VIEW_CREATE_AMENDMENT}
        extraCondition={openNotificationAmendmentList && user.role === 'Guest' && user.userType === 'CUSTOMER'}
      >
        <div className={classes.container}>
          <Button
            className={classes.button}
            onClick={addAmendment}>
            Add {label}
          </Button>
        </div>
      </PermissionProvider>
    </Dialog>
  );
};

export default ListNotification;
