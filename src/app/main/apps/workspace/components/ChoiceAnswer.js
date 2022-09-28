import React, {useEffect, useState} from 'react';
import {
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {PERMISSION, PermissionProvider} from "@shared/permission";

import * as InquiryActions from '../store/actions/inquiry';

const ChoiceAnswer = (props) => {
  const { question, questions, disableChecked, disable = false, saveStatus, currentQuestion } = props;
  const user = useSelector(({ user }) => user);
  let questionIsEmpty = props.question === undefined;
  let prevChoiceArray = (user.role === 'Admin' && !["ANS_SENT", "REP_A_SENT", "COMPL"].includes(question.state))? []: question.answerObj.filter((choice) => {
    return choice.confirmed;
  });
  const [isPermission, setPermission] = useState(false);
  const dispatch = useDispatch();

  const initSelectedChoice = () => {
    if (!questionIsEmpty && prevChoiceArray.length > 0) {
      return prevChoiceArray[0].id;
    } else {
      return '';
    }
  };
  const [selectedChoice, setSelectedChoice] = useState(initSelectedChoice());
  const allowUpdateChoiceAnswer = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_UPDATE_CHOICE });

  useEffect(() => {
    if (currentQuestion && currentQuestion.currentInq.id === question.id) {
      const inqConfirmed = currentQuestion.currentInq.answerObj.filter(ans => ans.confirmed);
      if (!inqConfirmed.length) {
        setSelectedChoice('');
      }
    }
  }, [saveStatus]);

  const handleChange = (e) => {
    setSelectedChoice(e.target.value);
    const selectedObj = {
      inquiry: question.id,
      answer: e.target.value,
      confirmed: true
    };
    //
    const optionsInquires = [...questions];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    optionsInquires[editedIndex].selectChoice = selectedObj;
    dispatch(InquiryActions.setInquiries(optionsInquires));
  };

  useEffect(() => {
    if (allowUpdateChoiceAnswer && !['ANS_SENT', 'REP_Q_DRF'].includes(question.state)) {
      setPermission(true);
    } else {
      setPermission(false);
    }
  }, []);

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
                disabled={!isPermission || disable}
                checked={!disableChecked&&selectedChoice === choice.id}
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
