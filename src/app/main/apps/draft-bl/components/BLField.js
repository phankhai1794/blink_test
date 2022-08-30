import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TextField, InputAdornment, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { useDispatch, useSelector } from "react-redux";
import ReplyIcon from "@material-ui/icons/Reply";

import * as BLDraftActions from '../store/actions';


const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const themeInput = '#BAC3CB';
const bgThemeInput = '#FFFFFF';
const blockThemeInput = '#F5F8FA';
const darkThemeInput = '#515E6A';
const pinkThemeInput = '#BD0F72';
const themeField = '#2F80ED';
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
      borderColor: `${pinkThemeInput} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${pinkThemeInput} !important`,
    },
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
    borderColor: `${darkThemeInput} !important`
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
  colorFieldEdited: {
    '& fieldset': {
      border: `1px solid ${themeField}!important`,
      background: '#EAF2FD',
      borderRadius: '8px'
    }
  },
  colorFieldClicked: {
    '& fieldset': {
      border: `1px solid ${pinkThemeInput}!important`,
      borderRadius: '8px'
    }
  },
  colorLockIcon: {
    color: darkThemeInput
  }
}));

const BLField = ({ children, width, multiline, rows, selectedChoice, id, lock, readOnly }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const draftContent = useSelector(({ draftBL }) => draftBL.draftContent);
  const [fieldIsChanged, setFieldIsChanged] = useState(false);

  useEffect(() => {
    if (draftContent && id) setFieldIsChanged(draftContent.filter(t => t.field === id).length);
  }, [draftContent, id]);

  const onClick = (e) => {
    if (!lock) {
      dispatch(BLDraftActions.toggleDraftBLEdit(true));
      dispatch(BLDraftActions.setCurrentField(e.currentTarget.id));
    }
  };

  const handleReply = () => {
    dispatch(BLDraftActions.toggleDraftBLEdit(false))
  }

  return (
    <div id={id} onClick={onClick} className={clsx(fieldIsChanged ? classes.colorFieldEdited : '')}>
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
                {fieldIsChanged ? (
                  <>
                    <ReplyIcon fontSize={'large'} style={{ color: '#2F80ED', cursor: 'pointer' }} onClick={handleReply} />
                  </>
                ) : <></>}
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
