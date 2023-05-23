import React, { useState } from 'react';
import clsx from 'clsx';
import { TextField, makeStyles } from '@material-ui/core';

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
  const classes = useStyles();
  const [isLongText, setIsLongText] = useState(false);
  const onMouseOver = (e) => {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } = e.target;
    setIsLongText(Boolean(scrollWidth > clientWidth || scrollHeight > clientHeight));
  };

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseLeave={() => setIsLongText(false)}
    >
      <ArrowTooltip isLongText={isLongText} title={Array.isArray(children) ? children.join('\n') : children} placement='right'>
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
          }}
        />
      </ArrowTooltip>
    </div>
  );
};

export default React.memo(BLField);
