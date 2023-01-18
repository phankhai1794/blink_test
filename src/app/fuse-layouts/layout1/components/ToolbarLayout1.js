import history from '@history';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import UserProfile from 'app/fuse-layouts/shared-components/UserProfile';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import * as AppActions from 'app/store/actions';
import * as Actions from 'app/main/apps/workspace/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Badge, Button, Hidden } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DescriptionIcon from '@material-ui/icons/Description';
import DialogConfirm from 'app/fuse-layouts/shared-components/DialogConfirm';
import { loadComment } from 'app/services/inquiryService';
import { getCommentDraftBl } from 'app/services/draftblService';
import axios from 'axios';

import * as InquiryActions from '../../../main/apps/workspace/store/actions/inquiry';

import PreviewDraftBL from './PreviewDraftBL';

const themeColor = '#BD0F72';
const whiteColor = '#FFFFFF';

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
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    marginLeft: 10
  },
  buttonSend: {
    padding: '10px 28.5px',
    color: whiteColor,
    fontSize: 16,
    borderRadius: 8,
    lineHeight: '20px',
    backgroundColor: themeColor,
    '&:hover': {
      backgroundColor: themeColor
    }
  },
  buttonEditDraftBL: {
    fontSize: 16,
    padding: '5px 16px',
    color: themeColor,
    background: whiteColor,
    border: `1px solid ${themeColor}`,
    borderRadius: 8
  },
  buttonComfirm: {
    fontSize: 16,
    padding: '5px 16px',
    color: whiteColor,
    background: themeColor,
    border: `1px solid ${themeColor}`,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: themeColor
    }
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
  const [amendmentsLength, setAmendmentLength] = useState();
  const [inquiryLength, setInquiryLength] = useState();
  const enableSubmit = useSelector(({ workspace }) => workspace.inquiryReducer.enableSubmit);
  const [open, setOpen] = useState(false);
  const [attachmentLength, setAttachmentLength] = useState(0);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const myBLDrf = useSelector(({ draftBL }) => draftBL.myBL);
  const enabledMail = inquiries.some((inq) =>
    ['OPEN', 'REP_Q_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state)
  );
  const enableSubmitInq = inquiries.some((inq) =>
    ['ANS_DRF', 'REP_A_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state));
  const isLoading = useSelector(({ workspace }) => workspace.formReducer.isLoading);

  useEffect(() => {
    dispatch(InquiryActions.checkSend(false));
    let optionInquiries = [...inquiries];
    let getAttachmentFiles = [];

    const inquiriesPendingProcess = optionInquiries.filter((op) => op.process === 'pending');
    setInquiryLength(inquiriesPendingProcess.length);
    inquiries.forEach((e) => {
      const mediaFile = e.mediaFile.map((f) => {
        return {
          ...f,
          field: e.field,
          inquiryId: e.id,
          inqType: e.inqType
        };
      });
      const mediaAnswer = e.mediaFilesAnswer.map((f) => {
        return {
          ...f,
          field: e.field,
          inquiryId: e.id,
          inqType: e.inqType
        };
      });

      getAttachmentFiles = [...getAttachmentFiles, ...mediaFile, ...mediaAnswer];
    });

    const amendment = optionInquiries.filter((op) => op.process === 'draft');
    if (pathname.includes('/guest') || pathname.includes('/workspace')) {
      let countLoadComment = 0;
      let countAmendment = 0;
      axios
        .all(inquiriesPendingProcess.map((q) => loadComment(q.id))) // TODO: refactor
        .then((res) => {
          if (res) {
            let commentList = [];
            // get attachments file in comment reply/answer
            res.map((r) => {
              commentList = [...commentList, ...r];
              r.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
              const curInq = inquiriesPendingProcess[countLoadComment];
              let commentIdList = [];
              r.forEach((itemRes) => {
                if (!commentIdList.includes(itemRes.id)) {
                  commentIdList.push(itemRes.id);
                  if (itemRes.mediaFile.length > 0) {
                    const mediaTemp = [
                      ...curInq.mediaFile,
                      ...curInq.mediaFilesAnswer,
                      ...itemRes.mediaFile
                    ];
                    const attachmentTemp = mediaTemp.map((f) => {
                      return {
                        ...f,
                        field: curInq.field,
                        inquiryId: curInq.id,
                        inqType: curInq.inqType
                      };
                    });
                    if (attachmentTemp.length > 0) {
                      attachmentTemp.forEach((att) => {
                        const tempAttList = getAttachmentFiles.filter(
                          (attItem) =>
                            attItem.name === att.name &&
                            attItem.field === att.field &&
                            attItem.inqType === att.inqType
                        );
                        if (tempAttList.length === 0) getAttachmentFiles.push(att);
                      });
                    }
                  }
                }
              });

              countLoadComment += 1;
              if (
                inquiriesPendingProcess &&
                amendment &&
                countLoadComment === inquiriesPendingProcess.length &&
                countAmendment === amendment.length
              ) {
                setAttachmentLength(getAttachmentFiles.length);
              }
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });

      setAmendmentLength(amendment.length);

      if (amendment.length) {
        axios
          .all(amendment.map((q) => getCommentDraftBl(myBL.id, q.field))) // TODO: refactor
          .then((res) => {
            if (res) {
              let commentList = [];
              // check and add attachment of amendment/answer to Att List
              res.map((r) => {
                commentList = [...commentList, ...r];
                const curInq = amendment[countAmendment];
                r.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
                let commentDraftIdList = [];
                r.forEach((itemRes) => {
                  if (!commentDraftIdList.includes(itemRes.id)) {
                    commentDraftIdList.push(itemRes.id);
                    const mediaTemp = [
                      ...curInq.mediaFile,
                      ...curInq.mediaFilesAnswer,
                      ...itemRes.content.mediaFile
                    ];
                    const attachmentAmendmentTemp = mediaTemp.map((f) => {
                      return {
                        ...f,
                        field: curInq.field,
                        inquiryId: curInq.id,
                        inqType: curInq.inqType
                      };
                    });
                    if (attachmentAmendmentTemp.length > 0) {
                      attachmentAmendmentTemp.forEach((attAmendment) => {
                        const fileNameList = getAttachmentFiles.map((item) => {
                          if (item.inqType === curInq.inqType) return item.name;
                        });
                        if (
                          attAmendment &&
                          !curInq.inqType &&
                          !fileNameList.includes(attAmendment.name)
                        )
                          getAttachmentFiles.push(attAmendment);
                      });
                    }
                  }
                });
                countAmendment += 1;
                if (
                  inquiriesPendingProcess &&
                  amendment &&
                  countLoadComment === inquiriesPendingProcess.length &&
                  countAmendment === amendment.length
                ) {
                  setAttachmentLength(getAttachmentFiles.length);
                }
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [enableSubmit]);

  useEffect(() => {
    if (!user.displayName || !validToken) {
      if (!allowAccess) {
        localStorage.clear();
        sessionStorage.clear();
        history.push({
          pathname: '/login',
          ...(!logout && { cachePath: pathname, cacheSearch: search })
        });
      }

      let userInfo = JSON.parse(localStorage.getItem('USER'));
      if (userInfo) {
        let payload = {
          ...user,
          userType: userInfo.userType,
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

  const openAllInquiry = () => {
    if (inquiries.filter((inq) => inq.process === 'pending').length) {
      dispatch(FormActions.toggleAllInquiry(true));
      dispatch(FormActions.toggleSaveInquiry(true));
    } else {
      dispatch(FormActions.toggleOpenNotificationInquiryList(true));
    }
  };

  const openAmendmentsList = () => {
    if (amendmentsLength) {
      dispatch(FormActions.toggleAmendmentsList(true));
    } else dispatch(FormActions.toggleOpenNotificationAmendmentList(true));
  };

  const openAttachment = () => {
    let isExistMedia = false;
    inquiries.forEach((inq) => {
      if (inq.mediaFile.length > 0 || inq.mediaFilesAnswer.length > 0) {
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

  const handleClose = () => {
    setOpen(false);
  };

  const confirmBlDraft = () => {
    setOpen(true);
  };

  const redirectEditDraftBL = () => {
    const bl = new URLSearchParams(search).get('bl');
    if (bl) history.push(`/guest?bl=${bl}`);
    dispatch(Actions.updateOpusStatus(myBLDrf.bkgNo, "BA", "TO")); //Customer edited/revised BL
  };

  const onSubmit = async () => {
    dispatch(FormActions.togglePreviewSubmitList(true));
    dispatch(InquiryActions.setShowBackgroundAttachmentList(true));
  };

  return (
    <ThemeProvider theme={toolbarTheme}>
      {!isLoading && (
        <AppBar id="fuse-toolbar" className="flex relative z-10" color="inherit">
          <Toolbar className="p-0">
            {config.navbar.display && config.navbar.position === 'left' && (
              <Hidden lgUp>
                <NavbarMobileToggleButton className="w-64 h-64 p-0" />
                <div className={classes.separator} />
              </Hidden>
            )}

            <div className="flex flex-1" style={{ marginLeft: 35 }}>
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
                  <span className="pl-12">Inquiries List</span>
                </Button>
              </PermissionProvider>

              {myBL?.state?.includes('DRF_') &&
                user?.userType !== 'ONSHORE' &&
                ['/workspace', '/guest'].some((el) => pathname.includes(el)) && (
                  <Button
                    variant="text"
                    size="medium"
                    className={clsx('h-64', classes.button)}
                    onClick={openAmendmentsList}>
                    <Badge color="primary" badgeContent={amendmentsLength}>
                      <NotificationsIcon />
                    </Badge>
                    <span className="pl-12">Amendments List</span>
                  </Button>
                )}

              <PermissionProvider
                action={PERMISSION.VIEW_SHOW_ALL_INQUIRIES}
                extraCondition={['/workspace', '/guest'].some((el) => pathname.includes(el))}>
                <Button
                  variant="text"
                  size="medium"
                  className={clsx('h-64', classes.button)}
                  onClick={openAttachment}>
                  <Badge color="primary" badgeContent={attachmentLength} id="no-att">
                    <DescriptionIcon />
                  </Badge>
                  <span className="pl-12">Attachments List</span>
                </Button>
              </PermissionProvider>
            </div>
            <div className="flex" style={{ marginRight: 35, alignItems: 'center' }}>
              <PreviewDraftBL />

              <PermissionProvider
                action={PERMISSION.VIEW_EDIT_DRAFT_BL}
                extraCondition={pathname.includes('/draft-bl')}>
                <Button
                  className={clsx(classes.button, classes.buttonEditDraftBL)}
                  onClick={redirectEditDraftBL}>
                  Amendment
                </Button>

                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.buttonComfirm)}
                  onClick={confirmBlDraft}>
                  Confirm
                </Button>
                <DialogConfirm open={open} handleClose={handleClose} />
              </PermissionProvider>

              <PermissionProvider
                action={PERMISSION.MAIL_SEND_MAIL}
                extraCondition={pathname.includes('/workspace')}>
                <div style={{ paddingRight: 5 }}>
                  <Button
                    style={{
                      width: '120px',
                      height: '30px',
                      borderRadius: '20px'
                    }}
                    disabled={!enabledMail}
                    color="primary"
                    variant="contained"
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
              {openTrans && transId && <RestoreVersion />}
            </PermissionProvider>  */}

              <PermissionProvider
                action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}
                extraCondition={!pathname.includes('/draft-bl')}>
                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.buttonSend)}
                  disabled={!enableSubmitInq}
                  onClick={onSubmit}>
                  Submit
                </Button>
              </PermissionProvider>

              <PermissionProvider
                action={PERMISSION.VIEW_SHOW_USER_MENU}
                extraCondition={!pathname.includes('/guest')}>
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
      )}
    </ThemeProvider>
  );
}

export default ToolbarLayout1;
