import React from 'react';
import { Button, Dialog, makeStyles, IconButton, Icon } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";

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
    paddingLeft: 11.67
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

const SubmitAnswerNotification = ({ msg, msg2 = 'Thank you!', iconType, open, handleClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose} classes={{ root: classes.dialog }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8A97A3' }}>
        <div style={{ color: '#515F6B', fontSize: '22px', fontWeight: '600', marginLeft: 20 }}>Notifications</div>
        <div style={{ paddingRight: '2px', paddingTop: '5px' }}>
          <IconButton aria-label="close" onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </div>
      </div>
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <span className={classes.firstSentence}>
          {iconType} {msg}
        </span>
        <span className={classes.secondSentence}>{msg2}</span>
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

export default SubmitAnswerNotification;
