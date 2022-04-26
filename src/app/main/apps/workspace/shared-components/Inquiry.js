import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import { Card, Typography, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { getKeyByValue } from '@shared';

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const { question, index } = props;
  const [questions, openEdit, metadata] = useSelector((state) => [
    state.workspace.inquiryReducer.question,
    state.workspace.inquiryReducer.openEdit,
    state.workspace.inquiryReducer.metadata
  ]);
  const onSaveSelectedChoice = (savedQuestion) => {
    props.onSaveSelectedChoice(savedQuestion);
  };

  const changeToEditor = (index) => {
    if (index !== openEdit) dispatch(Actions.setEdit(index));
  };

  const handleReceiverChange = (e) => {
    const optionsOfQuestion = [...questions];
    if (e.target.checked) {
      optionsOfQuestion[index].receiver.push(e.target.value);
    } else {
      const i = optionsOfQuestion[index].receiver.indexOf(e.target.value);
      optionsOfQuestion[index].receiver.splice(i, 1);
    }
    dispatch(Actions.setQuestion(optionsOfQuestion));
  };
  return (
    <>
      <div className="flex justify-between"></div>
      <div style={{ width: '770px', marginBottom: '24px' }}>
        {openEdit === index ? (
          <InquiryEditor
            index={index}
            questions={questions}
            question={question}
            saveQuestion={(q) => dispatch(Actions.setQuestion(q))}
          />
        ) : (
          <Card style={{ padding: '1rem ' }}>
            <div className="flex justify-between">
              <Typography color="primary" variant="h5">
                {getKeyByValue(metadata['field'], question.field)}
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  value="onshore"
                  control={
                    <Checkbox
                      checked={question.receiver.includes('onshore')}
                      onChange={handleReceiverChange}
                      color="primary"
                    />
                  }
                  label="Onshore"
                />
                <FormControlLabel
                  value="customer"
                  control={
                    <Checkbox
                      checked={question.receiver.includes('customer')}
                      onChange={handleReceiverChange}
                      color="primary"
                    />
                  }
                  label="Customer"
                />
              </FormGroup>
            </div>
            <div onClick={() => changeToEditor(index)}>
              <Typography variant="h5">{question.content.replace('{{INQ_TYPE}}', '')}</Typography>
              <div style={{ display: 'block', margin: '1rem 0rem' }}>
                {question.ansType === metadata.ans_type.choice && (
                  <ChoiceAnswer question={question} onSaveSelectedChoice={onSaveSelectedChoice} />
                )}
                {question.ansType === metadata.ans_type.paragraph && (
                  <ParagraphAnswer
                    question={question}
                    onSaveSelectedChoice={onSaveSelectedChoice}
                  />
                )}
                {question.ansType === metadata.ans_type.attachment && (
                  <AttatchmentAnswer
                    question={question}
                    onSaveSelectedChoice={onSaveSelectedChoice}
                    // disabled={true}
                  />
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default Inquiry;
