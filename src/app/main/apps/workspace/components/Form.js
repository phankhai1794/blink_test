import { PERMISSION, PermissionProvider } from '@shared/permission';
import { NUMBER_INQ_BOTTOM, toFindDuplicates } from '@shared';
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
import * as AppActions from 'app/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import PopoverFooter from './PopoverFooter';
import PopoverFooterAdmin from './PopoverFooter1';

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
            <MinimizeIcon />
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
          <IconButton aria-label="close">
            <OpenInNew />
          </IconButton>
          <IconButton aria-label="close" onClick={handleClose}>
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
    marginTop: '2rem',
    backgroundColor: 'white',
    width: (props) => (props.isFullScreen ? '1200px' : '900px')
  },
  dialogContentAttachment: {
    padding: '0',
    position: 'relative'
  },
  divider: {
    backgroundColor: '#8A97A3'
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
  }
}));

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
    disableSendBtn,
  } = props;

  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);

  const listInqMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listInqMinimize);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);

  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const isShowBackground = useSelector(
    ({ workspace }) => workspace.inquiryReducer.isShowBackground
  );

  const openAllInquiry = useSelector(({ workspace }) => workspace.formReducer.openAllInquiry);
  const showSaveInquiry = useSelector(({ workspace }) => workspace.formReducer.showSaveInquiry);
  const openInqReview = useSelector(({ workspace }) => workspace.formReducer.openInqReview);

  const [openFab, setOpenFab] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const classes = useStyles({ isFullScreen });
  const classesHover = useStyles();
  const [idBtn, setIdBtn] = useState('');

  useEffect(() => {
    const temp = listMinimize.find((e) => e.field === field);
    for (let index = 0; index < listInqMinimize.length; index++) {
      if (index < NUMBER_INQ_BOTTOM && listInqMinimize[index] === temp.id) {
        setOpenFab(true);
        break;
      }
    }
  }, [listInqMinimize]);

  const checkValidate = (question) => {
    if (
      !question.inqType ||
      !question.field ||
      !question.receiver.length ||
      !question.ansType ||
      !question.content
    ) {
      dispatch(
        InquiryActions.validate({
          ...valid,
          field: Boolean(question.field),
          inqType: Boolean(question.inqType),
          ansType: Boolean(question.ansType),
          receiver: Boolean(question.receiver.length),
          content: Boolean(question.content)
        })
      );
      return false;
    }
    //check empty type choice
    const typeChoice = metadata.ans_type['choice'];
    if (typeChoice === question.ansType) {
      if (question.answerObj.length > 0) {
        const checkOptionEmpty = question.answerObj.filter((item) => !item.content);
        if (checkOptionEmpty.length > 0) {
          dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
          return false;
        } else {
          dispatch(InquiryActions.validate({ ...valid, answerContent: true }));
        }
      } else {
        dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
        return false;
      }
    }
    if (typeChoice === question.ansType && question.answerObj.length) {
      const dupArray = question.answerObj.map((ans) => ans.content);
      if (toFindDuplicates(dupArray).length) {
        dispatch(
          AppActions.showMessage({ message: 'Options must not be duplicated', variant: 'error' })
        );
        return false;
      }
    }
    return true;
  };
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

  const handleClick = () => {
    if (!currentEditInq) {
      if (openAllInquiry) {
        toggleForm(false);
        dispatch(FormActions.toggleSaveInquiry(false));
        dispatch(FormActions.toggleCreateInquiry(true));
      } else {
        if (inquiries.length + 1 === metadata.field_options.length) {
          dispatch(FormActions.toggleAddInquiry(false));
        }
      }
      dispatch(InquiryActions.addQuestion());
    }
  };

  const sortListClose = (list, field) => {
    const index = list.findIndex((inp) => inp.field === field);
    const tempInq = list.splice(index, 1)[0];
    list.splice(list.length, 0, tempInq);
  };

  const [value, setValue] = useState(0);
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
    if (field === 'ATTACHMENT_LIST') {
      dispatch(FormActions.toggleReload());
    } else {
      // dispatch(InquiryActions.editInquiry(JSON.parse(JSON.stringify(originalInquiry))));
    }
    dispatch(FormActions.toggleSaveInquiry(false));
    dispatch(InquiryActions.setOneInq({}));
    //
    const currentInq = listMinimize.find((q) => q.field === field);
    if (currentInq?.id && listInqMinimize.includes(currentInq.id)) {
      const filterInq = listInqMinimize.filter((id) => id !== currentInq.id);
      dispatch(InquiryActions.setListInqMinimize(filterInq));
    }
    //
    dispatch(InquiryActions.setOpenedInqForm(false));
    dispatch(FormActions.setEnableSaveInquiriesList(true));
  };
  const handleChange = (_, newValue) => {
    setValue(newValue);
    props.tabChange(newValue);
  };
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

  const handleSetOpenFab = (status) => {
    setOpenFab(status);
  };

  const countInq = (recevier) => {
    let count = 0;
    inquiries.forEach((inq) => inq.receiver.includes(recevier) && count++);
    return count;
  };

  const sendMailClick = () => {
    toggleForm(false);
    dispatch(FormActions.toggleOpenEmail(true))
  };

  useEffect(() => {
    if (tabs) {
      props.tabChange(0);
      setValue(0);
    }
  }, [openInqReview, inquiries]);

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
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
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
        {tabs && (
          <Box style={{ borderBottom: '1px solid #515F6B' }} sx={{}}>
            <Tabs
              indicatorColor="primary"
              style={{ margin: 0 }}
              value={value}
              onChange={handleChange}>
              {countInq('customer') && <Tab
                classes={{ wrapper: classes.iconLabelWrapper }}
                className={clsx(classes.tab, value === 0 && classes.colorSelectedTab)}
                label="Customer"
                icon={
                  <div className={clsx(classes.countBtn, value === 0 && classes.colorCountBtn)}>
                    {countInq('customer')}
                  </div>
                }
              />}
              {countInq('onshore') && <Tab
                classes={{ wrapper: classes.iconLabelWrapper }}
                className={clsx(classes.tab, (value === 1 || !countInq('customer')) && classes.colorSelectedTab)}
                label="Onshore"
                icon={
                  <div className={clsx(classes.countBtn, (value === 1 || !countInq('customer')) && classes.colorCountBtn)}>
                    {countInq('onshore')}
                  </div>
                }
              />}
            </Tabs>
          </Box>
        )}
        <MuiDialogContent
          classes={{
            root:
              field === 'ATTACHMENT_LIST' ? classes.dialogContentAttachment : classes.dialogContent
          }}
          style={{ overflow: field === 'ATTACHMENT_LIST' && isShowBackground ? 'hidden' : '' }}>
          {children}
        </MuiDialogContent>
        {!popoverfooter && <Divider classes={{ root: classes.divider }} />}
        {customActions == null && (
          <DialogActions style={{ display: 'none !important', height: (hasAddButton === undefined || hasAddButton === true) && 70 }}>
            {(hasAddButton === undefined || hasAddButton === true) && (
              <PermissionProvider action={PERMISSION.INQUIRY_CREATE_INQUIRY}>
                <div style={{ right: '3rem', padding: '2.6rem', position: 'absolute' }}>
                  <Link
                    component="button"
                    variant="body2"
                    underline='none'
                    onClick={handleClick}
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <AddCircleOutlineIcon
                      style={{ color: currentEditInq ? '#d3d3d3' : '#BD0F72', left: '8.33%', right: '8.33%', border: '2px' }}
                    />
                    <span
                      style={{
                        color: currentEditInq ? '#d3d3d3' : '#BD0F72',
                        fontSize: '16px',
                        fontWeight: '600',
                        fontFamily: 'Montserrat',
                        width: '98px',
                        height: '20px',
                        fontStyle: 'normal'
                      }}>
                      Add Inquiry
                    </span>
                  </Link>
                </div>
              </PermissionProvider>
            )}
            {showBtnSend ?
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
                      backgroundColor: disableSendBtn ? '#CCD3D1' : '#bd1874',
                      borderRadius: '8px',
                      fontFamily: 'Montserrat'
                    }}
                    disabled={disableSendBtn}
                    onClick={sendMailClick}
                  >
                    Send
                  </Button>
                </div>
              </PermissionProvider> :
              <div style={{ marginLeft: '2rem' }}>
                <PopoverFooter user={user} title={field} />
              </div>
            }
          </DialogActions >
        )}
        {customActions}
      </Dialog >
    </div >
  );
}
