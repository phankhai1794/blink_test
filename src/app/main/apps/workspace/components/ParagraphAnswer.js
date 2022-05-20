import React, { useState } from 'react';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { createParagraphAnswer, updateParagraphAnswer } from 'app/services/inquiryService';
import { useDispatch } from 'react-redux';
import * as AppAction from 'app/store/actions';

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
  }
}));

const ParagraphAnswer = (props) => {
  const { question, user, index, questions, saveQuestion } = props;
  const [paragraphText, setParagraphText] = useState(question.answerObj[0]?.content || '');
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleSaveSelectedChoice = (e) => {
    let savedQuestion = question;
    savedQuestion = {
      ...savedQuestion,
      paragraph: paragraphText,
      selectedChoice: paragraphText
    };
    props.onSaveSelectedChoice(savedQuestion);
  };

  const addParagraph = async () => {
    const body = {
      inquiry: question.id,
      content: paragraphText
    };
    const optionsOfQuestion = [...questions];
    const objAns = optionsOfQuestion[index].answerObj;
    if (question.answerObj.length === 0) {
      createParagraphAnswer(body).then((res) => {
        if (res) {
          const { message, answerObj } = res;
          objAns.push(answerObj);
          saveQuestion(optionsOfQuestion);
          dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
        }
      });
    } else {
      const answerId = question.answerObj[0].id;
      updateParagraphAnswer(answerId, body).then((res) => {
        if (res) {
          const { message } = res;
          objAns[0].content = body.content;
          saveQuestion(optionsOfQuestion);
          dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
        }
      });
    }
  };

  return (
    <div>
      <div className="flex">
        <TextField
          placeholder="Customer Input"
          classes={{ root: classes.root }}
          disabled={user !== 'guest'}
          InputProps={{
            style: {
              fontSize: '1.7rem'
            },
            endAdornment: user === 'guest' && (
              <InputAdornment position="end">
                <Button
                  aria-label="Add"
                  edge="end"
                  color="primary"
                  variant="contained"
                  onClick={addParagraph}
                >
                  Add
                </Button>
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            style: {
              fontSize: '1.7rem'
            }
          }}
          id="outlined-multiline-flexible"
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          value={paragraphText}
          onChange={(e) => setParagraphText(e.target.value)}
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
