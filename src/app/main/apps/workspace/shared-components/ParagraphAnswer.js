import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import UserInfo from './UserInfo';
import SaveIcon from '@material-ui/icons/Save';
const ParagraphAnswer = (props) => {
  const { question } = props;
  const [paragraphText, setParagraphText] = useState(question.paragraph || '');

  const handleSaveSelectedChoice = (e) => {
    let savedQuestion = question;
    savedQuestion = {
      ...savedQuestion,
      paragraph: paragraphText,
      selectedChoice: paragraphText
    };
    props.onSaveSelectedChoice(savedQuestion);
  };
  return (
    <div>
      <div className="flex">
        <TextField
          placeholder="INPUT YOUR INFORMATION"
          InputProps={{
            style: {
              fontSize: '1.7rem'
            }
          }}
          InputLabelProps={{
            style: {
              fontSize: '1.7rem'
            }
          }}
          style={{ margin: 'auto 1rem' }}
          fullWidth
          multiline
          value={paragraphText}
          onChange={(e) => setParagraphText(e.target.value)}
          disabled={props.disabled || false}
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
      {question.paragraph !== paragraphText && (
        <div className="flex justify-end" style={{ marginTop: '1rem' }}>
          <Button variant="contained" color="primary" onClick={handleSaveSelectedChoice}>
            {' '}
            <SaveIcon />
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParagraphAnswer;
