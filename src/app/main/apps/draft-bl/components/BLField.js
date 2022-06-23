import React from 'react';
import clsx from 'clsx';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TextField, InputAdornment, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { PERMISSION, PermissionProvider } from '@shared/permission';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const themeInput = '#BAC3CB';
const bgThemeInput = '#FFFFFF';
const blockThemeInput = '#F5F8FA';
const darkThemeInput = '#515E6A';
const themeInq = '#BD0F72';
const lightThemeInq = '#FAF1F5';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    '& fieldset': {
      borderColor: themeInput,
      backgroundColor: bgThemeInput,
      borderRadius: '8px',
      zIndex: '-1'
    },
    '&:hover fieldset': {
      borderColor: `${darkThemeInput} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${darkThemeInput} !important`
    }
  },
  locked: {
    '& fieldset': {
      backgroundColor: blockThemeInput
    }
  },
  hasInquiry: {
    '& fieldset': {
      backgroundColor: lightThemeInq
    }
  },
  input: {
    fontSize: '15px',
    color: darkThemeInput,
    padding: '9px 16px',
    lineHeight: '22px'
  },
  notchedOutlineNotChecked: {
    borderColor: `${themeInq} !important`
  },
  adornment: {
    padding: '10px',
    margin: 0
  },
  adornmentMultiline: {
    alignItems: 'flex-end'
  },
  adornmentRow_2: {
    height: '4em',
    maxHeight: '4em'
  },
  adornmentRow_3: {
    height: '6em',
    maxHeight: '6em'
  },
  adornmentRow_4: {
    height: '8em',
    maxHeight: '8em'
  },
  adornmentRow_5: {
    height: '10.7em',
    maxHeight: '10.7em'
  },
  sizeIcon: {
    fontSize: '18px'
  },
  colorHasInqIcon: {
    color: `${themeInq} !important`
  },
  colorLockIcon: {
    color: darkThemeInput
  }
}));

const BLField = ({ children, width, multiline, rows, selectedChoice, id, lock, readOnly }) => {
  const classes = useStyles();

  return (
    <div id={id} style={{ width }}>
      <ThemeProvider theme={theme}>
        <TextField
          value={selectedChoice || children}
          variant="outlined"
          fullWidth={true}
          multiline={multiline}
          rows={rows}
          className={clsx(classes.root, lock ? classes.locked : '')}
          InputProps={{
            readOnly: readOnly || true,
            endAdornment: (
              <InputAdornment
                position="end"
                className={clsx(
                  classes.adornment,
                  multiline ? classes.adornmentMultiline : '',
                  rows ? classes[`adornmentRow_${rows}`] : ''
                )}>
                {lock ? (
                  <LockIcon className={clsx(classes.sizeIcon, classes.colorLockIcon)} />
                ) : (
                  <></>
                )}
              </InputAdornment>
            ),
            classes: {
              root: classes.root,
              input: classes.input
            }
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default BLField;
