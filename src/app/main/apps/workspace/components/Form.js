import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { Box, Tabs, Tab, Fab, Divider, Link } from '@material-ui/core';
import CropDinIcon from '@material-ui/icons/CropDin';
import CropIcon from '@material-ui/icons/Crop';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import OpenInNew from '@material-ui/icons/OpenInNew';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import PopoverFooter from './PopoverFooter';
import PopoverFooterAdmin from './PopoverFooter1';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1, 2)
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
        <div style={{ width: '30%', textAlign: 'right' }}>
          <IconButton
            aria-label="close"
            onClick={handleOpenSnackBar}
            style={{ textAlign: 'center' }}
          >
            <MinimizeIcon />
          </IconButton>
          {isFullScreen ? (
            <IconButton
              aria-label="close"
              onClick={() => openFullScreen(false)}
              style={{ textAlign: 'center' }}
            >
              <CropIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="close"
              onClick={() => openFullScreen(true)}
              style={{ textAlign: 'center' }}
            >
              <CropDinIcon />
            </IconButton>
          )}
          <IconButton aria-label="close" >
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
  }
}));

export default function Form(props) {
  const dispatch = useDispatch();
  const { children, title, field, hasAddButton, FabTitle, open, toggleForm, customActions, tabs, popoverfooter } =
    props;
  const [index, question] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEdit,
    workspace.inquiryReducer.question,
  ]);

  const [openAllInquiry, showSaveInuiry] = useSelector(({ workspace }) => [
    workspace.formReducer.openAllInquiry,
    workspace.formReducer.showSaveInuiry
  ]);

  const [openFab, setOpenFab] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const classes = useStyles({ isFullScreen });

  const checkValidate = (question) => {
    if (!question.inqType || !question.field || !question.receiver.length) {
      dispatch(
        InquiryActions.validate({
          field: Boolean(question.field),
          inqType: Boolean(question.inqType),
          receiver: Boolean(question.receiver.length),
        })
      );
      return false;
    }
    return true;
  };
  const handleOpenFab = () => {
    dispatch(FormActions.minimize(true));
    setOpenFab(true);
    toggleForm(false);
  };
  const toggleFullScreen = (open) => {
    setIsFullScreen(open);
  };

  const handleClick = () => {
    if (openAllInquiry) {
      dispatch(InquiryActions.addQuestion1());
    } else if (checkValidate(question[index])) {
      dispatch(InquiryActions.addQuestion());
      dispatch(InquiryActions.setEdit(index + 1));
    }
  };
  const handleClose = () => {
    dispatch(FormActions.minimize(false));
    toggleForm(false);
    setOpenFab(false);
    if (openAllInquiry) {
      setTimeout(() => {
        dispatch(FormActions.toggleAllInquiry());
      }, 400);
    }
    dispatch(InquiryActions.setReply(false));
    dispatch(InquiryActions.setEditInq(null))
    dispatch(FormActions.toggleSaveInquiry(false))
    if (tabs) props.tabChange(0);
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (_, newValue) => {
    setValue(newValue);
    props.tabChange(newValue);
  };
  return (
    <div>
      {openFab && (
        <Fab
          variant="extended"
          style={{ marginLeft: '0.5rem', maxWidth: '12rem', display: 'block' }}
          onClick={() => toggleForm(true)}
          color="primary"
        >
          {' '}
          {FabTitle}
        </Fab>
      )}
      <Dialog
        fullScreen={isFullScreen}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        classes={{ paperScrollPaper: isFullScreen ? null : classes.dialogPaper }}
      >
        <DialogTitle
          id="customized-dialog-title"
          toggleFullScreen={toggleFullScreen}
          handleOpenSnackBar={handleOpenFab}
          toggleForm={toggleForm}
          isFullScreen={isFullScreen}
          handleClose={handleClose}
        >
          {title || null}
        </DialogTitle>
        <Divider classes={{ root: classes.divider }} />
        {tabs && (
          <Box style={{}} sx={{}}>
            <Tabs
              indicatorColor="secondary"
              style={{ margin: 0, backgroundColor: '#102536' }}
              value={value}
              onChange={handleChange}
            >
              <Tab style={{ color: 'white' }} label="Customer" />
              <Tab style={{ color: 'white' }} label="Onshore" />
            </Tabs>
          </Box>
        )}
        <MuiDialogContent classes={{ root: classes.dialogContent }}>{children}</MuiDialogContent>
        {!popoverfooter && <Divider classes={{ root: classes.divider }} />}
        {customActions == null && (
          <DialogActions style={{ display: 'none !important' }}>
            {(hasAddButton === undefined || hasAddButton === true) && !openAllInquiry && (
              <div style={{ right: '3rem', bottom: '2.6rem', position: 'absolute' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleClick}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <AddCircleOutlineIcon fontSize="large" />
                  <span style={{ color: '#BD0F72', fontSize: '16px', marginLeft: '5px', fontWeight: 'bold' }}>Add Inquiry</span>
                </Link>
              </div>
            )}
            {!popoverfooter &&
              <div style={{ marginLeft: '2rem' }}>
                {!showSaveInuiry ? (
                  <PopoverFooter title={field} />
                ) : (
                  <PermissionProvider action={PERMISSION.VIEW_SAVE_INQUIRY}>
                    <PopoverFooterAdmin />
                  </PermissionProvider>
                )}
              </div>
            }
          </DialogActions>
        )}
        {customActions}
      </Dialog>
    </div>
  );
}
