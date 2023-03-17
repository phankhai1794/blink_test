import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { ONLY_ATT } from '@shared/keyword'
import clsx from "clsx";

import * as InquiryActions from '../store/actions/inquiry';

import UserInfo from './UserInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root.MuiButton-contained': {
      position: 'absolute',
      right: '6px',
      bottom: '5px'
    },
    '& .MuiInputBase-input': {
      width: '93%'
    }
  },
  inputText: {
    '& .MuiInputBase-input': {
      color: '#132535',
      fontSize: 15,
      fontWeight: 500,
      fontStyle: 'italic',
    }
  },
  placeHolder: {
    '& .MuiInputBase-input': {
      color: '#BAC3CB',
      fontSize: 14,
      fontWeight: 400,
      fontStyle: 'normal'
    }
  },
  deleteContent: {
    '& .MuiInputBase-input': {
      textDecorationLine: 'line-through'
    }
  }
}));

const ParagraphAnswer = (props) => {
  const { questions, question, disable = false, saveStatus, currentQuestion, isDeleteAnswer, setDeleteAnswer } = props;
  const allowUpdateParagraphAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_UPDATE_PARAGRAPH
  });
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();

  const [paragraphText, setParagraphText] = useState(question.answerObj && question.answerObj.length ? question.answerObj[0]?.content : '');

  const classes = useStyles(question);
  const [isPermission, setPermission] = useState(false);

  const handleChangeInput = (e) => {
    setParagraphText(e.target.value);
    const body = {
      inquiry: question.id,
      content: e.target.value
    };
    const optionsInquires = [...questions];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    optionsInquires[editedIndex].paragraphAnswer = body;
    dispatch(InquiryActions.setInquiries(optionsInquires));
  };

  useEffect(() => {
    if (allowUpdateParagraphAnswer && allowUpdateParagraphAnswer && !['REP_A_SENT', 'COMPL'].includes(question.state)) {
      setPermission(true);
    } else {
      setPermission(false);
    }
  }, []);

  useEffect(() => {
    if (currentQuestion && currentQuestion.id === question.id) {
      if (!currentQuestion.answerObj.length) {
        setParagraphText('');
      } else if (currentQuestion.answerObj && currentQuestion.answerObj.length) {
        setParagraphText(currentQuestion.answerObj[0].content);
      }
    }
  }, [saveStatus, currentQuestion]);

  useEffect(() => {
    if (!paragraphText &&
        question.answerObj &&
        question.answerObj.length > 0 &&
        ((question.mediaFilesAnswer &&
        question.mediaFilesAnswer.length > 0) ||
        (question.answersMedia &&
        question.answersMedia.length > 0))
    ) setParagraphText(ONLY_ATT)
  }, [saveStatus, question])

  useEffect(() => {
    if (isDeleteAnswer && isDeleteAnswer.status) {
      setParagraphText(isDeleteAnswer.content);
      setDeleteAnswer();
    }
  }, [isDeleteAnswer]);

  return (
    <div>
      <div className={clsx("flex", paragraphText ? classes.inputText : classes.placeHolder, ['ANS_DRF_DELETED', 'ANS_SENT_DELETED'].includes(question.state) && classes.deleteContent)}>
        <TextField
          style={{ border: 'none', display: !isPermission ? (!paragraphText ? 'none' : '') : '' }}
          fullWidth
          placeholder={isPermission ? 'Typing...' : ''}
          classes={{ root: classes.root }}
          disabled={!isPermission || disable}
          InputProps={{
            style: {
              fontSize: '1.7rem',
              fontFamily: 'Montserrat',
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: '1.7rem'
            }
          }}
          id="outlined-multiline-flexible"
          multiline
          rowsMax={4}

          value={paragraphText}
          onChange={handleChangeInput}
        />
      </div>
      {question.selectedChoice && (
        <div style={{ marginTop: '1rem' }}>
          <UserInfo name="Anrew" date="today" time="10:50PM" />
          <TextField
            value={question.selectedChoice}
            disabled
            style={{ margin: '1rem 5rem' }}
            multiline
            variant="outlined"
            inputProps={{
              style: { color: 'black' }
            }}
          />
          {/* <h3 style={{ margin: "1rem 2rem" }}>{question.selectedChoice}</h3> */}
        </div>
      )}
    </div>
  );
};

export default ParagraphAnswer;
