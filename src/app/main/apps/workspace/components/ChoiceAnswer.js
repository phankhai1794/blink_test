import { updateInquiryChoice } from 'app/services/inquiryService';
import React, { useState } from 'react';
import {
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import {PERMISSION, PermissionProvider} from "@shared/permission";


const ChoiceAnswer = (props) => {
  const { index, questions, question, saveQuestion } = props;
  let questionIsEmpty = props.question === undefined;
  let prevChoiceArray = question.answerObj.filter((choice) => {
    return choice.confirmed;
  });
  const user = useSelector(({ user }) => user);
  const initSelectedChoice = () => {
    if (!questionIsEmpty && prevChoiceArray.length > 0) {
      return prevChoiceArray[0].id;
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
  const allowUpdateChoiceAnswer = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_UPDATE_CHOICE });

  const handleChange = async (e) => {
    setSelectedChoice(e.target.value);
    // setShowSaveBtn(true);
    const selectedObj = {
      inquiry: question.id,
      answer: e.target.value,
      confirmed: true
    };
    await updateInquiryChoice(selectedObj);

    const optionsOfQuestion = [...questions];
    const answersObj = optionsOfQuestion[index].answerObj;
    answersObj.forEach((item, i) => {
      answersObj[i].confirmed = false;
    });
    const answerIndex = answersObj.findIndex((item) => item.id === selectedObj.answer);
    const answerUpdate = answersObj[answerIndex];
    answerUpdate.confirmed = true;
    saveQuestion(optionsOfQuestion);
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
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          onChange={handleChange}
        >
          {question.answerObj.map((choice, index) => (
            <div key={index} style={{ marginTop: '0.5rem' }}>
              <FormControlLabel
                disabled={!allowUpdateChoiceAnswer}
                checked={selectedChoice === choice.id}
                value={choice.id}
                control={<Radio color={'primary'} />}
                label={<span style={{ fontSize: '1.7rem' }}>{choice.content}</span>}
              />
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default ChoiceAnswer;
