import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as FormActions from '../store/actions/form';

import AddCommentIcon from '@material-ui/icons/AddComment';
import { Popover, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
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
    backgroundColor: '#f5f8fa'
  },
  notchedOutlineChecked: {
    borderColor: `${green[500]} !important`
  },
  notchedOutlineNotChecked: {
    borderColor: `red !important`
  }
}));
const AddPopover = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const anchorEl = useSelector((state) => state.workspace.formReducer.anchorEl);
  const { x, width } = anchorEl !== null && anchorEl.getBoundingClientRect();
  const isRightMost = x + width > 1400;
  return (
    <>
      <Popover
        id="popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: `${isRightMost ? 'left' : 'right'}`
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: `${isRightMost ? 'right' : 'left'}`
        }}
        className={`${classes.circlePopover}`}
        style={{
          pointerEvents: 'none'
        }}
        classes={{
          paper: classes.popoverContent
        }}
      >
        <IconButton color="primary" onClick={() => dispatch(FormActions.toggleCreateInquiry(true))}>
          <AddCommentIcon style={{ transform: `${isRightMost ? 'scaleX(1)' : 'scaleX(-1)'}` }} />
        </IconButton>
      </Popover>
    </>
  );
};

export default AddPopover;
