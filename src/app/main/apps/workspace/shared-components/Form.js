import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';

import WorkSpaceData from '../WorkSpaceData';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MinimizeIcon from '@material-ui/icons/Minimize';
import RemoveIcon from '@material-ui/icons/Remove';
import { Fab } from '@material-ui/core';
import CropDinIcon from '@material-ui/icons/CropDin';
import CropIcon from '@material-ui/icons/Crop';
import PopoverFooter from './PopoverFooter';
import { Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
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
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      <>
        <div className={classes.dialogToolTips}>
          <IconButton
            aria-label="close"
            onClick={handleOpenSnackBar}
            style={{ textAlign: 'center' }}
          >
            <RemoveIcon />
          </IconButton>
          {isFullScreen ? (
            <IconButton
              aria-label="close"
              onClick={() => toggleFullScreen(false)}
              style={{ textAlign: 'center' }}
            >
              <CropIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="close"
              onClick={() => toggleFullScreen(true)}
              style={{ textAlign: 'center' }}
            >
              <CropDinIcon />
            </IconButton>
          )}
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 'auto',
    marginTop: '1rem',
    backgroundColor: "snow"
    // maxWidth: "100%",
    // width: "780px"
  }
}))(MuiDialogContent);
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    display: 'block !important',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function Form(props) {
  const dispatch = useDispatch()
  const { children, title, hasAddButton, FabTitle, open, toggleForm } = props;
  const data = WorkSpaceData
  const index = useSelector((state) => state.workspace.openEdit)
  const [openFab, setOpenFab] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleOpenFab = () => {
    setOpenFab(true);
    toggleForm(false);
  };
  const toggleFullScreen = (open) => {
    setIsFullScreen(open);
  };

  const handleClick = () => {
    dispatch(Actions.addQuestion())
    dispatch(Actions.setEdit(index + 1));
  };
  const handleClose = () => {
    toggleForm(false);
    setOpenFab(false);
    dispatch(Actions.setReply(false))
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
      >
        <DialogTitle
          id="customized-dialog-title"
          toggleFullScreen={toggleFullScreen}
          handleOpenSnackBar={handleOpenFab}
          toggleForm={toggleForm}
          isFullScreen={isFullScreen}
          handleClose={handleClose}
        >
          {title && title !== "open Inquiries" ? data[title].title : "open Inquiries" }
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
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
              <PopoverFooter forCustomer={false} title={title} />
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
