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
import { getLabelById, displayTime } from '@shared';
import {
  CONTAINER_DETAIL,
  CONTAINER_MANIFEST,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CM_PACKAGE
} from '@shared/keyword';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Tooltip, Grid, Button, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import clsx from 'clsx';
import * as AppAction from 'app/store/actions';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from './AttachFile';
import Comment from './Comment';

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
    width: 170,
    border: '1px solid #BAC3CB',
    textAlign: 'center',
    color: '#132535'
  },
}));

const InquiryViewer = (props) => {
  const { index, showReceiver, isSaved, currentQuestion, openInquiryReview, field } = props;
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const classes = useStyles();

  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const [indexQuestionRemove, setIndexQuestionRemove] = useState(-1);
  const [replyRemove, setReplyRemove] = useState();
  const [question, setQuestion] = useState(props.question);
  const [type, setType] = useState(props.question.ansType);
  const [allowDeleteInq, setAllowDeleteInq] = useState(true);
  const [viewDropDown, setViewDropDown] = useState();
  const [inqHasComment, setInqHasComment] = useState(false);
  const [isResolve, setIsResolve] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [comment, setComment] = useState([]);
  const [isLoadedComment, setIsLoadedComment] = useState(false);
  const [textResolve, setTextResolve] = useState(content[question.field] || '');
  const [tempReply, setTempReply] = useState({});
  const [showLabelSent, setShowLabelSent] = useState(false);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const [isSaveComment, setSaveComment] = useState(false);
  const [checkStateReplyDraft, setStateReplyDraft] = useState(false);
  const [submitLabel, setSubmitLabel] = useState(false);
  const [isShowViewAll, setShowViewAll] = useState(false);

  const handleViewMore = (id) => {
    if (viewDropDown === id) {
      setViewDropDown('');
    } else {
      setViewDropDown(id);
    }
  };

  useEffect(() => {
    setTempReply({});
    if (question && question.process === 'pending') {
      loadComment(question.id)
        .then((res) => {
          const lastest = { ...question };
          if (res.length > 1) {
            res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

            // filter comment
            lastest.mediaFile = res[res.length - 1].answersMedia;
            lastest.answerObj = [{ content: res[res.length - 1].content }];
            lastest.content = res[res.length - 1].content;
            lastest.name = "";
            lastest.creator = res[res.length - 1].creator;
            lastest.createdAt = res[res.length - 1].createdAt;
            lastest.mediaFilesAnswer = [];
            //
            const filterOffshoreSent = res[res.length - 1];
            if (Object.keys(filterOffshoreSent).length > 0) {
              //
              if (['REP_Q_DRF', 'REP_A_DRF'].includes(filterOffshoreSent.state)) {
                const reqReply = {
                  inqAns: {
                    inquiry: null,
                    confirm: false,
                    type: 'REP'
                  },
                  answer: {
                    id: filterOffshoreSent.answer,
                    content: filterOffshoreSent.content,
                    type: metadata.ans_type['paragraph']
                  }
                };
                setTempReply({ ...tempReply, ...reqReply, mediaFiles: filterOffshoreSent.answersMedia });
              }
              //
              if (user.role === 'Admin') {
                if (filterOffshoreSent.state === 'REP_Q_SENT') {
                  setShowLabelSent(true)
                } else if (filterOffshoreSent.state === 'REP_Q_DRF') {
                  setStateReplyDraft(true)
                }
                if (filterOffshoreSent.state === 'REP_A_SENT') {
                  lastest.showIconReply = true;
                }
              } else {
                if (filterOffshoreSent.state === 'REP_A_DRF') {
                  setStateReplyDraft(true);
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  props.getStateReplyDraft(true);
                  //
                } else if (filterOffshoreSent.state === 'REP_Q_SENT') {
                  lastest.showIconReply = true;
                }
                if (['REP_A_SENT'].includes(filterOffshoreSent.state)) {
                  setSubmitLabel(true);
                }
              }
            }
            //
            setComment([...res]);
            setType(metadata.ans_type.paragraph);
            setQuestion(lastest);
            setInqHasComment(true);
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
              lastest.mediaFile = lastest.mediaFilesAnswer;
              lastest.mediaFilesAnswer = [];
              if (user.role === 'Admin') {
                lastest.showIconReply = true;
              } else {
                if (lastest.state === 'REP_Q_DRF') setSubmitLabel(true);
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
          const lastest = { ...question };
          if (res.length > 0) {
            const { content: contentField, mediaFile } = res[res.length - 1].content;
            const lastestComment = res[res.length - 1];
            // filter comment
            lastest.mediaFile = mediaFile;
            lastest.answerObj = [{ content: contentField }];
            lastest.content = ["AME_DRF", "AME_SENT"].includes(lastestComment.state) ? `The update information is "${contentField}"` : contentField;
            lastest.name = "";
            lastest.mediaFilesAnswer = [];
            lastest.id = lastestComment.id;
            lastest.state = lastestComment.state;
            lastest.createdAt = lastestComment.createdAt;
            lastest.creator = lastestComment.creator;
            lastest.process = 'draft';
            if (['REP_DRF', 'AME_DRF'].includes(lastest.state)) {
              setStateReplyDraft(true);
              const reqReply = {
                inqAns: {
                  inquiry: null,
                  confirm: false,
                  type: 'REP'
                },
                answer: {
                  id: lastest.id,
                  content: contentField,
                  type: metadata.ans_type['paragraph']
                }
              };
              setTempReply({ ...tempReply, ...reqReply, mediaFiles: lastest.mediaFile });
            }
            //
            if (user.role === 'Admin') {
              if (['AME_SENT'].includes(lastest.state)) {
                lastest.showIconReply = true;
              }
              if (['REP_SENT'].includes(lastest.state)) {
                setShowLabelSent(true);
              }
            } else {
              if (['REP_SENT'].includes(lastest.state)) {
                lastest.showIconReply = true;
                setStateReplyDraft(false);
              }
              if (['AME_DRF'].includes(lastest.state)) {
                setStateReplyDraft(true);
                lastest.showIconAttachReplyFile = false;
                lastest.showIconAttachAnswerFile = false;
              } else if (['AME_SENT'].includes(lastest.state)) {
                setStateReplyDraft(false);
                lastest.showIconReply = false;
                setSubmitLabel(true);
              }
            }
            setQuestion(lastest);
            //
            const comments = [{
              creator: { userName: user.displayName, avatar: null },
              createdAt: res[0].createdAt,
              answersMedia: [],
              content: `The information is "${content[lastest.field]}"`
            }];
            res.map(r => {
              const { content, mediaFile } = r.content;
              comments.push({
                id: r.id,
                creator: r.creator,
                createdAt: r.createdAt,
                answersMedia: mediaFile,
                content: ["AME_DRF", "AME_SENT"].includes(r.state) ? `The update information is "${content}"` : content,
              });
            });
            setComment(comments);
            setInqHasComment(true);
          }
          setIsLoadedComment(true);
        })
        .catch((error) => console.error(error));
    }
  }, [isSaveComment]);

  const resetAnswerActionSave = () => {
    const quest = { ...question };
    if (currentQuestion && currentQuestion.id === quest.id) {
      quest.showIconReply = false;
      quest.showIconEdit = true;
      quest.showIconAttachAnswerFile = false;
      quest.showIconAttachReplyFile = false;
      let answerObj = null;
      if (question.ansType === metadata.ans_type.choice) {
        answerObj = quest.answerObj.filter((item) => item.confirmed);
      } else {
        answerObj = quest.answerObj;
      }
      if (answerObj.length > 0) {
        quest.creator = answerObj[0]?.updater;
        quest.createdAt = answerObj[0]?.updatedAt;
        quest.content = `The updated information is "${answerObj[0]?.content}"`;
        quest.name = "";
        quest.answerObj = [];
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
      setQuestion(quest);
    }
  }
  //
  useEffect(() => {
    resetAnswerActionSave()
  }, [currentQuestion, isSaved]);

  useEffect(() => {
    setQuestion(props.question);
  }, [props.question]);

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
      } else if (['ANS_DRF'].includes(op.state)) {
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
    question?.state !== 'OPEN' && setAllowDeleteInq(false);
  }, [question]);

  useEffect(() => {
    if (confirmClick && confirmPopupType === 'removeInq' && indexQuestionRemove >= 0) {
      const optionsOfQuestion = [...inquiries];
      const inqDelete = optionsOfQuestion.splice(indexQuestionRemove, 1)[0];
      const hidePopupEmpty = !optionsOfQuestion.filter(inq => inq.field === inqDelete.field).length;
      deleteInquiry(inqDelete.id)
        .then(() => {
          dispatch(InquiryActions.setInquiries(optionsOfQuestion));
          hidePopupEmpty && dispatch(InquiryActions.setOneInq({}));
          if (!optionsOfQuestion.length) {
            (field === 'INQUIRY_LIST') && dispatch(FormActions.toggleAllInquiry(false));
            if (openInquiryReview) {
              dispatch(FormActions.toggleOpenInquiryReview(false));
              dispatch(FormActions.toggleOpenEmail(false))
            };
          }
        })
        .catch((error) => console.error(error));
    } else if (confirmPopupType === 'removeReply') {
      if (replyRemove) {
        deleteDraftBLReply(replyRemove.id)
          .then(() => {
            setSaveComment(!isSaveComment);
          }).catch((error) => console.error(error));
      }
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
    dispatch(
      FormActions.openConfirmPopup({
        openConfirmPopup: true,
        confirmPopupMsg: 'Are you sure you want to remove this reply?',
        confirmPopupType: 'removeReply'
      })
    );
  }

  const changeToEditor = (inq) => {
    const index = inquiries.findIndex((q) => q.id === inq.id);
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inq));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inq.field));
    }
  };

  const onResolve = () => {
    setIsResolve(true);
  };

  const onConfirm = () => {
    let content = '';
    if (typeof textResolve === 'string') {
      content = textResolve.trim();
    } else {
      content = textResolve;
      content.forEach((obj) => {
        if (obj[question.inqType]) obj[question.inqType] = obj[question.inqType]?.trim();
      });
    }
    const body = {
      fieldId: question.field,
      inqId: question.id,
      fieldContent: content,
      blId: myBL.id
    };
    resolveInquiry(body)
      .then(() => {
        dispatch(FormActions.toggleReload());
        setIsResolve(false);
        setQuestion((q) => ({ ...q, state: 'COMPL' }));
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  };

  const onUpload = () => {
    uploadOPUS(question.id)
      .then(() => {
        dispatch(FormActions.toggleReload());
        setQuestion((q) => ({ ...q, state: 'UPLOADED' }));
        dispatch(
          AppAction.showMessage({ message: 'Upload to OPUS successfully', variant: 'success' })
        );
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  };

  const cancelResolve = () => {
    setTextResolve(content[question.field] || '');
    setIsResolve(false);
  };

  const inputText = (e) => {
    setTextResolve(e.target.value);
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

  const handleSetAttachmentReply = (val) => {
    if (!tempReply.mediaFiles?.length) {
      setTempReply({
        ...tempReply,
        mediaFiles: val
      });
    } else {
      const mediaFiles = [...tempReply.mediaFiles, ...val];
      setTempReply({ ...tempReply, mediaFiles });
    }
  };

  const onSaveReply = async () => {
    const mediaListId = [];
    let mediaListAmendment = [];
    const mediaRest = [];
    let mediaFilesResp;
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
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
            setQuestion((q) => ({ ...q, state: stateUpdate, process: 'pending' }));
            dispatch(InquiryActions.setInquiries(optionsInquires));
            setSaveComment(!isSaveComment);
            //
            dispatch(InquiryActions.checkSend(true));
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
            setViewDropDown('');
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
            setQuestion((q) => ({ ...q, state: stateUpdate, process: 'pending' }));
            dispatch(InquiryActions.setInquiries(optionsInquires));
            setSaveComment(!isSaveComment);
            //
            dispatch(InquiryActions.checkSend(true));
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
          }).catch((error) =>
            dispatch(AppAction.showMessage({ message: error, variant: 'error' }))
          );
      }
    } else {
      // Add
      if (!tempReply.answer?.id) {
        const reqReply = {
          field: question.field,
          content: { content: tempReply.answer.content, mediaFile: mediaListAmendment },
          mybl: myBL.id
        };
        saveEditedField({ ...reqReply }).then(() => {
          //
          setSaveComment(!isSaveComment);
          dispatch(AppAction.showMessage({ message: 'Save Reply successfully', variant: 'success' }));
        }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' }))
        );
      } else {
        const reqReply = {
          content: { content: tempReply.answer.content, mediaFile: mediaListAmendment },
        };
        updateDraftBLReply({ ...reqReply }, tempReply.answer?.id).then(() => {
          setSaveComment(!isSaveComment);
          dispatch(AppAction.showMessage({ message: 'Edit Reply successfully', variant: 'success' }));
        }).catch((err) => dispatch(AppAction.showMessage({ message: err, variant: 'error' })))
      }
    }
    setIsReply(false)
  }

  const cancelReply = (q) => {
    setIsReply(false);
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
    if (['ANS_DRF', 'ANS_SENT'].includes(question.state)) {
      optionsInquires[editedIndex].showIconEdit = false;
      optionsInquires[editedIndex].showIconReply = false;
      optionsInquires[editedIndex].showIconAttachReplyFile = false;
      optionsInquires[editedIndex].showIconAttachAnswerFile = true;
      dispatch(InquiryActions.setInquiries(optionsInquires));
      reply.showIconAttachReplyFile = false;
      reply.showIconAttachAnswerFile = true;
      if (props.question.answerObj.length) reply.answerObj = props.question.answerObj;
      reply.mediaFilesAnswer = reply.mediaFile;
      reply.mediaFile = [];

    } else {
      // Edit Reply
      setIsReply(true);
      setIsResolve(false);
      setStateReplyDraft(false);
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

  const reOpen = (id) => {
    reOpenInquiry(id)
      .then(() => {
        dispatch(FormActions.toggleReload());
        dispatch(
          AppAction.showMessage({ message: 'Update inquiry is successfully', variant: 'success' })
        );
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  };

  useEffect(() => {
    const el = document.getElementById(question.id);
    setShowViewAll(false);
    if (el) {
      const oldClassName = el.className;
      el.className = el.className.replace('-hideText', '')
      if (el.getBoundingClientRect().height > 110) {
        el.className = oldClassName;
        setShowViewAll(true);
      }
    }
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

  return (
    <>
      {isLoadedComment && (
        <>
          <div>
            <div style={{ paddingTop: 10 }} className="flex justify-between">
              <UserInfo
                name={question.creator?.userName}
                time={displayTime(question.createdAt)}
                avatar={question.creator.avatar}
              />
              {user.role === 'Admin' ? ( // TODO
                <div className="flex items-center mr-2">
                  <PermissionProvider
                    action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}
                    extraCondition={question.state === 'COMPL' || question.state === 'UPLOADED'}
                  >
                    <div className='flex' style={{ alignItems: 'center' }}>
                      <div style={{ marginRight: 15 }}>
                        <span className={classes.labelStatus}>Resolved</span>
                      </div>
                      <Button
                        disabled={question.state === 'UPLOADED'}
                        variant="contained"
                        color="primary"
                        onClick={onUpload}
                        classes={{ root: classes.button }}
                      >
                        Upload to OPUS
                      </Button>
                    </div>
                  </PermissionProvider>
                  <div className='flex' style={{ alignItems: 'center' }}>
                    <div style={{ marginRight: 15 }}>
                      {showLabelSent && !['COMPL', 'UPLOADED'].includes(question.state) && (
                        <span className={classes.labelStatus}>Sent</span>
                      )}
                    </div>
                    {showReceiver && <FormControlLabel control={<Radio color={'primary'} checked disabled />} label={question.receiver.includes('customer') ? "Customer" : "Onshore"} />}

                    {/*Admin Reply*/}
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
                          <Tooltip title={'Edit Reply'}>
                            <div onClick={() => handleEdit(question)}>
                              <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                            </div>
                          </Tooltip>
                        )}
                      </>
                    )}
                    {/*Admin Reply*/}

                  </div>
                  <PermissionProvider
                    action={PERMISSION.VIEW_EDIT_INQUIRY}
                    extraCondition={question.state === 'INQ_SENT' || question.state === 'OPEN' || question.state === 'ANS_DRF'}>
                    <Tooltip title="Edit Inquiry">
                      <div onClick={() => changeToEditor(question)}>
                        <img
                          style={{ width: 20, cursor: 'pointer' }}
                          src="/assets/images/icons/edit.svg"
                        />
                      </div>
                    </Tooltip>
                  </PermissionProvider>
                  {allowDeleteInq && (
                    <Tooltip title="Delete Inquiry">
                      <div style={{ marginLeft: '10px' }} onClick={() => removeQuestion()}>
                        <img
                          style={{ height: '22px', cursor: 'pointer' }}
                          src="/assets/images/icons/trash-gray.svg"
                        />
                      </div>
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div className='flex' style={{ alignItems: 'center' }}>
                  <div style={{ marginRight: 15 }}>
                    {(['COMPL', 'UPLOADED'].includes(question.state)) ? (
                      <span className={classes.labelStatus}>Resolved</span>
                    ) : (['ANS_SENT'].includes(question.state) || submitLabel) && (
                      <span className={classes.labelStatus}>Submitted</span>
                    )}
                  </div>
                  {(((['ANS_DRF'].includes(question.state)) && question.showIconEdit) || checkStateReplyDraft) && (
                    <>
                      <Tooltip title={checkStateReplyDraft ? 'Edit Reply' : "Edit Answer"}>
                        <div onClick={() => handleEdit(question)}>
                          <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                        </div>
                      </Tooltip>
                      {question.process === 'draft' && (
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
                        <FormControlLabel control={<AttachFile isAnswer={true} question={question} questions={inquiries} />} />)}
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
              {question.content}
            </Typography>
            <div style={{ display: 'block', margin: '1rem 0rem' }}>
              {type === metadata.ans_type.choice &&
                ((['OPEN', 'INQ_SENT', 'ANS_SENT'].includes(question.state)) || question.showIconAttachAnswerFile) && !checkStateReplyDraft &&
                (
                  <ChoiceAnswer
                    questions={inquiries}
                    question={question}
                    disable={!question.showIconAttachAnswerFile}
                  />
                )}
              {type === metadata.ans_type.paragraph && ((['OPEN', 'INQ_SENT', 'ANS_SENT'].includes(question.state)) || question.showIconAttachAnswerFile) && !checkStateReplyDraft &&
                (
                  <ParagraphAnswer
                    question={question}
                    index={index}
                    questions={inquiries}
                    disable={!question.showIconAttachAnswerFile}
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
                extraCondition={question.state === 'COMPL'}
              >
                <div className='flex' style={{ alignItems: 'center' }}>
                  <Button
                    disabled={question.state === 'UPLOADED'}
                    variant="contained"
                    color="primary"
                    onClick={() => reOpen(question?.id)}
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
              user.role !== 'Admin' && question.mediaFilesAnswer?.length > 0 &&
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
                      />
                    )}
                  </div>
                ))}
              </>
            }
          </div>
          {question.state !== 'COMPL' && question.state !== 'UPLOADED' && (
            <>
              {isResolve ? (
                <>
                  {containerCheck.includes(question.field) ? (
                    <ContainerDetailForm
                      container={
                        question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                      }
                      question={question}
                      setTextResolve={setTextResolve}
                    />
                  ) : (
                    <textarea
                      style={{
                        width: '100%',
                        paddingTop: 10,
                        paddingLeft: 5,
                        marginTop: 10,
                        minHeight: 50,
                        borderWidth: '0.5px',
                        borderStyle: 'solid',
                        borderColor: 'lightgray',
                        borderRadius: 6,
                        resize: 'none'
                      }}
                      multiline="true"
                      type="text"
                      value={textResolve}
                      onChange={inputText}
                    />
                  )}
                  <div className="flex">
                    <PermissionProvider action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}>
                      <Button
                        variant="contained"
                        disabled={
                          typeof textResolve === 'string'
                            ? !textResolve.trim()
                            : textResolve.some((cont) => !cont[question.inqType]?.trim())
                        }
                        color="primary"
                        onClick={onConfirm}
                        classes={{ root: clsx(classes.button, 'w120') }}>
                        Save
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
                  {isReply ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                        <textarea
                          style={{
                            width: '100%',
                            paddingTop: 10,
                            paddingLeft: 5,
                            marginTop: 10,
                            minHeight: 50,
                            border: '1px solid #BAC3CB',
                            borderRadius: 8,
                            resize: 'none'
                          }}
                          multiline="true"
                          type="text"
                          placeholder="Reply..."
                          value={tempReply?.answer?.content}
                          onChange={handleChangeContentReply}
                        />
                      </div>

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
                          disabled={!tempReply?.answer?.content}
                          classes={{ root: classes.button }}>
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          classes={{ root: clsx(classes.button, 'reply') }}
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
        </>
      )}
    </>
  );
};

const ContainerDetailForm = ({ container, question, setTextResolve }) => {
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };
  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };
  const getValueField = (field) => {
    return content[getField(field)] || '';
  };
  const [values, setValues] = useState(getValueField(container) || [{}]);
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

  const renderTB = () => {
    let td = [];
    const valueCopy = JSON.parse(JSON.stringify(values));
    while (valueCopy.length) {
      let rowValues = valueCopy.splice(0, 4);
      td.push(typeList.map((type, index) => (
        <div key={index} style={{ display: 'flex', marginTop: 10 }}>
          <input
            className={clsx(classes.text)}
            style={{
              backgroundColor: '#FDF2F2',
              fontWeight: 600,
              borderTopLeftRadius: index === 0 && 8,
              fontSize: 14,
              borderBottomLeftRadius: index === typeList.length - 1 && 8
            }}
            disabled
            defaultValue={type}
          />
          {rowValues.map((cd, index1) => {
            const disabled = question.inqType !== getType(type);
            return (
              <input
                className={clsx(classes.text)}
                key={index1}
                style={{
                  marginLeft: 5,
                  backgroundColor: disabled && '#FDF2F2',
                  fontSize: 15,
                  borderTopRightRadius: index === 0 && rowValues.length - 1 === index1 ? 8 : null,
                  borderBottomRightRadius:
                    index1 === rowValues.length - 1 && index === typeList.length - 1 ? 8 : null
                }}
                disabled={disabled}
                value={cd[getType(type)]}
                onChange={(e) => onChange(e, index1, getType(type))}
              />
            );
          })}
        </div>
      )))
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
