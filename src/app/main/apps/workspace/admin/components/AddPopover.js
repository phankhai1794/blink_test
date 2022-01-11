import React from 'react';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { Popover, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import _ from '@lodash';
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
  const { anchorEl, onClose, toggleInquiryForm } = props;
  const { x, width } = anchorEl !== null && anchorEl.getBoundingClientRect();
  const isRightMost = x + width > 800;
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
        onMouseLeave={onClose}
        className={`${classes.circlePopover}`}
        style={{
          pointerEvents: 'none'
        }}
        classes={{
          paper: classes.popoverContent
        }}
      >
        <IconButton color="primary" onClick={toggleInquiryForm}>
          <AddCommentIcon style={{ transform: `${isRightMost ? 'scaleX(1)' : 'scaleX(-1)'}` }} />
        </IconButton>
      </Popover>
    </>
  );
};

export default AddPopover;
