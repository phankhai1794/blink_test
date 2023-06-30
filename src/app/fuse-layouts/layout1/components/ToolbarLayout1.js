import history from '@history';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import User from 'app/fuse-layouts/shared-components/User';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import * as AppActions from 'app/store/actions';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';
import { handleError } from '@shared/handleError';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Badge, Button, Hidden, TextField, MenuItem } from '@material-ui/core';
import DialogConfirm from 'app/fuse-layouts/shared-components/DialogConfirm';
import { loadComment } from 'app/services/inquiryService';
import { getCommentDraftBl } from 'app/services/draftblService';
import axios from 'axios';

import * as InquiryActions from '../../../main/apps/workspace/store/actions/inquiry';

import PreviewDraftBL from './PreviewDraftBL';
import BtnQueueList from './BtnQueueList';

const themeColor = '#BD0F72';
const lightThemeColor = '#FDF2F2';
const whiteColor = '#FFFFFF';
const blackColor = '#132535';
const drfViews = [
  { label: "Mark and Description", value: "MD" },
  { label: "Container Manifest", value: "CM" }
];

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
    width: 70,
    height: 50,
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
  buttonSubmit: {
    padding: '10px 28.5px',
    color: whiteColor,
    fontSize: 12,
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
    fontSize: 12,
    padding: '5px 16px',
    color: whiteColor,
    background: themeColor,
    border: `1px solid ${themeColor}`,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: themeColor
    }
  },
  selectView: {
    // width: 124,
    '& fieldset': {
      border: `1px solid ${themeColor} !important`,
      borderRadius: '8px'
    },
    '& div > div': {
      marginBottom: -12,
      left: 0,
      bottom: 7,
      position: 'relative'
    },
    '& div > svg': {
      color: themeColor,
      position: 'absolute',
      top: 10,
      right: 8
    },
    '&:hover fieldset': {
      borderColor: `${themeColor} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${themeColor} !important`
    },
  },
  selectViewProps: {
    color: 'themeColor',
    fontWeight: 600
  },
  menuItem: {
    background: whiteColor,
    color: blackColor,
    minWidth: 10,
    fontSize: 12,
    '&:hover': {
      background: `${lightThemeColor} !important`,
      color: themeColor,
      fontWeight: 600
    },
  },
  menuItemSelected: {
    background: `${lightThemeColor} !important`,
    color: themeColor,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'Montserrat',
  },
  titleButton: {
    position: 'relative',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    color: '#515E6A',
    paddingLeft: 10
  },
  dratTypeText: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    position: 'relative',
    color: themeColor,
    paddingRight: 18
  },
}));

function ToolbarLayout1(props) {
  const { pathname, search, logout } = window.location;
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ user }) => user);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const enableSubmit = useSelector(({ workspace }) => workspace.inquiryReducer.enableSubmit);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const isLoading = useSelector(({ workspace }) => workspace.formReducer.isLoading);
  const drfView = useSelector(({ draftBL }) => draftBL.drfView);
  const userType = useSelector(({ user }) => user.userType);

  const [open, setOpen] = useState(false);
  const [attachmentLength, setAttachmentLength] = useState(0);
  const [amendmentsLength, setAmendmentLength] = useState();
  const [inquiryLength, setInquiryLength] = useState();

  const enableSubmitInq = inquiries.some((inq) => ['ANS_DRF', 'REP_A_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state));

  const onUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
  }

  useEffect(() => {
    dispatch(FormActions.setDirtyReload({
      sendMail: inquiries.some((inq) => ['OPEN', 'REP_Q_DRF', 'REP_A_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state))
    }));
  }, [inquiries]);

  useEffect(() => {
    const countInquiry = inquiries.filter((inq) => inq.process === 'pending' && !['COMPL', 'UPLOADED'].includes(inq.state))
    setInquiryLength(countInquiry.length);

    const countAmend = inquiries.filter((ame) => ame.process === 'draft' && !['RESOLVED', 'UPLOADED', 'COMPL'].includes(ame.state))
    setAmendmentLength(countAmend.length);
  }, [inquiries]);

  useEffect(() => {
    dispatch(InquiryActions.checkSend(false));
    let optionInquiries = [...inquiries];
    let getAttachmentFiles = [];

    const inquiriesPendingProcess = optionInquiries.filter((op) => op.process === 'pending');
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
        .all(inquiriesPendingProcess.map((q) => loadComment(q.id).catch(err => handleError(dispatch, err)))) // TODO: refactor
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
  }, [enableSubmit, inquiries]);

  const openAllInquiry = () => {
    dispatch(InquiryActions.setField());
    if (inquiries.filter((inq) => inq.process === 'pending').length) {
      dispatch(FormActions.toggleAllInquiry(true));
      dispatch(FormActions.toggleSaveInquiry(true));
    } else {
      dispatch(FormActions.toggleOpenNotificationInquiryList(true));
    }
  };

  const openAmendmentsList = () => {
    if (inquiries.filter((inq) => inq.process === 'draft').length) {
      dispatch(FormActions.toggleAmendmentsList(true));
    } else dispatch(FormActions.toggleOpenNotificationAmendmentList(true));
  };

  const openAttachment = () => {
    if (attachmentLength > 0) {
      dispatch(FormActions.toggleAttachment(true));
    } else {
      dispatch(FormActions.toggleOpenNotificationAttachmentList(true));
    }
  };

  const openEmail = () => dispatch(FormActions.toggleOpenEmail(true));

  const handleClose = () => {
    setOpen(false);
  };

  const showQueueList = () => {
    userType === 'ADMIN' ?
      window.open('/apps/admin') :
      dispatch(InquiryActions.openQueueList(true));
  }

  const confirmBlDraft = () => {
    if (inquiries.some((inq) => !['RESOLVED', 'UPLOADED', 'COMPL'].includes(inq.state))) {
      dispatch(AppActions.showMessage({ message: "Unable to confirm, still has pending inquiry/amendment", variant: 'warning' }));
    }
    setOpen(true);
  };

  const redirectWorkspace = () => {
    const bl = new URLSearchParams(search).get('bl');
    if (bl) history.push(`/guest?bl=${bl}`, { skipVerification: true });
  };

  const showMessageReply = () => {
    return inquiries.some((inq) => ['INQ_SENT', 'REP_Q_SENT'].includes(inq.state) || inq.state === 'REP_SENT' && inq.creator?.accountRole === 'Admin');
  }

  const onSubmit = async () => {
    if (showMessageReply()) {
      dispatch(AppActions.showMessage({ message: 'There are still remaining Inquiries/Amendments that have not yet been replied', variant: 'warning' }));
    }
    dispatch(FormActions.togglePreviewSubmitList(true));
    dispatch(InquiryActions.setShowBackgroundAttachmentList(true));
  };

  const handleSelectView = (e) => {
    const { value } = e.target;
    dispatch(DraftBLActions.setDrfView(value));
    localStorage.setItem("drfView", value);
  }

  return (
    <ThemeProvider theme={toolbarTheme}>
      {(isLoading <= 0) && (
        <AppBar id="fuse-toolbar" className="flex relative z-10" color="inherit">
          <Toolbar className="p-0">
            {config.navbar.display && config.navbar.position === 'left' && (
              <Hidden lgUp>
                <NavbarMobileToggleButton className="w-64 h-64 p-0" />
                <div className={classes.separator} />
              </Hidden>
            )}

            <div className="flex flex-1" style={{ marginLeft: 35 }}>
              <div className={classes.iconWrapper}>
                <Button variant="text" size="medium">
                  <Avatar
                    src="assets/images/logos/one_ocean_network-logo.png"
                    className={clsx(classes.logo, classes.fitAvatar)}
                    alt="one-logo"
                    onClick={() => showQueueList()}
                  // {...(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD }) && {
                  //   component: Link,
                  //   to: '/'
                  // })}
                  />
                </Button>

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
                    <img src="assets/images/icons/inquiryIcon.svg" />
                  </Badge>
                  <span className={classes.titleButton}>Inquiries List</span>
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
                      <img src="assets/images/icons/amendIcon.svg" />
                      <img src="assets/images/icons/penIcon.svg" style={{ position: 'absolute', bottom: 0, left: 8 }} />
                    </Badge>
                    <span className={classes.titleButton}>Amendments List</span>
                  </Button>
                )}

              <PermissionProvider
                action={PERMISSION.VIEW_SHOW_ALL_INQUIRIES}
                extraCondition={['/workspace', '/guest'].some((el) => pathname.includes(el))}>
                {attachmentLength > 0 &&
                  <Button
                    variant="text"
                    size="medium"
                    className={clsx('h-64', classes.button)}
                    onClick={openAttachment}>
                    <Badge color="primary" badgeContent={attachmentLength} id="no-att">
                      <img src="assets/images/icons/attachmentIcon.svg" />
                    </Badge>
                    <span className={classes.titleButton}>Attachments List</span>
                  </Button>
                }

              </PermissionProvider>
            </div>

            <div className="flex" style={{ alignItems: 'center' }}>
              {!pathname.includes('/draft') &&
                <TextField
                  id="view"
                  name="view"
                  select
                  value={drfView}
                  onChange={(e) => handleSelectView(e)}
                  variant="outlined"
                  className={clsx(classes.button, classes.selectView)}
                  InputProps={{
                    className: classes.selectViewProps
                  }}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      getContentAnchorEl: null,
                      PaperProps: {
                        style: {
                          minWidth: 0,
                          position: 'absolute',
                          top: '-100px'
                        }
                      }
                    }
                  }}>
                  {drfViews.map(view => (
                    <MenuItem
                      key={view.value}
                      value={view.value}
                      className={view.value === drfView ? classes.menuItemSelected : classes.menuItem}>
                      <span className={classes.dratTypeText}>{view.label}</span>
                    </MenuItem>
                  ))}
                </TextField>}

              {!pathname.includes('/draft') && <BtnQueueList />}

              <PermissionProvider
                action={PERMISSION.VIEW_EDIT_DRAFT_BL}
                extraCondition={pathname.includes('/draft-bl') || pathname.includes('/workspace')}>
                <Button
                  className={clsx(classes.button, classes.buttonEditDraftBL)}
                  style={{ width: 110, fontSize: 12, height: 30 }}
                  onClick={redirectWorkspace}>
                  <img src="assets/images/icons/amendIconPink.svg" style={{ width: 12, height: 12, position: 'relative', left: 5 }} />
                  <img src="assets/images/icons/penIconPink.svg" style={{ position: 'relative', top: 5, width: 8 }} />
                  <span claseeName={classes.dratTypeText}>Amendment</span>
                </Button>
                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.buttonComfirm)}
                  style={{ width: 85, height: 30 }}
                  onClick={confirmBlDraft}>
                  <img src="assets/images/icons/confirm.svg" style={{ position: 'relative', right: 2, width: 11, height: 11 }} />
                  <span claseeName={classes.dratTypeText}>Confirm</span>
                </Button>
                <DialogConfirm open={open} handleClose={handleClose} />
              </PermissionProvider>

              <PermissionProvider
                action={PERMISSION.MAIL_SEND_MAIL}
                extraCondition={pathname.includes('/workspace')}>
                <div>
                  <Button
                    style={{
                      width: 80,
                      height: 30,
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    disabled={inquiries.filter(inq => ['UPLOADED', 'COMPL', 'RESOLVED', 'AME_SENT', 'ANS_SENT', 'REP_A_SENT'].includes(inq.state)).length === inquiries.length}
                    color="primary"
                    variant="contained"
                    size="medium"
                    className={clsx('h-64', classes.button)}
                    onClick={openEmail}>
                    <img src="assets/images/icons/email.svg" style={{ position: 'relative', right: 3, width: 12, height: 12, top: 1 }} />
                    <span>Email</span>
                  </Button>
                </div>
              </PermissionProvider>

              <PermissionProvider
                action={PERMISSION.MAIL_SEND_MAIL}
                extraCondition={pathname.includes('/guest')}
              >
                <div>
                  <Button
                    //color="primary"
                    variant="contained"
                    className={clsx(classes.button, classes.buttonSubmit)}
                    style={{ width: 80, height: 30 }}
                    // className={clsx('h-64', classes.button)}
                    onClick={openEmail}>
                    <img src="assets/images/icons/forwardMail.svg" style={{ position: 'relative', width: 10, height: 10 }} />
                    <span className="pl-4">Forward</span>
                  </Button>
                </div>
              </PermissionProvider>

              <PermissionProvider
                action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}
                extraCondition={!pathname.includes('/draft-bl')}>
                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.buttonSubmit)}
                  style={{ width: 80, height: 30 }}
                  disabled={!enableSubmitInq}
                  onClick={onSubmit}>
                  <img src="assets/images/icons/submitIcon.svg" style={{ position: 'relative', width: 12, height: 12, right: 3 }} />
                  Submit
                </Button>
              </PermissionProvider>

              <PreviewDraftBL />

              <User />
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
