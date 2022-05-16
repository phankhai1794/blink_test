import React, { useState } from 'react';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import UserInfo from './UserInfo';
import { makeStyles } from '@material-ui/styles';
import { createParagraphAnswer, updateInquiryChoice } from '../../../../services/inquiryService';

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
  const { question, user } = props;
  const [paragraphText, setParagraphText] = useState(question.paragraph || '');
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
      content: paragraphText,
    };
    await createParagraphAnswer(body);
  }

  return (
    <div>
      <div className="flex">
        <TextField
          placeholder="Customer Input"
          classes={{ root: classes.root }}
          disabled={user !== 'guest'}
          InputProps={
          {
            style: {
              fontSize: '1.7rem'
            },
             endAdornment: ( user === 'guest' &&
              <InputAdornment position="end">
                <Button
                  aria-label="Add"
                  edge="end"
                  color="primary"
                  variant="contained"
                  onClick={addParagraph}
                >
                  ADD
                </Button>
              </InputAdornment>
            )
          }
        }
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
