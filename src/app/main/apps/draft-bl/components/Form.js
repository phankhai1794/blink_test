import { useDispatch } from "react-redux";
import clsx from 'clsx';
import { Button, Dialog, Divider } from "@material-ui/core";
import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogContent from "@material-ui/core/DialogContent";

const white = '#FFFFFF';
const pink = '#BD0F72';
const greyBg = '#CCD3D1';
const greyText = '#999999';

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
  children,
  classes,
  toggleForm,
  handleClose,
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
  },
  btn: {
    width: 120,
    height: 40,
    borderRadius: 8,
    boxShadow: 'none'
  },
  btnSave: {
    color: white,
    background: pink,
    marginRight: 5
  },
  btnCancel: {
    color: greyText,
    background: white,
    border: `1px solid ${greyText}`
  }
}));

export default function Form(props) {
  const { open, toggleForm, title, children } = props;
  const classes = useStyles();

  const handleClose = () => {
    toggleForm(false);
  }

  const onSave = () => {
    props.handleSave();
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        classes={{ paperScrollPaper: classes.dialogPaper }}
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{
            fontSize: 22,
            fontWeight: 600,
          }}
          toggleForm={toggleForm}
          handleClose={handleClose}
        >
          {title || null}
        </DialogTitle>
        <Divider classes={{ root: classes.divider }} />
        <MuiDialogContent classes={{ root: classes.dialogContent }}>{children}</MuiDialogContent>
        <div style={{ padding: '0 39px 30px' }}>
          <Button className={clsx(classes.btn, classes.btnSave)} onClick={onSave}>
            Save
          </Button>
          <Button className={clsx(classes.btn, classes.btnCancel)} onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  )
}