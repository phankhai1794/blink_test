import history from '@history';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import UserProfile from 'app/fuse-layouts/shared-components/UserProfile';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import * as AppActions from 'app/store/actions';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { draftConfirm } from '@shared';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Badge, Button, Hidden } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DescriptionIcon from '@material-ui/icons/Description';
import DialogConfirm from 'app/fuse-layouts/shared-components/DialogConfirm';
import { submitInquiryAnswer, loadComment } from 'app/services/inquiryService';
import axios from 'axios';

import * as InquiryActions from "../../../main/apps/workspace/store/actions/inquiry";

import PreviewDraftBL from './PreviewDraftBL';

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider
  },
  fitAvatar: {
    // zoom out to show full logo in avatar
    '& > img': {
      objectFit: 'contain'
    }
  },
  logo: {
    width: '105.81px',
    height: '50px',
    borderRadius: 0
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  button: {
    textTransform: 'none',
    fontWeight: 'bold'
  },
  buttonComfirm: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    gap: '10px',
    position: 'absolute',
    left: '82.01%',
    right: '11.04%%',
    top: ' 28.24%',
    bottom: '24.71%',
    background: '#BD0F72',
    borderRadius: '8px',
  }
}));

function ToolbarLayout1(props) {
  const { pathname, search, logout } = window.location;
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ user }) => user);
  const [allowAccess, validToken] = useSelector(({ header }) => [
    header.allowAccess,
    header.validToken
  ]);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const draftContent = useSelector(({ draftBL }) => draftBL.draftContent);
  const enableSubmit = useSelector(({ workspace }) => workspace.inquiryReducer.enableSubmit);
  const myBL = useSelector(({ draftBL }) => draftBL.myBL);
  const [open, setOpen] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [disableSendDraft, setDisableSendDraft] = useState(false);
  const inquiryLength = inquiries.length;
  const attachmentLength = inquiries.map((i) => i.mediaFile.length).reduce((a, b) => a + b, 0);
  const [isSubmit, setIsSubmit] = useState(true);

  useEffect(() => {
    myBL.state === draftConfirm && setDisableConfirm(true);
  }, [myBL.state]);
  const openAllInquiry = () => {
    if (inquiryLength) {
      dispatch(FormActions.toggleAllInquiry(true));
      dispatch(FormActions.toggleSaveInquiry(true));
    }
  };

  useEffect(() => {
    let optionInquiries = [...inquiries];
    let isSubmit = true;
    optionInquiries.forEach((item) => {
      if (item.answerObj && item.state === "ANS_DRF") {
        isSubmit = false;
      }
    });
    if (enableSubmit) {
      isSubmit = false;
    }
    if (pathname.includes('/guest')) {
      axios.all(optionInquiries.map(q => loadComment(q.id)))
        .then(res => {
          if (res) {
            let commentList = [];
            res.map(r => {
              commentList = [...commentList, ...r];
            });
            const filterRepADraft = commentList.some((r) => r.state === 'REP_A_DRF');
            dispatch(InquiryActions.checkSubmit(filterRepADraft));
            if (filterRepADraft) isSubmit = false;
            setIsSubmit(isSubmit)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }, [enableSubmit, inquiries]);

  useEffect(() => {
    setDisableSendDraft(draftContent.some((c) => c.state === 'AME_DRF'))
  }, [draftContent])

  const openAttachment = () => {
    let isExistMedia = false;
    inquiries.forEach((inq) => {
      if (inq.mediaFile.length > 0) {
        isExistMedia = true;
        return;
      }
    });
    if (inquiries.length === 0 || !isExistMedia) {
      dispatch(FormActions.toggleOpenNotificationAttachmentList(true));
    } else {
      dispatch(FormActions.toggleAttachment(true));
    }
  };

  const openEmail = () => dispatch(FormActions.toggleOpenEmail(true));

  const handleClose = () => setOpen(false);

  const confirmBlDraft = () => {
    setOpen(true);
    dispatch(DraftBLActions.setConfirmDraftBL());
  };
  const onSendDraftBl = () => {
    dispatch(DraftBLActions.toggleSendNotification(true));
  }
  const redirectEditDraftBL = () => {
    const bl = window.location.pathname.split('/')[3];
    if (bl) history.push(`/apps/draft-bl/edit/${bl}`);
  };

  useEffect(() => {
    if (!user.displayName || !validToken) {
      if (!allowAccess) {
        localStorage.clear();
        history.push({
          pathname: '/login',
          ...(!logout && { cachePath: pathname, cacheSearch: search })
        });
      }

      let userInfo = JSON.parse(localStorage.getItem('USER'));
      if (userInfo) {
        let payload = {
          ...user,
          role: userInfo.role,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          email: userInfo.email,
          permissions: userInfo.permissions
        };
        dispatch(AppActions.setUser(payload));
      }
    }
  }, [user, allowAccess]);

  const onSubmit = async () => {
    const inqs = [...inquiries];
    const lstInq = inqs.map((item) => {
      if (item.answerObj && (!['OPEN', 'INQ_SENT', 'COMPL', 'UPLOADED'].includes(item.state))
      ) {
        return { inquiryId: item.id, currentState: item.state };
      }
      return null;
    });
    await submitInquiryAnswer({ lstInq: lstInq.filter(x => x !== null) });
    //
    const listIdInq = lstInq.filter(x => x !== null).map((inq) => inq.inquiryId);
    inqs.forEach((item) => {
      if (listIdInq.includes(item.id)) {
        if (item.state === 'ANS_DRF') item.state = 'ANS_SENT';
      }
    });
    dispatch(InquiryActions.setInquiries(inqs));
    dispatch(FormActions.toggleOpenNotificationSubmitAnswer(true));
  }

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="inherit">
        <Toolbar className="p-0">
          {config.navbar.display && config.navbar.position === 'left' && (
            <Hidden lgUp>
              <NavbarMobileToggleButton className="w-64 h-64 p-0" />
              <div className={classes.separator} />
            </Hidden>
          )}

          <div className="flex flex-1" style={{ paddingLeft: '53px' }}>
            <div style={{ paddingRight: '32px' }} className={classes.iconWrapper}>
              <Avatar
                src="assets/images/logos/one_ocean_network-logo.png"
                className={clsx(classes.logo, classes.fitAvatar)}
                alt="one-logo"
              // {...(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD }) && {
              //   component: Link,
              //   to: '/'
              // })}
              />
            </div>

            <PermissionProvider
              action={PERMISSION.VIEW_SHOW_ALL_INQUIRIES}
              extraCondition={['/workspace', '/guest'].some((el) => pathname.includes(el))}>
              <Button
                variant="text"
                size="medium"
                className={clsx('h-64', classes.button)}
                onClick={openAllInquiry}>
                <Badge color="primary" badgeContent={inquiryLength}>
                  <NotificationsIcon />
                </Badge>
                <span className="pl-12">Inquiry List</span>
              </Button>
              <Button
                variant="text"
                size="medium"
                className={clsx('h-64', classes.button)}
                onClick={openAttachment}>
                <Badge color="primary" badgeContent={attachmentLength}>
                  <DescriptionIcon />
                </Badge>
                <span className="pl-12">Attachment List</span>
              </Button>
            </PermissionProvider>
            {/* {openTrans && transId && <RestoreVersion />} */}
            <PermissionProvider
              action={PERMISSION.VIEW_EDIT_DRAFT_BL}
              extraCondition={pathname.includes('/apps/draft-bl')}>
              {/*<Button
                variant="text"
                size="medium"
                className={classes.button}
                onClick={redirectEditDraftBL}>
                <EditIcon />
                <span className="px-2">Edit</span>
          </Button>*/}
              <PermissionProvider action={PERMISSION.DRAFTBL_SEND_DRAFT_AMENDMENT}>
                <Button
                  style={{
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontFamily: 'Montserrat',
                    right: '1rem'
                  }}
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={clsx('normal-case absolute flex my-8 mr-10')}
                  onClick={onSendDraftBl}
                  disabled={!disableSendDraft}>
                  <span className="pl-4">Send</span>
                </Button>
              </PermissionProvider>
              <Button
                style={{
                  backgroundColor: disableConfirm && '#CCD3D1',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontFamily: 'Montserrat',
                  fontStyle: 'normal',
                  lineHeight: '20px',
                  fontSize: '16px',
                  textTransform: 'capitalize',
                  panding: '10px'
                }}
                variant="contained"
                color="primary"
                className={clsx(classes.buttonComfirm)}
                onClick={confirmBlDraft}
                disabled={disableConfirm}>
                <span className="pl-4">Confirm</span>
              </Button>
              <DialogConfirm open={open} handleClose={handleClose} />
            </PermissionProvider>
          </div>
          <div className="flex" style={{ marginRight: '27px' }}>
            <PermissionProvider
              action={PERMISSION.MAIL_SEND_MAIL}
              extraCondition={pathname.includes('/workspace')}>
              <div style={{ paddingLeft: '15px', paddingRight: '5px', paddingTop: '17px' }}>
                <Button
                  style={{
                    width: '120px',
                    height: '30px',
                    color: 'white',
                    backgroundColor: '#bd1874',
                    borderRadius: '20px'
                  }}
                  variant="text"
                  size="medium"
                  className={clsx('h-64', classes.button)}
                  onClick={openEmail}>
                  <span className="pl-4">E-mail</span>
                </Button>
              </div>
            </PermissionProvider>
            {/* <PermissionProvider
              action={PERMISSION.VIEW_SHOW_BL_HISTORY}
              extraCondition={pathname.includes('/workspace')}>
              <History />
            </PermissionProvider> 
             */}
            <PreviewDraftBL />
            <PermissionProvider
              action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}
              extraCondition={!pathname.includes('/apps/draft-bl')}>
              <Button
                variant="contained"
                style={{
                  textTransform: 'capitalize',
                  left: '13.45%',
                  right: '13.45%',
                  top: '25%',
                  bottom: '25%',
                  borderRadius: 6,
                  fontFamily: 'Montserrat',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: '16px',
                  textAlign: 'center',
                  height: 40,
                  marginTop: 11
                }}
                className={classes.root}
                color="primary"
                disabled={isSubmit}
                onClick={onSubmit}>
                Submit
              </Button>
            </PermissionProvider>
            <PermissionProvider action={PERMISSION.VIEW_SHOW_USER_MENU}>
              <UserProfile classes={classes} history={history} />
            </PermissionProvider>
          </div>

          {config.navbar.display && config.navbar.position === 'right' && (
            <Hidden lgUp>
              <NavbarMobileToggleButton />
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout1;
