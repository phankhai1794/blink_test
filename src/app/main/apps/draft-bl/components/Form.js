import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Divider } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogContent from "@material-ui/core/DialogContent";

import * as Actions from '../store/actions';

const white = '#FFFFFF';

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

const DialogTitle = withStyles(styles)(({
  classes,
  handleClose,
  children,
  ...other
}) => {
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '70%', padding: '1rem' }}>
          <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600' }}>{children}</div>
        </div>
        <div style={{ width: '30%', textAlign: 'right' }}>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(() => ({
  dialogPaper: {
    width: 1000,
    minHeight: 165,
    margin: 0
  },
  dialogContent: {
    backgroundColor: white,
    padding: '20.26px 41.2px 20px 39px'
  },
  divider: {
    backgroundColor: '#8A97A3'
  },
  chip: {
    marginLeft: '0.2rem'
  }
}));

export default function Form({ title, children }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const openDraftBL = useSelector(({ draftBL }) => draftBL.openDraftBL);

  const handleClose = () => dispatch(Actions.toggleDraftBLEdit(false))

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDraftBL}
        maxWidth="md"
        classes={{ paperScrollPaper: classes.dialogPaper }}
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{
            fontSize: 22,
            fontWeight: 600,
          }}
          handleClose={handleClose}
        >
          {title || null}
        </DialogTitle>
        <Divider classes={{ root: classes.divider }} />
        <MuiDialogContent classes={{ root: classes.dialogContent }}>{children}</MuiDialogContent>
      </Dialog>
    </div>
  )
}