import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';

import { withStyles, makeStyles } from '@material-ui/core/styles';
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
import {
  Box,
  Tabs,
  Tab
} from '@material-ui/core';
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: "70%" }}>
          <Typography variant="h6">{children}</Typography>
        </div>
        <div style={{ width: "30%", textAlign: "right" }}>
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
      </div>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 'auto',
    marginTop: '1rem',
    backgroundColor: "white"
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

const useStyles = makeStyles(() => ({
  dialogPaper: {
    width: '838px'
  }
}))
export default function Form(props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { children, title, field, hasAddButton, FabTitle, open, toggleForm, customActions, tabs } = props;
  const [index, openAllInquiry, question] = useSelector((state) => [
    state.workspace.openEdit,
    state.workspace.openAllInquiry,
    state.workspace.question
  ])
  const [openFab, setOpenFab] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const checkValidate = () => {
    if (!question[index].inqType || !question[index].field) {
      dispatch(Actions.validate({
        field: Boolean(question[index].field),
        inqType: Boolean(question[index].inqType)
      }));
      return false
    }
    return true
  }
  const handleOpenFab = () => {
    setOpenFab(true);
    toggleForm(false);
  };
  const toggleFullScreen = (open) => {
    setIsFullScreen(open);
  };

  const handleClick = () => {
    if (openAllInquiry) {
      dispatch(Actions.addQuestion1())
    }
    else if (checkValidate()) {
      dispatch(Actions.addQuestion())
      dispatch(Actions.setEdit(index + 1));
    }
  };
  const handleClose = () => {
    toggleForm(false);
    setOpenFab(false);
    dispatch(Actions.setReply(false))
    if (openAllInquiry) {
      dispatch(Actions.toggleAllInquiry())
    }
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          {title && title !== "open Inquiries" ? title : "open Inquiries"}
        </DialogTitle>
        {
          tabs && <Box style={{}} sx={{}}>
            <Tabs
              indicatorColor="secondary"
              style={{ margin: 0, backgroundColor: '#102536' }}
              value={value}
              onChange={handleChange}>
              <Tab style={{ color: 'white' }} label="Customer" />
              <Tab style={{ color: 'white' }} label="Onshore" />
            </Tabs>
          </Box>
        }
        <DialogContent>{children}</DialogContent>
        {customActions == null && (<DialogActions style={{ display: 'none !important' }}>
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
              {!openAllInquiry && <PopoverFooter forCustomer={false} title={field} />}
            </div>
          </div>
        </DialogActions>
        )}
        {
          customActions
        }
      </Dialog>
    </div>
  );
}
