import React, { useEffect, useState } from 'react';
import { getKeyByValue, displayTime } from '@shared';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Button,
  Radio,
  RadioGroup,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import InquiryAnswer from './InquiryAnswer';
import InquiryViewer from './InquiryViewer';
import UserInfo from './UserInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
  }
}));

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const listInqsField = inquiries.filter((q, index) => q.field === currentField);
  const indexes = inquiries.findIndex((q) => q.field === currentField);
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
        const user = q.creator;
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
                    // toggleEdit={() => toggleEdit(index)}
                    // changeQuestion={(e) => {
                    //   if (e.isCancel) {
                    //     console.log('cancel')
                    //     setChangeQuestion({})
                    //   } else {
                    //     setChangeQuestion(e)
                    //   }
                    // }}
                    // index={index}
                    currentQuestion={changeQuestion}
                    question={q}
                    saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
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
        !currentEditInq.id && ( // Case: Add Inquiry
        <>
          <InquiryEditor onCancel={onCancel} />
        </>
      )}
    </>
  ) : (
    <>
      {listInqsField.map((q, index) => {
        const user = q.creator;
        const isEdit = currentEditInq && q.id === currentEditInq.id;
        return (
          <>
            <InquiryViewer
              toggleEdit={() => toggleEdit(index)}
              // changeQuestion={(e) => {
              //   if (e.isCancel) {
              //     console.log('cancel')
              //     setChangeQuestion({})
              //   } else {
              //     setChangeQuestion(e)
              //   }
              // }}
              // index={index}
              currentQuestion={changeQuestion}
              question={q}
              saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
              user={props.user}
            />
            {isEdit && <InquiryAnswer onCancel={onCancel} />}
          </>
        );
      })}
    </>
  );
};
export default Inquiry;
