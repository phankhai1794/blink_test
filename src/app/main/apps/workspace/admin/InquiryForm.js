import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';

import Form from '../shared-components/Form';
import Inquiry from '../shared-components/Inquiry';

const InquiryForm = (props) => {
  const { FabTitle } = props;
  const dispatch = useDispatch()
  const [questions , currentField, open] = useSelector((state) =>[state.workspace.question, state.workspace.currentField, state.workspace.open] )
  const tempQuestionNum = questions.length
  return (
      <Form
        FabTitle={FabTitle}
        title={tempQuestionNum === 1 ? (currentField ? currentField : "") : 'open Inquiries'}
        toggleForm={(status) => dispatch(Actions.toggleCreateInquiry(status))}
        open={open}
      >
        <>
          { questions.map((question, index) => (
            <Inquiry style={{ marginBottom: '2rem' }} index={index} question={question} />
          ))
          }
        </>
      </Form>
  );
};

export default InquiryForm;
