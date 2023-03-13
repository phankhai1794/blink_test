import React from 'react';
import { Button, Dialog, makeStyles, IconButton, Icon, Divider } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";

import { ContainerDetailFormOldVersion } from './InquiryViewer';

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

const WarningMessage = ({ msg, content, msg2 = 'Thank you!', iconType, open, handleClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose} classes={{ root: classes.dialog }}>
      <Divider classes={{ root: classes.divider }} />
      <MuiDialogContent classes={{ root: classes.dialogContent }}>
        <div className={classes.firstSentence}>
          <span>
            {iconType}
          </span>
          <span>
            {msg}
          </span>
          {/*{*/}
          {/*<ContainerDetailFormOldVersion originalValues={content} />*/}

          {/*  </ContainerDetailFormOldVersion>*/}
          {/*}*/}
        </div>
        <div style={{ textAlign: 'left', marginLeft: 22, marginTop: 14 }}>
          {
            content.map((k, id) => {
              return (<strong key={id}> <div>{`[Row ${k.row}] Cont-No: ${k.containerNo}`}</div> </strong>)
            })
          }
        </div>
        {/*<span className={classes.secondSentence}>{msg2}</span>*/}
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

export default WarningMessage;
