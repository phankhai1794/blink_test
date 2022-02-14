import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import {  Card, Typography } from '@material-ui/core';

const Inquiry = (props) => {
  const dispatch = useDispatch()
  const { question, index } = props;
  const [questions , openEdit] = useSelector((state) => [state.workspace.question,state.workspace.openEdit])
  const onSaveSelectedChoice = (savedQuestion) => {
    props.onSaveSelectedChoice(savedQuestion);
  };

  const changeToEditor = (index) => {
    if (index !== openEdit)
      dispatch(Actions.setEdit(index));
  };
  return (
    <>
      <div className="flex justify-between">
      </div>
        <div style={{ width: '770px', marginBottom: "24px" }} onClick={() => changeToEditor(index)}>
        {openEdit === index ? <InquiryEditor index={index} questions={questions} question={question} saveQuestion={(q) => dispatch((Actions.setQuestion(q)))}  /> : 
          <Card style={{ padding: '1rem ' }}>
            <Typography variant="h5">{question.name}</Typography>
              <div style={{ display: 'block', margin: '1rem 0rem' }}>
                {question.answerType === 'CHOICE ANSWER' && (
                  <ChoiceAnswer question={question} onSaveSelectedChoice={onSaveSelectedChoice} />
                )}
                {question.answerType === 'PARAGRAPH ANSWER' && (
                  <ParagraphAnswer question={question} onSaveSelectedChoice={onSaveSelectedChoice} />
                )}
                {question.answerType === 'ATTACHMENT ANSWER' && (
                  <AttatchmentAnswer
                    question={question}
                    onSaveSelectedChoice={onSaveSelectedChoice}
                    // disabled={true}
                  />
                )}
              </div>
          </Card>
        }
        </div>
    </>
  );
};

export default Inquiry;
