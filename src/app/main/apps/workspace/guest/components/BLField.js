import React, {useEffect, useState} from 'react';
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
  }
}));
const BLField = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const {
    children,
    width,
    selectedChoice,
    fileName,
    id
  } = props;
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true)
  const questionSaved = useSelector((state) => state.guestspace.questionSaved)

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty())
  },[questionSaved])

  const  checkQuestionIsEmpty = () => {
    if (questionSaved.length > 0){
      const check = questionSaved.filter(q => q.field === id)
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
        classes={{
          root: classes.root
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {!questionIsEmpty ? (
                <ChatBubbleIcon color="primary" />
              ) : (
                ''
              )}
            </InputAdornment>
          ),
          classes: {
            notchedOutline: `${
              questionIsEmpty
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
