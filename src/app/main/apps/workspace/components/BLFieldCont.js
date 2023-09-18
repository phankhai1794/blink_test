import React, { useState } from 'react';
import clsx from 'clsx';
import { TextField, Icon, makeStyles, Paper } from '@material-ui/core';
import { copyTextToClipboard } from '@shared';
import * as AppAction from 'app/store/actions';
import { useDispatch } from 'react-redux';
import EllipsisPopper from 'app/main/apps/workspace/shared-components/EllipsisPopper';

const white = '#FFFFFF';
const gray = '#BAC3CB';
const darkGray = '#515E6A';
const pink = '#BD0F72';
const red = '#DC2626';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    fontFamily: 'Montserrat',
    '& fieldset': {
      borderColor: gray,
      backgroundColor: white,
      borderRadius: '8px',
      zIndex: '-1',
    },
    '&:hover fieldset': {
      borderColor: `${pink} !important`,
    },
    '&:focus-within fieldset': {
      border: `1px solid ${pink} !important`,
    }
  },
  input: {
    fontSize: '15px',
    color: darkGray,
    padding: '9px 0 9px 16px',
    lineHeight: '22px',
    fontWeight: '500',
    textOverflow: 'ellipsis',
    overflow: 'auto',
  },
  notchedOutlineNotChecked: {
    borderColor: `${red} !important`,
  },
  paper: {
    maxHeight: 400,
    maxWidth: 400,
    overflow: "auto",
    padding: 15,
    color: '#515E6A',
    whiteSpace: 'pre-line'
  }
}));

const BLField = ({ multiline = false, children: _children, isSeq, isEditSeq }) => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const [anchorElCopy, setAnchorElCopy] = useState(null);
  const children = Array.isArray(_children) ? _children.join(',') : _children;
  const [popover, setPopover] = useState({ open: false, text: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  const onMouseOver = (e) => {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } = e.target;
    setAnchorElCopy(e.currentTarget);
    setAnchorEl(e.currentTarget);
    if (scrollWidth > clientWidth || scrollHeight > clientHeight) {
      setPopover({ open: true, text: children });
    }
  };

  const onMouseLeave = () => {
    setAnchorElCopy(null);
    setAnchorEl(null);
    setPopover({ open: false });
  }

  const handlePopoverMouseEnter = () => setPopover({ ...popover, open: true });

  const handlePopoverMouseLeave = () => setPopover({ open: false });

  const onCopyClick = (e, text) => {
    e.stopPropagation();
    copyTextToClipboard(text)
    dispatch(AppAction.showMessage({ message: 'Copy to clipboard !', variant: 'info', autoHideDuration: 2000 }));
  };

  const handleChangeSeq = (e) => {
    const valInput = e.target.value;
    console.log('val input', valInput);
  }

  return (
    <>
      <EllipsisPopper
        open={popover.open}
        anchorEl={anchorEl}
        arrow={true}
        // className={classes.popper}
        flip={true}
        transition
        placement={'left'}
        disablePortal={false}
        preventOverflow={'scrollParent'}>
        {({ TransitionProps, placement, arrow }) => (
          <div
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
          >
            {arrow}
            <Paper className={classes.paper}>{popover.text}</Paper>
          </div>
        )}
      </EllipsisPopper>

      <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
        <TextField
          value={children || ''}
          variant="outlined"
          fullWidth={true}
          multiline={multiline}
          rows={multiline ? 6 : null}
          className={clsx(classes.root)}
          onChange={(e) => {
            (isSeq && isEditSeq) ? handleChangeSeq(e) : e.preventDefault();
          }}
          InputProps={{
            readOnly: !(isSeq && isEditSeq),
            classes: {
              root: classes.root,
              input: classes.input,
            },
            endAdornment:
              <>
                {anchorElCopy && children && (
                  <Icon
                    style={{ position: 'absolute', right: 5, bottom: 5, cursor: 'pointer', fontSize: 18 }}
                    onClick={(e) => onCopyClick(e, children)}
                  >
                    file_copy
                  </Icon>
                )}
              </>
          }}
        />
      </div>
    </>
  );
};

export default React.memo(BLField);
