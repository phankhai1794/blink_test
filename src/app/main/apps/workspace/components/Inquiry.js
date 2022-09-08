import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
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
    },
    '&.customerReply': {
      borderColor: '#2F80ED'
    },
    '&.offshoreReply': {
      borderColor: '#2F80ED'
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
  const [getStateReplyDraft, setStateReplyDraft] = useState(false);
  const [questionIdSaved, setQuestionIdSaved] = useState();

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

  const resetActionInquiry = (q) => {
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => q.id === inq.id);
    optionsInquires[editedIndex].showIconReply = true;
    optionsInquires[editedIndex].showIconEdit = true;
    optionsInquires[editedIndex].showIconAttachAnswerFile = false;
    optionsInquires[editedIndex].showIconAttachReplyFile = false;
    dispatch(InquiryActions.setInquiries(optionsInquires));
    setQuestionIdSaved(optionsInquires[editedIndex]);
    setSaved(!isSaved);
  };

  const handleCancel = (q) => {
    resetActionInquiry(q);
  };

  const handleSetSave = (q) => {
    resetActionInquiry(q);
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
                <div className={clsx(classes.boxItem,
                  (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved',
                  !['OPEN', 'INQ_SENT', 'COMPL', 'UPLOADED', 'ANS_DRF'].includes(q.state) && 'offshoreReply'
                )}
                style={{ filter: isEdit && 'opacity(0.4)', pointerEvents: isEdit && 'none' }}>
                  <InquiryViewer
                    currentQuestion={changeQuestion}
                    question={q}
                    user={props.user}
                    showReceiver={true}
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
            <div key={index} className={clsx(classes.boxItem,
              (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved',
              !['OPEN', 'INQ_SENT', 'COMPL', 'UPLOADED'].includes(q.state) && 'customerReply'
            )}>
              <InquiryViewer
                toggleEdit={() => toggleEdit(index)}
                currentQuestion={questionIdSaved}
                question={q}
                user={props.user}
                isSaved={isSaved}
                isEdit={q.id === currentEditInq?.id ? q : {}}
                showReceiver={false}
                getStateReplyDraft={(val) => setStateReplyDraft(val)}
              />
              {(q.showIconAttachAnswerFile) && (q.state === 'ANS_DRF' || q.state === 'OPEN' || q.state === 'INQ_SENT' || getStateReplyDraft) &&
              <InquiryAnswer
                onCancel={() => handleCancel(q)}
                setSave={() => handleSetSave(q)}
                question={q}
              />}
              {listInqsField.length - 1 !== index && <Divider className="mt-16 mb-16" />}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Inquiry;
