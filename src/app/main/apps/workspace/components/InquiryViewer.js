import {
  resolveInquiry,
  deleteInquiry,
  uploadOPUS,
  saveReply,
  updateReply,
  loadComment,
  reOpenInquiry
} from 'app/services/inquiryService';
import { saveEditedField, updateDraftBLReply, getCommentDraftBl, deleteDraftBLReply } from 'app/services/draftblService';
import { uploadFile } from 'app/services/fileService';
import { getLabelById, displayTime, validatePartiesContent } from '@shared';
import { getBlInfo } from 'app/services/myBLService';
import {
  CONTAINER_DETAIL,
  CONTAINER_MANIFEST,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CM_PACKAGE,
  SHIPPER,
  CONSIGNEE,
  NOTIFY
} from '@shared/keyword';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Tooltip, Grid, Button, FormControlLabel, Radio, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import clsx from 'clsx';
import * as AppAction from 'app/store/actions';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';
import * as Actions from '../store/actions';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from './AttachFile';
import Comment from './Comment';
import TagsComponent from './TagsComponent';
import ContainerDetailForm from './ContainerDetailForm';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
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
    },
    '&.disabledCheck': {
      backgroundColor: '#DDE3EE'
    }
  },
  labelStatus: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
    padding: '2px 9px',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 4
  },
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical'
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
  button: {
    margin: theme.spacing(1),
    marginLeft: 0,
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    },
    '&.w120': {
      width: 120
    }
  },
  boxItem: {
    borderLeft: '2px solid',
    borderColor: '#DC2626',
    paddingLeft: '2rem'
  },
  boxResolve: {
    borderColor: '#36B37E'
  },
  text: {
    height: 40,
    width: 158,
    border: '1px solid #BAC3CB',
    textAlign: 'center',
    color: '#132535'
  },
  inputResolve: {
    width: '100%',
    paddingTop: 10,
    marginTop: 10,
    minHeight: 50,
    resize: 'none',
    '& .MuiOutlinedInput-multiline': {
      padding: '10.5px'
    },
    '& fieldset': {
      borderWidth: '0.5px',
      borderRadius: '6px'
    }
  }
}));

const InquiryViewer = (props) => {
  const { index, showReceiver, isSaved, currentQuestion, openInquiryReview, field, isSaveAnswer } = props;
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const classes = useStyles();

  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const orgContent = useSelector(({ workspace }) => workspace.inquiryReducer.orgContent);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const enableSubmit = useSelector(({ workspace }) => workspace.inquiryReducer.enableSubmit);
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const [indexQuestionRemove, setIndexQuestionRemove] = useState(-1);
  const [replyRemove, setReplyRemove] = useState();
  const [question, setQuestion] = useState(props.question);
  const [type, setType] = useState(props.question.ansType);
  const [allowDeleteInq, setAllowDeleteInq] = useState(true);
  const [viewDropDown, setViewDropDown] = useState();
  const [inqHasComment, setInqHasComment] = useState(false);
  const [isResolve, setIsResolve] = useState(false);
  const [isResolveCDCM, setIsResolveCDCM] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isReplyCDCM, setIsReplyCDCM] = useState(false);
  const [comment, setComment] = useState([]);
  const [isLoadedComment, setIsLoadedComment] = useState(false);
  const [textResolve, setTextResolve] = useState(content[question.field] || '');
  const [textResolveSeparate, setTextResolveSeparate] = useState({ name: '', address: '' });
  const [isSeparate, setIsSeparate] = useState([SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(question.field));
  const [tempReply, setTempReply] = useState({});
  const [showLabelSent, setShowLabelSent] = useState(false);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const [isSaveComment, setSaveComment] = useState(false);
  const [isReopenLabel, setReopenLabel] = useState(false);
  const [checkStateReplyDraft, setStateReplyDraft] = useState(false);
  const [submitLabel, setSubmitLabel] = useState(false);
  const [isShowViewAll, setShowViewAll] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [isRemoveFile, setIsRemoveFile] = useState(false);
  const [disableSaveReply, setDisableSaveReply] = useState(false);
  const [isEditOriginalAmendment, setEditOriginalAmendment] = useState(false);
  const inqViewerFocus = useSelector(({ workspace }) => workspace.formReducer.inqViewerFocus);

  const [loading, setLoading] = useState(false);

  const handleViewMore = (id) => {
    if (viewDropDown === id) {
      setViewDropDown('');
    } else {
      setViewDropDown(id);
    }
  };

  useEffect(() => {
    if (question.id !== inqViewerFocus) {
      setIsReply(false)
      setIsReplyCDCM(false)
      setIsResolve(false)
      setIsReplyCDCM(false)
      setShowViewAll(false)
      setViewDropDown()
    }
  }, [inqViewerFocus])

  useEffect(() => {
    setQuestion(props.question);
  }, [props.question]);

  useEffect(() => {
    let isUnmounted = false;
    setTempReply({});
    if (question && question.process === 'pending') {
      loadComment(question.id)
        .then((res) => {
          if (isUnmounted) return;
          const lastest = { ...question };
          if (res.length > 0) {
            res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
            // filter comment
            // console.log(res)
            const filterOffshoreSent = res[res.length - 1];
            lastest.mediaFile = filterOffshoreSent.mediaFile;
            lastest.mediaFilesAnswer = filterOffshoreSent.answersMedia;
            lastest.answerObj = filterOffshoreSent.answerObj;
            lastest.content = filterOffshoreSent.content;
            lastest.name = "";
            lastest.creator = filterOffshoreSent.updater;
            lastest.createdAt = filterOffshoreSent.createdAt;
            lastest.process = 'pending';
            setType(filterOffshoreSent.ansType);
            //
            if (Object.keys(filterOffshoreSent).length > 0) {
              //
              const reqReply = {
                inqAns: {
                  inquiry: null,
                  confirm: false,
                  type: 'REP'
                },
                answer: {
                  id: filterOffshoreSent.id,
                  content: filterOffshoreSent.content,
                  type: metadata.ans_type['paragraph']
                }
              };
              if (['REP_Q_DRF', 'REP_A_DRF'].includes(filterOffshoreSent.state)) {
                setTempReply({ ...tempReply, ...reqReply, mediaFiles: filterOffshoreSent.mediaFile });
              }
              lastest.state = filterOffshoreSent.state;
              lastest.updatedAt = filterOffshoreSent.updatedAt;
              //
              if (['REOPEN_A', 'REOPEN_Q'].includes(filterOffshoreSent.state)) {
                setShowLabelSent(false);
                setSubmitLabel(false);
                lastest.showIconReply = true;
              }
              if (user.role === 'Admin') {
                if (filterOffshoreSent.state === 'REP_Q_SENT') {
                  setShowLabelSent(true);
                  setTempReply({ ...tempReply, ...reqReply, mediaFiles: filterOffshoreSent.mediaFile });
                  setStateReplyDraft(true);
                } else if (filterOffshoreSent.state === 'REP_Q_DRF') {
                  setStateReplyDraft(true);
                  setShowLabelSent(false);
                }
                if (['REP_A_SENT', 'ANS_SENT'].includes(filterOffshoreSent.state)) {
                  lastest.showIconReply = true;
                  lastest.showIconEdit = false;
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  setStateReplyDraft(false);
                } else if (['OPEN', 'INQ_SENT'].includes(filterOffshoreSent.state)) {
                  lastest.showIconReply = false;
                  lastest.showIconAttachAnswerFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  setStateReplyDraft(false);
                  if (filterOffshoreSent.state === 'OPEN') {
                    setShowLabelSent(false)
                  } else {
                    setShowLabelSent(true);
                  }
                }
              } else {
                if (filterOffshoreSent.state === 'REP_A_DRF') {
                  setStateReplyDraft(true);
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  props.getStateReplyDraft(true);
                  //
                } else if (['REP_Q_SENT'].includes(filterOffshoreSent.state)) {
                  lastest.showIconReply = true;
                } else if (filterOffshoreSent.state === 'REP_Q_DRF') {
                  setSubmitLabel(true);
                  lastest.showIconEdit = true;
                } else if (filterOffshoreSent.state === 'ANS_DRF') {
                  setStateReplyDraft(false);
                  lastest.showIconEdit = true;
                  lastest.showIconAttachAnswerFile = false;
                }
                if (['REP_A_SENT'].includes(filterOffshoreSent.state)) {
                  setSubmitLabel(true);
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  lastest.showIconEdit = true;
                  //
                  setTempReply({ ...tempReply, ...reqReply, mediaFiles: filterOffshoreSent.mediaFile });
                }
              }
            }
            //
            if (['REOPEN_A', 'REOPEN_Q'].includes(filterOffshoreSent.state)) {
              const markReopen = {
                creator: filterOffshoreSent.creator,
                updater: filterOffshoreSent.creator,
                createdAt: filterOffshoreSent.createdAt,
                updatedAt: filterOffshoreSent.createdAt,
                answersMedia: filterOffshoreSent.answersMedia,
                content: `<span class='markReopen'>Marked as reopened</span>`,
                process: 'pending',
                state: filterOffshoreSent?.state,
              }
              res.splice(res.length - 1, 0, markReopen);
            }
            setComment([...res]);
            // setType(metadata.ans_type.paragraph);
            setQuestion(lastest);
            if (res.length > 1) {
              setInqHasComment(true);
            }
            if (res.length === 1) {
              setShowViewAll(false);
              setInqHasComment(false)
            }
          } else {
            if ((user.role === 'Admin' ? ["ANS_SENT", "COMPL", "UPLOADED"] : ["ANS_SENT", "ANS_DRF", "REP_Q_DRF", "COMPL", "UPLOADED"]).includes(question.state)) {
              let answerObj = null;
              if (question.ansType === metadata.ans_type.choice) {
                answerObj = question.answerObj.filter((item) => item.confirmed);
              } else {
                answerObj = question.answerObj;
              }
              if (answerObj.length > 0) {
                lastest.answerObj = [];
                lastest.content = `The updated information is "${answerObj[0]?.content}"`;
                lastest.name = "";
                lastest.creator = answerObj[0]?.updater;
                lastest.createdAt = answerObj[0]?.updatedAt;
                setType(lastest.ansType);
              }
              if (lastest.mediaFilesAnswer.length || ['ANS_DRF', 'ANS_SENT', 'REP_Q_DRF'].includes(lastest.state)) {
                lastest.mediaFile = lastest.mediaFilesAnswer;
                lastest.mediaFilesAnswer = [];
              }
              if (user.role === 'Admin') {
                lastest.showIconReply = true;
              } else {
                if (lastest.state === 'REP_Q_DRF') {
                  setSubmitLabel(true);
                  lastest.showIconEdit = true;
                }
              }
              setQuestion(lastest);
              setInqHasComment(true);
            }
          }
          setIsLoadedComment(true);
        })
        .catch((error) => console.error(error));
    } else {
      getCommentDraftBl(myBL.id, question.field)
        .then((res) => {
          if (isUnmounted) return;
          // setEditOriginalAmendment(res.length === 1);
          res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          const lastest = { ...question };
          if (res.length > 0) {
            // console.log(res)
            const { content: contentField, mediaFile } = res[res.length - 1].content;
            const lastestComment = res[res.length - 1];
            // filter comment
            lastest.mediaFile = mediaFile;
            lastest.answerObj = [{ content: contentField }];
            lastest.content = contentField instanceof String ? `"${contentField}"` : contentField;
            lastest.name = "";
            lastest.mediaFilesAnswer = [];
            // lastest.id = lastestComment.id;
            lastest.state = lastestComment.state;
            lastest.createdAt = lastestComment.createdAt;
            lastest.creator = lastestComment.creator;
            lastest.process = 'draft';
            if (!['UPLOADED'].includes(lastest.state)) {
              setStateReplyDraft(true);
              const reqReply = {
                inqAns: {
                  inquiry: null,
                  confirm: false,
                  type: 'REP'
                },
                answer: {
                  id: lastestComment.id,
                  content: contentField,
                  type: metadata.ans_type['paragraph']
                }
              };
              setTempReply({ ...tempReply, ...reqReply, mediaFiles: lastest.mediaFile });
              lastest.showIconAttachReplyFile = false;
              lastest.showIconAttachAnswerFile = false;
            }
            if (lastest.state === 'RESOLVED') {
              setStateReplyDraft(false);
            }

            if (user.role === 'Admin') {
              if (['AME_SENT', 'REOPEN_Q'].includes(lastest.state)) {
                lastest.showIconReply = true;
                setStateReplyDraft(false);
                setTempReply({});
              }
              if (['REP_SENT'].includes(lastest.state)) {
                lastest.showIconReply = false;
                setShowLabelSent(true);
              } else if (['REP_DRF'].includes(lastest.state)) {
                lastest.showIconReply = false;
                setShowLabelSent(false);
              } else if (['REOPEN_A'].includes(lastest.state)) {
                lastest.showIconReply = true;
                setStateReplyDraft(false);
                setTempReply({});
              }
            } else {
              if (['REP_SENT', 'REOPEN_A'].includes(lastest.state)) {
                lastest.showIconReply = true;
                setStateReplyDraft(false);
                setTempReply({});
              } else if (['AME_SENT'].includes(lastest.state)) {
                lastest.showIconReply = false;
                setSubmitLabel(true);
              } else if (['REOPEN_Q'].includes(lastest.state)) {
                lastest.showIconReply = true;
                lastest.showIconEdit = false;
                setStateReplyDraft(false);
                setTempReply({});
              } else if (['AME_DRF'].includes(lastest.state)) {
                setSubmitLabel(false);
              }
            }
            if (isEditOriginalAmendment) {
              dispatch(InquiryActions.setContent({ ...content, [question.field]: lastest.content }));
            }
            setQuestion(lastest);

            // push new lastestComment if not already exist
            !listCommentDraft.find(ele => ele.id === lastestComment.id) && dispatch(InquiryActions.setListCommentDraft([...listCommentDraft, ...[lastestComment]]));

            const comments = [{
              creator: { userName: user.displayName, avatar: null },
              updater: { userName: user.displayName, avatar: null },
              createdAt: res[0].createdAt,
              updatedAt: res[0].createdAt,
              answersMedia: [],
              content: orgContent[lastest.field] || '',
              process: 'draft',
              state: res[0]?.state,
            }];
           
            res.map(r => {
              const { content, mediaFile } = r.content;
              comments.push({
                id: r.id,
                creator: r.creator,
                updater: r.creator,
                createdAt: r.createdAt,
                updatedAt: r.createdAt,
                answersMedia: mediaFile,
                content: content instanceof String ? `"${content}"` : content,
                process: 'draft',
                state: r?.state,
              });
            });
            //
            if (['REOPEN_A', 'REOPEN_Q'].includes(lastestComment.state)) {
              const markReopen = {
                creator: lastestComment.creator,
                updater: lastestComment.creator,
                createdAt: lastestComment.createdAt,
                updatedAt: lastestComment.createdAt,
                answersMedia: lastestComment.answersMedia,
                content: `<span class='markReopen'>Marked as reopened</span>`,
                process: 'pending',
                state: lastestComment?.state,
              }
              comments.splice(comments.length - 1, 0, markReopen);
            }
            setComment(comments);
            setInqHasComment(true);
          } else {
            // check close popup empty
            const optionsOfQuestion = [...inquiries];
            const inquiriesByField = optionsOfQuestion.filter(inq => inq.field === question.field && inq.process === 'pending');
            //
            const removeAmendment = optionsOfQuestion.filter(inq => inq.field === question.field && inq.process === 'draft');
            const removeIndex = optionsOfQuestion.findIndex(inq => inq.id === removeAmendment[0].id);
            optionsOfQuestion.splice(removeIndex, 1);
            dispatch(InquiryActions.setInquiries(optionsOfQuestion));
            //
            getBlInfo(myBL.id).then(res => {
              dispatch(InquiryActions.setContent({ ...content, [question.field]: res.myBL.content[question.field] }));
              if (!inquiriesByField.length) {
                if (field === 'INQUIRY_LIST') {
                  dispatch(FormActions.toggleAllInquiry(false));
                  dispatch(FormActions.toggleAmendmentsList(false));
                } else {
                  dispatch(InquiryActions.setOneInq({}));
                }
              }
            }).catch((error) => console.error(error));
          }
          setIsLoadedComment(true);
        })
        .catch((error) => console.error(error));
    }

    return () => isUnmounted = true;
  }, [isSaveComment, isSaveAnswer]);

  const resetAnswerActionSave = () => {
    const quest = { ...question };
    quest.showIconAttachAnswerFile = false;
    quest.showIconAttachReplyFile = false;
    if (currentQuestion && currentQuestion.id === quest.id) {
      quest.showIconReply = false;
      quest.showIconEdit = true;
      quest.mediaFilesAnswer = [];
      let answerObj = null;
      if (question.ansType === metadata.ans_type.choice) {
        answerObj = quest.answerObj.filter((item) => item.confirmed);
      } else {
        answerObj = quest.answerObj;
      }
      if (answerObj.length > 0) {
        quest.creator = answerObj[0]?.updater;
        quest.createdAt = answerObj[0]?.updatedAt;
      }
      quest.state = currentQuestion.state;
      setType(quest.ansType);
      if (currentQuestion.state !== 'INQ_SENT') {
        quest.mediaFile = currentQuestion.mediaFilesAnswer;
        quest.mediaFilesAnswer = [];
        setInqHasComment(true);
      } else {
        quest.showIconReply = true;
      }
      quest.mediaFilesAnswer = [];
      setQuestion(quest);
      setSaveComment(!isSaveComment);
    }
  }
  //
  useEffect(() => {
    resetAnswerActionSave()
  }, [currentQuestion, isSaved]);

  const updateQuestionFile = () => {
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    const quest = { ...question };
    setQuestion({ ...quest, mediaFilesAnswer: optionsInquires[editedIndex].mediaFilesAnswer });
  }

  useEffect(() => {
    updateQuestionFile()
  }, [isUploadFile, isRemoveFile]);

  useEffect(() => {
    question?.state !== 'OPEN' && setAllowDeleteInq(false);
  }, [question]);

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  const resetInquiry = () => {
    const optionsInquires = [...inquiries];
    optionsInquires.forEach(op => op.showIconAttachFile = false);
    optionsInquires.forEach(op => op.showIconReply = false);
    optionsInquires.forEach(op => op.showIconAttachAnswerFile = false);
    optionsInquires.forEach(op => {
      if (['OPEN', 'INQ_SENT', 'AME_SENT'].includes(op.state)) {
        op.showIconReply = true;
        op.showIconEditInq = true;
      } else if (['ANS_DRF', 'ANS_SENT'].includes(op.state)) {
        op.showIconEdit = true;
      }
    });
    dispatch(InquiryActions.setInquiries(optionsInquires));
    //
  }

  useEffect(() => {
    resetInquiry();
    ['INQ_SENT', 'ANS_DRF'].includes(question.state) ? setShowLabelSent(true) : setShowLabelSent(false);
  }, []);

  useEffect(() => {
    if (confirmClick && confirmPopupType === 'removeInq' && indexQuestionRemove >= 0) {
      const optionsOfQuestion = [...inquiries];
      const inqDelete = optionsOfQuestion.splice(indexQuestionRemove, 1)[0];
      const hidePopupEmpty = !optionsOfQuestion.filter(inq => inq.field === inqDelete.field).length;
      deleteInquiry(inqDelete.id)
        .then(() => {
          dispatch(InquiryActions.setInquiries(optionsOfQuestion));
          if (hidePopupEmpty) {
            dispatch(InquiryActions.setOneInq({}));
            dispatch(FormActions.toggleCreateInquiry(false));
          }
          if (!optionsOfQuestion.length) {
            (field === 'INQUIRY_LIST') && dispatch(FormActions.toggleAllInquiry(false));
          }
        })
        .catch((error) => console.error(error));
    } else if (confirmPopupType === 'removeReply' && replyRemove) {
      deleteDraftBLReply(tempReply?.answer.id, replyRemove.field, myBL.id)
        .then((res) => {
          // Case: Offshore reply customer's amendment first time => delete
          if (comment.length === 3) {
            const prevAmendment = {
              field: replyRemove.field,
              state: comment[comment.length - 2].state,
              creator: comment[comment.length - 2].creator,
              updater: comment[comment.length - 2].updater,
              createdAt: comment[comment.length - 2].createdAt,
              content: comment[comment.length - 2].content,
              mediaFile: comment[comment.length - 2].answersMedia,
              answerObj: []
            };
            dispatch(InquiryActions.setNewAmendment({ newAmendment: prevAmendment }));
          }
          //
          dispatch(InquiryActions.setShowBackgroundAttachmentList(false));

          // Update state of listDraftComments for re-rendering UI
          let cloneListCommentDraft = listCommentDraft.filter(({ id }) => id !== replyRemove.id);
          dispatch(InquiryActions.setListCommentDraft(cloneListCommentDraft));
          dispatch(FormActions.toggleOpenNotificationDeleteReply(true));
          if (res) {
            setEditOriginalAmendment(res.isEditOriginalAmendment);
            setViewDropDown('');
            setDisableSaveReply(false);
          }
          setSaveComment(!isSaveComment);
        }).catch((error) => console.error(error));
    }
    dispatch(
      FormActions.openConfirmPopup({
        openConfirmPopup: false,
        confirmClick: false,
        confirmPopupMsg: '',
        confirmPopupType: ''
      })
    );
  }, [confirmClick]);

  useEffect(() => {
    if (isSeparate) {
      const arrFields = [SHIPPER, CONSIGNEE, NOTIFY];
      const fieldIndex = arrFields.findIndex(key => metadata.field[key] === question.field);
      const fieldName = metadata.field?.[`${arrFields[fieldIndex]}Name`] ? content[metadata.field?.[`${arrFields[fieldIndex]}Name`]] : '';
      const fieldAddress = metadata.field?.[`${arrFields[fieldIndex]}Address`] ? content[metadata.field?.[`${arrFields[fieldIndex]}Address`]] : '';
      setTextResolveSeparate({
        name: fieldName || '',
        address: fieldAddress || ''
      })
    }
  }, [isResolve])

  const removeQuestion = () => {
    setIndexQuestionRemove(inquiries.findIndex((q) => q.id === question.id));
    dispatch(
      FormActions.openConfirmPopup({
        openConfirmPopup: true,
        confirmPopupMsg: 'Are you sure you want to remove this inquiry?',
        confirmPopupType: 'removeInq'
      })
    );
  };

  const removeReply = (question) => {
    setReplyRemove(question);
    let confirmPopupMsg = 'Are you sure you want to remove this amendment?';
    if (comment.length > 2) {
      confirmPopupMsg = 'Are you sure you want to delete this reply?';
    }
    dispatch(
      FormActions.openConfirmPopup({
        openConfirmPopup: true,
        confirmPopupMsg,
        confirmPopupType: 'removeReply'
      })
    );
  }

  const changeToEditor = (inq) => {
    const index = inquiries.findIndex((q) => q.id === inq.id);
    if (index >= 0) {
      const optionsOfQuestion = [...inquiries];
      const inqEdit = JSON.parse(JSON.stringify(inq));
      inqEdit.ansType = optionsOfQuestion[index].ansType;
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inq.field));
    }
  };

  const onResolve = () => {
    if (Array.isArray(question.content)) {
      setIsResolveCDCM(true);
    } else {
      setIsResolve(true);
    }
  };

  const onConfirm = () => {
    let contentField = '';
    const getTempReply = {...tempReply};
    if (isSeparate) {
      contentField = `${textResolveSeparate.name}\n${textResolveSeparate.address}`;
    } else if (typeof textResolve === 'string') {
      contentField = textResolve.trim();
    } else {
      contentField = textResolve;
      contentField.forEach((obj) => {
        if (obj[question.inqType]) obj[question.inqType] = obj[question.inqType] instanceof String ? obj[question.inqType].trim() : obj[question.inqType];
      });
    }
    const body = {
      fieldId: question.field,
      inqId: question?.id || tempReply?.answer.id,
      fieldContent: contentField,
      blId: myBL.id,
      fieldNameContent: textResolveSeparate.name.trim() || '',
      fieldAddressContent: textResolveSeparate.address.trim() || ''
    };
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    resolveInquiry(body)
      .then((res) => {
        // setQuestion((q) => ({ ...q, state: 'COMPL' }));
        optionsInquires[editedIndex].state = 'COMPL';
        optionsInquires[editedIndex].createdAt = res.updatedAt;
        dispatch(InquiryActions.setInquiries(optionsInquires));
        props.getUpdatedAt();
        setIsResolve(false);
        setViewDropDown('');
        // dispatch(InquiryActions.setContent({ ...content, [question.field]: contentField }));
        // setSaveComment(!isSaveComment);
        setStateReplyDraft(false);
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  };

  const onUpload = () => {
    setLoading(true);
    const optionsInquires = [...inquiries];
    uploadOPUS(myBL.id, question.id, question.field)
      .then((res) => {
        if (res && res.status === 'F') {
          dispatch(AppAction.showMessage({ message: res.message, variant: 'error' }));
        } else {
          setQuestion((q) => ({ ...q, state: 'UPLOADED' }));

          // Update list inquiry
          let editedInqIndex = optionsInquires.findIndex(inq => question.id === inq.id);
          if (optionsInquires[editedInqIndex]?.process === 'pending') {
            optionsInquires[editedInqIndex].state = 'UPLOADED';
            dispatch(InquiryActions.setInquiries(optionsInquires));
          } else {
            // Update list amendment
            let editedAmeIndex = optionsInquires.findIndex(inq => (question.field === inq.field && inq.process === 'draft'));
            if (editedAmeIndex !== -1) {
              optionsInquires[editedAmeIndex].state = 'UPLOADED';
              dispatch(InquiryActions.setInquiries(optionsInquires));
              const optionAmendment = [...listCommentDraft];
              editedAmeIndex = optionAmendment.findIndex(ame => question.id === ame.id);
              optionAmendment[editedAmeIndex].state = 'UPLOADED';
              dispatch(InquiryActions.setListCommentDraft(optionAmendment));
            }
          }

          if (res.warning) {
            dispatch(AppAction.showMessage({ message: res.warning, variant: 'warning' }));
          } else {
            dispatch(AppAction.showMessage({ message: 'Upload to OPUS successfully', variant: 'success' }));
          }
        }
      })
      .catch((error) => {
        dispatch(AppAction.showMessage({ message: error, variant: 'error' }))
      }).finally(() => setLoading(false));
  };

  const cancelResolve = () => {
    setTextResolve(content[question.field] || '');
    setIsResolve(false);
    setIsResolveCDCM(false);
    setTempReply({});
  };

  const inputText = (e) => {
    setTextResolve(e.target.value);
  };

  const inputTextSeparate = (e, type) => {
    setTextResolveSeparate(Object.assign({}, textResolveSeparate, { [type]: e.target.value }));
  };

  const handleChangeContentReply = (e) => {
    const value = e.target.value;
    const reqReply = {
      inqAns: {
        ...tempReply.inqAns,
        inquiry: question.id,
        confirm: false,
        type: 'REP'
      },
      answer: {
        ...tempReply.answer,
        content: value,
        type: metadata.ans_type['paragraph']
      }
    };
    setTempReply({ ...tempReply, ...reqReply });
  };

  const handleChangeContainerDetail = (value) => {
    const reqReply = {
      inqAns: {
        ...tempReply.inqAns,
        inquiry: question.id,
        confirm: false,
        type: 'REP'
      },
      answer: {
        ...tempReply.answer,
        content: value,
        type: metadata.ans_type['paragraph']
      }
    };
    setDisableSaveReply(false);
    setTempReply({ ...tempReply, ...reqReply });
  };

  const handleSetAttachmentReply = (val) => {
    const reqReply = {
      inqAns: {
        ...tempReply.inqAns,
        inquiry: question.id,
        confirm: false,
        type: 'REP'
      },
      answer: {
        ...tempReply.answer,
        type: metadata.ans_type['attachment']
      }
    };
    if (!tempReply.mediaFiles?.length) {
      setTempReply({
        ...tempReply,
        mediaFiles: val,
        ...reqReply
      });
    } else {
      setTempReply((prev) => {
        const attachmentsName = val.map(att => att.name);
        let isExist = false;
        if (prev && prev.mediaFiles.length) {
          isExist = prev.mediaFiles.some(media => attachmentsName.includes(media.name));
        }
        if (isExist) {
          dispatch(AppAction.showMessage({
            message: `Duplicate file(s)`,
            variant: 'error'
          }));
          return { ...tempReply };
        } else {
          const mediaFiles = [...prev.mediaFiles, ...val];
          return { ...tempReply, mediaFiles };
        }
      });
    }
  };

  const onSaveReply = async () => {
    const mediaListId = [];
    let mediaListAmendment = [];
    const mediaRest = [];
    let mediaFilesResp;
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    setDisableSaveReply(true);
    if (tempReply.mediaFiles?.length) {
      const formData = new FormData();
      tempReply.mediaFiles.forEach((mediaFileAns, index) => {
        if (mediaFileAns.id === null) {
          formData.append('files', mediaFileAns.data);
        } else {
          mediaRest.push(mediaFileAns.id);
          mediaListAmendment.push({ id: mediaFileAns.id, ext: mediaFileAns.ext, name: mediaFileAns.name })
        }
      });
      if (formData.get('files')) mediaFilesResp = await uploadFile(formData);
      if (mediaFilesResp) {
        const { response } = mediaFilesResp;
        response.forEach((file) => {
          const media = { id: file.id };
          mediaListId.push(media);
          //
          mediaListAmendment.push({ id: file.id, ext: file.ext, name: file.name });
        });
      }
    }
    if (question.process === 'pending') {
      // Add
      if (!tempReply.answer?.id) {
        const reqReply = {
          inqAns: tempReply.inqAns,
          answer: tempReply.answer,
          mediaFiles: mediaListId
        };
        saveReply({ ...reqReply })
          .then((res) => {
            //
            let stateUpdate;
            if (user.role === 'Admin') {
              optionsInquires[editedIndex].state = 'REP_Q_DRF';
              stateUpdate = 'REP_Q_DRF';
            } else {
              optionsInquires[editedIndex].state = 'REP_A_DRF';
              stateUpdate = 'REP_A_DRF';
            }
            optionsInquires[editedIndex].process = 'pending';
            optionsInquires[editedIndex].createdAt = res.updatedAt;
            dispatch(InquiryActions.setInquiries(optionsInquires));
            props.getUpdatedAt();
            dispatch(InquiryActions.checkSend(true));
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
            setViewDropDown('');
            setDisableSaveReply(false);
          }).catch((error) =>
            dispatch(AppAction.showMessage({ message: error, variant: 'error' }))
          );
      } else {
        // Edit
        const reqReply = {
          content: tempReply.answer.content,
          mediaFiles: mediaListId.map(media => media.id),
          mediaRest
        };
        updateReply(tempReply.answer.id, { ...reqReply })
          .then((res) => {
            //
            let stateUpdate;
            if (user.role === 'Admin') {
              optionsInquires[editedIndex].state = 'REP_Q_DRF';
              stateUpdate = 'REP_Q_DRF';
            } else {
              optionsInquires[editedIndex].state = 'REP_A_DRF';
              stateUpdate = 'REP_A_DRF';
            }
            optionsInquires[editedIndex].process = 'pending';
            optionsInquires[editedIndex].createdAt = res.updatedAt;
            dispatch(InquiryActions.setInquiries(optionsInquires));
            props.getUpdatedAt();
            // if (props.isInquiryDetail) {
            //   setSaveComment(!isSaveComment);
            // }
            //
            dispatch(InquiryActions.checkSend(true));
            setDisableSaveReply(false);
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
          }).catch((error) =>
            dispatch(AppAction.showMessage({ message: error, variant: 'error' }))
          );
      }
    } else {
      if (!tempReply.answer?.id) { // Create amendment / reply
        const reqReply = {
          field: question.field,
          content: { content: tempReply.answer?.content || '', mediaFile: mediaListAmendment },
          mybl: myBL.id
        };
        saveEditedField({ ...reqReply })
          .then((res) => {
            optionsInquires[editedIndex].createdAt = res.createdAt;
            dispatch(InquiryActions.setInquiries(optionsInquires));
            props.getUpdatedAt();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            setDisableSaveReply(false);
            dispatch(AppAction.showMessage({ message: 'Save Reply successfully', variant: 'success' }));
            dispatch(InquiryActions.setNewAmendment({ oldAmendmentId: question.id, newAmendment: res.newAmendment }));
          })
          .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
      }
      else { // Edit amendment / reply
        const reqReply = {
          content: { content: tempReply.answer.content, mediaFile: mediaListAmendment },
        };
        updateDraftBLReply({ ...reqReply }, tempReply.answer?.id).then((res) => {
          if (res) {
            dispatch(InquiryActions.setNewAmendment({ newAmendment: res.newAmendment }));
            setEditOriginalAmendment(res.isEditOriginalAmendment);
          }
          optionsInquires[editedIndex].createdAt = res.createdAt;
          dispatch(InquiryActions.setInquiries(optionsInquires));
          props.getUpdatedAt();
          dispatch(InquiryActions.checkSubmit(!enableSubmit));
          setDisableSaveReply(false);
          dispatch(AppAction.showMessage({ message: 'Edit Reply successfully', variant: 'success' }));
          dispatch(InquiryActions.setNewAmendment({ newAmendment: res.newAmendment }));
          if (isEditOriginalAmendment) dispatch(InquiryActions.setContent({ ...content, [res.newAmendment?.field]: tempReply.answer.content }));
        }).catch((err) => dispatch(AppAction.showMessage({ message: err, variant: 'error' })));
      }
    }
    setIsReply(false);
    setIsReplyCDCM(false);
  }

  const cancelReply = (q) => {
    setIsReply(false);
    setIsReplyCDCM(false);
    const reply = { ...question };
    reply.mediaFilesAnswer = reply.mediaFile;
    reply.mediaFile = [];
    setQuestion(reply);
    setSaveComment(!isSaveComment);
  };

  const onReply = (q) => {
    // case: Reply Answer
    const optionsInquires = [...inquiries];
    if (['OPEN', 'INQ_SENT'].includes(q.state)) {
      const editedIndex = optionsInquires.findIndex(inq => q.id === inq.id);
      //
      optionsInquires[editedIndex].showIconReply = false;
      optionsInquires[editedIndex].showIconAttachReplyFile = false;
      optionsInquires[editedIndex].showIconAttachAnswerFile = true;
      optionsInquires[editedIndex].showIconEdit = true;
      dispatch(InquiryActions.setInquiries(optionsInquires));
      setQuestion(q => ({ ...q, showIconReply: false, showIconAttachAnswerFile: true, showIconAttachReplyFile: false }))
      setIsReply(false);
    } else {
      // case: Reply Comment
      setIsReply(true);
      setQuestion(q => ({ ...q, showIconReply: false, showIconAttachAnswerFile: false, showIconAttachReplyFile: true }));
    }
  };

  // TODO
  const handleEdit = (q) => {
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => q.id === inq.id);
    // case: Edit Answer
    const reply = { ...question };
    reply.showIconEdit = false;
    reply.showIconReply = false;
    if (['ANS_DRF', 'ANS_SENT'].includes(question.state) || (user.role === 'Guest' && ['REP_Q_DRF'].includes(question.state))) {
      optionsInquires[editedIndex].showIconEdit = false;
      optionsInquires[editedIndex].showIconReply = false;
      optionsInquires[editedIndex].showIconAttachReplyFile = false;
      optionsInquires[editedIndex].showIconAttachAnswerFile = true;
      dispatch(InquiryActions.setInquiries(optionsInquires));
      reply.showIconAttachReplyFile = false;
      reply.showIconAttachAnswerFile = true;
      if (props.question.answerObj.length) reply.answerObj = props.question.answerObj;
      // reply.mediaFilesAnswer = reply.mediaFile;
      // reply.mediaFile = [];
    } else if (Array.isArray(reply.content)) {
      setIsReplyCDCM(true);
      reply.mediaFilesAnswer = [];
      reply.mediaFile = [];
      reply.showIconAttachReplyFile = true;
      reply.showIconAttachAnswerFile = false;
    } else {
      // Edit Reply
      setIsReply(true);
      setIsResolve(false);
      reply.content = '';
      reply.mediaFilesAnswer = [];
      reply.mediaFile = [];
      reply.showIconAttachReplyFile = true;
      reply.showIconAttachAnswerFile = false;
    }
    setQuestion(reply);
    setStateReplyDraft(false);
    setViewDropDown('');
    setInqHasComment(false);
  }

  const reOpen = (idInq) => {
    reOpenInquiry(idInq)
      .then((res) => {
        const optionsInquires = [...inquiries];
        if (res) {
          if (question.process === 'draft') {
            const optionAmendment = [...listCommentDraft.filter(({ id }) => id !== question.id)];
            dispatch(InquiryActions.setListCommentDraft(optionAmendment));

            const indexAmenment = optionsInquires.findIndex(inq => (inq.field === question.field && inq.process === 'draft'))
            // optionsInquires[indexAmenment].state = res?.prevState;
            optionsInquires[indexAmenment].state = user.role === 'Admin' ? 'REOPEN_Q' : 'REOPEN_A';
            optionsInquires[indexAmenment].createdAt = res.updatedAt;
          } else {
            const indexInq = optionsInquires.findIndex(inq => inq.id === idInq)
            // optionsInquires[indexInq].state = res?.prevState;
            optionsInquires[indexInq].createdAt = res.updatedAt;
            optionsInquires[indexInq].state = user.role === 'Admin' ? 'REOPEN_Q' : 'REOPEN_A';
          }
          dispatch(InquiryActions.setInquiries(optionsInquires));
          props.getUpdatedAt();
          setViewDropDown('');
          // setSaveComment(!isSaveComment);
          dispatch(
            AppAction.showMessage({ message: 'Update inquiry is successfully', variant: 'success' })
          );
        }
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })))
      .finally(() => {
        // setContent
        dispatch(Actions.loadContent(myBL?.id));
      });

  };

  useEffect(() => {
    const el = document.getElementById(question.id);
    setShowViewAll(false);
    if (el && el.scrollHeight > el.clientHeight) setShowViewAll(true);
  }, [isLoadedComment]);

  const renderBtnReply = () => {
    if (question.process === 'pending') {
      return (
        <PermissionProvider
          action={PERMISSION.INQUIRY_CREATE_REPLY}
          extraCondition={user.role === "Admin" && (inqHasComment) && question.showIconReply}
        >
          <Button
            variant="contained"
            classes={{ root: clsx(classes.button, 'w120', 'reply') }}
            color="primary"
            onClick={onReply}>
            Reply
          </Button>
        </PermissionProvider>
      )
    } else {
      return (
        <PermissionProvider
          action={PERMISSION.DRAFTBL_CREATE_REPLY}
          extraCondition={user.role === "Admin" && question.showIconReply}
        >
          <Button
            variant="contained"
            classes={{ root: clsx(classes.button, 'w120', 'reply') }}
            color="primary"
            onClick={onReply}>
            Reply
          </Button>
        </PermissionProvider>
      )
    }
  }

  // Separate Shipper/Consignee/Notify 
  const renderSeparateField = (field) => {
    if (isSeparate) {
      const LABEL_TYPE = ['name', 'address']
      const labelName = Object.assign({}, ...[SHIPPER, CONSIGNEE, NOTIFY].map(key => ({ [metadata.field?.[key]]: key })))[field]
      const labelNameCapitalize = labelName?.charAt(0).toUpperCase() + labelName?.slice(1);
      return LABEL_TYPE.map((type, index) =>
        <div key={index} style={{ paddingTop: '15px' }}>
          <label><strong>{`${labelName?.toUpperCase()} ${type.toUpperCase()}`}</strong></label>
          <TextField
            className={classes.inputResolve}
            value={textResolveSeparate[type]}
            multiline
            rows={['name'].includes(type) ? 2 : 3}
            onChange={(e) => inputTextSeparate(e, type, field)}
            error={validatePartiesContent(textResolveSeparate[type], type).isError}
            helperText={
              validatePartiesContent(textResolveSeparate[type], type).isError ? validatePartiesContent(textResolveSeparate[type], type).errorType.replace('{{fieldName}}', labelNameCapitalize) : ''}
            variant='outlined'
          />
        </div>)
    } else {
      return (
        <TextField
          className={classes.inputResolve}
          value={textResolve}
          multiline
          rows={3}
          onChange={inputText}
          variant='outlined'
        />
      )
    }
  }

  return (
    <>
      {isLoadedComment && (
        <div onClick={() => dispatch(FormActions.inqViewerFocus(question.id))}>
          <div >
            {(question?.process === 'draft') &&
              <TagsComponent tagName='AMENDMENT' tagColor='primary' />
            }
            <div style={{ paddingTop: 10 }} className="flex justify-between">
              <UserInfo
                name={question.creator?.userName}
                time={displayTime(question.createdAt || question.updatedAt)}
                avatar={question.creator?.avatar}
              />
              {user.role === 'Admin' ? ( // TODO
                <div className="flex items-center mr-2">
                  <PermissionProvider
                    action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}
                    extraCondition={question.state === 'COMPL' || question.state === 'UPLOADED' || question.state === 'RESOLVED'}
                  >
                    <div className='flex' style={{ alignItems: 'center' }}>
                      <div style={{ marginRight: 15 }}>
                        <span className={classes.labelStatus}>{question.state === 'UPLOADED' ? 'Uploaded' : 'Resolved'}</span>
                      </div>
                      <Button
                        disabled={loading || question.state === 'UPLOADED'}
                        variant="contained"
                        color="primary"
                        onClick={onUpload}
                        classes={{ root: classes.button }}
                      >
                        Upload to OPUS
                        {loading && <CircularProgress className='absolute' color='primary' size={'25px'} />}
                      </Button>
                    </div>
                  </PermissionProvider>
                  <div className='flex' style={{ alignItems: 'center' }}>
                    <div style={{ marginRight: 15 }}>
                      {showLabelSent && !['COMPL', 'UPLOADED', 'RESOLVED'].includes(question.state) && (
                        <span className={classes.labelStatus}>Sent</span>
                      )}
                      {/*{isReopenLabel && !['COMPL', 'UPLOADED', 'RESOLVED'].includes(question.state) && (*/}
                      {/*  <span className={classes.labelStatus}>Reopen</span>*/}
                      {/*)}*/}
                    </div>
                    {showReceiver && <FormControlLabel control={<Radio color={'primary'} checked disabled />} label={question.receiver.includes('customer') ? "Customer" : "Onshore"} />}
                    {!['COMPL', 'UPLOADED'].includes(question.state) && (
                      isReply ? (
                        <>
                          {<AttachFile
                            isReply={true}
                            question={question}
                            setAttachmentReply={handleSetAttachmentReply}
                          />}
                        </>
                      ) : <>
                        {checkStateReplyDraft && (
                          <>
                            <PermissionProvider action={PERMISSION.INQUIRY_UPDATE_REPLY}>
                              <Tooltip title={'Edit Reply'}>
                                <div onClick={() => handleEdit(question)}>
                                  <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                                </div>
                              </Tooltip>
                            </PermissionProvider>
                            {question.process === 'draft' && !['REP_SENT', 'AME_SENT'].includes(question.state) && (
                              <Tooltip title="Delete Reply">
                                <div style={{ marginLeft: '10px' }} onClick={() => removeReply(question)}>
                                  <img
                                    style={{ height: '22px', cursor: 'pointer' }}
                                    src="/assets/images/icons/trash-gray.svg"
                                  />
                                </div>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {/*Admin Reply*/}

                  </div>
                  <PermissionProvider
                    action={PERMISSION.VIEW_EDIT_INQUIRY}
                    extraCondition={['OPEN', 'INQ_SENT', 'ANS_DRF'].includes(question.state) && question.showIconEditInq}>
                    <Tooltip title="Edit Inquiry">
                      <div onClick={() => changeToEditor(question)}>
                        <img
                          style={{ width: 20, cursor: 'pointer' }}
                          src="/assets/images/icons/edit.svg"
                        />
                      </div>
                    </Tooltip>
                  </PermissionProvider>
                  <PermissionProvider
                    action={PERMISSION.INQUIRY_DELETE_INQUIRY}
                    extraCondition={allowDeleteInq}
                  >
                    <Tooltip title="Delete Inquiry">
                      <div style={{ marginLeft: '10px' }} onClick={() => removeQuestion()}>
                        <img
                          style={{ height: '22px', cursor: 'pointer' }}
                          src="/assets/images/icons/trash-gray.svg"
                        />
                      </div>
                    </Tooltip>
                  </PermissionProvider>
                </div>
              ) : (
                <div className='flex' style={{ alignItems: 'center' }}>
                  <div style={{ marginRight: 15 }}>
                    {question.state === 'UPLOADED' ?
                      <span className={classes.labelStatus}>Uploaded</span> :
                      ['COMPL', 'RESOLVED'].includes(question.state) ?
                        <span className={classes.labelStatus}>Resolved</span> :
                        <>
                          {(['ANS_SENT'].includes(question.state) || submitLabel) && <span className={classes.labelStatus}>Submitted</span>}
                          {/*{(['REOPEN_A'].includes(question.state) || isReopenLabel) && <span className={classes.labelStatus}>Reopen</span>}*/}
                        </>
                    }
                  </div>
                  {(((['ANS_DRF', 'REP_A_SENT', 'ANS_SENT', 'REP_Q_DRF', 'REP_SENT', 'AME_SENT'].includes(question.state)) && question.showIconEdit) || checkStateReplyDraft) && (
                    <>
                      <Tooltip title={'Edit'}>
                        <div onClick={() => handleEdit(question)}>
                          <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                        </div>
                      </Tooltip>
                      {question.process === 'draft' && !['AME_SENT', 'REP_SENT'].includes(question.state) && (
                        <Tooltip title="Delete Reply">
                          <div style={{ marginLeft: '10px' }} onClick={() => removeReply(question)}>
                            <img
                              style={{ height: '22px', cursor: 'pointer' }}
                              src="/assets/images/icons/trash-gray.svg"
                            />
                          </div>
                        </Tooltip>
                      )}
                    </>
                  )}
                  {question.showIconReply ? (
                    <PermissionProvider
                      action={PERMISSION.INQUIRY_CREATE_REPLY || PERMISSION.DRAFTBL_CREATE_REPLY}
                      extraCondition={!checkStateReplyDraft && !['ANS_DRF', 'COMPL', 'UPLOADED'].includes(question.state)}
                    >
                      <Tooltip title="Reply Inquiry">
                        <div onClick={() => onReply(question)} style={{ marginRight: 8 }}>
                          <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/reply.svg" />
                        </div>
                      </Tooltip>
                    </PermissionProvider>
                  ) : (
                    <>
                      {question.showIconAttachAnswerFile && (
                        <FormControlLabel control={
                          <AttachFile isAnswer={true}
                            question={question}
                            questions={inquiries}
                            setIsUploadFile={(val) => {
                              setIsUploadFile(val)
                            }}
                            isUploadFile={isUploadFile} />}
                        />)}
                      {question.showIconAttachReplyFile && (
                        <AttachFile
                          isReply={true}
                          question={question}
                          setAttachmentReply={handleSetAttachmentReply}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <Typography variant="h5">{question.name}</Typography>
            {
              ['RESOLVED', 'COMPL', 'UPLOADED', 'AME_DRF', 'AME_SENT'].includes(question.state) && containerCheck.includes(question.field) ? (
                question?.process === 'draft' ?
                  <>
                    {
                      typeof question.content === 'string' ? <Typography
                        className={viewDropDown !== question.id ? classes.hideText : ''}
                        variant="h5"
                        id={question.id}
                        style={{
                          wordBreak: 'break-word',
                          fontFamily: 'Montserrat',
                          fontSize: 15,
                          color: '#132535',
                          whiteSpace: 'pre-wrap'
                        }}>
                        {`${question.content}`}
                      </Typography> :
                        <ContainerDetailForm
                          container={
                            question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                          }
                          setEditContent={(value) => {
                            if (isReplyCDCM || isResolveCDCM) {
                              handleChangeContainerDetail(value);
                              setTextResolve(value);
                            }
                          }}
                          disableInput={!isResolveCDCM && !isReplyCDCM}
                        />
                    }
                  </> : <ContainerDetailFormOldVersion
                    container={
                      question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                    }
                    question={question}
                    setTextResolve={setTextResolve}
                    disableInput={true}
                  />
              ) :
                <Typography
                  className={viewDropDown !== question.id ? classes.hideText : ''}
                  variant="h5"
                  id={question.id}
                  style={{
                    wordBreak: 'break-word',
                    fontFamily: 'Montserrat',
                    fontSize: 15,
                    color: '#132535',
                    whiteSpace: 'pre-wrap'
                  }}>
                  {`${question.content}`}
                </Typography>
            }

            <div style={{ display: 'block', margin: '1rem 0rem' }}>
              {type === metadata.ans_type.choice &&
                ((['OPEN', 'ANS_DRF', 'INQ_SENT', 'ANS_SENT', 'REP_Q_DRF'].includes(question.state)) || question.showIconAttachAnswerFile) && !checkStateReplyDraft &&
                (
                  <ChoiceAnswer
                    questions={inquiries}
                    question={question}
                    disable={!question.showIconAttachAnswerFile}
                    saveStatus={isSaved}
                    currentQuestion={currentQuestion}
                  />
                )}
              {type === metadata.ans_type.paragraph && ((['OPEN', 'INQ_SENT', 'REP_Q_DRF', 'ANS_DRF', 'ANS_SENT'].includes(question.state)) || question.showIconAttachAnswerFile) && !checkStateReplyDraft &&
                (
                  <ParagraphAnswer
                    question={question}
                    index={index}
                    questions={inquiries}
                    disable={!question.showIconAttachAnswerFile}
                    saveStatus={isSaved}
                    currentQuestion={currentQuestion}
                  />
                )}
            </div>
            <>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  {/*{question.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}*/}
                </Grid>

                {(isShowViewAll || inqHasComment) && (
                  <Grid item xs={6}>
                    <div
                      className={classes.viewMoreBtn}
                      onClick={() => handleViewMore(question.id)}>
                      {viewDropDown !== question.id ? ( // TODO
                        <>
                          View All
                          <ArrowDropDown />
                        </>
                      ) : (
                        <>
                          Hide All
                          <ArrowDropUp />
                        </>
                      )}
                    </div>
                  </Grid>
                )}
              </Grid>

              <PermissionProvider
                action={PERMISSION.INQUIRY_REOPEN_INQUIRY}
                extraCondition={['COMPL', 'RESOLVED', 'UPLOADED'].includes(question.state)}
              >
                <div className='flex' style={{ alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => reOpen(question.process === 'draft' ? tempReply?.answer.id : question.id)}
                    classes={{ root: classes.button }}
                  >
                    ReOpen
                  </Button>
                </div>
              </PermissionProvider>

              {viewDropDown === question.id && inqHasComment && (
                <Comment question={props.question} comment={comment} />
              )}

              {question.mediaFile?.length > 0 &&
                question.mediaFile?.map((file, mediaIndex) => (
                  <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                    {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                      <ImageAttach
                        file={file}
                        hiddenRemove={true}
                        field={question.field}
                        indexInquiry={index}
                        style={{ margin: '2.5rem' }}
                      />
                    ) : (
                      <FileAttach
                        hiddenRemove={true}
                        file={file}
                        field={question.field}
                        indexInquiry={index}
                      />
                    )}
                  </div>
                ))}
            </>
            {
              question.mediaFilesAnswer?.length > 0 &&
              <>
                {question.mediaFilesAnswer?.length > 0 && <h3>Attachment Answer:</h3>}
                {question.mediaFilesAnswer?.map((file, mediaIndex) => (
                  <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                    {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                      <ImageAttach
                        file={file}
                        field={question.field}
                        style={{ margin: '2.5rem' }}
                        indexMedia={mediaIndex}
                        isAnswer={true}
                        question={question}
                        questions={inquiries}
                        hiddenRemove={!question.showIconAttachAnswerFile}
                        isRemoveFile={isRemoveFile}
                        setIsRemoveFile={(val) => {
                          setIsRemoveFile(val)
                        }}
                      />
                    ) : (
                      <FileAttach
                        file={file}
                        field={question.field}
                        indexMedia={mediaIndex}
                        isAnswer={true}
                        question={question}
                        index={index}
                        questions={inquiries}
                        hiddenRemove={!question.showIconAttachAnswerFile}
                        isRemoveFile={isRemoveFile}
                        setIsRemoveFile={(val) => {
                          setIsRemoveFile(val)
                        }}
                      />
                    )}
                  </div>
                ))}
              </>
            }
          </div>
          {!['COMPL', 'RESOLVED'].includes(question.state) && question.state !== 'UPLOADED' && (
            <>
              {isResolve || isResolveCDCM ? (
                <>
                  {containerCheck.includes(question.field) && <>
                    {question?.process === 'draft' ?
                      !isResolveCDCM && <ContainerDetailForm
                        container={
                          question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                        }
                        setEditContent={(value) => {
                          handleChangeContainerDetail(value);
                          setTextResolve(value)
                        }}
                        setTextResolve={setTextResolve}
                      />
                      : <ContainerDetailFormOldVersion
                        container={
                          question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                        }
                        question={question}
                        setTextResolve={setTextResolve}
                      />
                    }
                  </>
                  }
                  {
                    !containerCheck.includes(question.field) &&
                    <div style={{ paddingTop: '5px' }}>
                      {renderSeparateField(question?.field)}
                    </div>
                  }
                  <div className="flex">
                    <PermissionProvider action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}>
                      <Button
                        variant="contained"
                        disabled={
                          isSeparate ?
                            (validatePartiesContent(textResolveSeparate.name, 'name')?.isError ||
                              validatePartiesContent(textResolveSeparate.address, 'address')?.isError)
                            : false
                        }
                        color="primary"
                        onClick={onConfirm}
                        classes={{ root: clsx(classes.button, 'w120') }}>
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        classes={{ root: clsx(classes.button, 'w120', 'reply') }}
                        color="primary"
                        onClick={cancelResolve}>
                        Cancel
                      </Button>
                    </PermissionProvider>
                  </div>
                </>
              ) : (
                <>
                  {isReply || isReplyCDCM ? (
                    <>
                      {isReply && <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                        <textarea
                          style={{
                            width: '100%',
                            paddingTop: 10,
                            paddingLeft: 5,
                            marginTop: 10,
                            minHeight: 50,
                            border: '1px solid #BAC3CB',
                            borderRadius: 8,
                            resize: 'none',
                            fontFamily: 'Montserrat',
                            fontSize: 15
                          }}
                          multiline="true"
                          type="text"
                          placeholder="Reply..."
                          value={tempReply?.answer?.content}
                          onChange={handleChangeContentReply}
                        />
                      </div>
                      }
                      {/*{tempReply?.mediaFiles?.length > 0 && <h3>Attachment Reply:</h3>}*/}
                      {tempReply?.mediaFiles?.map((file, mediaIndex) => (
                        <div
                          style={{ position: 'relative', display: 'inline-block' }}
                          key={mediaIndex}>
                          {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                            <ImageAttach
                              hiddenRemove={!question.showIconAttachReplyFile}
                              file={file}
                              field={question.field}
                              style={{ margin: '2.5rem' }}
                              indexMedia={mediaIndex}
                              isReply={true}
                              templateReply={tempReply}
                              setTemplateReply={(val) => {
                                setTempReply(val)
                              }}
                            />
                          ) : (
                            <FileAttach
                              hiddenRemove={!question.showIconAttachReplyFile}
                              file={file}
                              field={question.field}
                              indexMedia={mediaIndex}
                              isReply={true}
                              templateReply={tempReply}
                              setTemplateReply={(val) => {
                                setTempReply(val)
                              }}
                            />
                          )}
                        </div>
                      ))}

                      <div className="flex">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onSaveReply}
                          disabled={
                            (question.state === "AME_DRF" && !tempReply?.answer?.content)
                            || (question.state !== "AME_DRF" && !tempReply?.answer?.content && (!tempReply.mediaFiles || tempReply.mediaFiles.length === 0))
                            || disableSaveReply
                          }
                          classes={{ root: clsx(classes.button, 'w120') }}>
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          classes={{ root: clsx(classes.button, 'w120', 'reply') }}
                          color="primary"
                          onClick={() => cancelReply(question)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex">
                      <PermissionProvider action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onResolve}
                          classes={{ root: clsx(classes.button, 'w120') }}>
                          Resolve
                        </Button>
                      </PermissionProvider>
                      {/*//*/}
                      {renderBtnReply()}
                      {/*//*/}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export const ContainerDetailFormOldVersion = ({ container, originalValues,question, setTextResolve, disableInput = false }) => {
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const getTypeName = (type) => {
    return Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === type);
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };
  const [tableScrollTop, setTableScrollTop] = useState(0);
  const [values, setValues] = useState(originalValues || getValueField(container) || [{}]);

  const inqType = getLabelById(metadata['inq_type_options'], question.inqType);
  const cdType =
    inqType !== CONTAINER_NUMBER ? [CONTAINER_NUMBER, inqType] : [CONTAINER_NUMBER, CONTAINER_SEAL];
  const cmType = inqType !== CONTAINER_NUMBER ? [CONTAINER_NUMBER, inqType] : [CONTAINER_NUMBER, CM_PACKAGE];
  const typeList = container === CONTAINER_DETAIL ? cdType : cmType;
  const onChange = (e, index, type) => {
    const temp = JSON.parse(JSON.stringify(values));
    temp[index][type] = e.target.value;
    setValues(temp);
    setTextResolve(temp);
  };

  useEffect(() => {
    setValues(getValueField(container) || [{}]);
  }, [content]);

  /**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
  // export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
  //    const map = new Map<K, Array<V>>();

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  const renderTB = () => {
    let td = [];
    const valueCopy = JSON.parse(JSON.stringify(values));
    let index = 0;
    valueCopy.map((item) => {
      item.index = index;
      index += 1;
    })
    const groups = groupBy(valueCopy, value => value[getType(CONTAINER_NUMBER)]);
    const groupsValues = [...groups].map(([name, value]) => ({ name, value }));
    while (groupsValues.length) {
      let rowValues = groupsValues.splice(0, 4);
      let rowIndex = 0;
      let isRunning = true;

      while (isRunning) {
        let type;
        if (rowIndex == 0) {
          type = typeList[rowIndex];
        }
        else {
          type = typeList[typeList.length - 1];
        }
        let hasData = false;
        td.push(<div key={rowIndex} style={{ display: 'flex', marginTop: type === typeList[0] ? 10 : 5 }}>
          <input
            className={clsx(classes.text)}
            style={{
              backgroundColor: '#FDF2F2',
              fontWeight: 600,
              borderTopLeftRadius: rowIndex === 0 && 8,
              fontSize: 14,
              // borderBottomLeftRadius: rowIndex === typeList.length - 1 && 8
            }}
            disabled
            defaultValue={type}
          />
          {
            rowValues.map((item, index1) => {
              if (item.value.length > rowIndex) {
                hasData = true;
              }
              let nodeValue = null;
              if (rowIndex - 1 < item.value.length) {
                nodeValue = item.value[rowIndex > 0 ? rowIndex - 1 : 0];
              }
              const disabled = !(rowIndex > 0 && nodeValue && !disableInput);
              return (
                <input
                  className={clsx(classes.text)}
                  key={index1}
                  style={{
                    marginLeft: 5,
                    backgroundColor: disabled && '#FDF2F2',
                    fontSize: 15,
                    borderTopRightRadius: rowIndex === 0 && rowValues.length - 1 === index1 ? 8 : null,
                    // borderBottomRightRadius:
                    //     index1 === rowValues.length - 1 && rowIndex === typeList.length - 1 ? 8 : null
                  }}
                  disabled={disabled}
                  value={nodeValue ? nodeValue[getType(type)] : ''}
                  onChange={(e) => onChange(e, nodeValue.index, getType(type))}
                />
              );
            })
          }
        </div>);
        if (!hasData) {
          isRunning = false;
        }
        rowIndex += 1;
      }
    }
    return td;
  };

  return (
    <>
      {
        renderTB()
      }
    </>
  );
};
export default InquiryViewer;
