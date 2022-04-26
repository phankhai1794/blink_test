import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import { getKeyByValue } from '@shared';

import Form from '../shared-components/Form';
import Inquiry from '../shared-components/Inquiry';

const InquiryForm = (props) => {
  const { FabTitle } = props;
  const dispatch = useDispatch();
  const [questions, currentField, open, metadata] = useSelector((state) => [
    state.workspace.inquiryReducer.question,
    state.workspace.inquiryReducer.currentField,
    state.workspace.inquiryReducer.openDialog,
    state.workspace.inquiryReducer.metadata
  ]);
  const tempQuestionNum = questions.length;
  return (
    <Form
      FabTitle={FabTitle}
      title={
        tempQuestionNum === 1
          ? currentField
            ? getKeyByValue(metadata['field'], currentField)
            : ''
          : 'open Inquiries'
      }
      toggleForm={(status) => dispatch(Actions.toggleCreateInquiry(status))}
      open={open}
    >
      <>
        {questions.map((question, index) => (
          <Inquiry style={{ marginBottom: '2rem' }} index={index} question={question} />
        ))}
      </>
    </Form>
  );
};

export default InquiryForm;
