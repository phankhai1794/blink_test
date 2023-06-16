import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Button, Dialog, Divider } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { getInquiryById } from 'app/services/inquiryService';
import { getBlInfo } from 'app/services/myBLService';
import { SocketContext } from 'app/AppContext';
import { getPermissionByRole } from 'app/services/authService';
import * as AppAction from 'app/store/actions';
import { checkBroadCastAccessing, categorizeInquiriesByUserType } from '@shared';
import { BROADCAST } from '@shared/keyword';

import * as Actions from '../store/actions';
import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

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
  const socket = useContext(SocketContext);
  const channel = new BroadcastChannel(BROADCAST.ACCESS);

  const [open, setOpen] = useState(false);

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  const startBLProcess = () => {
    dispatch(Actions.loadInquiry(myBL.id));
  };

  const checkBLProcess = async () => {
    dispatch(FormActions.increaseLoading());
    const [lengthInq, lengthContent] = [
      await getInquiryById(myBL.id).then((res) => res.length),
      await getBlInfo(myBL.id).then((res) => Object.keys(res.myBL.content).length)
    ];
    dispatch(FormActions.decreaseLoading());
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
    if (myBL.id) {
      checkBLProcess();

      const user = JSON.parse(localStorage.getItem('USER'));

      // post a signal
      channel.postMessage(user.role);

      // receive signal
      channel.onmessage = (e) => {
        checkBroadCastAccessing(e.data);
      };

      // user connect
      const mybl = (user.userType === "ADMIN") ? [myBL.bkgNo, myBL.id] : [myBL.id, myBL.bkgNo];
      socket.emit(
        'user_connect',
        {
          mybl: mybl[0],
          optSite: mybl[1], // opposite workspace (offshore or onshore/customer)
          userName: user.displayName,
          userType: user.userType
        }
      );

      // Receive the list user accessing
      socket.on('users_accessing', async ({ usersAccessing }) => {
        console.log("usersAccessing: ", usersAccessing);

        const userLocal = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : {};
        if (userLocal.displayName && usersAccessing.length) {
          let permissions = await getPermissionByRole('Viewer');
          dispatch(AppAction.setUser({ ...userLocal, permissions }));

          if (userLocal.displayName === usersAccessing[0]) { // if to be the first user
            permissions = await getPermissionByRole(userLocal.role);            
            // close the warning popup if the user is granted permission
            dispatch(FormActions.toggleOpenBLWarning(false));
          } else if (userLocal.displayName === usersAccessing[usersAccessing.length - 1]) { // if to be the last user
            dispatch(FormActions.toggleOpenBLWarning({ status: true, userName: usersAccessing[0] }));
          }

          setTimeout(() => {
            dispatch(AppAction.setUser({ ...userLocal, permissions }));
          }, 500);
          sessionStorage.setItem('permissions', JSON.stringify(permissions));
        }
      });

      // Receive the message sync state
      // socket.on('sync_state', async (res) => {
      //   const result = categorizeInquiriesByUserType(user.userType, res.inquiries);
      //   dispatch(InquiryActions.setInquiries(result));
      //   if (res.listMinimize) dispatch(InquiryActions.setListMinimize(res.listMinimize));
      //   if (res.content) dispatch(InquiryActions.setContent(res.content));
      //   if (res.amendments) dispatch(InquiryActions.setListCommentDraft(res.amendments));
      // });
    }
  }, [myBL]);

  useEffect(() => {
    return () => channel.close();
  }, [])

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
