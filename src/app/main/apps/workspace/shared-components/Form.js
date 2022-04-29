import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as InquiryActions from '../admin/store/actions/inquiry';
import * as FormActions from '../admin/store/actions/form';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { Box, Tabs, Tab, Fab, Divider } from '@material-ui/core';
import CropDinIcon from '@material-ui/icons/CropDin';
import CropIcon from '@material-ui/icons/Crop';
import AddIcon from '@material-ui/icons/Add';

import { PERMISSION, PermissionProvider } from '@shared/permission';
import PopoverFooter from './PopoverFooter';
import PopoverFooterAdmin from '../admin/components/PopoverFooter';

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
        <div style={{ width: '70%' }}>
          <Typography variant="h6">{children}</Typography>
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
    width: '850px'
  },
  dialogContent: {
    margin: 'auto',
    marginTop: '1rem',
    backgroundColor: 'white',
    width: (props) => (props.isFullScreen ? '1200px' : '770px')
  }
}));

export default function Form(props) {
  const dispatch = useDispatch();
  const { children, title, field, hasAddButton, FabTitle, open, toggleForm, customActions, tabs } =
    props;
  const [index, question] = useSelector((state) => [
    state.workspace.inquiryReducer.currentEdit,
    state.workspace.inquiryReducer.question
  ]);

  const [openAllInquiry] = useSelector((state) => [state.workspace.formReducer.openAllInquiry]);

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
          error: true
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
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.tabChange(newValue);
  };
  return (
    <div>
      {openFab && (
        <Fab
          variant="extended"
          style={{ position: 'fixed', right: '2rem', bottom: '1rem' }}
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
        {customActions == null && (
          <DialogActions style={{ display: 'none !important' }}>
            <div style={{ position: 'relative' }}>
              {(hasAddButton === undefined || hasAddButton === true) && (
                <Fab
                  size="small"
                  color="primary"
                  style={{ right: '0.5rem', bottom: '5rem', position: 'absolute' }}
                  onClick={handleClick}
                >
                  <AddIcon />
                </Fab>
              )}
              <div style={{ marginTop: '2rem', marginLeft: '2rem' }}>
                <Divider />
                {!openAllInquiry ? (
                  <PopoverFooter title={field} checkValidate={checkValidate} />
                ) : (
                  <PermissionProvider action={PERMISSION.VIEW_SAVE_INQUIRY}>
                    <PopoverFooterAdmin />
                  </PermissionProvider>
                )}
              </div>
            </div>
          </DialogActions>
        )}
        {customActions}
      </Dialog>
    </div>
  );
}
