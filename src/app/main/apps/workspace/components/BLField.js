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
  },
}));

const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });

const BLField = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { children, width, multiline, rows, selectedChoice, id, lock, readOnly } = props;
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const [isHasAnswer, setHasAnswer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mediaFileIsEmpty, setMediaFileIsEmpty] = useState(true);
  const questions = useSelector(({ workspace }) => workspace.inquiryReducer.question);
  const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);

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
    if (!questionIsEmpty) {
      const currentInq = inquiries.find((q) => q.field === id);
      dispatch(InquiryActions.setOneInq(currentInq));
    }
    if (anchorEl && anchorEl.id === id && allowAddInquiry && !lock) {
      if (
        questions.length > 1 &&
        !questions[questions.length - 1].id &&
        checkValidate(questions[questions.length - 1])
      ) {
        if (inquiries.length + questions.length + 1 === metadata.field_options.length) {
          dispatch(FormActions.toggleAddInquiry(false));
        }
        if (inquiries.length + questions.length !== metadata.field_options.length) {
          dispatch(InquiryActions.addQuestion());
          dispatch(InquiryActions.setEdit(questions.length));
        }
      }
      dispatch(FormActions.toggleCreateInquiry(true));
    }
    dispatch(InquiryActions.setField(e.currentTarget.id));
    setAnchorEl(e.currentTarget.id);
  };

  const checkQuestionIsEmpty = () => {
    if (originalInquiry.length > 0) {
      const check = originalInquiry.filter((q) => q.field === id);
      const checkMedia = originalInquiry.filter((q) => q.field === id && q.mediaFile.length);
      checkMedia.length && setMediaFileIsEmpty(false);
      return check.length === 0;
    }
    return true;
  };

  const checkAnswerIsEmpty = () => {
    if (inquiries.length > 0) {
      const checkInqAnswer = inquiries.find(q => q.field === id && q.answerObj.length);
      if (checkInqAnswer) {
        switch (checkInqAnswer.ansType) {
        case `${metadata.ans_type['choice']}`: {
          const findConfirmed = checkInqAnswer.answerObj.find(inq => inq.confirmed);
          if (findConfirmed) setHasAnswer(true);
          break;
        }
        case `${metadata.ans_type['attachment']}`: {
          const findAnswerMedia = checkInqAnswer.answerObj.find(inq => inq.mediaFiles.length > 0);
          findAnswerMedia ? setHasAnswer(true) : setHasAnswer(false);
          break;
        }
        default: {
          const findAnswer = checkInqAnswer.answerObj.find(inq => inq.content);
          findAnswer ? setHasAnswer(true) : setHasAnswer(false);
          break;
        }
        }
      }
    }
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
  }, [originalInquiry, metadata]);

  useEffect(() => {
    checkAnswerIsEmpty();
  }, [inquiries]);

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
              isHasAnswer ? classes.hasAnswer : '',
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
                  {!mediaFileIsEmpty && <AttachFile className={clsx(classes.sizeIcon, !isHasAnswer ? classes.colorHasInqIcon : classes.colorHasAnswer, classes.attachIcon)} />}
                 
                  {!questionIsEmpty && !isHasAnswer && (
                    <HelpIcon className={clsx(classes.sizeIcon, classes.colorHasInqIcon)} />
                  )}
                  {!questionIsEmpty && isHasAnswer && (
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
