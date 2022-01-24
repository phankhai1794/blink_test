import React from 'react';
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
    questionIsEmpty,
    selectedChoice,
    fileName,
    openInquiry,
    id
  } = props;
  const anchorEl = useSelector((state) => state.workspace.anchorEl)

  const openAddPopover = (e) => {
    dispatch(Actions.setAnchor(e.currentTarget))
    dispatch(Actions.setField(e.currentTarget.id))
  };

  const closeAddPopover = (e) => {
    if (anchorEl === null) {
      dispatch(Actions.setAnchor(null))
    } else {
      const { x, y, width, height } = anchorEl.getBoundingClientRect();
      if (x + width < 800) {
        if (e.clientY + 2 > y + height || e.clientY < y) {
          dispatch(Actions.setAnchor(null))
        } else if (e.clientX > x + width + 48 || e.clientX < x) {
          dispatch(Actions.setAnchor(null))
        }
      } else {
        if (e.clientY + 2 > y + height || e.clientY < y) {
          dispatch(Actions.setAnchor(null))
        } else if (e.clientX > x + width || e.clientX > x + 48) {
          dispatch(Actions.setAnchor(null))
        }
      }
    }
  };

  return (
    <div
      id={id}
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
