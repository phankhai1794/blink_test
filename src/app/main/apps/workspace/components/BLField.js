import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, InputAdornment, makeStyles } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import LockIcon from '@material-ui/icons/Lock';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import Label from './FieldLabel';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const themeInput = '#BAC3CB';
const lightThemeInput = '#F5F8FA';
const darkThemeInput = '#515E6A';
const themeInq = '#BD0F72';
const lightThemeInq = '#FAF1F5';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    '& fieldset': {
      borderColor: themeInput,
      backgroundColor: lightThemeInput,
      borderRadius: '8px',
      zIndex: '-1'
    },
    '&:hover fieldset': {
      borderColor: `${themeInq} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${themeInq} !important`
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

const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });

const BLField = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { children, width, multiline, rows, selectedChoice, id, label, lock, readOnly } = props;
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const [inquiries, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata
  ]);
  const [minimize, anchorEl] = useSelector(({ workspace }) => [
    workspace.formReducer.minimize,
    workspace.formReducer.anchorEl
  ]);
  const openAddPopover = (e) => {
    if (questionIsEmpty) {
      dispatch(FormActions.setAnchor(e.currentTarget));
    }
    if (!minimize) {
      dispatch(InquiryActions.setField(e.currentTarget.id));
    }
  };

  const closeAddPopover = (e) => {
    if (anchorEl !== null) dispatch(FormActions.setAnchor(null));
  };

  const onClick = (e) => {
    if (!minimize) {
      dispatch(InquiryActions.setField(e.currentTarget.id));
    }
    if (!questionIsEmpty && !minimize) {
      dispatch(FormActions.toggleInquiry(true));
    }
    if (anchorEl && anchorEl.id === id && allowAddInquiry && !minimize && !lock) {
      dispatch(FormActions.toggleCreateInquiry(true));
    }
  };

  const checkQuestionIsEmpty = () => {
    if (inquiries.length > 0) {
      const check = inquiries.filter((q) => q.field === id);
      return check.length === 0;
    }
    return true;
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
  }, [inquiries, metadata]);

  return (
    <>
      {label && <Label className={!questionIsEmpty ? classes.colorHasInqIcon : ''}>{label}</Label>}
      <div
        id={id}
        style={{ width }}
        onMouseEnter={openAddPopover}
        onMouseLeave={closeAddPopover}
        onClick={onClick}>
        <ThemeProvider theme={theme}>
          <TextField
            value={selectedChoice || children}
            variant="outlined"
            fullWidth={true}
            multiline={multiline}
            rows={rows}
            className={clsx(classes.root, !questionIsEmpty ? classes.hasInquiry : '')}
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
                  {!questionIsEmpty && (
                    <HelpIcon className={clsx(classes.sizeIcon, classes.colorHasInqIcon)} />
                  )}
                  {lock ? (
                    <LockIcon className={clsx(classes.sizeIcon, classes.colorLockIcon)} />
                  ) : (
                    anchorEl &&
                    anchorEl.id === id &&
                    allowAddInquiry && (
                      <AddCircleOutlineIcon
                        className={clsx(classes.sizeIcon, classes.colorHasInqIcon)}
                      />
                    )
                  )}
                </InputAdornment>
              ),
              classes: {
                root: classes.root,
                input: classes.input,
                notchedOutline: questionIsEmpty ? '' : classes.notchedOutlineNotChecked
              }
            }}
          />
        </ThemeProvider>
      </div>
    </>
  );
};

export default BLField;
