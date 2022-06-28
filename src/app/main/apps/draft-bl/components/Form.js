import {useDispatch} from "react-redux";
import {Button, Dialog, Divider} from "@material-ui/core";
import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogContent from "@material-ui/core/DialogContent";


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
    toggleForm,
    handleClose,
    ...other
  } = props;
  const dispatch = useDispatch();
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
    width: '600px',
    minHeight: '244px'
  },
  dialogContent: {
    backgroundColor: 'white',
    paddingLeft: '40px',
    paddingRight: '70px'
  },
  divider: {
    backgroundColor: '#8A97A3'
  },
  chip: {
    marginLeft: '0.2rem'
  },
  buttonSave: {
    borderRadius: '34px',
    width: '120px'
  }
}));

export default function Form(props) {
  const {open, toggleForm, title, children} = props;
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
        classes={{paperScrollPaper: classes.dialogPaper}}
      >
        <DialogTitle
          id="customized-dialog-title"
          toggleForm={toggleForm}
          handleClose={handleClose}
        >
          {title || null}
        </DialogTitle>
        <Divider classes={{ root: classes.divider }} />
        <MuiDialogContent classes={{ root: classes.dialogContent }}>{children}</MuiDialogContent>
        <div className="text-center p-5">
          <Button variant="contained" className={classes.buttonSave} color="primary" onClick={(onSave)}>
            Save
          </Button>
        </div>
      </Dialog>
    </div>
  )
}