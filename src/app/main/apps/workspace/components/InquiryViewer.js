import { changeStatus } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { displayTime } from '@shared';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Divider
} from '@material-ui/core';
import clsx from 'clsx';
import IconAttachFile from '@material-ui/icons/AttachFile';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import Comment from './Comment';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
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
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical'
  },
  viewMoreBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 'fit-content',
    position: 'sticky',
    left: '100%',
    color: '#BD0F72',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer'
  }
}));

const InquiryViewer = (props) => {
  const { index, question, toggleEdit } = props;
  const type = question.ansType;
  const user = question.creator;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);

  const [viewDropDown, setViewDropDown] = useState();
  const [isDisableSave, setDisableSave] = useState( true);

  const allowCreateAttachmentAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT
  });
  const handleViewMore = (id) => (viewDropDown === id ? setViewDropDown('') : setViewDropDown(id));

  const selectChoiceHandle = (e) => {
    const inq = { ...currentEditInq };
    inq.selectChoice = e;
    dispatch(InquiryActions.setEditInq(inq));
  };

  const paragraphAnswerHandle = (e) => {
    const inq = { ...currentEditInq };
    inq.paragraphAnswer = e;
    dispatch(InquiryActions.setEditInq(inq));
  };

  return (
    <>
      <div onClick={toggleEdit}>
        <div style={{paddingTop: 10}} className="flex justify-between">
          <UserInfo
            name={question.creator.userName}
            time={displayTime(question.createdAt)}
            avatar={question.creator.avatar}
          />
        </div>
        <Typography variant="h5">{question.name}</Typography>
        <Typography
          className={viewDropDown !== question.id ? classes.hideText : ''}
          variant="h5"
          style={{
            wordBreak: 'break-word',
            fontFamily: 'Montserrat',
            fontSize: 15,
            color: '#132535'
          }}>
          {question.content}
        </Typography>
        {viewDropDown === question.id && (
          <div style={{ display: 'block', margin: '1rem 0rem' }}>
            {type === metadata.ans_type.choice && (
              <ChoiceAnswer
                index={index}
                questions={inquiries}
                question={question}
                selectChoice={(e) => selectChoiceHandle(e)}
                isDisableSave={(e) => setDisableSave(e)}
                saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
              />
            )}
            {type === metadata.ans_type.paragraph && (
              <ParagraphAnswer
                question={question}
                index={index}
                questions={inquiries}
                paragrapAnswer={(e) => paragraphAnswerHandle(e)}
                isDisableSave={(e) => setDisableSave(e)}
                saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
              />
            )}
            {type === metadata.ans_type.attachment && (
              <AttachmentAnswer
                question={question}
                index={index}
                questions={inquiries}
                saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                isPermissionAttach={allowCreateAttachmentAnswer}
              />
            )}
          </div>
        )}
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              {question.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
            </Grid>
            <Grid item xs={6}>
              <div className={classes.viewMoreBtn} onClick={() => handleViewMore(question.id)}>
                {viewDropDown !== question.id ? (
                  <>
                    View All
                    <ArrowDropDown />
                  </>
                ) : (
                  <>
                    Hide All
                    <ArrowDropUp />
                  </>
                )}
              </div>
            </Grid>
          </Grid>
          {question.mediaFile?.length > 0 &&
            question.mediaFile?.map((file, mediaIndex) => (
              <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                  <ImageAttach
                    file={file}
                    hiddenRemove={true}
                    field={question.field}
                    indexInquiry={index}
                    style={{ margin: '2.5rem' }}
                  />
                ) : (
                  <FileAttach hiddenRemove={true} file={file} field={question.field} indexInquiry={index} />
                )}
              </div>
            ))}
        </>
        <>
          {question.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
          {question.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
            <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
              {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                <ImageAttach hiddenRemove={true} file={file} field={question.field} style={{ margin: '2.5rem' }} />
              ) : (
                <FileAttach hiddenRemove={true} file={file} field={question.field} />
              )}
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export default InquiryViewer;
