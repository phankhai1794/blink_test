import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },
  circlePopover: {
    '& > div': {
      borderRadius: '200px'
    }
  },
  popoverContent: {
    pointerEvents: 'auto'
  },
  root: {
    backgroundColor: '#f5f8fa',
    '&:hover': {
      backgroundColor: 'yellow'
    }
  },
  notchedOutlineChecked: {
    borderColor: `${green[500]} !important`
  },
  notchedOutlineNotChecked: {
    borderColor: `red !important`
  }
}));
const BLField = (props) => {
  const classes = useStyles();
  const {
    children,
    openAddPopover,
    closeAddPopover,
    width,
    questionIsEmpty,
    selectedChoice,
    fileName,
    openInquiry
  } = props;
  return (
    <div
      style={{
        width: `${width}`
      }}
      onMouseEnter={questionIsEmpty !== undefined && !questionIsEmpty ? null : openAddPopover}
      onMouseLeave={closeAddPopover}
      onClick={openInquiry}
    >
      <TextField
        value={selectedChoice || children}
        variant="outlined"
        fullWidth={true}
        classes={{
          root: classes.root
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {questionIsEmpty !== undefined && !questionIsEmpty ? (
                <ChatBubbleIcon color="primary" />
              ) : (
                ''
              )}
            </InputAdornment>
          ),
          classes: {
            notchedOutline: `${
              questionIsEmpty !== undefined && !questionIsEmpty
                ? selectedChoice || fileName
                  ? classes.notchedOutlineChecked
                  : classes.notchedOutlineNotChecked
                : ''
            }`
          }
        }}
      />
    </div>
  );
};

export default BLField;
