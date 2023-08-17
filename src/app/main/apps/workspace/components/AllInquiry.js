import { getLabelById, sentStatus } from '@shared';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Typography,
  Divider,
  Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getInquiryById } from 'app/services/inquiryService';
import { handleError } from '@shared/handleError';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import InquiryViewer from './InquiryViewer';
import InquiryAnswer from './InquiryAnswer';
import AmendmentEditor from "./AmendmentEditor";

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
  console.log(receiver)
  const classes = useStyles();
  const [isSaved, setSaved] = useState(false);
  const [inquiryCopy, currentEditInq, metadata, isShowBackground, currentAmendment] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.isShowBackground,
    workspace.inquiryReducer.currentAmendment,
  ]);
  const [openAllInquiry, openAmendmentList, openPreviewListSubmit, openPreviewFiles, currentFilePreview, scrollInquiry ] = useSelector(({ workspace }) => [
    workspace.formReducer.openAllInquiry,
    workspace.formReducer.openAmendmentList,
    workspace.formReducer.openPreviewListSubmit,
    workspace.formReducer.openPreviewFiles,
    workspace.formReducer.currentFilePreview,
    workspace.formReducer.scrollInquiry,
  ]);
  const [inquiries, setInquiries] = useState([]);
  const [getStateReplyDraft, setStateReplyDraft] = useState(false);
  const [questionIdSaved, setQuestionIdSaved] = useState();
  const [isSaveAnswer, setSaveAnswer] = useState(false);
  const [isUpdateReply, setUpdateReply] = useState(false);
  const inputAddAmendmentEndRef = useRef(null);
  const scrollTopPopup = useRef(null);
  const scrollFilePosition = useRef(null);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  useEffect(() => {
    let inquiriesSet = [...inquiryCopy];
    if (!openAmendmentList) dispatch(InquiryActions.addAmendment());
    if (openAllInquiry) {
      inquiriesSet = inquiriesSet.filter(inq => inq.process === 'pending');
    } else if (openAmendmentList) {
      inquiriesSet = inquiriesSet.filter(inq => inq.process === 'draft');
      if (!inquiriesSet.length) dispatch(InquiryActions.addAmendment(null));
    } else if (openInquiryReview) {
      console.log(inquiriesSet)
      inquiriesSet = inquiriesSet.filter(inq => ['OPEN', 'REP_Q_DRF', 'REOPEN_A', 'REOPEN_Q', 'REP_DRF'].includes(inq.state));
      console.log(inquiriesSet)
    } else if (openPreviewListSubmit) {
      inquiriesSet = inquiriesSet.filter(inq => ['ANS_DRF', 'REP_A_DRF', 'REP_DRF', 'AME_DRF'].includes(inq.state));
      if (!inquiriesSet.length) dispatch(FormActions.togglePreviewSubmitList(false));
    }
    let inquiriesSort = inquiriesSet.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    setInquiries(inquiriesSort);
  }, [inquiryCopy]);

  useEffect(() => {
    if (isUpdateReply) {
      setSaveAnswer(!isSaveAnswer)
      setUpdateReply(false);
    }
    if (scrollTopPopup.current &&!scrollInquiry) {
      scrollTopPopup.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isUpdateReply]);

  let CURRENT_NUMBER = 0;

  const toggleEdit = (index) => {
    dispatch(FormActions.toggleSaveInquiry(true));
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inquiries[index]));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inqEdit.field));
    }
  };

  const onCancel = () => {
    if (currentEditInq) {
      dispatch(InquiryActions.setEditInq());
    }
  };

  const resetActionAllInquiry = async (q, isCancel) => {
    const optionsInquires = [...inquiryCopy];
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

  useEffect(() => {
    if (currentAmendment !== undefined && inputAddAmendmentEndRef.current) {
      inputAddAmendmentEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentAmendment]);

  const getLabel = (id) => {
    const result = metadata['field_options'].filter(({ value }) => value === id);
    if (result.length) {
      if ((result[0].keyword === 'containerDetail' || result[0].keyword === 'containerManifest') && !openAmendmentList) {
        return 'Container Detail - Container Manifest'
      } else {
        return result[0].label;
      }
    }
    return '';
  }

  const scrollFunction = () => {
    const a = document.getElementById(scrollInquiry);
    if(a) {
      a.scrollIntoView(true);
      dispatch(FormActions.setScrollInquiry());
    }
  }
  
  return (
    <>
      {openInquiryReview && !inquiries.length &&
        <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {inquiryCopy.length ?
            <>
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
            </> :
            <>
              <span className={classes.firstSentence}>No Inquiries Right Now!</span>
              <span className={classes.secondSentence}>Please add an inquiry for missing information.</span>
            </>
          }
        </div>
      }
      <div className='inquiryList' style={{
        padding: isShowBackground && '8px 24px',
        marginTop: isShowBackground && '2rem'
      }} ref={scrollTopPopup}>
        {props.user === 'workspace' ? (
          inquiries.map((q, index) => {
            CURRENT_NUMBER += 1;
            if (receiver && !q.receiver.includes(receiver) && !openAmendmentList) {
              return (
                <div key={index} style={{ display: 'flex' }}></div>
              );
            }
            return (
              currentEditInq && q.id === currentEditInq.id ? (
                <div key={index}>
                  {<InquiryEditor
                    onCancel={onCancel}
                    getUpdatedAt={() => {
                      setUpdateReply(true)
                    }}
                  />}
                  <Divider
                    className="my-32"
                    variant="middle"
                    style={{ height: '2px', color: '#BAC3CB' }}
                  />
                </div>
              ) : (
                <Card key={index} elevation={0} style={{ padding: '1rem ', width: '100%' }}>
                  <div
                    className={clsx(
                      classes.boxItem,
                      (['UPLOADED'].includes(q.state)) && 'uploaded',
                      (['COMPL', 'RESOLVED'].includes(q.state)) && 'resolved',
                      ([...sentStatus, ...['REP_DRF']].includes(q.state)) && 'offshoreReply'
                    )}>
                    <div style={{ marginBottom: '12px' }}>
                      <Typography color="primary" variant="h5" className={classes.inqTitle} id={q.id}>
                        {getLabel(q.field)}
                      </Typography>
                      {(q.id === scrollInquiry) && scrollFunction()}         
                      <InquiryViewer
                        user={props.user}
                        question={q}
                        index={index}
                        openInquiryReview={openInquiryReview}
                        field={field}
                        isSaveAnswer={isSaveAnswer}
                        getUpdatedAt={() => {
                          setUpdateReply(true)
                        }}
                        isAllInq={true}
                      />
                    </div>
                  </div>
                  <Divider
                    className="my-32"
                    variant="middle"
                    style={{ height: '2px', color: '#BAC3CB' }}
                  />
                </Card>
              )
            )
          })
        ) : (
          inquiries.map((q, index) => {
            CURRENT_NUMBER += 1;
            return (
              <div key={index} id={q.id}>
                <div
                  className={clsx(
                    classes.boxItem,
                    (['UPLOADED'].includes(q.state)) && 'uploaded',
                    (['COMPL', 'RESOLVED'].includes(q.state)) && 'resolved',
                    ([...sentStatus, ...['REP_DRF']].includes(q.state)) && 'offshoreReply'
                  )}>
                  <div style={{ marginBottom: '12px' }}>
                    <Typography color="primary" variant="h5" className={classes.inqTitle} id={q.id}>
                      {getLabel(q.field)}
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
                      field={field}
                      isSaveAnswer={isSaveAnswer}
                      getUpdatedAt={() => {
                        setUpdateReply(true)
                      }}
                      isAllInq={true}
                    />
                    {(q.id === scrollInquiry) && scrollFunction()}  
                    {(q.showIconAttachAnswerFile) && (['ANS_DRF', 'OPEN', 'INQ_SENT', 'ANS_SENT', 'REP_Q_DRF'].includes(q.state) || getStateReplyDraft) &&
                      <InquiryAnswer
                        onCancel={() => handleCancel(q)}
                        question={q}
                        getUpdatedAt={() => {
                          setUpdateReply(true)
                        }}
                      />}
                  </div>
                </div>
                <Divider
                  className="my-32"
                  variant="middle"
                  style={{ height: '2px', color: '#BAC3CB' }}
                />
              </div>
            )
          })
        )}
        {currentEditInq &&
          !currentEditInq.id &&  // Case: Add Inquiry
          <InquiryEditor onCancel={onCancel} getUpdatedAt={() => {
            setUpdateReply(true)
          }} />
        }
        <div ref={inputAddAmendmentEndRef}>
          {props.user !== 'workspace' && currentAmendment !== undefined && (
            <div style={{ marginTop: 30 }}>
              <AmendmentEditor
                inquiriesLength={inquiries.length}
                getUpdatedAt={() => {
                  setUpdateReply(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllInquiry;
