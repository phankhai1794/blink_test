import React, { useState } from 'react';
import { Radio, TextField, Button } from '@material-ui/core';
import UserInfo from './UserInfo';
import SaveIcon from '@material-ui/icons/Save';

const ChoiceAnswer = (props) => {
  const { question, disabled } = props;
  let questionIsEmpty = props.question === undefined;
  let prevChoiceArray = question.choices.filter(
    (choice) => choice.content === question.selectedChoice
  );
  const initSelectedChoice = () => {
    if (!questionIsEmpty) {
      if (question.selectedChoice === '') {
        return '';
      } else if (question.selectedChoice === 'other') {
        return 'other';
      } else {
        return prevChoiceArray.length === 0
          ? `${question.otherChoiceContent === undefined ? '' : 'other'}`
          : prevChoiceArray[0].content;
      }
    } else {
      return '';
    }
  };
  const [selectedChoice, setSelectedChoice] = useState(initSelectedChoice());
  console.log(selectedChoice);
  const [otherChoiceContent, setOtherChoiceContent] = useState(question.otherChoiceContent);
  const [lastSelectedChoice, setLastSelectedChoice] = useState(
    selectedChoice === 'other' ? otherChoiceContent : selectedChoice
  );
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const handleChange = (e) => {
    setSelectedChoice(e.target.value);
    setShowSaveBtn(true);
  };
  const handleSaveSelectedChoice = () => {
    let savedQuestion = question;
    savedQuestion = {
      ...savedQuestion,
      selectedChoice: selectedChoice === 'other' ? otherChoiceContent : selectedChoice,
      otherChoice: otherChoiceContent
    };
    // props.onSaveSelectedChoice(savedQuestion)
    setLastSelectedChoice(selectedChoice === 'other' ? otherChoiceContent : selectedChoice);
    setShowSaveBtn(false);
  };
  const handleFocus = (e) => {
    setSelectedChoice('other');
    e.target.select();
    setShowSaveBtn(true);
  };
  return (
    <>
      {question.choices.map((choice) => (
        <div key={choice.id} style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <div>
              <Radio
                disabled={disabled}
                checked={selectedChoice === choice.content}
                onChange={handleChange}
                value={choice.content}
                color="primary"
                style={{ margin: 'auto' }}
              />
            </div>
            <p style={{ margin: 'auto 1rem', fontSize: '1.7rem' }}>{choice.content}</p>
          </div>
        </div>
      ))}
      {question.addOther && (
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <Radio
            disabled={disabled}
            checked={selectedChoice === 'other'}
            onChange={handleChange}
            value="other"
            color="primary"
            style={{ marginLeft: '0rem' }}
          />
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
            value={otherChoiceContent}
            onChange={(e) => setOtherChoiceContent(e.target.value)}
            fullWidth
            multiline
            disabled={disabled}
            onFocus={handleFocus}
          />
        </div>
      )}
      {lastSelectedChoice !== '' && !showSaveBtn && (
        <div style={{ marginTop: '1rem' }}>
          <UserInfo name="Anrew" date="today" time="10:50PM" />
          <h3 style={{ margin: '1rem 5.5rem' }}>{lastSelectedChoice}</h3>
        </div>
      )}
      {showSaveBtn && (
        <div className="flex justify-end">
          <Button variant="contained" color="primary" onClick={handleSaveSelectedChoice}>
            {' '}
            <SaveIcon />
            Save
          </Button>
        </div>
      )}
    </>
  );
};

export default ChoiceAnswer;
