import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import clsx from 'clsx';
import { getInquiryById } from 'app/services/inquiryService';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import InquiryAnswer from './InquiryAnswer';
import InquiryViewer from './InquiryViewer';
import AmendmentEditor from './AmendmentEditor';

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
  const currentAmendment = useSelector(({ workspace }) => workspace.inquiryReducer.currentAmendment);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const listInqsField = inquiries.filter((q, index) => q.field === currentField);
  const isShowBackground = useSelector(({ workspace }) => workspace.inquiryReducer.isShowBackground);
  const [changeQuestion, setChangeQuestion] = useState();
  const [isSaved, setSaved] = useState(false);
  const [getStateReplyDraft, setStateReplyDraft] = useState(false);
  const [questionIdSaved, setQuestionIdSaved] = useState();
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

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
    } else {
      dispatch(InquiryActions.setEditInq(null));
      dispatch(FormActions.toggleCreateInquiry(false))
    }
  };

  const resetActionInquiry = async (q, isCancel) => {
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => q.id === inq.id);
    optionsInquires[editedIndex].showIconReply = true;
    optionsInquires[editedIndex].showIconEdit = true;
    optionsInquires[editedIndex].showIconAttachAnswerFile = false;
    optionsInquires[editedIndex].showIconAttachReplyFile = false;
    //
    let isAnswered = false;
    let choiceAnswer = false;
    if (metadata.ans_type['paragraph'] === optionsInquires[editedIndex].ansType) {
      if (optionsInquires[editedIndex].answerObj) {
        isAnswered = true;
      }
    } else if (metadata.ans_type['choice'] === optionsInquires[editedIndex].ansType) {
      if (optionsInquires[editedIndex].answerObj) {
        const answered = optionsInquires[editedIndex].answerObj.filter(ans => ans.confirmed);
        if (answered.length) isAnswered = true;
        choiceAnswer = true;
      }
    }
    if (isCancel && !isAnswered) {
      optionsInquires[editedIndex].mediaFilesAnswer = [];
    } else if (isCancel && isAnswered) {
      const [resInq] = [await getInquiryById(myBL.id)];
      resInq.forEach(ans => {
        //reset data click cancel
        if (optionsInquires[editedIndex].id === ans.id) {
          if (ans.answerObj.length) {
            if (!choiceAnswer && optionsInquires[editedIndex].paragraphAnswer) {
              optionsInquires[editedIndex].paragraphAnswer.content = ans.answerObj[0].content
            } else if (choiceAnswer && optionsInquires[editedIndex].selectChoice) {
              const answerIndex = ans.answerObj.find((item) => item.confirmed);
              optionsInquires[editedIndex].selectChoice.answer = answerIndex.id;
            }
          }
          optionsInquires[editedIndex].mediaFilesAnswer = ans.mediaFilesAnswer;
        }
      });
    }
    //
    dispatch(InquiryActions.setInquiries(optionsInquires));
    setQuestionIdSaved(optionsInquires[editedIndex]);
    setSaved(!isSaved);
  };

  const handleCancel = (q) => {
    resetActionInquiry(q, true);
  };

  const handleSetSave = (q) => {
    resetActionInquiry(q, false);
  };

  const checkCommentDraft = (amendment, conditionStates) => {
    let result = true;
    if (amendment?.process === 'draft') {
      const lst = listCommentDraft.filter(comment => comment.field === amendment.field);
      if (lst.length === 1) result = false; // has only 1 customer's amendment
      else result = Boolean(lst.filter(comment => conditionStates.includes(comment.state)).length);
    }
    return result;
  }

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
                <div
                  className={clsx(
                    classes.boxItem,
                    (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved',
                    (!['OPEN', 'INQ_SENT', 'ANS_DRF', 'COMPL', 'UPLOADED', 'RESOVLED'].includes(q.state) && checkCommentDraft(q, ['REP_DRF', 'REP_SENT'])) && 'offshoreReply'
                  )}
                  style={{ filter: isEdit && 'opacity(0.4)', pointerEvents: isEdit && 'none' }}>
                  <InquiryViewer
                    currentQuestion={changeQuestion}
                    question={q}
                    user={props.user}
                    showReceiver={q.process === 'pending'}
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
          return (
            <div key={index} className={clsx(classes.boxItem,
              (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved',
              (!['OPEN', 'INQ_SENT', 'COMPL', 'UPLOADED', 'RESOVLED'].includes(q.state) && checkCommentDraft(q, ['REP_SENT'])) && 'customerReply'
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
      {currentAmendment || currentAmendment === null &&
        <div style={{ marginTop: 30 }}>
          <AmendmentEditor />
        </div>
      }
    </>
  );
};
export default Inquiry;
