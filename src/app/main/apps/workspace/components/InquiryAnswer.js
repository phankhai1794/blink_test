import { changeStatus } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { displayTime } from '@shared';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from './AttachFile';
import Comment from './Comment';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 8,
    width: 120,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
  },
  positionBtnImg: {
    left: '0',
    top: '-3rem'
  },
  positionBtnNotImg: {
    left: '0',
    top: '4rem'
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72'
    },
    '&.disabledCheck': {
      backgroundColor: '#DDE3EE'
    }
  },
  checkedIcon: {
    display: 'flex',
    alignItems: 'end',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
    '& .container': {
      marginBottom: 5
    }
  },

}
));

const InquiryAnswer = (props) => {
  const { index, question, toggleEdit } = props;
  const type = question.ansType;
  const user = question.creator;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const indexes = originalInquiry.findIndex((q) => q.field === currentField);
  const [isShowBtn, setShowBtn] = useState(null);
  const allowCreateAttachmentAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT
  });

  const onResolve = () => {
    changeStatus(currentField, 'COMPL')
      .then(() => {
        dispatch(FormActions.toggleReload());
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  };

  const onReply = () => {
    dispatch(InquiryActions.setReply(true));
  };

  return (
    <>
      <FormControl className={classes.checkedIcon}>
        <RadioGroup aria-label="gender" name="gender1" value={question.receiver[0]}>
          <FormControlLabel value="customer" control={<Radio color={'primary'} />} label="Customer" />
          <FormControlLabel value="onshore" control={<Radio color={'primary'} />} label="Onshore" />
        </RadioGroup>
      </FormControl>
      <div className="flex justify-between">
        <UserInfo name={user.userName} time={displayTime(question.createdAt)} avatar={user.avatar} />
        <div className="flex items-center">
          <PermissionProvider action={PERMISSION.VIEW_EDIT_INQUIRY}>
            <Tooltip title="Edit Inquiry">
              <IconButton className="p-8" onClick={toggleEdit}>
                <img style={{ height: "22px" }} src="/assets/images/icons/edit.svg" />
              </IconButton>
            </Tooltip>
            <AttachFile index={index} />
            <Tooltip title="Delete Inquiry">
              <IconButton className="p-8" disabled>
                <img style={{ height: "22px" }} src="/assets/images/icons/trash.svg" />
              </IconButton>
            </Tooltip>
          </PermissionProvider>
        </div>
      </div>
      <Typography variant="subtitle" style={{ fontSize: 15, wordBreak: 'break-word', fontFamily: 'Montserrat' }}>
        {question.content}
      </Typography>
      <div style={{ display: 'block', margin: '1rem 0rem' }}>
        {type === metadata.ans_type.choice && (
          <ChoiceAnswer
            index={indexes}
            questions={inquiries}
            question={question}
            saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
          />
        )}
        {type === metadata.ans_type.paragraph && (
          <ParagraphAnswer
            question={question}
            index={indexes}
            questions={inquiries}
            saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
          />
        )}
        {type === metadata.ans_type.attachment && (
          <AttachmentAnswer
            question={question}
            index={indexes}
            questions={inquiries}
            saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
            isShowBtn={isShowBtn}
            isPermissionAttach={allowCreateAttachmentAnswer}
          // disabled={true}
          />
        )}
      </div>
      <>
        {question.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
        {question.mediaFile?.length > 0 &&
          question.mediaFile?.map((file, mediaIndex) => (
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              key={mediaIndex}
              className={classes.root}>
              {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                <ImageAttach
                  hiddenRemove={true}
                  file={file}
                  field={question.field}
                  style={{ margin: '2.5rem' }}
                />
              ) : (
                <FileAttach hiddenRemove={true} file={file} field={question.field} />
              )}
            </div>
          ))}
      </>
      <>
        {question.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
        {question.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            key={mediaIndex}
            className={classes.root}>
            {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
              <ImageAttach
                hiddenRemove={true}
                file={file}
                field={question.field}
                style={{ margin: '2.5rem' }}
              />
            ) : (
              <FileAttach hiddenRemove={true} file={file} field={question.field} />
            )}
          </div>
        ))}
      </>

      <Comment q={question} inquiries={inquiries} indexes={indexes} userType={props.user} />
      <div className="flex">
        <PermissionProvider
          action={PERMISSION.INQUIRY_UPDATE_INQUIRY_STATUS}
        // extraCondition={displayCmt}
        >
          <Button
            variant="contained"
            color="primary"
            // onClick={onResolve}
            classes={{ root: classes.button }}>
            Resolved
          </Button>
        </PermissionProvider>
        <PermissionProvider
          action={PERMISSION.INQUIRY_CREATE_COMMENT}
        // extraCondition={displayCmt}
        >
          <Button
            variant="contained"
            classes={{ root: clsx(classes.button, 'reply') }}
            color="primary"
          // onClick={onReply}
          >
            Reply
          </Button>
        </PermissionProvider>
      </div>
    </>
  );
};

export default InquiryAnswer;
