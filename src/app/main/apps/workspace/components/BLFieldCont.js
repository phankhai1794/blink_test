import React, { useState } from 'react';
import clsx from 'clsx';
import { TextField, Icon, makeStyles } from '@material-ui/core';
import { copyTextToClipboard } from '@shared';
import * as AppAction from 'app/store/actions';
import { useDispatch } from 'react-redux';

import ArrowTooltip from '../shared-components/ArrowTooltip';

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
}));

const BLField = ({ multiline = false, children }) => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const [isLongText, setIsLongText] = useState(false);
  const [anchorElCopy, setAnchorElCopy] = useState(null);

  const onMouseOver = (e) => {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } = e.target;
    setAnchorElCopy(e.currentTarget);
    setIsLongText(Boolean(scrollWidth > clientWidth || scrollHeight > clientHeight));
  };

  const onMouseLeave = () => {
    setAnchorElCopy(null);
    setIsLongText(false)
  }

  const onCopyClick = (e, text) => {
    e.stopPropagation();
    copyTextToClipboard(text)
    dispatch(AppAction.showMessage({ message: 'Copy to clipboard !', variant: 'info', autoHideDuration: 2000 }));
  };
  return (
    <div
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <ArrowTooltip isLongText={isLongText} title={Array.isArray(children) ? children.join('\n') : (children || '')} placement='right'>
        <TextField
          value={children || ''}
          variant="outlined"
          fullWidth={true}
          multiline={multiline}
          rows={multiline ? 6 : null}
          className={clsx(classes.root)}
          InputProps={{
            readOnly: true,
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
      </ArrowTooltip>
    </div>
  );
};

export default React.memo(BLField);
