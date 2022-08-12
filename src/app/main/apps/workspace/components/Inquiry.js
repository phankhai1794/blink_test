import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import InquiryAnswer from './InquiryAnswer';
import InquiryViewer from './InquiryViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
  }
}));

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const listInqsField = inquiries.filter((q, index) => q.field === currentField);
  const [changeQuestion, setChangeQuestion] = useState();

  const toggleEdit = (index) => {
    dispatch(FormActions.toggleSaveInquiry(true));
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(listInqsField[index]));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inqEdit.field));
    }
  };

  const onCancel = () => {
    if (currentEditInq.id) {
      dispatch(InquiryActions.setEditInq());
    }
  };

  return props.user === 'workspace' ? (
    <>
      {listInqsField.map((q, index) => {
        const isEdit = currentEditInq && q.id === currentEditInq.id;
        return (
          <div key={q.id}>
            {isEdit ? (
              <>
                {currentEditInq && <InquiryEditor onCancel={onCancel} />}
              </>
            ) : (
              <>
                <div style={{ filter: isEdit && 'opacity(0.4)', pointerEvents: isEdit && 'none' }}>
                  <InquiryViewer
                    currentQuestion={changeQuestion}
                    question={q}
                    user={props.user}
                  />
                </div>
                {listInqsField.length - 1 !== index && <Divider className="mt-16 mb-16" />}
              </>
            )}
          </div>
        );
      })}
      {currentEditInq &&
        !currentEditInq.id &&  // Case: Add Inquiry
        <InquiryEditor onCancel={onCancel} />
      }
    </>
  ) : (
    <>
      {listInqsField.map((q, index) => {
        const isEdit = currentEditInq && q.id === currentEditInq.id;
        return (
          <>
            <InquiryViewer
              toggleEdit={() => toggleEdit(index)}
              currentQuestion={changeQuestion}
              question={isEdit ? currentEditInq : q}
              user={props.user}></InquiryViewer>
            {isEdit && <InquiryAnswer onCancel={onCancel} />}
          </>
        );
      })}
    </>
  );
};
export default Inquiry;
