import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';

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
  },
  adornment: {
    height: '6em',
    maxHeight: '6em',
    alignItems: 'flex-end',
  },
}));
const BLField = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const {
    children,
    width,
    multiline,
    rows,
    selectedChoice,
    fileName,
    id
  } = props;
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true)
  const inquiries = useSelector((state) => state.guestspace.inquiries)

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty())
  }, [inquiries])

  const checkQuestionIsEmpty = () => {
    if (inquiries.length > 0) {
      const check = inquiries.filter(q => q.field === id)
      return check.length > 0 ? false : true
    }
    return true
  }

  const onClick = (e) => {
    if (!questionIsEmpty) {
      dispatch(Actions.setField(e.currentTarget.id))
      dispatch(Actions.toggleInquiry(true))
    }
  }
  return (
    <div
      id={id}
      style={{
        width: `${width}`
      }}
      onClick={onClick}
    >
      <TextField
        value={selectedChoice || children}
        variant="outlined"
        fullWidth={true}
        multiline={multiline}
        rows={rows}
        classes={{
          root: classes.root
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              className={multiline && rows > 3 ? classes.adornment : ""}
            >
              {!questionIsEmpty ? (
                <ChatBubbleIcon color="primary" />
              ) : (
                ''
              )}
            </InputAdornment>
          ),
          classes: {
            notchedOutline: `${questionIsEmpty
                ? ""
                : classes.notchedOutlineNotChecked
              }`
          }
        }}
      />
    </div>
  );
};

export default BLField;
