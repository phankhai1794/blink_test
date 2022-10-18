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
import { sentStatus, statusCommentDrf } from '@shared';
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
const green = '#2F80ED';
const success = '#36B37E'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    '& fieldset': {
      borderColor: gray,
      backgroundColor: white,
      borderRadius: '8px',
      zIndex: '-1'
    },
    '&:hover fieldset': {
      borderColor: `${pink} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${pink} !important`
    }
  },
  hasInquiry: {
    '& fieldset': {
      backgroundColor: lightPink
    }
  },
  hasResolved: {
    '& fieldset': {
      backgroundColor: '#EBF7F2',
      borderColor: `${success} !important`
    }
  },
  hasAnswer: {
    '& fieldset': {
      backgroundColor: blue,
      borderColor: `${green} !important`
    },
    '&:hover fieldset': {
      borderColor: `${green} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${green} !important`
    }
  },
  input: {
    fontSize: '15px',
    color: darkGray,
    padding: '9px 0 9px 16px',
    lineHeight: '22px',
    fontWeight: '500'
  },
  notchedOutlineNotChecked: {
    borderColor: `${red} !important`
  },
  adornment: {
    padding: '10px 10px 10px 0',
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
    fontSize: '20px'
  },
  colorHasInqIcon: {
    color: `${red} !important`
  },
  colorHasAnswer: {
    color: `${green} !important`
  },
  colorEmptyInqIcon: {
    color: `${pink} !important`
  },
  colorHasResolved: {
    color: `${success} !important`
  },
  locked: {
    '& fieldset': {
      backgroundColor: lockGray
    }
  },
  colorLockIcon: {
    color: darkGray
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    marginLeft: '-2.5rem'
  }
}));

const BLField = (props) => {
  const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });
  const allowCreateAmendment = PermissionProvider({ action: PERMISSION.VIEW_CREATE_AMENDMENT });
  const classes = useStyles();
  const dispatch = useDispatch();
  const { children, width, multiline, rows, selectedChoice, id, lock, readOnly, disableClick } = props;
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mediaFileIsEmpty, setMediaFileIsEmpty] = useState(true);
  const [isResolved, setIsResolved] = useState(false);
  const user = useSelector(({ user }) => user);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  const onMouseEnter = (e) => {
    if (questionIsEmpty) setAnchorEl(e.currentTarget);
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
      if (questionIsEmpty && allowAddInquiry) {
        dispatch(InquiryActions.addQuestion(id));
      } else if (!questionIsEmpty) {
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

  const checkQuestionIsEmpty = () => {
    if (inquiries.length > 0) {
      const check = inquiries.filter((q) => q.field === id);
      const checkMedia = inquiries.filter((q) => q.field === id && q.mediaFile.length);
      checkMedia.length && setMediaFileIsEmpty(false);
      return check.length === 0;
    }
    return true;
  };
  const checkAnswerSent = () => {
    let checkInqAns = false;
    let checkDrafComment = false;
    if (inquiries.length > 0) {
      const lstInq = inquiries.filter((q) => (q.field === id && !statusCommentDrf.includes(q.state)));
      const lstReplyAme = listCommentDraft.filter(q => q.field === id);
      // Check Inquiry
      if (lstInq.length) {
        if (lstInq.some(e => ['OPEN', 'INQ_SENT'].includes(e.state))) return false;
        const listStatus = user?.role === 'Admin' ? [...sentStatus] : [...sentStatus, ...['ANS_DRF']];
        checkInqAns = lstInq.some(e => listStatus.includes(e.state));
      }
      // Check Amendment
      if (lstReplyAme.length === 1) return false;
      if (lstReplyAme.length > 1) {
        checkDrafComment = Boolean(lstReplyAme.filter(comment => ['REP_DRF', 'REP_SENT'].includes(comment.state).length));
      }
      return (lstReplyAme.length === 0 ? checkInqAns : (checkInqAns || checkDrafComment));
    }
    return false;
  };

  const checkQuestionIsResolved = () => {
    if (inquiries.length > 0) {
      const lst = inquiries.filter((q) => q.field === id);
      if (lst.length > 0)
        return lst.every(e => e.state === 'COMPL' || e.state === 'UPLOADED' || e.state === 'RESOLVED')
    }
    return false;
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
    setHasAnswer(checkAnswerSent())
    setIsResolved(checkQuestionIsResolved())
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
              !questionIsEmpty ? classes.hasInquiry : '',
              lock ? classes.locked : '',
              (hasAnswer && !isResolved) ? classes.hasAnswer : '',
              isResolved ? classes.hasResolved : ''
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
                  {!mediaFileIsEmpty && (
                    <AttachFile
                      className={clsx(
                        classes.sizeIcon,
                        !hasAnswer ? classes.colorHasInqIcon : classes.colorHasAnswer,
                        classes.attachIcon,
                        isResolved ? classes.colorHasResolved : ''
                      )}
                    />
                  )}
                  {isResolved ? (
                    <CheckCircleIcon className={clsx(classes.sizeIcon, classes.colorHasResolved)} />
                  ) :
                    !questionIsEmpty && !hasAnswer && (
                      <HelpIcon className={clsx(classes.sizeIcon, classes.colorHasInqIcon)} />
                    )}
                  {!questionIsEmpty && hasAnswer && !isResolved && (
                    <ReplyIcon className={clsx(classes.sizeIcon, classes.colorHasAnswer)} />
                  )}

                  {lock ? (
                    <LockOutlinedIcon className={clsx(classes.sizeIcon, classes.colorLockIcon)} />
                  ) : (
                    anchorEl &&
                    anchorEl.id === id &&
                    allowAddInquiry && (
                      <AddCircleIcon
                        className={clsx(classes.sizeIcon, classes.colorEmptyInqIcon)}
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
