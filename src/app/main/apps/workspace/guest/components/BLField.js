import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../admin/store/actions';

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
    alignItems: 'flex-end'
  }
}));

const BLField = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { children, width, multiline, rows, selectedChoice, id } = props;
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const [inquiries, metadata] = useSelector((state) => [
    state.workspace.inquiryReducer.inquiries,
    state.workspace.inquiryReducer.metadata
  ]);

  const onMouseEnter = (e) => {
    if (questionIsEmpty) {
      dispatch(Actions.setAnchor(e.currentTarget));
    }
    dispatch(Actions.setField(e.currentTarget.id));
  };

  const onMouseLeave = (e) => {
    dispatch(Actions.setAnchor(null));
  };

  const onClick = () => {
    if (!questionIsEmpty) {
      dispatch(Actions.toggleInquiry(true));
    }
  };

  const checkQuestionIsEmpty = () => {
    if (inquiries.length > 0) {
      const check = inquiries.filter((q) => q.field === id);
      return check.length == 0;
    }
    return true;
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
  }, [inquiries, metadata]);

  return (
    <div
      id={id}
      style={{
        width: `${width}`
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
              className={multiline && rows > 3 ? classes.adornment : ''}
            >
              {!questionIsEmpty ? <ChatBubbleIcon color="primary" /> : ''}
            </InputAdornment>
          ),
          classes: {
            notchedOutline: `${questionIsEmpty ? '' : classes.notchedOutlineNotChecked}`
          }
        }}
      />
    </div>
  );
};

export default BLField;
