import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const primary = '#BD0F72';
const light = '#FBEDF4';
const useStyles = makeStyles((theme) => ({
  root: {},
  contentText: {
    '& h6': {
      fontFamily: 'Montserrat',
      textAlign: 'center',
      fontWeight: '400'
    }
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    '& .MuiButtonBase-root': {
      borderRadius: '8px',
      textTransform: 'none',
    },
    '& .MuiButtonBase-root:hover': {
      // TODO:
      // background: 'transparent'
    }
  },
  btnCancel: {
    backgroundColor: ''
  },
  btnConfirm: {
    backgroundColor: primary,
    color: '#FFFFFF',
  }
}));

const DialogCommon = (props) => {
  const classes = useStyles();
  const { iconWaring, iconSuccess, title, content, cancel, confirm } = props;
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    cancel();
  }

  const handleConfirm = () => {
    setOpen(false);
    confirm();
  }

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle className={classes.contentText}>
        <p style={{ margin: 'auto' }}>{iconWaring || iconSuccess || ''}</p>
        <p style={{ margin: 'auto' }}>{title || ''}</p>
      </DialogTitle>
      <DialogContent >
        {content || ''}
      </DialogContent>
      <DialogActions className={classes.btn}>
        <Button onClick={handleClose} color='primary' variant='outlined' size={'large'}>
          Cancel
        </Button>
        <Button className={classes.btnConfirm} onClick={handleConfirm} variant='contained' size={'large'}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogCommon;
