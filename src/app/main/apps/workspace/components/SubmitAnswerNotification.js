import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, makeStyles, IconButton, Icon } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { SocketContext } from 'app/AppContext';
import { getPermissionByRole } from 'app/services/authService';
import * as AppActions from 'app/store/actions';

import * as InquiryActions from '../store/actions/inquiry';
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
    paddingLeft: 11.67,
    display: 'flex',
    flexDirection: 'column',
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
    fontWeight: 600,
    margin: '0px 5px'
  }
}))

const SubmitAnswerNotification = ({ msg, msg2 = 'Thank you!', iconType, open }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const conflictWarning = useSelector(({ workspace }) => workspace.formReducer.openNotificationBLWarning.status);

  const handleClose = async () => {
    const { usersAccessing } = window;
    const userLocal = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : {};

    if (userLocal.displayName && usersAccessing.length) {
      let permissions = await getPermissionByRole(userLocal.role);
      if (userLocal.displayName !== usersAccessing[0].userName) // if not to be the first user
        permissions = await getPermissionByRole('Viewer');

      setTimeout(() => {
        dispatch(AppActions.setUser({ ...userLocal, permissions }));
      }, 500);
      sessionStorage.setItem('permissions', JSON.stringify(permissions));
    }

    dispatch(FormActions.toggleOpenNotificationSubmitAnswer(false));
    dispatch(FormActions.toggleOpenNotificationDeleteReply(false));
    dispatch(FormActions.toggleOpenNotificationDeleteAmendment(false));
    dispatch(FormActions.toggleOpenBLWarning(false));
    dispatch(FormActions.toggleOpenNotificationPreviewSubmit(false));
    dispatch(FormActions.toggleReload());
    dispatch(InquiryActions.setField());
    dispatch(InquiryActions.setOneInq({}));
    dispatch(InquiryActions.setEditInq(null)); // close popup inq detail
  }

  return (
    <Dialog open={open} onClose={handleClose} classes={{ root: classes.dialog }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8A97A3' }}>
        <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600', marginLeft: 20 }}>Notifications</div>
        <div style={{ paddingRight: '2px', paddingTop: '5px' }}>
          <IconButton aria-label="close" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </div>
      </div>
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <div className={classes.firstSentence}>
          <span>
            {iconType}
          </span>
          <span>
            {msg}
          </span>
        </div>
        <span className={classes.secondSentence}>{msg2}</span>
      </MuiDialogContent>
      <div className={classes.container}>
        {conflictWarning &&
          <Button
            className={classes.button}
            onClick={() => {
              socket.emit("kick_user");
              dispatch(FormActions.toggleOpenBLWarning(false));
            }}>
            Force Out
          </Button>
        }
        <Button
          className={classes.button}
          onClick={handleClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default SubmitAnswerNotification;
