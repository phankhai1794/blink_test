import React from 'react';
import clsx from 'clsx';
import { TextField, makeStyles } from '@material-ui/core';

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
  return (
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
  );
};

export default React.memo(BLField);
