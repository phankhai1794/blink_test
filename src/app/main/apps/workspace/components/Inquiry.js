import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { loadComment } from 'app/services/inquiryService';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import InquiryAnswer from './InquiryAnswer';
import InquiryViewer from './InquiryViewer';

const useStyles = makeStyles((theme) => ({
  boxItem: {
    borderLeft: '2px solid',
    borderColor: '#DC2626',
    paddingLeft: '2rem',
    '&.resolved': {
      borderColor: '#36B37E'
    }
  },
}));

const Inquiry = (props) => {
  const { receiver } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const listInqsField = inquiries.filter((q, index) => q.field === currentField);
  const isShowBackground = useSelector(({ workspace }) => workspace.inquiryReducer.isShowBackground);
  const [changeQuestion, setChangeQuestion] = useState();
  const [isSaved, setSaved] = useState(false);
 
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

  const handleCancel = () => {
    // reset media file
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => currentEditInq.id === inq.id);
    optionsInquires[editedIndex].mediaFilesAnswer = optionsInquires[editedIndex].mediaFilesAnswer.filter(inq => inq.id);
    dispatch(InquiryActions.setInquiries(optionsInquires));
    dispatch(InquiryActions.setEditInq());
  };


  const handleSetSave = () => {
    dispatch(InquiryActions.setEditInq());
  };

  return props.user === 'workspace' ? (
    <>
      {listInqsField.map((q, index) => {
        const isEdit = currentEditInq && q.id === currentEditInq.id;
        if (receiver && !q.receiver.includes(receiver)) {
          return (
            <div key={index} style={{ display: 'flex' }}></div>
          );
        }
        return (
          <div key={q.id}>
            {isEdit ? (
              <>
                {currentEditInq && <InquiryEditor onCancel={onCancel} />}
              </>
            ) : (
              <>
                <div className={clsx(classes.boxItem, (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved')}
                  style={{ filter: isEdit && 'opacity(0.4)', pointerEvents: isEdit && 'none' }}>
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
      <div className='inquiry' style={{
        padding: isShowBackground ? '8px 24px' : '',
        marginTop: isShowBackground ? '2rem' : '',
      }}>
        {listInqsField.map((q, index) => {
          const isEdit = currentEditInq && q.id === currentEditInq.id;
          return (
            <div key={index} className={clsx(classes.boxItem, (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved')}>
              <InquiryViewer
                toggleEdit={() => toggleEdit(index)}
                currentQuestion={changeQuestion}
                question={isEdit ? currentEditInq : q}
                user={props.user}
                isSaved={isSaved}
                setSave={() => setSaved(false)}
              />
              {isEdit && (q.state === 'ANS_DRF' || q.state === 'OPEN' || q.state === 'INQ_SENT') && <InquiryAnswer onCancel={handleCancel} setSave={handleSetSave} />}
              {listInqsField.length - 1 !== index && <Divider className="mt-16 mb-16" />}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Inquiry;
