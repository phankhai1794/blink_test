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
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const gray = '#BAC3CB';
const white = '#FFFFFF';
const darkGray = '#515E6A';
const lockGray = '#F5F8FA';
const pink = '#BD0F72';
const lightPink = '#FAF1F5';
const red = '#DC2626';
const blue = '#EAF2FD';
const darkBlue = '#00506D';
const green = '#2F80ED';
const success = '#36B37E';

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
      backgroundColor: blue,
      borderColor: `${green} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${green} !important`,
    },
    '&:focus-within fieldset': {
      border: `1px solid ${green} !important`,
    }
  },
  hasResolved: {
    '& fieldset': {
      backgroundColor: '#EBF7F2',
      borderColor: `${success} !important`,
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
  colorHasInqIcon: {
    color: `${red} !important`,
  },
  colorHasAnswer: {
    color: `${green} !important`,
  },
  colorEmptyInqIcon: {
    color: `${pink} !important`,
  },
  colorHasResolved: {
    color: `${success} !important`,
  },
  colorHasUploaded: {
    color: `${darkBlue} !important`,
  },
  locked: {
    '& fieldset': {
      backgroundColor: lockGray,
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

const BLField = ({ children, width, multiline, rows, selectedChoice, id, lock, readOnly, disableClick }) => {
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

  const checkClassName = () => {
    let response = { className: '', iconColor: '' };
    if (hasInquiry || hasAmendment) response = { className: classes.hasInquiry, iconColor: classes.colorHasInqIcon };
    else if (hasAnswer) response = { className: classes.hasAnswer, iconColor: classes.colorHasAnswer };
    else if (isResolved) response = { className: classes.hasResolved, iconColor: classes.colorHasResolved };
    else if (isUploaded) response = { className: classes.hasUploaded, iconColor: classes.colorHasUploaded };
    return response;
  }

  const checkDisplayIcon = () => {
    const { iconColor } = checkClassName();
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
        <LockOutlinedIcon className={clsx(classes.sizeIcon, classes.colorLockIcon)} />
      </>
    }
    else if (hasInquiry || hasAmendment) {
      return <>
        {attachIcon}
        {hasInquiry && <HelpIcon className={clsx(classes.sizeIcon, iconColor)} />}
        {hasAmendment && <img src='/assets/images/icons/icon-amendment.svg' className={classes.iconSvg} />}
      </>
    }
    else if (hasAnswer) {
      return <>
        {attachIcon}
        <ReplyIcon className={clsx(classes.sizeIcon, iconColor)} />
      </>
    }
    else if (isResolved) {
      return <>
        {attachIcon}
        <CheckCircleIcon className={clsx(classes.sizeIcon, iconColor)} />
      </>
    }
    else if (isUploaded) {
      return <>
        {attachIcon}
        <img src='/assets/images/icons/icon-uploaded.svg' className={classes.iconSvg} />
      </>
    }
  }

  const checkColorStatus = () => {
    const colorStatusObj = {
      isEmpty: true,
      hasInquiry: false,
      hasAmendment: false,
      hasAttachment: false,
      hasAnswer: false,
      isResolved: false,
      isUploaded: false
    };

    /** Check Inquiry */
    const lstInq = inquiries.filter((q) => q.field === id && q.process === 'pending');
    if (lstInq.length) {
      colorStatusObj.isEmpty = false;
      const statusReply = user?.role === 'Admin' ? sentStatus : [...sentStatus, ...['ANS_DRF']];

      lstInq.forEach(inq => {
        // check has attachment
        if (!colorStatusObj.hasAttachment && inq.mediaFile?.length) colorStatusObj.hasAttachment = true;

        // check has inquiry
        if (!colorStatusObj.hasInquiry && ['OPEN', 'INQ_SENT', 'ANS_DRF'].includes(inq.state)) colorStatusObj.hasInquiry = true;

        // check has reply/answer
        else if (!colorStatusObj.hasAnswer, statusReply.includes(inq.state)) colorStatusObj.hasAnswer = true;

        // check is resolved
        else if (!colorStatusObj.isResolved && inq.state === 'COMPL') colorStatusObj.isResolved = true;

        // check is resolved
        else if (!colorStatusObj.isUploaded && inq.state === 'UPLOADED') colorStatusObj.isUploaded = true;
      });
    }

    /** Check Amendment */
    const listCommentFilter = listCommentDraft.filter(q => q.field === id);
    if (listCommentFilter.length) {
      colorStatusObj.isEmpty = false;
      const statusReply = user?.role === 'Admin' ? [...sentStatus, ...['REP_DRF']] : [...sentStatus, ...['AME_DRF']];
      const amendment = listCommentFilter[0] || {};
      const lastComment = listCommentFilter[listCommentFilter.length - 1] || {};

      // check has attachment
      if (!colorStatusObj.hasAttachment && amendment.content?.mediaFile?.length) colorStatusObj.hasAttachment = true;

      // check has amendment
      if (!colorStatusObj.hasAmendment && listCommentFilter.length === 1) colorStatusObj.hasAmendment = true;

      // check has reply/answer
      else if (!colorStatusObj.hasAnswer && statusReply.includes(lastComment.state)) colorStatusObj.hasAnswer = true;

      // check is resolved
      else if (!colorStatusObj.isResolved && ['RESOLVED'].includes(lastComment.state)) colorStatusObj.isResolved = true;

      // check is resolved
      else if (!colorStatusObj.isUploaded && ['UPLOADED'].includes(lastComment.state)) colorStatusObj.isUploaded = true;
    }

    setIsEmpty(colorStatusObj.isEmpty);
    setHasInquiry(colorStatusObj.hasInquiry);
    setHasAmendment(colorStatusObj.hasAmendment);
    setHasAttachment(colorStatusObj.hasAttachment);
    setHasAnswer(colorStatusObj.hasAnswer);
    setIsResolved(colorStatusObj.isResolved);
    setIsUploaded(colorStatusObj.isUploaded);
  }

  useEffect(() => {
    checkColorStatus();
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
            value={selectedChoice || children}
            variant="outlined"
            fullWidth={true}
            multiline={multiline}
            rows={rows}
            className={clsx(
              classes.root,
              lock ? classes.locked : checkClassName().className
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
                    <AddCircleIcon className={clsx(classes.sizeIcon, classes.colorEmptyInqIcon)} />
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
