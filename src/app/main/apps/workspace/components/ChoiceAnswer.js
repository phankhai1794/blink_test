import React, { useEffect, useState } from 'react';
import {
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel,
  TextField
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION, PermissionProvider } from "@shared/permission";
import { makeStyles } from '@material-ui/styles';

import * as InquiryActions from '../store/actions/inquiry';

const useStyles = makeStyles(() => ({
  input: {
    '& .MuiOutlinedInput-input': {
      padding: 8
    }
  },
}))

const ChoiceAnswer = (props) => {
  const { question, questions, disableChecked, disable = false, saveStatus, currentQuestion, isDeleteAnswer, setDeleteAnswer } = props;
  const user = useSelector(({ user }) => user);
  let questionIsEmpty = question === undefined;
  let prevChoiceArray = question.answerObj?.filter(choice => choice.confirmed) || [];
  const [isPermission, setPermission] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();
  const [otherOptionText, setOtherOptionText] = useState();

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
    if (currentQuestion && currentQuestion.id === question.id) {
      const inqConfirmed = currentQuestion.answerObj.filter(ans => ans.confirmed);
      if (!inqConfirmed.length) {
        setSelectedChoice('');
      }
    }
  }, [saveStatus]);

  const handleChange = (choice, otherOptionText) => {
    setSelectedChoice(choice);
    const optionsInquires = [...questions];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    const lastOptionId = question.answerObj[question.answerObj.length - 1].id;
    const isLast = lastOptionId === choice;
    const selectedObj = {
      inquiry: question.id,
      answer: choice,
      confirmed: true,
      isOther: isLast ? otherOptionText : null,
      isLast,
      lastOptionId
    };

    optionsInquires[editedIndex].selectChoice = selectedObj;
    dispatch(InquiryActions.setInquiries(optionsInquires));
  };

  useEffect(() => {
    const lastChoice = question.answerObj?.[question.answerObj.length - 1].content;
    setOtherOptionText(lastChoice || null);
    if (allowUpdateChoiceAnswer) {
      setPermission(true);
    } else {
      setPermission(false);
    }
  }, []);

  useEffect(() => {
    if (!questionIsEmpty) {
      if (prevChoiceArray.length) {
        setSelectedChoice(prevChoiceArray[0].id);

        const lastChoice = question.answerObj?.[question.answerObj.length - 1].content;
        setOtherOptionText(lastChoice || null);
      }
      else setSelectedChoice('');
    }
  }, [question?.answerObj]);

  useEffect(() => {
    if (isDeleteAnswer?.status) {
      setSelectedChoice(isDeleteAnswer.content);
      setDeleteAnswer();
    }
  }, [isDeleteAnswer]);

  return (
    <>
      <FormControl fullWidth>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          onChange={(e) => handleChange(e.target.value, otherOptionText)}
        >
          {question.answerObj?.map((choice, index) => {
            const lastElement = question.answerObj.length - 1 === index
            if ((lastElement && choice.content) || !lastElement || (user.role === 'Guest' && (!selectedChoice || selectedChoice === choice.id || !disable))) {
              return (
                <div key={index} style={{ marginTop: '0.5rem', display: 'flex' }}>
                  <FormControlLabel
                    disabled={!isPermission || disable}
                    checked={!disableChecked && selectedChoice === choice.id}
                    value={choice.id}
                    control={<Radio color={'primary'} />}
                    label={
                      <span style={{
                        fontSize: '1.7rem',
                        whiteSpace: 'pre',
                        textDecorationLine: ['ANS_DRF_DELETED', 'ANS_SENT_DELETED'].includes(question.state) && 'line-through',
                        fontStyle: (!['COMPL', 'REOPEN_Q', 'REOPEN_A', 'UPLOADED', 'OPEN', 'INQ_SENT'].includes(question.state) || (['ANS_DRF'].includes(question.state) && user.role === 'Guest')) && 'italic',
                      }}>{lastElement && !disable ? 'Other:' : (lastElement ? `Other${choice.content && ':'} ${choice.content}` : choice.content)}</span>
                    }
                  />
                  {lastElement && !disable &&
                    <TextField
                      className={classes.input}
                      fullWidth
                      value={otherOptionText}
                      // autoFocus
                      onChange={(e) => {
                        setOtherOptionText(e.target.value)
                        handleChange(question.answerObj[question.answerObj.length - 1].id, e.target.value)
                      }}
                    />
                  }
                </div>
              )
            }
          })}
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default ChoiceAnswer;
