import { PERMISSION, PermissionProvider } from '@shared/permission';
import { NUMBER_INQ_BOTTOM } from '@shared';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { ThemeProvider } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { Box, Tabs, Tab, Divider, Link, Chip, Button } from '@material-ui/core';
import CropDinIcon from '@material-ui/icons/CropDin';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import OpenInNew from '@material-ui/icons/OpenInNew';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import PopoverFooter from './PopoverFooter';
import PopupConfirmSubmit from './PopupConfirmSubmit';
import PopupConfirm from './PopupConfirm';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1, 2),
    '& .MuiIconButton-root': {
      padding: '6px',
      marginLeft: '4px'
    },
    '& .MuiIconButton-root:nth-child(1)': {
      height: '0px',
      padding: '0px',
      top: '-5px'
    }
  },
  dialogToolTips: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const {
    children,
    classes,
    handleOpenSnackBar,
    toggleFullScreen,
    isFullScreen,
    toggleForm,
    handleClose,
    ...other
  } = props;
  const dispatch = useDispatch();
  const openFullScreen = (state) => {
    dispatch(FormActions.setFullscreen(state));
    toggleFullScreen(state);
  };
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '70%', padding: '1rem' }}>
          <ThemeProvider theme={theme}>
            <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600' }}>{children}</div>
          </ThemeProvider>
        </div>
        <div style={{ width: '30%', textAlign: 'right', paddingRight: '2px', paddingTop: '8px' }}>
          <IconButton
            aria-label="close"
            // onClick={handleOpenSnackBar}
            onClick={() => { }}
            style={{ textAlign: 'center' }}>
            {/* <MinimizeIcon /> */}
          </IconButton>
          {isFullScreen ? (
            <IconButton
              aria-label="close"
              onClick={() => openFullScreen(false)}
              style={{ textAlign: 'center' }}>
              <FilterNoneIcon style={{ width: '20px' }} />
            </IconButton>
          ) : (
            <IconButton
              aria-label="close"
              onClick={() => openFullScreen(true)}
              style={{ textAlign: 'center' }}>
              <CropDinIcon />
            </IconButton>
          )}
          {/* <IconButton aria-label="close">
            <OpenInNew />
          </IconButton> */}
          <IconButton
            aria-label="close"
            onClick={() => {
              handleClose();
              openFullScreen(false);
            }}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </MuiDialogTitle>
  );
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    display: 'block !important',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const useStyles = makeStyles(() => ({
  dialogPaper: {
    minHeight: 600,
    maxHeight: '80%'
  },
  dialogContent: {
    margin: 'auto',
    backgroundColor: (props) => props.style?.backgroundColor || 'white', //email preview
    position: 'relative',
    width: (props) => (props.isFullScreen ? '1200px' : '900px')
  },
  dialogContentAttachment: {
    padding: '0',
    position: 'relative',
    width: (props) => (props.isFullScreen ? '1200px' : '950px')
  },
  divider: {
    backgroundColor: '#8A97A3',
    zIndex: 1
  },
  chip: {
    marginLeft: '0.2rem'
  },
  colorSelectedTab: {
    color: '#BD0F72'
  },
  tab: {
    fontFamily: 'Montserrat',
    textTransform: 'none',
    fontSize: '18px',
    fontWeight: '600'
  },
  iconLabelWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-around'
  },
  countBtn: {
    background: '#E2E6EA',
    fontSize: '14px',
    height: '24px',
    width: '24px',
    borderRadius: '4px',
    marginBottom: '0 !important'
  },
  colorCountBtn: {
    background: '#FDF2F2'
  },
  buttonProgress: {
    color: 'red',
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}));

const LinkButton = ({ text, disable, handleClick }) => {
  return (
    <div style={{ position: 'absolute', right: '1rem', zIndex: 10, padding: 21 }}>
      <Link
        component="button"
        variant="body2"
        underline="none"
        disabled={disable}
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={handleClick}>
        <AddCircleOutlineIcon
          style={{
            color: disable ? '#d3d3d3' : '#BD0F72',
            left: '8.33%',
            right: '8.33%',
            border: '2px',
            width: 25
          }}
        />
        <span
          style={{
            color: disable ? '#d3d3d3' : '#BD0F72',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'Montserrat',
            paddingLeft: 5,
            height: 20,
            fontStyle: 'normal'
          }}>
          {text}
        </span>
      </Link>
    </div>
  );
};

export default function Form(props) {
  const dispatch = useDispatch();
  const {
    user,
    children,
    title,
    field,
    hasAddButton,
    FabTitle,
    open,
    toggleForm,
    customActions,
    tabs,
    popoverfooter,
    showBtnSend,
    nums,
    tabSelected
  } = props;

  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const userType = useSelector(({ user }) => user.userType);
  const listInqMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listInqMinimize);
  const enableSubmit = useSelector(({ workspace }) => workspace.inquiryReducer.enableSubmit);
  const reply = useSelector(({ workspace }) => workspace.inquiryReducer.reply);
  const currentFieldAmend = useSelector(({ draftBL }) => draftBL.currentField);

  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const isShowBackground = useSelector(
    ({ workspace }) => workspace.inquiryReducer.isShowBackground
  );

  const openAllInquiry = useSelector(({ workspace }) => workspace.formReducer.openAllInquiry);
  const openPreviewListSubmit = useSelector(({ workspace }) => workspace.formReducer.openPreviewListSubmit);
  const openInqReview = useSelector(({ workspace }) => workspace.formReducer.openInqReview);
  const currentAmendment = useSelector(
    ({ workspace }) => workspace.inquiryReducer.currentAmendment
  );
  const isLoading = useSelector(({ workspace }) => workspace.mailReducer.isLoading);
  const openAmendmentList = useSelector(({ workspace }) => workspace.formReducer.openAmendmentList);

  const [openFab, setOpenFab] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const classes = useStyles({ isFullScreen, style: props.style });
  const classesHover = useStyles();
  const [idBtn, setIdBtn] = useState('');
  const [checkSubmit, setCheckSubmit] = useState(true);

  const enableSend = inquiries.filter(inq => ['UPLOADED', 'COMPL', 'RESOLVED'].includes(inq.state)).length !== inquiries.length;

  const handleOpenFab = () => {
    setIdBtn(currentField);
    setOpenFab(true);
    toggleForm(false);
    dispatch(InquiryActions.setOneInq({}));
    dispatch(FormActions.toggleSaveInquiry(false));
    // sort
    const currentInq = listMinimize.find((q) => q.field === field);
    if (currentInq?.id && !listInqMinimize.includes(currentInq.id)) {
      const minimizeOptions = [...listMinimize].filter((item) => item.id !== currentInq.id);
      minimizeOptions.unshift(currentInq);
      dispatch(InquiryActions.setListMinimize(minimizeOptions));
      listInqMinimize.push(currentInq.id);
      dispatch(InquiryActions.setListInqMinimize(listInqMinimize));
    }
    if (listInqMinimize.findIndex((inq) => inq === currentInq.id) >= NUMBER_INQ_BOTTOM) {
      setOpenFab(false);
    }
  };

  const toggleFullScreen = (open) => {
    setIsFullScreen(open);
  };
  const onUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
  }

  useEffect(() => {
    if (currentEditInq || currentFieldAmend || reply) {
      window.addEventListener("beforeunload", onUnload);
    }
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [currentEditInq, currentFieldAmend, reply])

  const handleClick = () => {
    if (!currentEditInq) {
      if (inquiries.length + 1 === metadata.field_options.length) {
        dispatch(FormActions.toggleAddInquiry(false));
      }
      dispatch(InquiryActions.addQuestion());
    }
  };

  const sortListClose = (list, field) => {
    const index = list.findIndex((inp) => inp.field === field);
    const tempInq = list.splice(index, 1)[0];
    list.splice(list.length, 0, tempInq);
  };

  const handleClose = () => {
    toggleForm(false);
    setOpenFab(false);

    if (openAllInquiry) {
      setTimeout(() => {
        dispatch(FormActions.toggleAllInquiry(false));
      }, 400);
    }

    sortListClose(listMinimize, field);
    dispatch(InquiryActions.setReply(false));
    dispatch(InquiryActions.setEditInq(null));

    if (field === 'ATTACHMENT_LIST') dispatch(FormActions.toggleReload());

    dispatch(FormActions.toggleSaveInquiry(false));
    dispatch(InquiryActions.setOneInq({}));

    const currentInq = listMinimize.find((q) => q.field === field);
    if (currentInq?.id && listInqMinimize.includes(currentInq.id)) {
      const filterInq = listInqMinimize.filter((id) => id !== currentInq.id);
      dispatch(InquiryActions.setListInqMinimize(filterInq));
    }

    dispatch(InquiryActions.setOpenedInqForm(false));
    dispatch(FormActions.setEnableSaveInquiriesList(true));
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
    dispatch(FormActions.openConfirmPopup({ openConfirmPopup: false }));
    dispatch(InquiryActions.addAmendment());
    dispatch(DraftBLActions.setCurrentField());
  };

  const handleChange = (_, newValue) => {
    props.tabChange(newValue);
  };

  useEffect(() => {
    let setNumber = 0;
    const countOnshore = inquiries.filter((inq) => {
      return inq.process === 'pending' && inq.receiver.includes('onshore')
        && (inq.state === 'OPEN' || inq.state === 'REP_Q_DRF')
    }).length;
    if (countOnshore !== 0 && tabSelected === 1) {
      setNumber = 1;
    }
    props.tabChange(setNumber);
  }, [enableSubmit, openAllInquiry]);

  const openMinimize = () => {
    dispatch(InquiryActions.setField(idBtn));
    const currentInq = listMinimize.find((q) => q.field === field);
    if (currentInq) {
      dispatch(InquiryActions.setOneInq(currentInq));
      toggleForm(true);
      if (field === 'INQUIRY_LIST') {
        dispatch(FormActions.toggleSaveInquiry(true));
      }
    }
  };

  const sendMailClick = () => {
    toggleForm(false);
    dispatch(FormActions.toggleOpenEmail(true));
    dispatch(InquiryActions.setOneInq({}));
  };

  const checkEnableBtnAddAmendment = () => {
    const filter = inquiries.filter((inq) => inq.field === currentField);
    if (!openAmendmentList) {
      if (!filter.length) return false;
      return !filter.some((inq) => inq.process === 'draft');
    }
    return true;
  };

  useEffect(() => {
    if (tabs) {
      props.tabChange(0);
    }
  }, [openInqReview]);

  useEffect(() => {
    const temp = listMinimize.find((e) => e.field === field);
    for (let index = 0; index < listInqMinimize.length; index++) {
      if (index < NUMBER_INQ_BOTTOM && listInqMinimize[index] === temp.id) {
        setOpenFab(true);
        break;
      }
    }
  }, [listInqMinimize]);

  const showAddAmendment = () => {
    return !(openAllInquiry || openPreviewListSubmit);
  };

  useEffect(() => {
    const isEmptyPopup = inquiries.filter(inq => inq.field === currentField);
    if (!openAmendmentList) {
      if (!isEmptyPopup.length) dispatch(InquiryActions.addAmendment(null));
      else dispatch(InquiryActions.addAmendment());
    } else {
      dispatch(InquiryActions.addAmendment());
    }
  }, [open]);

  return (
    <div>
      {openFab && (
        <Chip
          label={FabTitle}
          onClick={openMinimize}
          onDelete={handleClose}
          color="primary"
          className={classesHover.chip}
        />
      )}
      <Dialog
        fullScreen={isFullScreen}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        container={() => document.getElementById('content-wrapper')}
        classes={{ paperScrollPaper: isFullScreen ? null : classes.dialogPaper }}>
        <DialogTitle
          id="customized-dialog-title"
          toggleFullScreen={toggleFullScreen}
          handleOpenSnackBar={handleOpenFab}
          toggleForm={toggleForm}
          isFullScreen={isFullScreen}
          handleClose={handleClose}>
          {title || null}
        </DialogTitle>
        <Divider classes={{ root: classes.divider }} />
        {tabs?.length > 0 && ((nums && nums.some((num) => num > 0)) || openAllInquiry) && !openAmendmentList && (
          <Box
            style={{ marginLeft: 20, marginRight: 20, borderBottom: '1px solid #515F6B' }}
            sx={{}}>
            <Tabs
              indicatorColor="primary"
              style={{ display: 'flex', margin: 0, height: '50px' }}
              value={tabSelected}
              onChange={handleChange}>
              {(nums[0] || (openAllInquiry && inquiries.some((inq) => inq.receiver.includes('customer')))) && (
                <Tab
                  classes={{ wrapper: classes.iconLabelWrapper }}
                  className={clsx(classes.tab, tabSelected === 0 && classes.colorSelectedTab)}
                  label="Customer"
                  icon={
                    nums[0] ?
                      <div className={clsx(classes.countBtn, tabSelected === 0 && classes.colorCountBtn)}>
                        {nums[0]}
                      </div> : null
                  }
                />
              )}
              {(nums[1] || (openAllInquiry && inquiries.some((inq) => inq.receiver.includes('onshore')))) && (
                <Tab
                  classes={{ wrapper: classes.iconLabelWrapper }}
                  className={clsx(classes.tab, tabSelected === 1 && classes.colorSelectedTab)}
                  label="Onshore"
                  icon={
                    nums[1] ?
                      <div
                        className={clsx(
                          classes.countBtn,
                          (tabSelected === 1 || !nums[1]) && classes.colorCountBtn
                        )}>
                        {nums[1]}
                      </div> : null
                  }
                />
              )}
            </Tabs>
          </Box>
        )}
        <MuiDialogContent
          classes={{
            root:
              field === 'ATTACHMENT_LIST' ||
                ((field === 'INQUIRY_LIST' || field === currentField) && isShowBackground)
                ? classes.dialogContentAttachment
                : classes.dialogContent
          }}
          style={{
            overflow: isShowBackground && 'hidden'
          }}>
          {children}
        </MuiDialogContent>

        {field !== 'ATTACHMENT_LIST' && (
          <PopupConfirmSubmit
            field={field}
            user={user}
            handleCheckSubmit={() => setCheckSubmit(!checkSubmit)}
          />
        )}

        <PopupConfirm />

        {!popoverfooter && <Divider classes={{ root: classes.divider }} />}

        {customActions == null && (
          <DialogActions
            style={{
              display: 'none !important',
              height: (hasAddButton === undefined || hasAddButton === true) && 70
            }}>
            {(hasAddButton === undefined || hasAddButton === true) && (
              <PermissionProvider
                action={PERMISSION.INQUIRY_CREATE_INQUIRY}
                extraCondition={!openAmendmentList}>
                <LinkButton text="Add Inquiry" disable={currentEditInq} handleClick={handleClick} />
              </PermissionProvider>
            )}

            <PermissionProvider
              action={PERMISSION.VIEW_CREATE_AMENDMENT}
              extraCondition={
                showAddAmendment() && myBL?.state?.includes('DRF_') && userType === 'CUSTOMER' // Allow only customer to create amendment
              }>
              <LinkButton
                text="Add Amendment"
                disable={currentAmendment !== undefined}
                handleClick={() => dispatch(InquiryActions.addAmendment(null))}
              />
            </PermissionProvider>

            {showBtnSend && user === 'workspace' && (openAllInquiry || openAmendmentList) ? (
              <PermissionProvider action={PERMISSION.INQUIRY_CREATE_INQUIRY}>
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2.6rem' }}>
                  <Button
                    variant="text"
                    size="medium"
                    style={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      width: 120,
                      color: 'white',
                      backgroundColor: (!enableSend || isLoading) ? '#CCD3D1' : '#bd1874',
                      borderRadius: '8px',
                      fontFamily: 'Montserrat'
                    }}
                    disabled={!enableSend || isLoading}
                    onClick={sendMailClick}>
                    E-mail
                  </Button>
                  {isLoading && (
                    <CircularProgress
                      size={24}
                      style={{
                        color: 'red',
                        position: 'absolute'
                      }}
                    />
                  )}
                </div>
              </PermissionProvider>
            ) : (
              <div style={{ marginLeft: '2rem' }}>
                {field !== 'INQUIRY_REVIEW' && (
                  <PopoverFooter user={user} title={field} checkSubmit={checkSubmit} />
                )}
              </div>
            )}
          </DialogActions>
        )}
        {customActions}
      </Dialog>
    </div>
  );
}
