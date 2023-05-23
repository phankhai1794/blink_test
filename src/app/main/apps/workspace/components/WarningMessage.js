import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, makeStyles, Divider } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import * as AppActions from 'app/store/actions';

const mainColor = '#BD0F72';
const darkColor = '#132535';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: '14px 20px 15px 20px',
  },
  dialog: {
    '& .MuiPaper-root': {
      width: 500,
      borderRadius: 6
    }
  },
  firstSentence: {
    position: 'relative',
    color: mainColor,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '20px',
    paddingLeft: 11.67,
    display: 'flex',
    flexDirection: 'column',
  },
  secondSentence: {
    color: darkColor,
    fontSize: 15,
    lineHeight: '18px',
    marginTop: 10,
    display: 'block',
    fontWeight: 500,
  },
  dialogContent: {
    textAlign: 'center',
    padding: 30,
  },
  container: {
    textAlign: 'center',
    paddingBottom: 30
  }
}))

const WarningMessage = ({ open, setOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const kickBy = useSelector(({ user }) => user.kickBy);

  const handleClose = () => {
    dispatch(AppActions.kickForce({ kickBy: "" }));
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ root: classes.dialog }}
    >
      <Divider classes={{ root: classes.divider }} />
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <div className={classes.firstSentence}>
          <span>
            <img
              style={{ verticalAlign: 'middle', paddingBottom: 2, paddingLeft: 5, paddingRight: 5, }}
              src={`/assets/images/icons/warning.svg`}
            />
          </span>
          <span>
            You has been kicked by {kickBy}
          </span>
        </div>
      </MuiDialogContent>
      <div className={classes.container}>
        <Button
          style={{
            width: 171,
            height: 40,
            color: '#FFFFFF',
            backgroundColor: mainColor,
            borderRadius: 8,
            padding: '10px 13px',
            textTransform: 'none',
            fontFamily: 'Montserrat',
            fontSize: 16,
            fontWeight: 600
          }}
          onClick={handleClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default React.memo(WarningMessage);
