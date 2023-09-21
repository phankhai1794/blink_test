import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import User from 'app/fuse-layouts/shared-components/User';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import * as AppActions from 'app/store/actions';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Badge, Button, Hidden, TextField, MenuItem, Tooltip, Icon, IconButton } from '@material-ui/core';
import DialogConfirm from 'app/fuse-layouts/shared-components/DialogConfirm';
import { loadComment } from 'app/services/inquiryService';
import { getCommentDraftBl } from 'app/services/draftblService';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import axios from 'axios';

import * as InquiryActions from '../../../main/apps/workspace/store/actions/inquiry';

import PreviewDraftBL from './PreviewDraftBL';
import BtnQueueList from './BtnQueueList';
import useShowQueueListCallback from './useShowQueueListCallback';

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
    }
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
    }
  },
  menuItemSelected: {
    background: `${lightThemeColor} !important`,
    color: themeColor,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'Montserrat'
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
  warningHeader: {
    top: 58,
    width: '100%',
    height: 36,
    padding: '2px 13px 2px 13px',
    position: 'fixed',
    background: 'rgba(243, 146, 0, 1)',
    zIndex: 10000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  warningText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#FAFAFA'
  },
  closeWarningIcon: {
    cursor: 'pointer',
    marginRight: 25
  }
}));

function ToolbarLayout1(props) {
  const { pathname, search } = window.location;
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
  const isPreviewingDraftPage = useSelector(({ draftBL }) => draftBL.isPreviewingDraftPage);

  const [open, setOpen] = useState(false);
  const [attachmentLength, setAttachmentLength] = useState(0);
  const [amendmentsLength, setAmendmentLength] = useState();
  const [inquiryLength, setInquiryLength] = useState();
  const [showBack, setShowBack] = useState(true);
  const [isShowWarning, setShowWarning] = useState(pathname.includes('/draft-bl') ? true : false);

  const { showQueueList } = useShowQueueListCallback();

  const enableSubmitInq = inquiries.some((inq) => ['ANS_DRF', 'REP_A_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state));
  const msgConfirmDrf = inquiries.some((inq) => !['RESOLVED', 'UPLOADED', 'COMPL'].includes(inq.state)) ? 'Still has pending inquiry/amendment \n' : '';

  useEffect(() => {
    // check display button back (draft process)
    if (isPreviewingDraftPage) {
      const btnBack = new URLSearchParams(search).get('btn-back');
      if (btnBack) {
        setShowBack(true);
        const bl = new URLSearchParams(search).get('bl');
        const url = new URL(window.location);
        url.searchParams.set('bl', bl);
        window.history.pushState({}, '', `${pathname}?bl=${bl}`);
      } else setShowBack(false);
    } else setShowBack(false);
  }, [isPreviewingDraftPage]);

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

  const fetchData = async (url, q) => {
    try {
      const response = await url;
      let reponseMap = [];
      if (response && response.length) {
        reponseMap = response.map(r => {
          return {
            ...r,
            inquiryId: q.id,
            inqType: q.inqType,
            field: q.field,
            process: q.process
          }
        })
      }
      return reponseMap;
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    dispatch(InquiryActions.checkSend(false));
    let optionInquiries = [...inquiries];

    if (pathname.includes('/guest') || pathname.includes('/workspace') || !isPreviewingDraftPage) {
      axios.all(optionInquiries.map(q => {
        if (q.process === 'pending') return fetchData(loadComment(q.id), q);
        if (q.process === 'draft') return fetchData(getCommentDraftBl(myBL.id, q.field), q);
      })) // TODO: refactor
        .then(res => {
          if (res) {
            let attachFileCount = [];
            let collectAttachment = [];
            if (res.length) {
              res.forEach((r, index) => {
                collectAttachment = [...collectAttachment, ...r];
              });
              if (collectAttachment.length) {
                collectAttachment = collectAttachment.filter(col => col.latestReply);
                collectAttachment.forEach(col => {
                  if (col.process === 'pending') {
                    let mediaMap = [];
                    if (col.type === 'ANS') {
                      mediaMap = [...mediaMap, ...col.answersMedia];
                    } else {
                      mediaMap = [...mediaMap, ...col.mediaFile];
                    }
                    if (mediaMap.length) {
                      mediaMap = mediaMap.map(q => {
                        return {
                          ...q,
                          inquiryId: col.id,
                          inqType: col.inqType,
                          field: col.field,
                          process: col.process
                        }
                      })
                    }
                    attachFileCount = [...attachFileCount, ...mediaMap];
                  } else if (col.process === 'draft') {
                    const { mediaFile } = col.content;
                    if (col.content && mediaFile.length) {
                      const mediaMap = mediaFile.map(q => {
                        return {
                          ...q,
                          inquiryId: col.id,
                          inqType: col.inqType,
                          field: col.field,
                          process: col.process
                        }
                      })
                      attachFileCount = [...attachFileCount, ...mediaMap];
                    }
                  }
                })
              }
            }
            setAttachmentLength(attachFileCount.length);
          }
        }).catch(err => {
          console.error(err)
        });
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

  const confirmBlDraft = () => setOpen(true);

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
      {isLoading <= 0 && (
        <>
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
                  {showBack &&
                    pathname.includes('/draft-bl') &&
                    !PermissionProvider({ action: PERMISSION.VIEW_ACCESS_EDIT_DRAFT_BL }) ? (
                    <Tooltip
                      title="Back"
                      onClick={() => dispatch(DraftBLActions.setPreviewingDraftBL(false))}>
                      <IconButton component="span">
                        <KeyboardBackspaceIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
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
                  )}
                </div>

                <PermissionProvider
                  action={PERMISSION.VIEW_SHOW_ALL_INQUIRIES}
                  extraCondition={
                    ['/workspace', '/guest'].some((el) => pathname.includes(el)) ||
                    !isPreviewingDraftPage
                  }>
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
                  (['/workspace', '/guest'].some((el) => pathname.includes(el)) ||
                    !isPreviewingDraftPage) && (
                    <Button
                      variant="text"
                      size="medium"
                      className={clsx('h-64', classes.button)}
                      onClick={openAmendmentsList}>
                      <Badge color="primary" badgeContent={amendmentsLength}>
                        <img src="assets/images/icons/amendIcon.svg" />
                        <img
                          src="assets/images/icons/penIcon.svg"
                          style={{ position: 'absolute', bottom: 0, left: 8 }}
                        />
                      </Badge>
                      <span className={classes.titleButton}>Amendments List</span>
                    </Button>
                  )}

                <PermissionProvider
                  action={PERMISSION.VIEW_SHOW_ALL_INQUIRIES}
                  extraCondition={
                    attachmentLength > 0 &&
                    (['/workspace', '/guest'].some((el) => pathname.includes(el)) ||
                      !isPreviewingDraftPage)
                  }>
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
                </PermissionProvider>
              </div>

              <div className="flex" style={{ alignItems: 'center' }}>
                {(['/workspace', '/guest'].some((el) => pathname.includes(el)) ||
                  !isPreviewingDraftPage) && (
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
                      {drfViews.map((view) => (
                        <MenuItem
                          key={view.value}
                          value={view.value}
                          className={
                            view.value === drfView ? classes.menuItemSelected : classes.menuItem
                          }>
                          <span className={classes.dratTypeText}>{view.label}</span>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                <PermissionProvider
                  action={PERMISSION.MYBL_GET_QUEUE_LIST}
                  extraCondition={!pathname.includes('/draft') || !isPreviewingDraftPage}>
                  <BtnQueueList />
                </PermissionProvider>

                <PermissionProvider
                  action={PERMISSION.VIEW_EDIT_DRAFT_BL}
                  extraCondition={pathname.includes('/draft-bl') && isPreviewingDraftPage}>
                  <Button
                    className={clsx(classes.button, classes.buttonEditDraftBL)}
                    style={{ width: 110, fontSize: 12, height: 30 }}
                    onClick={() => dispatch(DraftBLActions.setPreviewingDraftBL(false))}>
                    <img
                      src="assets/images/icons/amendIconPink.svg"
                      style={{ width: 12, height: 12, position: 'relative', left: 5 }}
                    />
                    <img
                      src="assets/images/icons/penIconPink.svg"
                      style={{ position: 'relative', top: 5, width: 8 }}
                    />
                    <span claseeName={classes.dratTypeText}>Amendment</span>
                  </Button>
                  <Button
                    variant="contained"
                    className={clsx(classes.button, classes.buttonComfirm)}
                    style={{ width: 85, height: 30 }}
                    onClick={confirmBlDraft}>
                    <img
                      src="assets/images/icons/confirm.svg"
                      style={{ position: 'relative', right: 2, width: 11, height: 11 }}
                    />
                    <span claseeName={classes.dratTypeText}>Confirm</span>
                  </Button>
                  <DialogConfirm open={open} handleClose={handleClose} msg={msgConfirmDrf} />
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
                      disabled={
                        inquiries.filter((inq) =>
                          [
                            'UPLOADED',
                            'COMPL',
                            'RESOLVED',
                            'AME_SENT',
                            'ANS_SENT',
                            'REP_A_SENT'
                          ].includes(inq.state)
                        ).length === inquiries.length
                      }
                      color="primary"
                      variant="contained"
                      size="medium"
                      className={clsx('h-64', classes.button)}
                      onClick={openEmail}>
                      <div style={{ textAlign: 'center' }}>
                        <img
                          src="assets/images/icons/email.svg"
                          style={{
                            width: 13,
                            height: 9,
                            display: 'inline-flex',
                            position: 'relative',
                            right: 2,
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ display: 'inline-block' }}>Email</span>
                      </div>
                    </Button>
                  </div>
                </PermissionProvider>

                {/* <PermissionProvider
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
                </PermissionProvider> */}

                <PermissionProvider
                  action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}
                  extraCondition={pathname.includes('/guest') || !isPreviewingDraftPage}>
                  <Button
                    variant="contained"
                    className={clsx(classes.button, classes.buttonSubmit)}
                    style={{ width: 80, height: 30 }}
                    disabled={!enableSubmitInq}
                    onClick={onSubmit}>
                    <img
                      src="assets/images/icons/submitIcon.svg"
                      style={{ position: 'relative', width: 12, height: 12, right: 3 }}
                    />
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
          {isShowWarning && isPreviewingDraftPage && (
            <div className={classes.warningHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img height="20px" src="/assets/images/icons/warningIcon.svg" />
                <p className={classes.warningText}>
                  This page is temporarily not available due to technical issues
                </p>
              </div>
              <img
                height="16px"
                className={classes.closeWarningIcon}
                src="/assets/images/icons/close_icon.svg"
                onClick={() => setShowWarning(false)}
              />
            </div>
          )}
        </>
      )}
    </ThemeProvider>
  );
}

export default ToolbarLayout1;
