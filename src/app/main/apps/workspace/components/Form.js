import { PERMISSION, PermissionProvider } from '@shared/permission';
import { NUMBER_INQ_BOTTOM, toFindDuplicates } from '@shared';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { Box, Tabs, Tab, Divider, Link, Chip } from '@material-ui/core';
import CropDinIcon from '@material-ui/icons/CropDin';
import CropIcon from '@material-ui/icons/Crop';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import OpenInNew from '@material-ui/icons/OpenInNew';
import * as AppActions from 'app/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import PopoverFooter from './PopoverFooter';
import PopoverFooterAdmin from './PopoverFooter1';

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
          <div style={{ color: '#8A97A3', fontSize: '26px', fontWeight: '600' }}>{children}</div>
        </div>
        <div style={{ width: '30%', textAlign: 'right', paddingRight: '16px', paddingTop: '8px' }}>
          <IconButton
            aria-label="close"
            onClick={handleOpenSnackBar}
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
    width: '950px',
    minHeight: '600px'
  },
  dialogContent: {
    margin: 'auto',
    marginTop: '2rem',
    backgroundColor: 'white',
    width: (props) => (props.isFullScreen ? '1200px' : '900px')
  },
  divider: {
    backgroundColor: '#8A97A3'
  },
  chip: {
    marginLeft: '0.2rem'
  }
}));

export default function Form(props) {
  const dispatch = useDispatch();
  const {
    children,
    title,
    field,
    hasAddButton,
    FabTitle,
    open,
    toggleForm,
    customActions,
    tabs,
    popoverfooter
  } = props;

  const [
    index,
    question,
    inquiries,
    metadata,
    currentField,
    originalInquiry,
    listInqMinimize,
    listMinimize,
    valid
  ] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEdit,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.originalInquiry,
    workspace.inquiryReducer.listInqMinimize,
    workspace.inquiryReducer.listMinimize,
    workspace.inquiryReducer.validation
  ]);

  const [openAllInquiry, showSaveInquiry, showAddInquiry] = useSelector(({ workspace }) => [
    workspace.formReducer.openAllInquiry,
    workspace.formReducer.showSaveInquiry,
    workspace.formReducer.showAddInquiry
  ]);

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
    if (!question.inqType || !question.field || !question.receiver.length || !question.content) {
      dispatch(
        InquiryActions.validate({
          ...valid,
          field: Boolean(question.field),
          inqType: Boolean(question.inqType),
          ansType: Boolean(question.ansType),
          receiver: Boolean(question.receiver.length),
          content: Boolean(question.content),
        })
      );
      return false;
    }
    //check empty type choice
    const typeChoice = metadata.ans_type['choice'];
    if (typeChoice === question.ansType) {
      if (question.answerObj.length > 0) {
        const checkOptionEmpty = question.answerObj.filter(item => !item.content);
        if (checkOptionEmpty.length > 0) {
          dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
          return false;
        } else {
          dispatch(InquiryActions.validate({ ...valid, answerContent: true}));
        }
      } else {
        dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
        return false;
      }
    }
    if (question.answerObj.length) {
      const dupArray = question.answerObj.map(ans => ans.content)
      if (toFindDuplicates(dupArray).length) {
        dispatch(AppActions.showMessage({ message: "Options must not be duplicated", variant: 'error' }));
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
    if (openAllInquiry) {
      dispatch(InquiryActions.addQuestion1());
    } else if (checkValidate(question[index])) {
      if (inquiries.length + question.length + 1 === metadata.field_options.length) {
        dispatch(FormActions.toggleAddInquiry(false));
      }
      dispatch(InquiryActions.addQuestion());
      dispatch(InquiryActions.setEdit(question.length));
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
        dispatch(FormActions.toggleAllInquiry());
      }, 400);
    }
    sortListClose(listMinimize, field);
    dispatch(InquiryActions.setReply(false));
    dispatch(InquiryActions.setEditInq(null));
    if (field === 'ATTACHMENT_LIST') {
      dispatch(FormActions.toggleReload());
    } else {
      dispatch(InquiryActions.editInquiry(JSON.parse(JSON.stringify(originalInquiry))));
    }
    dispatch(FormActions.toggleSaveInquiry(false));
    if (tabs) props.tabChange(0);
    dispatch(InquiryActions.setOneInq({}));
    //
    const currentInq = listMinimize.find((q) => q.field === field);
    if (currentInq?.id && listInqMinimize.includes(currentInq.id)) {
      const filterInq = listInqMinimize.filter((id) => id !== currentInq.id);
      dispatch(InquiryActions.setListInqMinimize(filterInq));
    }
  };
  const [value, setValue] = React.useState(0);
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
          <Box style={{}} sx={{}}>
            <Tabs
              indicatorColor="secondary"
              style={{ margin: 0, backgroundColor: '#102536' }}
              value={value}
              onChange={handleChange}>
              <Tab style={{ color: 'white' }} label="Customer" />
              <Tab style={{ color: 'white' }} label="Onshore" />
            </Tabs>
          </Box>
        )}
        <MuiDialogContent classes={{ root: classes.dialogContent }}>{children}</MuiDialogContent>
        {!popoverfooter && <Divider classes={{ root: classes.divider }} />}
        {customActions == null && (
          <DialogActions style={{ display: 'none !important' }}>
            {(hasAddButton === undefined || hasAddButton === true) &&
              !openAllInquiry &&
              showAddInquiry && (
              <div style={{ right: '3rem', bottom: '2.6rem', position: 'absolute' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleClick}
                  style={{ display: 'flex', alignItems: 'center' }}>
                  <AddCircleOutlineIcon fontSize="large" />
                  <span
                    style={{
                      color: '#BD0F72',
                      fontSize: '16px',
                      marginLeft: '5px',
                      fontWeight: 'bold'
                    }}>
                      Add Inquiry
                  </span>
                </Link>
              </div>
            )}
            {!popoverfooter && (
              <div style={{ marginLeft: '2rem' }}>
                {!showSaveInquiry ? (
                  <PopoverFooter title={field} />
                ) : (
                  <PermissionProvider action={PERMISSION.VIEW_SAVE_INQUIRY}>
                    <PopoverFooterAdmin handleToggleFab={handleSetOpenFab} />
                  </PermissionProvider>
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
