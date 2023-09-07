import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { getInquiryById, getUpdatedAtAnswer } from 'app/services/inquiryService';
import { sentStatus } from '@shared';
import { handleError } from '@shared/handleError';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';
import { CONTAINER_DETAIL, CONTAINER_MANIFEST } from "../../../../../@shared/keyword";

import InquiryEditor from './InquiryEditor';
import InquiryAnswer from './InquiryAnswer';
import InquiryViewer from './InquiryViewer';
import AmendmentEditor from './AmendmentEditor';

const useStyles = makeStyles((theme) => ({
  boxItem: {
    borderLeft: '2px solid',
    borderColor: '#DC2626',
    paddingLeft: '2rem',
    '&.uploaded': {
      borderColor: '#00506D'
    },
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
  const [receiver, setReceiver] = useState(props?.receiver);
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const currentAmendment = useSelector(({ workspace }) => workspace.inquiryReducer.currentAmendment);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentAmendField = useSelector(({ draftBL }) => draftBL.currentAmendField);
  const [listInqsField, setListInqsField] = useState([]);
  const isShowBackground = useSelector(({ workspace }) => workspace.inquiryReducer.isShowBackground);
  const [changeQuestion, setChangeQuestion] = useState();
  const [isSaved, setSaved] = useState(false);
  const [isUpdateReply, setUpdateReply] = useState(false);
  const [getStateReplyDraft, setStateReplyDraft] = useState(false);
  const [questionIdSaved, setQuestionIdSaved] = useState();
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const [isSaveAnswer, setSaveAnswer] = useState(false);
  const [inqActing, setInqActing] = useState({val: {}, action: false});
  const scrollTopPopup = useRef(null);
  const inputAddAmendmentEndRef = useRef(null);
  const getField = (field) => {
    return metadata.field?.[field] || '';
  };
  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  useEffect(() => {
    let inquiriesSet = [...inquiries];
    inquiriesSet = inquiriesSet.filter((q) => (
      (q.field === currentField && q.process === 'pending')
      ||
      (
        q.process === 'draft'
        && (
          (containerCheck.includes(q.field) && containerCheck.includes(currentField))
          ||
          (q.field === currentField && !containerCheck.includes(q.field))
        )
      )
    ));
    if (user.role === 'Admin' && containerCheck.includes(currentField)) {
      const filterInqDrf = inquiries.filter(inq =>
        containerCheck.includes(inq.field) && inq.process === 'draft');
      const filterInqPending = inquiries.filter(inq => containerCheck.includes(inq.field) && inq.process === 'pending');
      if (filterInqDrf.length && !filterInqPending.length) {
        inquiriesSet = inquiriesSet.filter((q) => (q.process === 'draft' && q.field === currentField));
      }
    }
    setReceiver(null);
    const inqSort = inquiriesSet.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    inqSort.forEach(inq => {
      if (inq.answerObj && inq.answerObj.length > 0) inq.answerObj = inq.answerObj.filter(item => item.type !== metadata.ans_type['attachment']);
    })
    setListInqsField(inqSort);
  }, [inquiries]);

  useEffect(() => {
    if (isUpdateReply && !inqActing.action) {
      setSaveAnswer(!isSaveAnswer)
      setUpdateReply(false);
    }
    if (scrollTopPopup.current) {
      scrollTopPopup.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isUpdateReply, inqActing.action]);

  const toggleEdit = (index) => {
    dispatch(FormActions.toggleSaveInquiry(true));
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(listInqsField[index]));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inqEdit.field));
    }
  };
  const onCancel = () => {
    setInqActing({val: {}, action: false});
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
    optionsInquires[editedIndex].showIconEditInq = true;
    optionsInquires[editedIndex].showIconAttachAnswerFile = false;
    optionsInquires[editedIndex].showIconAttachReplyFile = false;
    //
    let isAnswered = false;
    let choiceAnswer = false;
    if (optionsInquires[editedIndex].answerObj) {
      if (metadata.ans_type['paragraph'] === optionsInquires[editedIndex].ansType) {
        isAnswered = true;
      }
      else if (metadata.ans_type['choice'] === optionsInquires[editedIndex].ansType) {
        const answered = optionsInquires[editedIndex].answerObj.filter(ans => ans.confirmed);
        isAnswered = true;
        choiceAnswer = true;
      }
    }
    if (isCancel && !isAnswered) {
      optionsInquires[editedIndex].mediaFilesAnswer = [];
      optionsInquires[editedIndex].selectChoice = '';
    } else if (isCancel && isAnswered) {
      optionsInquires[editedIndex].selectChoice = '';
      const resInq = await getInquiryById(myBL.id).catch(err => handleError(dispatch, err));
      resInq.forEach(ans => {
        //reset data click cancel
        if (optionsInquires[editedIndex].id === ans.id) {
          if (ans.answerObj.length) {
            if (!choiceAnswer && optionsInquires[editedIndex].paragraphAnswer) {
              optionsInquires[editedIndex].paragraphAnswer.content = ans.answerObj[0].content
            } else if (choiceAnswer && optionsInquires[editedIndex].selectChoice) {
              const answerIndex = ans.answerObj.find((item) => item.confirmed);
              if (answerIndex) optionsInquires[editedIndex].selectChoice.answer = answerIndex.id;
            }
          }
          optionsInquires[editedIndex].mediaFilesAnswer = ans.mediaFilesAnswer;
        }
      });
    } else if (!isCancel) {
      const dataDate = await getUpdatedAtAnswer(q.id).catch(err => handleError(dispatch, err));
      optionsInquires[editedIndex].createdAt = dataDate.data;
      setSaveAnswer(!isSaveAnswer);
    }
    //
    dispatch(InquiryActions.setInquiries(optionsInquires));
    setQuestionIdSaved(optionsInquires[editedIndex]);
    setSaved(!isSaved);
  };

  const handleCancel = (q) => {
    resetActionInquiry(q, true);
  };

  useEffect(() => {
    if (currentAmendment !== undefined && inputAddAmendmentEndRef.current) {
      inputAddAmendmentEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentAmendment]);

  return props.user === 'workspace' ? (
    <div ref={scrollTopPopup}>
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
                {currentEditInq && <InquiryEditor onCancel={onCancel} getUpdatedAt={() => {
                  setUpdateReply(true)
                }}
                setDefaultAction={(currQ) => {
                  if (currQ) {
                    setInqActing(currQ);
                  }
                }} />}
              </>
            ) : (
              <>
                <div
                  className={clsx(
                    classes.boxItem,
                    (['UPLOADED'].includes(q.state)) && 'uploaded',
                    (['COMPL', 'RESOLVED'].includes(q.state)) && 'resolved',
                    ([...sentStatus, ...['REP_DRF']].includes(q.state)) && 'offshoreReply'
                  )}
                  style={{ filter: isEdit && 'opacity(0.4)', pointerEvents: isEdit && 'none' }}>
                  <InquiryViewer
                    currentQuestion={changeQuestion}
                    question={q}
                    user={props.user}
                    showReceiver={q.process === 'pending'}
                    isSaveAnswer={isSaveAnswer}
                    getUpdatedAt={() => {
                      setUpdateReply(true)
                    }}
                    getStateReplyDraft={(val) => {}}
                    isAllInq={false}
                    setDefaultAction={(currQ) => {
                      if (currQ) {
                        setInqActing(currQ);
                      }
                    }}
                    inqActing={inqActing}
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
        <InquiryEditor onCancel={onCancel} getUpdatedAt={() => {
          setUpdateReply(true)
        }}
        setDefaultAction={(currQ) => {
          if (currQ) {
            setInqActing(currQ);
          }
        }} />
      }
    </div>
  ) : (
    <div ref={scrollTopPopup}>
      <div className='inquiry' style={{
        padding: isShowBackground ? '8px 24px' : '',
        marginTop: isShowBackground ? '2rem' : '',
      }}>
        {listInqsField.map((q, index) => {
          return (
            <div key={index}
              style={{ width: '100%' }}
              className={clsx(
                classes.boxItem,
                (['UPLOADED'].includes(q.state)) && 'uploaded',
                (['COMPL', 'RESOLVED'].includes(q.state)) && 'resolved',
                ([...sentStatus, ...['REP_DRF']].includes(q.state)) && 'offshoreReply'
              )}>
              <InquiryViewer
                toggleEdit={() => toggleEdit(index)}
                currentQuestion={questionIdSaved}
                question={q}
                user={props.user}
                isSaved={isSaved}
                // isEdit={q.id === currentEditInq?.id ? q : {}}
                showReceiver={false}
                getStateReplyDraft={(val) => setStateReplyDraft(val)}
                isSaveAnswer={isSaveAnswer}
                getUpdatedAt={() => {
                  setUpdateReply(true)
                }}
                isAllInq={false}
                setDefaultAction={(currQ) => {
                  if (currQ) setInqActing(currQ);
                }}
                inqActing={inqActing}
              />
              {(q.showIconAttachAnswerFile) && (['ANS_DRF', 'OPEN', 'INQ_SENT', 'ANS_SENT', 'REP_Q_DRF'].includes(q.state) || getStateReplyDraft) &&
                <InquiryAnswer
                  onCancel={() => handleCancel(q)}
                  question={q}
                  getUpdatedAt={() => {
                    setUpdateReply(true)
                  }}
                  setDefaultAction={(currQ) => {
                    if (currQ) {
                      setInqActing(currQ);
                    }
                  }}
                />}
              {listInqsField.length - 1 !== index && <Divider className="mt-16 mb-16" />}
            </div>
          );
        })}
      </div>
      <div ref={inputAddAmendmentEndRef}>
        {currentAmendment || currentAmendment === null &&
          <div style={{ marginTop: 30 }}>
            <AmendmentEditor getUpdatedAt={() => { }} />
          </div>
        }
      </div>
    </div>
  );
};
export default Inquiry;
