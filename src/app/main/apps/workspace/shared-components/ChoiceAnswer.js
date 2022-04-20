import React, { useState } from 'react';
import { Radio, TextField, Button } from '@material-ui/core';
import UserInfo from './UserInfo';
import SaveIcon from '@material-ui/icons/Save';

const ChoiceAnswer = (props) => {
  const { question } = props;
  let questionIsEmpty = props.question === undefined;
  let prevChoiceArray = question.answerObj.filter(
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
      {question.answerObj.map((choice, index) => (
        <div key={index} style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <div>
              <Radio
                disabled
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
     
      {/* {lastSelectedChoice !== '' && !showSaveBtn && (
        <div style={{ marginTop: '1rem' }}>
          <UserInfo name="Anrew" date="today" time="10:50PM" />
          <h3 style={{ margin: '1rem 5.5rem' }}>{lastSelectedChoice}</h3>
        </div>
      )} */}

    </>
  );
};

export default ChoiceAnswer;
