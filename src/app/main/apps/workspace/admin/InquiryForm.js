import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as InquiryActions from './store/actions/inquiry';
import * as FormActions from './store/actions/form';
import { getKeyByValue } from '@shared';

import { Card, Typography, FormGroup, FormControlLabel, Checkbox, FormControl, FormHelperText } from '@material-ui/core';
import ChoiceAnswer from '../shared-components/ChoiceAnswer';
import ParagraphAnswer from '../shared-components/ParagraphAnswer';
import AttachmentAnswer from '../shared-components/AttachmentAnswer';
import InquiryEditor from './components/InquiryEditor';
import Form from '../shared-components/Form';

const InquiryForm = (props) => {
  const { FabTitle } = props;
  const dispatch = useDispatch();
  const [questions, currentField, metadata, valid, currentEdit] = useSelector((state) => [
    state.workspace.inquiryReducer.question,
    state.workspace.inquiryReducer.currentField,
    state.workspace.inquiryReducer.metadata,
    state.workspace.inquiryReducer.validation,
    state.workspace.inquiryReducer.currentEdit,
  ]);
  const [open] = useSelector((state) => [
    state.workspace.formReducer.openDialog,
  ])
  useEffect(() => {
    const check = questions.filter((q) => !q.receiver.length)
    dispatch(InquiryActions.validate({ ...valid, receiver: !Boolean(check.length) }));
  }, [questions])

  const changeToEditor = (index) => {
    if (!questions[currentEdit].inqType || !questions[currentEdit].field || !questions[currentEdit].receiver.length) {
      dispatch(InquiryActions.validate({
        field: Boolean(questions[currentEdit].field),
        inqType: Boolean(questions[currentEdit].inqType),
        receiver: Boolean(questions[currentEdit].receiver.length)
      }))
    } else if (index !== currentEdit) dispatch(InquiryActions.setEdit(index));
  };
  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...questions];
    if (e.target.checked) {
      optionsOfQuestion[index].receiver.push(e.target.value);
    } else {
      const i = optionsOfQuestion[index].receiver.indexOf(e.target.value);
      optionsOfQuestion[index].receiver.splice(i, 1);
    }
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };
  return (
    <Form
      FabTitle={FabTitle}
      title="Inquiry Creation"
      toggleForm={(status) => dispatch(FormActions.toggleCreateInquiry(status))}
      open={open}
    >
      <>
        {questions.map((question, index) => (
          <>
            <div style={{ marginBottom: '24px' }}>
              {currentEdit === index ? (
                <InquiryEditor
                  index={index}
                  questions={questions}
                  question={question}
                  saveQuestion={(q) => dispatch(InquiryActions.setQuestion(q))}
                />
              ) : (
                <Card style={{ padding: '1rem ' }}>
                  <div className="flex justify-between">
                    <Typography color="primary" variant="h5">
                      {getKeyByValue(metadata['field'], question.field)}
                    </Typography>
                    <FormControl error={!questions[index].receiver.length}>
                      <FormGroup row>
                        <FormControlLabel
                          value="onshore"
                          control={
                            <Checkbox
                              checked={question.receiver.includes('onshore')}
                              onChange={(e) => handleReceiverChange(e, index)}
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
                              onChange={(e) => handleReceiverChange(e, index)}
                              color="primary"
                            />
                          }
                          label="Customer"
                        />
                      </FormGroup>
                      {!questions[index].receiver.length && <FormHelperText>Pick at least one!</FormHelperText>}
                    </FormControl>
                  </div>
                  <div onClick={() => changeToEditor(index)}>
                    <Typography variant="h5">{question.content.replace('{{INQ_TYPE}}', '')}</Typography>
                    <div style={{ display: 'block', margin: '1rem 0rem' }}>
                      {question.ansType === metadata.ans_type.choice && (
                        <ChoiceAnswer question={question} />
                      )}
                      {question.ansType === metadata.ans_type.paragraph && (
                        <ParagraphAnswer
                          question={question}

                        />
                      )}
                      {question.ansType === metadata.ans_type.attachment && (
                        <AttachmentAnswer
                          question={question}

                        // disabled={true}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </>
        ))}
      </>
    </Form>
  );
};

export default InquiryForm;
