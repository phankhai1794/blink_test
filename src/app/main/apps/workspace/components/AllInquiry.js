import { getLabelById, sentStatus } from '@shared';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Divider,
  Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getInquiryById } from 'app/services/inquiryService';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import InquiryViewer from './InquiryViewer';
import InquiryAnswer from './InquiryAnswer';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72'
    }
  },
  checkedIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
    '& .container': {
      marginBottom: 5
    }
  },
  inqTitle: {
    fontFamily: 'Montserrat',
    color: '#BD0F72',
    fontSize: 22,
    fontWeight: 600,
    wordBreak: 'break-word'
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    color: '#8A97A3 !important'
  },
  viewMoreBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 'fit-content',
    position: 'sticky',
    left: '100%',
    color: '#BD0F72',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer'
  },
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical'
  },
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
  boxHasComment: {
    borderColor: '#2F80ED'
  },
  backgroundConfirm: {
    top: 74,
    left: 0,
    position: 'absolute',
    width: '950px',
    minHeight: '100%',
    background: '#ffffff85'
  },
  dialogConfirm: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 74,
    background: '#BD0F72',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& p': {
      marginLeft: '27px',
      fontSize: 16,
      fontWeight: 600,
      color: '#FFFFFF',
      letterSpacing: 1
    },
    '& .btnConfirm': {
      marginRight: '24px',
      '& .MuiButton-label': {
        color: '#BD0F72'
      },
      '& .MuiButtonBase-root': {
        background: '#FFFFFF',
        borderRadius: 6
      }
    },
  },
  firstSentence: {
    position: 'relative',
    color: '#BD0F72',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '20px',
    paddingLeft: 11.67,
    '&:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'translateX(-50%)',
      width: 16.67,
      height: 16.67,
      content: '""',
      backgroundImage: 'url("assets/images/icons/warning.svg")',
      backgroundSize: 'cover'
    }
  },
  secondSentence: {
    color: '#132535',
    fontSize: 15,
    lineHeight: '18px',
    marginTop: 10,
    display: 'block',
    fontWeight: 500,
  },
}));
const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { receiver, openInquiryReview, field } = props;
  const classes = useStyles();
  const [viewDropDown, setViewDropDown] = useState('');
  const [inqHasComment, setInqHasComment] = useState([]);
  const [isSaved, setSaved] = useState(false);
  const [inquiryCopy, currentEditInq, metadata, isShowBackground] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.isShowBackground,
  ]);
  const inquiries = openInquiryReview ? inquiryCopy.filter(inq => inq.state === 'OPEN' || inq.state === 'REP_Q_DRF') : inquiryCopy
  const [getStateReplyDraft, setStateReplyDraft] = useState(false);
  const [questionIdSaved, setQuestionIdSaved] = useState();
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  let CURRENT_NUMBER = 0;

  const changeToEditor = (inq) => {
    const index = inquiries.findIndex((q) => q.id === inq.id);
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inq));
      dispatch(InquiryActions.setEditInq(inqEdit));

      dispatch(InquiryActions.setField(inq.field));
      setViewDropDown('');
    }
  };

  const toggleEdit = (index) => {
    dispatch(FormActions.toggleSaveInquiry(true));
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inquiries[index]));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inqEdit.field));
    }
  };
  const onCancel = () => {
    if (currentEditInq.id) {
      dispatch(InquiryActions.setEditInq());
    }
  };

  const resetActionAllInquiry = async (q, isCancel) => {
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
    resetActionAllInquiry(q, true);
  };

  const handleSetSave = (q) => {
    resetActionAllInquiry(q, false);
  };

  return (
    <>
      {openInquiryReview && !inquiries.length &&
        <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <span className={classes.firstSentence}>
            All Inquiries were sent.
          </span>
          <span className={classes.secondSentence}>Go to&nbsp;
            <Link
              style={{ cursor: 'pointer' }}
              onClick={() => {
                dispatch(FormActions.toggleAllInquiry(true))
                dispatch(FormActions.toggleOpenEmail(false))
              }}>Inquiries List</Link>  to view detail</span>
        </div>
      }
      <div className='inquiryList' style={{
        padding: isShowBackground && '8px 24px',
        marginTop: isShowBackground && '2rem'
      }}>
        {inquiries.map((q, index) => {
          if (receiver && !q.receiver.includes(receiver)) {
            return (
              <div key={index} style={{ display: 'flex' }} onClick={() => changeToEditor(q)}></div>
            );
          }
          CURRENT_NUMBER += 1;
          if (props.user === 'workspace') {
            return currentEditInq && q.id === currentEditInq.id ? (
              <div key={index}>
                {<InquiryEditor onCancel={onCancel} />}
                <Divider
                  className="my-32"
                  variant="middle"
                  style={{ height: '2px', color: '#BAC3CB' }}
                />
              </div>
            ) : (
              <Card key={index} elevation={0} style={{ padding: '1rem ' }}>
                <div
                  className={clsx(
                    classes.boxItem,
                    (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved',
                    inqHasComment.includes(q.id) && classes.boxHasComment,
                    sentStatus.includes(q.state) && 'offshoreReply'
                  )}>
                  <div style={{ marginBottom: '12px' }}>
                    <Typography color="primary" variant="h5" className={classes.inqTitle}>
                      {`${CURRENT_NUMBER}. ${getLabelById(metadata['field_options'], q.field)}`}
                    </Typography>

                    <InquiryViewer user={props.user} question={q} index={index} openInquiryReview={openInquiryReview} field={field} />
                  </div>
                </div>
                <Divider
                  className="my-32"
                  variant="middle"
                  style={{ height: '2px', color: '#BAC3CB' }}
                />
              </Card>
            );
          } else {
            return (
              <div key={index}>
                <div
                  className={clsx(
                    classes.boxItem,
                    (q.state === 'COMPL' || q.state === 'UPLOADED') && 'resolved',
                    !['OPEN', 'INQ_SENT', 'COMPL', 'UPLOADED'].includes(q.state) && 'customerReply',
                    inqHasComment.includes(q.id) && classes.boxHasComment
                  )}>
                  <div style={{ marginBottom: '12px' }}>
                    <Typography color="primary" variant="h5" className={classes.inqTitle}>
                      {`${CURRENT_NUMBER}. ${getLabelById(metadata['field_options'], q.field)}`}
                    </Typography>

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
                  </div>
                </div>
                <Divider
                  className="my-32"
                  variant="middle"
                  style={{ height: '2px', color: '#BAC3CB' }}
                />
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default AllInquiry;
