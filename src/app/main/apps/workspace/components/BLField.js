import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AttachFile from '@material-ui/icons/AttachFile';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, InputAdornment, makeStyles } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ReplyIcon from '@material-ui/icons/Reply';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { sentStatus } from '@shared';
import { checkClassName, checkColorStatus } from '@shared/colorStatus';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const white = '#FFFFFF';
const gray = '#BAC3CB';
const darkGray = '#515E6A';
const lightGray = '#F5F8FA';
const lightPink = '#FAF1F5';
const pink = '#BD0F72';
const red = '#DC2626';
const lightBlue = '#EAF2FD';
const blue = '#2F80ED';
const darkBlue = '#00506D';
const green = '#36B37E';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
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
  hasInquiry: {
    '& fieldset': {
      backgroundColor: lightPink,
    }
  },
  hasAnswer: {
    '& fieldset': {
      backgroundColor: lightBlue,
      borderColor: `${blue} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${blue} !important`,
    },
    '&:focus-within fieldset': {
      border: `1px solid ${blue} !important`,
    }
  },
  hasResolved: {
    '& fieldset': {
      backgroundColor: '#EBF7F2',
      borderColor: `${green} !important`,
    }
  },
  hasUploaded: {
    '& fieldset': {
      backgroundColor: '#E6EDF0',
      borderColor: `${darkBlue} !important`,
    }
  },
  input: {
    fontSize: '15px',
    color: darkGray,
    padding: '9px 0 9px 16px',
    lineHeight: '22px',
    fontWeight: '500',
  },
  notchedOutlineNotChecked: {
    borderColor: `${red} !important`,
  },
  adornment: {
    padding: '10px 10px 10px 0',
    margin: 0,
  },
  adornmentMultiline: {
    alignItems: 'flex-end',
  },
  adornmentRow_2: {
    height: '4em',
    maxHeight: '4em',
  },
  adornmentRow_3: {
    height: '6em',
    maxHeight: '6em',
  },
  adornmentRow_4: {
    height: '8em',
    maxHeight: '8em',
  },
  adornmentRow_5: {
    height: '10.7em',
    maxHeight: '10.7em',
  },
  sizeIcon: {
    fontSize: '20px',
  },
  colorAddIcon: {
    color: `${pink} !important`,
  },
  colorHasInqIcon: {
    color: `${red} !important`,
  },
  colorHasAnswer: {
    color: `${blue} !important`,
  },
  colorHasResolved: {
    color: `${green} !important`,
  },
  colorHasUploaded: {
    color: `${darkBlue} !important`,
  },
  locked: {
    '& fieldset': {
      backgroundColor: lightGray,
    }
  },
  colorLockIcon: {
    color: darkGray,
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    marginLeft: '-2.5rem',
  },
  iconSvg: {
    width: 17,
    marginBottom: 1.5,
    paddingLeft: 3,
  },
}));

const BLField = ({ children, width, multiline, rows, selectedChoice, id, lock, readOnly, disableClick, disableIcon }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const user = useSelector(({ user }) => user);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [hasInquiry, setHasInquiry] = useState(false);
  const [hasAmendment, setHasAmendment] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });
  const allowCreateAmendment = PermissionProvider({ action: PERMISSION.VIEW_CREATE_AMENDMENT });

  const onMouseEnter = (e) => {
    if (isEmpty) setAnchorEl(e.currentTarget);
  };

  const onMouseLeave = (e) => {
    if (e.currentTarget !== null) setAnchorEl(null);
  };

  const checkValidate = (question) => {
    if (!question.inqType || !question.receiver.length) {
      dispatch(
        InquiryActions.validate({
          ...valid,
          field: true,
          inqType: Boolean(question.inqType),
          receiver: Boolean(question.receiver.length)
        })
      );
      return false;
    }
    return true;
  };

  const onClick = (e) => {
    if (!disableClick) {
      if (isEmpty && allowAddInquiry) {
        dispatch(InquiryActions.addQuestion(id));
      } else if (!isEmpty) {
        const currentInq = inquiries.find((q) => q.field === id);
        dispatch(InquiryActions.setOneInq(currentInq));
      }
      if (anchorEl && anchorEl.id === id && !lock) {
        if (allowAddInquiry) {
          if (
            inquiries.length > 0 &&
            !currentEditInq &&
            checkValidate(inquiries[inquiries.length - 1])
          ) {
            if (inquiries.length + 1 === metadata.field_options.length) {
              dispatch(FormActions.toggleAddInquiry(false));
            }
          }
          dispatch(FormActions.toggleCreateInquiry(true));
        }
        else if (
          allowCreateAmendment
          && myBL?.state?.includes('DRF_')
          && user.userType === 'CUSTOMER' // Allow only customer to create amendment
        ) dispatch(FormActions.toggleCreateAmendment(true));
      }
      dispatch(InquiryActions.setField(e.currentTarget.id));
      setAnchorEl(e.currentTarget.id);
    }
  };

  const checkDisplayIcon = () => {
    if (!disableIcon) {
      const {iconColor} = checkClassName(
        hasInquiry,
        hasAmendment,
        hasAnswer,
        isResolved,
        isUploaded,
        classes
      );

      const attachIcon = <>
        {hasAttachment && (
          <AttachFile
            className={clsx(
              classes.sizeIcon,
              classes.attachIcon,
              iconColor
            )}
          />
        )}
      </>

      if (lock) {
        return <>
          <LockOutlinedIcon className={clsx(classes.sizeIcon, classes.colorLockIcon)}/>
        </>
      } else if (hasInquiry || hasAmendment) {
        return <>
          {attachIcon}
          {hasInquiry && <HelpIcon className={clsx(classes.sizeIcon, iconColor)}/>}
          {hasAmendment && <img src='/assets/images/icons/icon-amendment.svg' className={classes.iconSvg}/>}
        </>
      } else if (hasAnswer) {
        return <>
          {attachIcon}
          <ReplyIcon className={clsx(classes.sizeIcon, iconColor)}/>
        </>
      } else if (isResolved) {
        return <>
          {attachIcon}
          <CheckCircleIcon className={clsx(classes.sizeIcon, iconColor)}/>
        </>
      } else if (isUploaded) {
        return <>
          {attachIcon}
          <img src='/assets/images/icons/icon-uploaded.svg' className={classes.iconSvg}/>
        </>
      }
    }
  }

  const setColorStatus = () => {
    const colorStatusObj = checkColorStatus(
      id,
      user,
      inquiries,
      listCommentDraft
    );

    setIsEmpty(colorStatusObj.isEmpty);
    setHasInquiry(colorStatusObj.hasInquiry);
    setHasAmendment(colorStatusObj.hasAmendment);
    setHasAttachment(colorStatusObj.hasAttachment);
    setHasAnswer(colorStatusObj.hasAnswer);
    setIsResolved(colorStatusObj.isResolved);
    setIsUploaded(colorStatusObj.isUploaded);
  }

  useEffect(() => {
    setColorStatus();
  }, [inquiries, metadata, listCommentDraft]);

  return (
    <>
      <div
        id={id}
        style={{ width }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}>
        <ThemeProvider theme={theme}>
          <TextField
            value={selectedChoice || children || ''}
            variant="outlined"
            fullWidth={true}
            multiline={multiline}
            rows={rows}
            className={clsx(
              classes.root,
              lock ? classes.locked : checkClassName(
                hasInquiry,
                hasAmendment,
                hasAnswer,
                isResolved,
                isUploaded,
                classes
              ).className
            )}
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
                  {checkDisplayIcon()}
                  {anchorEl && anchorEl.id === id && allowAddInquiry && (
                    <AddCircleIcon className={clsx(classes.sizeIcon, classes.colorAddIcon)} />
                  )}
                </InputAdornment>
              ),
              classes: {
                root: classes.root,
                input: classes.input,
                notchedOutline: isEmpty ? '' : classes.notchedOutlineNotChecked
              }
            }}
          />
        </ThemeProvider>
      </div>
    </>
  );
};

export default BLField;
