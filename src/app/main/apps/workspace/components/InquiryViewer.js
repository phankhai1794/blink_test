import {
  deleteComment,
  deleteInquiry,
  loadComment,
  reOpenInquiry,
  resolveInquiry,
  saveReply,
  updateReply,
  uploadOPUS
} from 'app/services/inquiryService';
import { saveEditedField, updateDraftBLReply, getCommentDraftBl, deleteDraftBLReply } from 'app/services/draftblService';
import { uploadFile } from 'app/services/fileService';
import { getLabelById, displayTime, validatePartiesContent, validateBLType, groupBy, isJsonText, formatContainerNo, isSameFile, validateAlsoNotify } from '@shared';
import { getBlInfo, validateTextInput } from 'app/services/myBLService';
import { useUnsavedChangesWarning } from 'app/hooks';
import { sendmailResolve } from 'app/services/mailService';
import {
  CONSIGNEE,
  CONTAINER_DETAIL,
  CONTAINER_MANIFEST,
  CONTAINER_NUMBER,
  CONTAINER_PACKAGE,
  CONTAINER_SEAL,
  CONTAINER_WEIGHT,
  CONTAINER_MEASUREMENT,
  CM_PACKAGE,
  CM_WEIGHT,
  CM_MEASUREMENT,
  SHIPPER,
  NOTIFY,
  ONLY_ATT,
  NO_CONTENT_AMENDMENT,
  BL_TYPE,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  CONTAINER_LIST,
  FORWARDING,
  TYPE_OF_MOVEMENT,
  PRE_CARRIAGE,
  VESSEL_VOYAGE,
  FREIGHT_CHARGES,
  PLACE_OF_BILL,
  DATED,
  COMMODITY_CODE,
  DATE_CARGO,
  DATE_LADEN,
  ALSO_NOTIFY,
  DESCRIPTION_OF_GOODS
} from '@shared/keyword';

import {  NumberFormat } from '@shared';
import { packageUnits, weightUnits, measurementUnits } from '@shared/units';
import { handleError } from '@shared/handleError';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import clsx from 'clsx';
import * as AppAction from 'app/store/actions';
import ErrorOutlineOutlined from '@material-ui/icons/ErrorOutlineOutlined';

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
    borderRadius: 4,
  },
  labelMargin: {
    marginRight: 21
  },
  labelDisabled: {
    '&.Mui-disabled': {
      color: '#132535',
    },
  },
  labelText: {
    color: '#36B37E',
    fontWeight: 400,
    fontSize: 12,
  },
  timeSent: {
    position: 'relative',
    '& img': {
      position: 'absolute',
      left: -16,
      bottom: 6
    }
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
  inputText: {
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
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '1px',
      borderColor: '#BAC3CB'
    },
    '& .MuiFormHelperText-root': {
      fontFamily: 'Montserrat',
      fontSize: '14px'
    }
  },
  placeholder: {
    '&::placeholder': {
      textTransform: 'none',
    },
  },
  btnBlockFields: {
    fontWeight: 600,
    display: 'flex',
    backgroundColor: '#E4E4E4',
    height: '20px',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '10px',
    color: '#AFAFAF'
  }
}));

const InquiryViewer = (props) => {
  const { index, showReceiver, isSaved, currentQuestion, openInquiryReview, field, isSaveAnswer } = props;
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

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
  const [validationCDCM, setValidationCDCM] = useState(true);
  const [textResolveSeparate, setTextResolveSeparate] = useState({ name: '', address: '' });
  const [isSeparate, setIsSeparate] = useState([SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(question.field));
  const [isAlsoNotifies, setIsAlsoNotifies] = useState([ALSO_NOTIFY].map(key => metadata.field?.[key]).includes(question.field));
  const [tempReply, setTempReply] = useState({});
  const [showLabelSent, setShowLabelSent] = useState(false);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);
  const openConfirmPopup = useSelector(({ workspace }) => workspace.formReducer.openConfirmPopup);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const [isSaveComment, setSaveComment] = useState(false);
  const [checkStateReplyDraft, setStateReplyDraft] = useState(false);
  const [submitLabel, setSubmitLabel] = useState(false);
  const [isShowViewAll, setShowViewAll] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [isRemoveFile, setIsRemoveFile] = useState(false);
  const [disableSaveReply, setDisableSaveReply] = useState(false);
  const [disableAcceptResolve, setDisableAcceptResolve] = useState(false);
  const [disableReopen, setDisableReopen] = useState(false);
  const [isEditOriginalAmendment, setEditOriginalAmendment] = useState(false);
  const inqViewerFocus = useSelector(({ workspace }) => workspace.formReducer.inqViewerFocus);
  const [inqAnsId, setInqAnsId] = useState('');
  const validateInput = useSelector(({ workspace }) => workspace.formReducer.validateInput);
  const [isDeleteAnswer, setDeleteAnswer] = useState({ status: false, content: '' });
  const [listFieldDisableUpload, setListFieldDisableUpload] = useState([]);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  const fieldsNotSendOPUS = [
    FORWARDING,
    TYPE_OF_MOVEMENT,
    PRE_CARRIAGE,
    VESSEL_VOYAGE,
    FREIGHT_CHARGES,
    PLACE_OF_BILL,
    DATED,
    COMMODITY_CODE,
    DATE_CARGO,
    DATE_LADEN
  ];

  const isDisableBtnUpload = () => {
    const listField = [];
    metadata['field_options'].forEach(item => {
      if (fieldsNotSendOPUS.includes(item.keyword)) {
        listField.push(item.value)
      }
    })
    setListFieldDisableUpload(listField)
  }

  const handleViewMore = (id) => {
    if (viewDropDown === id) {
      setViewDropDown('');
    } else {
      setViewDropDown(id);
    }
  };

  const validateField = (field, value) => {
    let response = { isError: false, errorType: "" };
    const isAlsoNotify = metadata.field[ALSO_NOTIFY] === field;
    if (Object.keys(metadata.field).find(key => metadata.field[key] === field) === BL_TYPE) {
      response = validateBLType(value);
    }
    if (isAlsoNotify) {
      response = validateAlsoNotify(value);
    }
    return response;
  }

  useEffect(() => {
    if (question.id !== inqViewerFocus) {
      setIsReply(false)
      setIsReplyCDCM(false)
      setIsResolve(false)
      setIsReplyCDCM(false)
      // setShowViewAll(false)
      setViewDropDown()
    }
  }, [inqViewerFocus])

  useEffect(() => {
    setQuestion(props.question);
  }, [props.question]);

  useEffect(() => {
    let isUnmounted = false;
    setTempReply({});
    setIsSeparate([SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(question.field));
    setIsAlsoNotifies([ALSO_NOTIFY].map(key => metadata.field?.[key]).includes(question.field));
    if (question && question.process === 'pending') {
      loadComment(question.id)
        .then((res) => {
          if (isUnmounted) return;
          const lastest = { ...question };
          if (res.length > 0) {
            // res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
            // filter comment
            // console.log(res)
            const filterOffshoreSent = res[res.length - 1];
            if (filterOffshoreSent.type === 'REP' && filterOffshoreSent.state === 'COMPL') {
              setInqAnsId(filterOffshoreSent.id);
            }

            lastest.mediaFile = filterOffshoreSent.mediaFile;
            lastest.mediaFilesAnswer = filterOffshoreSent.answersMedia;
            lastest.answerObj = filterOffshoreSent.answerObj;
            lastest.content = filterOffshoreSent.content;
            lastest.status = filterOffshoreSent.status;
            lastest.sentAt = filterOffshoreSent.sentAt;
            lastest.name = "";
            lastest.creator = filterOffshoreSent.updater;
            lastest.createdAt = filterOffshoreSent.createdAt;
            lastest.createdAt = filterOffshoreSent.createdAt;
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
              if (['REP_Q_DRF', 'REP_A_DRF', 'ANS_DRF'].includes(filterOffshoreSent.state)) {
                setTempReply({ ...tempReply, ...reqReply, mediaFiles: filterOffshoreSent.mediaFile });
              }
              lastest.state = filterOffshoreSent.state;
              lastest.updatedAt = filterOffshoreSent.updatedAt;
              //
              if (['REOPEN_A', 'REOPEN_Q'].includes(filterOffshoreSent.state)) {
                setShowLabelSent(false);
                setSubmitLabel(false);
                setStateReplyDraft(false);
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
                  setSubmitLabel(false);
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  props.getStateReplyDraft(true);
                  setSubmitLabel(false);
                  //
                } else if (['REP_Q_SENT'].includes(filterOffshoreSent.state)) {
                  lastest.showIconReply = true;
                  setStateReplyDraft(false);
                } else if (filterOffshoreSent.state === 'REP_Q_DRF') {
                  setSubmitLabel(true);
                  lastest.showIconEdit = true;
                } else if (filterOffshoreSent.state === 'ANS_DRF') {
                  setSubmitLabel(false);
                  setStateReplyDraft(false);
                  lastest.showIconEdit = true;
                  lastest.showIconAttachAnswerFile = false;
                } else if (filterOffshoreSent.state === 'INQ_SENT') {
                  setSubmitLabel(false);
                  lastest.showIconReply = true;
                  lastest.showIconEdit = false;
                  setStateReplyDraft(false);
                }
                if (['REP_A_SENT', 'ANS_SENT'].includes(filterOffshoreSent.state)) {
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
            const sortComments = [...res].sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
            if (sortComments.length && ['REOPEN_A', 'REOPEN_Q'].includes(sortComments[sortComments.length - 1].state)) {
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
              // setShowViewAll(false);
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
            // setTextResolve(content[lastest.field] || '');
          }
          setIsLoadedComment(true);
        })
        .catch((error) => handleError(dispatch, error));
    } else {
      getCommentDraftBl(myBL.id, question.field)
        .then((res) => {
          if (isUnmounted) return;
          // setEditOriginalAmendment(res.length === 1);
          // res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          const lastest = { ...question };
          if (res.length > 0) {
            // console.log(res)
            const { content: contentField, mediaFile } = res[res.length - 1].content;
            const lastestComment = res[res.length - 1];
            if (lastestComment.state === 'RESOLVED') {
              setInqAnsId(lastestComment.id);
            }
            // filter comment
            lastest.mediaFile = mediaFile;
            lastest.answerObj = [{ content: contentField }];
            lastest.content = contentField instanceof String ? `"${contentField}"` : contentField;
            lastest.name = "";
            lastest.mediaFilesAnswer = [];
            // lastest.id = lastestComment.id;
            lastest.state = lastestComment.state;
            lastest.status = lastestComment.status;
            lastest.sentAt = lastestComment.sentAt;
            lastest.createdAt = lastestComment.createdAt;
            lastest.creator = lastestComment.creator;
            lastest.process = 'draft';
            if (containerCheck.includes(question.field)) {
              const lastestContentCDCM = res.filter(r => r.state.includes('AME_') || r.state.includes('REOPEN_'));
              lastest.contentCDCM = lastestContentCDCM[lastestContentCDCM.length - 1].content.content;
            }

            if (Object.keys(lastestComment).length > 0) {
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
              setDisableReopen(false);
              setIsReplyCDCM(false);
              setIsResolveCDCM(false);
            }

            if (user.role === 'Admin') {
              if (lastestComment.role === 'Guest') {
                if (['REP_SENT', 'AME_SENT'].includes(lastest.state)) {
                  lastest.showIconReply = true;
                  setStateReplyDraft(false);
                  setTempReply({});
                }
              } else {
                if (['REP_DRF'].includes(lastest.state)) {
                  lastest.showIconReply = false;
                  setShowLabelSent(false);
                } else if (['REP_SENT'].includes(lastest.state)) {
                  lastest.showIconReply = false;
                  setShowLabelSent(true);
                }
              }
              if (['REOPEN_A'].includes(lastest.state)) {
                lastest.showIconReply = true;
                setStateReplyDraft(false);
              } else if (['REOPEN_Q'].includes(lastest.state)) {
                lastest.showIconReply = true;
                setStateReplyDraft(false);
              }
              if (['REOPEN_A', 'REOPEN_Q'].includes(lastest.state)) {
                if (typeof lastest.content === 'string') {
                  setTempReply({})
                }
              }
            } else {
              if (lastestComment.role === 'Guest') {
                if (['REP_SENT', 'AME_SENT'].includes(lastest.state)) {
                  lastest.showIconReply = false;
                  setSubmitLabel(true);
                } else if (['AME_DRF', 'REP_DRF'].includes(lastest.state)) {
                  setSubmitLabel(false);
                }
              } else {
                if (['REP_SENT'].includes(lastest.state)) {
                  lastest.showIconReply = true;
                  lastest.showIconEdit = false;
                  setSubmitLabel(false);
                  setStateReplyDraft(false);
                  setTempReply({});
                }
              }
              if (['UPLOADED'].includes(lastest.state)) {
                setStateReplyDraft(false);
                setStateReplyDraft(false);
              } else if (['REOPEN_A'].includes(lastest.state)) {
                lastest.showIconReply = true;
                lastest.showIconEdit = false;
                setSubmitLabel(false);
                setStateReplyDraft(false);
              } else if (['REOPEN_Q'].includes(lastest.state)) {
                lastest.showIconReply = true;
                lastest.showIconEdit = false;
                setStateReplyDraft(false);
              }
              if (['REOPEN_A', 'REOPEN_Q'].includes(lastest.state)) {
                // is CM CD Amendment
                if (typeof lastest.content !== 'string') {
                  setIsReplyCDCM(true)
                }
                else {
                  setTempReply({})
                }
              }
            }
            if (isEditOriginalAmendment) {
              dispatch(InquiryActions.setContent({ ...content, [lastest.field]: lastest.content }));
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
              state: lastestComment[0]?.state,
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
                status: r.status,
                sentAt: r.sentAt,
                process: 'draft',
                state: r?.state,
              });
            });
            //
            const sortComments = [...comments].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
            if (sortComments.length && ['REOPEN_A', 'REOPEN_Q'].includes(sortComments[sortComments.length - 1].state)) {
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
          }
          setIsLoadedComment(true);
        })
        .catch((error) => handleError(dispatch, error));
    }

    return () => {
      isUnmounted = true;
      dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    }
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
      const optionsInquires = [...inquiries];
      const editedIndex = optionsInquires.findIndex(inq => currentQuestion.id === inq.id);
      quest.answerObj.forEach(ans => {
        ans.confirmed = false;
        if (ans.id === optionsInquires[editedIndex].selectChoice?.answer) {
          ans.confirmed = true;
        }
      })
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
    const currentEditInq = optionsInquires[editedIndex];
    //
    const answersObj = quest.answerObj;
    if (currentEditInq.paragraphAnswer) {
      // update paragraph answer
      if (answersObj.length) {
        quest.answerObj[0].content = currentEditInq.paragraphAnswer.content;
      } else {
        const objectContent = {
          content: currentEditInq.paragraphAnswer.content,
        }
        answersObj.push(objectContent)
      }
    } else if (currentEditInq.selectChoice) {
      if (answersObj.length) {
        // update choice answer
        answersObj.forEach((item, i) => {
          answersObj[i].confirmed = false;
        });
        const answerIndex = answersObj.findIndex((item) => item.id === currentEditInq.selectChoice.answer);
        const answerUpdate = answersObj[answerIndex];
        answerUpdate.confirmed = true;
        quest.answerObj = answersObj;
      }
    }
    //
    setQuestion({ ...quest, mediaFilesAnswer: currentEditInq.mediaFilesAnswer });
  }

  useEffect(() => {
    updateQuestionFile()
  }, [isUploadFile, isRemoveFile]);

  useEffect(() => {
    question?.state !== 'OPEN' && setAllowDeleteInq(false);
    if (!['REOPEN_A', 'REOPEN_Q'].includes(question.state)) {
      setDisableReopen(false);
    }
  }, [question]);

  const resetInquiry = () => {
    const optionsInquires = [...inquiries];
    optionsInquires.forEach(op => op.showIconAttachFile = false);
    optionsInquires.forEach(op => op.showIconReply = false);
    optionsInquires.forEach(op => op.showIconAttachAnswerFile = false);
    optionsInquires.forEach(op => {
      if (['OPEN', 'INQ_SENT', 'REP_SENT'].includes(op.state)) {
        op.showIconReply = true;
        op.showIconEditInq = true;
      } else if (['ANS_DRF', 'ANS_SENT'].includes(op.state)) {
        op.showIconEdit = true;
      }
    });
    dispatch(InquiryActions.setInquiries(optionsInquires));
    //
  }

  const getTypeCDCM = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  useEffect(() => {
    resetInquiry();
    ['INQ_SENT', 'ANS_DRF'].includes(question.state) ? setShowLabelSent(true) : setShowLabelSent(false);
    isDisableBtnUpload();
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
          const isEmptyInq = optionsOfQuestion.filter(op => op.process === 'pending');
          if (!isEmptyInq.length) {
            (field === 'INQUIRY_LIST') && dispatch(FormActions.toggleAllInquiry(false));
            dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BX", "")) //BX: Delete all inquiries draft
          }
          dispatch(InquiryActions.checkSubmit(!enableSubmit));
        })
        .catch((error) => handleError(dispatch, error));
    } else if (confirmPopupType === 'removeReplyAmendment' && replyRemove) {
      deleteDraftBLReply(replyRemove?.draftId, replyRemove.field, myBL.id)
        .then((res) => {
          // update mediaFile in inquiries
          const optionsInquires = [...inquiries];
          const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
          const newMediaFile = comment.at(-2).answersMedia.filter(({ id: id1 }) => !comment.at(-1).answersMedia.some(({ id: id2 }) => id2 === id1));
          const removeMediaFile = comment.at(-1).answersMedia.filter(({ id: id1 }) => !comment.at(-2).answersMedia.some(({ id: id2 }) => id2 === id1)).map(({ id }) => id);
          optionsInquires[editedIndex].createdAt = res.updatedAt;
          optionsInquires[editedIndex].mediaFile = optionsInquires[editedIndex].mediaFile.filter(inq => !removeMediaFile.includes(inq.id));
          optionsInquires[editedIndex].mediaFile.push(...newMediaFile);
          dispatch(InquiryActions.setInquiries(optionsInquires));

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
          if (res) {
            setEditOriginalAmendment(res.isEditOriginalAmendment);
            setViewDropDown('');
            setDisableSaveReply(false);
            const optionsOfQuestion = [...inquiries];
            const removeAmendment = optionsOfQuestion.filter(inq => inq.field === question.field && inq.process === 'draft');
            let removeIndex = -1;
            if (removeAmendment.length) {
              removeIndex = optionsOfQuestion.findIndex(inq => inq.id === removeAmendment[0].id);
            }
            const inquiriesByField = optionsOfQuestion.filter(inq => inq.field === question.field && inq.process === 'pending');
            if (res.checkEmpty) {
              if (removeIndex !== -1) optionsOfQuestion.splice(removeIndex, 1);
              // remove all cd cm amendment
              if (res.removeAllCDCM) {
                getBlInfo(myBL.id).then((res) => {
                  if (res) {
                    const { content } = res.myBL;
                    dispatch(InquiryActions.setContent({ ...content, [containerCheck[0]]: content[containerCheck[0]], [containerCheck[1]]: content[containerCheck[1]] }));
                  }
                })
              } else {
                const response = res.drfAnswersTrans && res.drfAnswersTrans.length ? res.drfAnswersTrans : orgContent[question.field];
                dispatch(InquiryActions.setContent({ ...content, [question.field]: response }));
              }
              if (field !== 'INQUIRY_LIST') {
                if (!inquiriesByField.length) dispatch(InquiryActions.setOneInq({}));
              } else {
                const draftBl = optionsOfQuestion.filter(inq => inq.process === 'draft');
                if (!draftBl.length) {
                  dispatch(FormActions.toggleAllInquiry(false));
                  dispatch(FormActions.toggleAmendmentsList(false));
                  dispatch(FormActions.toggleOpenNotificationAmendmentList(true));
                }
              }
              dispatch(InquiryActions.setInquiries(optionsOfQuestion));
            } else {
              if (res.checkReplyEmpty) {
                if (removeIndex !== -1) optionsOfQuestion[removeIndex].state = user.role === 'Admin' ? 'AME_SENT' : 'REP_SENT';
                dispatch(InquiryActions.setInquiries(optionsOfQuestion));
              }
              //
              const idCD = metadata.field[CONTAINER_DETAIL];
              const idCM = metadata.field[CONTAINER_MANIFEST];
              if (res.drfAnswersTrans && question.state.includes('AME_')) {
                if (idCD === question.field) {
                  let cm = content[containerCheck[1]]
                  if (cm) {
                    cm[0][getTypeCDCM(CONTAINER_NUMBER)] = res.drfAnswersTrans[0][getTypeCDCM(CONTAINER_NUMBER)];
                    CONTAINER_LIST.cdNumber.map((key, index) => {
                      cm[0][getTypeCDCM(CONTAINER_LIST.cmNumber[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                    });
                    CONTAINER_LIST.cdUnit.map((key, index) => {
                      cm[0][getTypeCDCM(CONTAINER_LIST.cmUnit[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                    });
                    content[containerCheck[1]] = cm;
                    saveEditedField({ field: containerCheck[1], content: { content: cm, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'deleteAmendment' })
                      .then(res => {
                        if (res && res.removeAmendment) {
                          const removeAmendment = optionsOfQuestion.filter(inq => inq.field === containerCheck[1] && inq.process === 'draft');
                          if (removeAmendment.length) {
                            const removeIndex = optionsOfQuestion.findIndex(inq => inq.id === removeAmendment[0].id);
                            if (removeIndex !== -1) optionsOfQuestion.splice(removeIndex, 1);
                          }
                          dispatch(InquiryActions.setInquiries(optionsOfQuestion));
                        }
                      })
                      .catch((err) => handleError(dispatch, err));
                  }
                } else if (idCM === question.field) {
                  let cd = content[containerCheck[0]]
                  if (cd) {
                    cd[0][getTypeCDCM(CONTAINER_NUMBER)] = res.drfAnswersTrans[0][getTypeCDCM(CONTAINER_NUMBER)];
                    CONTAINER_LIST.cmNumber.map((key, index) => {
                      cd[0][getTypeCDCM(CONTAINER_LIST.cdNumber[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                    });
                    CONTAINER_LIST.cmUnit.map((key, index) => {
                      cd[0][getTypeCDCM(CONTAINER_LIST.cdUnit[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                    });
                    content[containerCheck[0]] = cd;
                    saveEditedField({ field: containerCheck[0], content: { content: cd, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'deleteAmendment' })
                      .then(res => {
                        if (res && res.removeAmendment) {
                          const removeAmendment = optionsOfQuestion.filter(inq => inq.field === containerCheck[0] && inq.process === 'draft');
                          if (removeAmendment.length) {
                            const removeIndex = optionsOfQuestion.findIndex(inq => inq.id === removeAmendment[0].id);
                            if (removeIndex !== -1) optionsOfQuestion.splice(removeIndex, 1);
                          }
                          dispatch(InquiryActions.setInquiries(optionsOfQuestion));
                        }
                      })
                      .catch((err) => handleError(dispatch, err));
                  }
                }
                if (res.emptyCDorCMAmendment) {
                  if (removeIndex !== -1) optionsOfQuestion.splice(removeIndex, 1);
                  dispatch(InquiryActions.setContent({ ...content, [question.field]: res.drfAnswersTrans }));
                  if (field !== 'INQUIRY_LIST') {
                    if (!inquiriesByField.length) dispatch(InquiryActions.setOneInq({}));
                  } else {
                    const draftBl = optionsOfQuestion.filter(inq => inq.process === 'draft');
                    if (!draftBl.length) {
                      dispatch(FormActions.toggleAllInquiry(false));
                      dispatch(FormActions.toggleAmendmentsList(false));
                    }
                  }
                  dispatch(InquiryActions.setInquiries(optionsOfQuestion));
                }
              }
            }
            setReplyRemove();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            dispatch(InquiryActions.addAmendment());
            props.getUpdatedAt();
          }
          // setSaveComment(!isSaveComment);
        }).catch((error) => handleError(dispatch, error));
    } else if (confirmPopupType === 'removeReplyInquiry' && replyRemove) {
      deleteComment(replyRemove?.draftId, replyRemove.id)
        .then((res) => {
          if (res) {
            const optionsOfQuestion = [...inquiries];
            const indexQuestion = optionsOfQuestion.findIndex(inq => inq.id === replyRemove.id);
            if (res.isOldestReply) {
              if (indexQuestion !== -1) {
                if (metadata.ans_type.paragraph === optionsOfQuestion[indexQuestion].ansType && optionsOfQuestion[indexQuestion].answerObj && optionsOfQuestion[indexQuestion].answerObj.length) {
                  setDeleteAnswer({ status: true, content: optionsOfQuestion[indexQuestion].answerObj[0].content });
                }
              }
              if (!res.statePrev) {
                optionsOfQuestion[indexQuestion].state = 'ANS_SENT';
              } else {
                optionsOfQuestion.splice(indexQuestion, 1);
              }
            }
            if (res.response.type) {
              setDeleteAnswer({ status: true, content: res.response.content || '' });
              if (!res.response.content) {
                optionsOfQuestion[indexQuestion].mediaFilesAnswer = [];
              }
              if (res.response.type === 'paragraph') {
                if (res.response.content) {
                  optionsOfQuestion[indexQuestion].mediaFilesAnswer = res.response.mediaFilesAnswer;
                  optionsOfQuestion[indexQuestion].paragraphAnswer = {
                    inquiry: question.id,
                    content: res.response.content,
                  };
                } else {
                  optionsOfQuestion[indexQuestion].state = 'INQ_SENT';
                  optionsOfQuestion[indexQuestion].answerObj = [];
                }
              }
              else if (res.response.type === 'choice') {
                if (res.response.content) {
                  optionsOfQuestion[indexQuestion].mediaFilesAnswer = res.response.mediaFilesAnswer;
                  optionsOfQuestion[indexQuestion].selectChoice = {
                    inquiry: question.id,
                    answer: res.response.content,
                    confirmed: true
                  };
                } else {
                  optionsOfQuestion[indexQuestion].state = 'INQ_SENT';
                }
              }
            }
            dispatch(InquiryActions.setInquiries(optionsOfQuestion));
            setReplyRemove();
            setDisableSaveReply(false);
            props.getUpdatedAt();
            setViewDropDown('');
          }
        })
        .catch((error) => handleError(dispatch, error));
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
    if (!openConfirmPopup) setReplyRemove();
  }, [openConfirmPopup]);

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
    } else {
      setTextResolve(content[question.field] || '');
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
    let confirmPopupType = 'removeReplyAmendment';
    let confirmPopupMsg = 'Are you sure you want to remove this amendment?';
    if (comment.length > 2 || question.process === 'pending') {
      confirmPopupMsg = 'Are you sure you want to delete this reply?';
    }
    if (tempReply.answer) {
      question.draftId = tempReply.answer.id;
    }
    if (question.process === 'pending') {
      confirmPopupType = 'removeReplyInquiry';
    }
    setReplyRemove(question);
    dispatch(
      FormActions.openConfirmPopup({
        openConfirmPopup: true,
        confirmPopupMsg,
        confirmPopupType
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

  const handleValidateInput = async (type, confirm = null, isWrapText = false, isLostFocus = false) => {
    // Check if no CM/CD
    if (['string'].includes(typeof textResolve)) {
      let textInput = tempReply?.answer?.content.trim() || '';
      if (isSeparate && !['REPLY'].includes(type)) {
        textInput = `${textResolveSeparate.name}\n${textResolveSeparate.address}`;
      } else if (!['REPLY'].includes(type)) {
        textInput = textResolve.trim();
      }

      const { isWarning, prohibitedInfo } = await validateTextInput({ textInput, dest: myBL.bkgNo }).catch(err => handleError(dispatch, err));
      if (isWarning) {
        dispatch(FormActions.validateInput({ isValid: false, prohibitedInfo, handleConfirm: confirm }));
        setDisableAcceptResolve(false);
      } else {
        !isLostFocus && confirm && confirm(isWrapText);
      }
    } else {
      !isLostFocus && confirm && confirm(isWrapText);
    }
  }

  const autoSendMailResolve = (inquiries, type, process) => {
    const check = inquiries.filter(inq => inq.process === process && inq.receiver[0] === type);
    if (check.every(inq => ['COMPL', 'RESOLVED'].includes(inq.state))) {
      const ids = []
      check.forEach(inq => {
        const find = metadata?.field_options.find(field => field.value === inq.field);
        ids.push({ id: inq.id, field: find.label })
      })
      sendmailResolve({ type: type === 'customer' ? 'Customer' : 'Onshore', myBL, user, content, ids, process })
        .catch(err => handleError(dispatch, err));
    }
  }

  const validationCDCMContainerNo = (contsNo) => {
    const warningLeast1CM = [];
    const warningCmsNotInCD = [];
    // Validation container number must include at least one C/M.
    if (question.field === getField(CONTAINER_DETAIL)) {
      let cmOfCdContainerNo = [...new Set((content[getField(CONTAINER_MANIFEST)] || []))].map(cm => cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
      contsNo.forEach((containerNo, index) => {
        if (cmOfCdContainerNo.length && !cmOfCdContainerNo.includes(containerNo)) {
          warningLeast1CM.push({ containerNo, row: index + 1 });
        }
      })
    } else if (question.field === getField(CONTAINER_MANIFEST)) {
      // Validation The C/M below does not match any container numbers that already exist in C/D
      let cdOfCmContainerNo = [...new Set((content[getField(CONTAINER_DETAIL)] || []))].map(cm => cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
      contsNo.forEach((containerNo, index) => {
        if (cdOfCmContainerNo.length && !cdOfCmContainerNo.includes(containerNo)) {
          warningCmsNotInCD.push({ containerNo, row: index + 1 });
        }
      });
    }
    if (warningLeast1CM.length) {
      dispatch(AppAction.showMessage({ message: 'A container number must include at least one C/M. Please check again the container numbers below', variant: 'warning' }));
    }
    if (warningCmsNotInCD.length) {
      dispatch(AppAction.showMessage({ message: `Container Manifest doesn't match with Container Details`, variant: 'warning' }));
    }
  }

  const onConfirm = (isWrapText = false) => {
    let contentField = '';
    const contsNoChange = {};
    if (!validationCDCM) {
      setDisableAcceptResolve(false);
      return;
    }
    if (isSeparate) {
      contentField = `${textResolveSeparate.name.toUpperCase().trim()}\n${textResolveSeparate.address.toUpperCase().trim()}`;
    } else if (typeof textResolve === 'string') {
      contentField = textResolve.toUpperCase().trim();
    } else {
      contentField = textResolve;
      const orgContentField = content[question.field];
      const contsNo = [];
      contentField.forEach((obj, index) => {
        const getTypeName = Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === question.inqType);
        if (getTypeName === CONTAINER_NUMBER) {
          contsNo.push(obj?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
          const containerNo = orgContentField[index][question.inqType];
          contsNoChange[containerNo] = obj[question.inqType];
          obj[question.inqType] = formatContainerNo(obj[question.inqType]);
        }
        if (getTypeName === CONTAINER_SEAL) {
          obj[question.inqType] = obj[question.inqType].map(seal => seal.toUpperCase().trim())
        } else if (obj[question.inqType]) {
          obj[question.inqType] = (typeof obj[question.inqType] === 'string') ? obj[question.inqType].toUpperCase().replace(/^0*/g, "").trim() : obj[question.inqType];
        }
      });

      validationCDCMContainerNo(contsNo);
    }

    const body = {
      fieldId: question.field,
      inqId: question?.id || tempReply?.answer.id,
      fieldContent: contentField,
      blId: myBL.id,
      contsNoChange,
      fieldNameContent: textResolveSeparate.name.toUpperCase().trim() || '',
      fieldAddressContent: textResolveSeparate.address.toUpperCase().trim() || '',
      isWrapText
    };
    if (containerCheck.includes(question.field)) {
      setIsResolveCDCM(true);
    }
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    resolveInquiry(body)
      .then((res) => {
        // setQuestion((q) => ({ ...q, state: 'COMPL' }));
        optionsInquires[editedIndex].state = 'COMPL';
        optionsInquires[editedIndex].createdAt = res.updatedAt;
        const receiver = optionsInquires[editedIndex].receiver[0];
        const process = optionsInquires[editedIndex].process;
        if (process === 'draft') {
          const optionsMinimize = [...listMinimize];
          const index = optionsMinimize.findIndex((e) => e.id === optionsInquires[editedIndex].id);
          optionsMinimize[index].id = res.id;
          optionsInquires[editedIndex].id = res.id;
          dispatch(InquiryActions.setListMinimize(optionsMinimize));
        }
        //auto send mail if every inquiry is resolved
        autoSendMailResolve(optionsInquires, receiver, process);

        dispatch(InquiryActions.setInquiries(optionsInquires));
        dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
        props.getUpdatedAt();
        setIsResolve(false);
        setIsResolveCDCM(false);
        setViewDropDown('');
        if (!isSeparate) {
          if (containerCheck.includes(question.field)) {
            setQuestion((q) => ({ ...q, content: contentField }));
            dispatch(InquiryActions.setContent({ ...res.content }));
          }
          else dispatch(InquiryActions.setContent({
            ...content,
            [question.field]: contentField,
            [metadata.field[DESCRIPTION_OF_GOODS]]: res.content[metadata.field[DESCRIPTION_OF_GOODS]]
          }));
        } else {
          const contentWrapText = res?.contentWrapText || '';
          const arrFields = [SHIPPER, CONSIGNEE, NOTIFY];
          const fieldIndex = arrFields.findIndex(key => metadata.field[key] === question.field);
          // setContent here
          dispatch(InquiryActions.setContent({
            ...content,
            [metadata.field?.[`${arrFields[fieldIndex]}Address`]]: isWrapText ? (contentWrapText.fieldAddressContentWrap || '') : textResolveSeparate.address.trim(),
            [metadata.field?.[`${arrFields[fieldIndex]}Name`]]: isWrapText ? (contentWrapText.fieldNameContentWrap || '') : textResolveSeparate.name.trim(),
            [question.field]: isWrapText ? `${contentWrapText.fieldNameContentWrap}\n${contentWrapText.fieldAddressContentWrap}` : contentField,
            [metadata.field[DESCRIPTION_OF_GOODS]]: res.content[metadata.field[DESCRIPTION_OF_GOODS]]
          }));
        }
        // setSaveComment(!isSaveComment);
        setStateReplyDraft(false);
        setDisableAcceptResolve(false);
        setDisableReopen(false);
      })
      .catch((error) => handleError(dispatch, error));
  };

  const onUpload = () => {
    dispatch(FormActions.isLoadingProcess(true));
    const optionsInquires = [...inquiries];
    const idUpload = question.process === 'pending' ? question.id : tempReply?.answer?.id;
    uploadOPUS(myBL.id, idUpload, question.field, inqAnsId)
      .then((res) => {
        if (res && res.status === 'F') {
          // dispatch(FormActions.toggleWarningUploadOpus({ status: true, message: res.message, icon: 'failed' }));
          dispatch(AppAction.showMessage({ message: res.message, variant: 'error' }));
        } else {
          setQuestion((q) => ({ ...q, state: 'UPLOADED' }));
          // Update State list separate
          if (res.fieldsChangesState?.length) {
            res.fieldsChangesState.forEach(item => {
              if (item.process === 'pending') {
                let inqIndex = optionsInquires.findIndex(inq => inq.id === item.id);
                optionsInquires[inqIndex].state = 'UPLOADED';
              } else {
                let amendIndex = optionsInquires.findIndex(inq => ((inq.field === item.id) && (inq.process === 'draft')));
                optionsInquires[amendIndex].state = 'UPLOADED';
              }
            });
          }
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
              if (optionAmendment[editedAmeIndex]) {
                optionAmendment[editedAmeIndex].state = 'UPLOADED';
                dispatch(InquiryActions.setListCommentDraft(optionAmendment));
              }
            }
          }
          // Set new Content when EBL has new data
          if (res?.newData) {
            dispatch(InquiryActions.setContent({ ...content, ...res.newData }));
          }
          if (res.warning) {
            // dispatch(FormActions.toggleWarningUploadOpus({ status: true, message: res.warning, icon: 'warning' }));
            dispatch(AppAction.showMessage({ message: res.warning, variant: 'warning' }));
          } else {
            // dispatch(FormActions.toggleWarningUploadOpus({ status: true, message: 'Upload to OPUS successfully', icon: 'success' }));
            dispatch(AppAction.showMessage({ message: 'Upload to OPUS successfully', variant: 'success' }));
          }
          const inqsPending = optionsInquires?.filter(inq => inq.process === 'pending' && inq.state !== 'COMPL');
          const inqsDraft = optionsInquires?.filter(inq => inq.process === 'draft' && inq.state !== 'COMPL');
          if (myBL.bkgNo) {
            if (optionsInquires[editedInqIndex].process === "pending" && inqsPending.length > 0 && inqsPending.every(q => ['UPLOADED'].includes(q.state))) {
              if (optionsInquires[editedInqIndex].receiver.includes('customer') && inqsPending.filter(q => q.receiver.includes('customer')).length > 0) {
                // BL Inquired Resolved (BR), Upload all to Opus. RO: Return to Customer via BLink
                dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BR", "RO"))
              }
              if (optionsInquires[editedInqIndex].receiver.includes('onshore') && inqsPending.filter(q => q.receiver.includes('onshore')).length > 0) {
                //BL Inquired Resolved (BR) , Upload all to Opus.  RW: Return to Onshore via BLink
                dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BR", "RW"))
              }
            }
            if (optionsInquires[editedInqIndex].process === "draft" && inqsDraft.length > 0 && inqsDraft.every(q => ['UPLOADED'].includes(q.state))) {
              // BL Amendment Success (BS), Upload all to Opus.
              dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BS", ""))
            }
          }
        }
        props.getUpdatedAt();
        setViewDropDown('');
      })
      .catch((error) => {
        // dispatch(FormActions.toggleWarningUploadOpus({ status: true, message: error, icon: 'failed' }));
        handleError(dispatch, error);
      })
      .finally(() => dispatch(FormActions.isLoadingProcess(false)));
  };

  const cancelResolve = () => {
    dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    setTextResolve(content[question.field] || '');
    setIsResolve(false);
    setIsResolveCDCM(false);
    setTempReply({});
    setPristine()
  };

  const inputText = (e) => {
    !validateInput?.isValid && dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    setTextResolve(e.target.value);
    setDirty()
  };

  const inputTextSeparate = (e, type) => {
    setDirty()
    !validateInput?.isValid && dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    setTextResolveSeparate(Object.assign({}, textResolveSeparate, { [type]: e.target.value }));
  };

  const handleChangeContentReply = (e, type = '') => {
    let value = e.target.value;
    if (['name', 'address'].includes(type)) {
      let content = tempReply?.answer?.content ? JSON.parse(tempReply?.answer?.content) : { name: '', address: '' };
      content[type] = e.target.value;
      value = JSON.stringify(content);
    }

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
    setDirty()
  };

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
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
        content: tempReply?.answer?.content || '',
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
    setDisableSaveReply(true);
    setPristine()
    const mediaListId = [];
    let mediaListAmendment = [];
    const mediaRest = [];
    let mediaFilesResp;
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    const newMediaFile = [];
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
      if (formData.get('files')) mediaFilesResp = await uploadFile(formData).catch((err) => handleError(dispatch, err));
      if (mediaFilesResp) {
        const { response } = mediaFilesResp;
        response.forEach((file) => {
          const media = { id: file.id };
          mediaListId.push(media);
          newMediaFile.push({ id: file.id, ext: file.ext, name: file.name });
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
          answer: {
            content: ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim() || ONLY_ATT) : (tempReply.answer.content || ONLY_ATT),
            type: tempReply.answer.type
          },

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
            // optionsInquires[editedIndex].mediaFilesAnswer = mediaListAmendment;
            if (mediaListAmendment.length) optionsInquires[editedIndex].mediaFilesAnswer.push(...mediaListAmendment);
            dispatch(InquiryActions.setInquiries(optionsInquires));
            props.getUpdatedAt();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            dispatch(InquiryActions.checkSend(true));
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
            setViewDropDown('');
            setDisableSaveReply(false);
          }).catch((error) => handleError(dispatch, error));
      } else {
        // Edit
        const reqReply = {
          content: ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim() || ONLY_ATT) : (tempReply.answer.content || ONLY_ATT),
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
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            // if (props.isInquiryDetail) {
            //   setSaveComment(!isSaveComment);
            // }
            //
            dispatch(InquiryActions.checkSend(true));
            setDisableSaveReply(false);
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
          }).catch((error) => handleError(dispatch, error));
      }
    } else {
      if (!tempReply.answer?.id) { // Create amendment / reply
        const reqReply = {
          field: question.field,
          content: {
            content: ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim() || ONLY_ATT) : (tempReply.answer.content || ONLY_ATT),
            mediaFile: mediaListAmendment
          },
          mybl: myBL.id
        };
        saveEditedField({ ...reqReply })
          .then((res) => {
            optionsInquires[editedIndex].createdAt = res.createdAt;
            if (question.state.includes('AME_')) {
              dispatch(InquiryActions.setContent({
                ...content,
                [question.field]: question.content
              }));
              optionsInquires[editedIndex].state = 'AME_DRF';
            } else {
              optionsInquires[editedIndex].state = 'REP_DRF';
            }
            dispatch(InquiryActions.setInquiries(optionsInquires));
            props.getUpdatedAt();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            setDisableSaveReply(false);
            dispatch(AppAction.showMessage({ message: 'Save Reply successfully', variant: 'success' }));
            dispatch(InquiryActions.setNewAmendment({ oldAmendmentId: question.id, newAmendment: res.newAmendment }));
          })
          .catch((error) => handleError(dispatch, error));
      }
      else { // Edit amendment / reply
        let newContent = tempReply.answer.content || (question.state === 'AME_DRF' ? NO_CONTENT_AMENDMENT : ONLY_ATT);
        if (newContent && typeof newContent === "string") {
          if (isJsonText(newContent)) {
            const parseContent = JSON.parse(newContent);
            parseContent.name = parseContent.name.toUpperCase().trim();
            parseContent.address = parseContent.address.toUpperCase().trim();
            if (question.state === 'AME_DRF' && parseContent.name === '' && parseContent.address === '') parseContent.name = NO_CONTENT_AMENDMENT;
            newContent = JSON.stringify(parseContent);
          }
          else {
            newContent = newContent.trim() || (question.state === 'AME_DRF' ? NO_CONTENT_AMENDMENT : ONLY_ATT);
            if (!isReply || question.state.includes('AME_')) newContent = newContent.toUpperCase();
          }
        }

        const reqReply = {
          field: question.field,
          content: {
            content: newContent,
            mediaFile: mediaListAmendment
          },
          mybl: myBL.id
        };

        updateDraftBLReply({ ...reqReply }, tempReply.answer?.id).then((res) => {
          if (res) {
            dispatch(InquiryActions.setNewAmendment({ newAmendment: res.newAmendment }));
          }
          optionsInquires[editedIndex].mediaFile = mediaListAmendment;
          optionsInquires[editedIndex].createdAt = res.createdAt;
          setDisableSaveReply(false);
          if (question.state.includes('AME_')) {
            dispatch(InquiryActions.setContent({
              ...content,
              [res.newAmendment?.field]: newContent
            }));
            if (containerCheck.includes(question.field)) {
              //CASE 1-1 CD CM
              if (tempReply.answer.content.length === 1 && content[question.field === getField(CONTAINER_DETAIL) ? containerCheck[1] : containerCheck[0]].length === 1) {
                let fieldCdCM = question.field === getField(CONTAINER_DETAIL) ? containerCheck[1] : containerCheck[0];
                let arr = content[fieldCdCM]
                if (arr.length > 0) {
                  arr[0][getType(CONTAINER_NUMBER)] = tempReply.answer.content[0][getType(CONTAINER_NUMBER)];
                  if (question.field === getField(CONTAINER_DETAIL)) {
                    CONTAINER_LIST.cdNumber.map((key, index) => {
                      arr[0][getType(CONTAINER_LIST.cmNumber[index])] = tempReply.answer.content[0][getType(key)];
                    });
                    CONTAINER_LIST.cdUnit.map((key, index) => {
                      arr[0][getType(CONTAINER_LIST.cmUnit[index])] = tempReply.answer.content[0][getType(key)];
                    });
                  } else {
                    CONTAINER_LIST.cmNumber.map((key, index) => {
                      arr[0][getType(CONTAINER_LIST.cdNumber[index])] = tempReply.answer.content[0][getType(key)];
                    });
                    CONTAINER_LIST.cmUnit.map((key, index) => {
                      arr[0][getType(CONTAINER_LIST.cdUnit[index])] = tempReply.answer.content[0][getType(key)];
                    });
                  }
                  content[fieldCdCM] = arr;
                  saveEditedField({ field: fieldCdCM, content: { content: arr, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'editAmendment' });
                }
              }
              // MULTIPLE CASE CD CM
              else {
                let contsNoChange = {}
                const contsNo = [];
                const orgContentField = content[question.field];
                const contentField = tempReply.answer.content;
                contentField.forEach((obj, index) => {
                  const containerNo = orgContentField[index][getType(CONTAINER_NUMBER)];
                  const getTypeName = Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === getType(CONTAINER_NUMBER));
                  if (getTypeName === CONTAINER_NUMBER && containerNo !== obj[getType(CONTAINER_NUMBER)]) {
                    contsNoChange[containerNo] = obj[getType(CONTAINER_NUMBER)];
                  }
                })
                const fieldCdCM = question.field === getField(CONTAINER_DETAIL) ? containerCheck[1] : containerCheck[0];
                const fieldAutoUpdate = content[fieldCdCM];
                if (fieldAutoUpdate) {
                  if (question.field === getField(CONTAINER_DETAIL)) {
                    if (fieldAutoUpdate.length) {
                      fieldAutoUpdate.map((item) => {
                        if (item[getType(CONTAINER_NUMBER)] in contsNoChange) {
                          item[getType(CONTAINER_NUMBER)] = contsNoChange[item[getType(CONTAINER_NUMBER)]];
                        }
                      })
                    }
                    content[fieldCdCM] = fieldAutoUpdate;
                    contentField.forEach((cd) => {
                      let cmOfCd = [...new Set((fieldAutoUpdate || []).filter(cm =>
                        cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
                      ))]
                      if (cmOfCd.length === 1) {
                        CONTAINER_LIST.cdNumber.map((key, index) => {
                          cmOfCd[0][getType(CONTAINER_LIST.cmNumber[index])] = cd[getType(key)];
                        });
                        CONTAINER_LIST.cdUnit.map((key, index) => {
                          cmOfCd[0][getType(CONTAINER_LIST.cmUnit[index])] = cd[getType(key)];
                        });
                      }
                    })
                  }
                  if (question.field === getField(CONTAINER_MANIFEST)) {
                    fieldAutoUpdate.forEach((cd) => {
                      let cmOfCd = [...new Set((contentField || []).filter(cm =>
                        cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
                      ))]
                      if (cmOfCd.length > 0) {
                        CONTAINER_LIST.cmNumber.map((key, index) => {
                          let total = 0;
                          cmOfCd.map((cm) => {
                            total += parseFloat(cm[getType(key)]);
                          });
                          cd[getType(CONTAINER_LIST.cdNumber[index])] = parseFloat(total.toFixed(3));
                        });
                      }
                    })
                  }
                  saveEditedField({ field: fieldCdCM, content: { content: fieldAutoUpdate, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'editAmendment' });
                }
                validationCDCMContainerNo(contsNo)
              }
            }
            optionsInquires[editedIndex].state = 'AME_DRF';
          } else {
            optionsInquires[editedIndex].state = 'REP_DRF';
          }

          dispatch(InquiryActions.setInquiries(optionsInquires));
          props.getUpdatedAt();
          dispatch(InquiryActions.checkSubmit(!enableSubmit));
        }).catch((err) => handleError(dispatch, err));
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
      setTempReply({})
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
    setShowViewAll(false);
    if (['ANS_DRF', 'ANS_SENT'].includes(question.state) || (user.role === 'Guest' && ['REP_Q_DRF'].includes(question.state))) {
      optionsInquires[editedIndex].showIconEdit = false;
      optionsInquires[editedIndex].showIconReply = false;
      optionsInquires[editedIndex].showIconAttachReplyFile = false;
      optionsInquires[editedIndex].showIconAttachAnswerFile = true;
      dispatch(InquiryActions.setInquiries(optionsInquires));
      reply.showIconAttachReplyFile = false;
      reply.showIconAttachAnswerFile = true;
      // if (props.question.answerObj.length) reply.answerObj = props.question.answerObj;
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
          setIsResolve(false);
          setIsResolveCDCM(false);
          // setSaveComment(!isSaveComment);
          dispatch(
            AppAction.showMessage({ message: 'Update inquiry successfully', variant: 'success' })
          );
        }
      })
      .catch((error) => handleError(dispatch, error));
  };

  useEffect(() => {
    const el = document.getElementById(question.id);
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

  // Text Helper for separate fields
  const renderTextHelper = (type) => {
    let isErr = false, textHelper = '', prohibitedInfo = { countries: [], danger_cargo: [] };
    const countries = validateInput?.prohibitedInfo?.countries ? validateInput?.prohibitedInfo?.countries : [];
    const dangerCargo = validateInput?.prohibitedInfo?.countries ? validateInput?.prohibitedInfo?.danger_cargo : [];
    countries.forEach(text => {
      if (textResolveSeparate[type].toUpperCase().includes(text)) {
        prohibitedInfo.countries.push(text);
        isErr = true;
      }
    });
    dangerCargo.forEach(text => {
      if (textResolveSeparate[type].toUpperCase().includes(text)) {
        prohibitedInfo.danger_cargo.push(text);
        isErr = true;
      }
    });
    // Check for each case NAME || ADDRESS
    if (isErr) {
      textHelper = (<>
        {(prohibitedInfo?.countries.length > 0) &&
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <ErrorOutlineOutlined fontSize='small' />
            &nbsp;{`Countries: ${prohibitedInfo?.countries.join(', ')}`}
          </span>
        }
        {(prohibitedInfo?.danger_cargo.length > 0) &&
          <>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <ErrorOutlineOutlined fontSize='small' />
              &nbsp;{`Danger Cargo: ${prohibitedInfo?.danger_cargo.join(', ')}`}
            </span>
          </>
        }
      </>)
    }

    return { isErr, textHelper };
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
            className={classes.inputText}
            value={textResolveSeparate[type]}
            multiline
            rows={['name'].includes(type) ? 2 : 3}
            onChange={(e) => inputTextSeparate(e, type, field)}
            variant='outlined'
            inputProps={{ style: { textTransform: 'uppercase' } }}
            error={
              renderTextHelper(type).isErr
              || validatePartiesContent(textResolveSeparate[type], type).isError}
            helperText={
              (!renderTextHelper(type).textHelper && validatePartiesContent(textResolveSeparate[type], type).isError) ? validatePartiesContent(textResolveSeparate[type], type).errorType.replace('{{fieldName}}', labelNameCapitalize) : ''
                || renderTextHelper(type).textHelper
            }
            onBlur={() => handleValidateInput('RESOLVE', onConfirm, true, true)}
          />
        </div>)
    } else {
      // TODO: Check WrapText for alsoNotify 1,2,3
      const isAlsoNotify = metadata.field[ALSO_NOTIFY] === field;
      return (
        <TextField
          className={classes.inputText}
          value={textResolve}
          multiline
          rows={3}
          onChange={inputText}
          variant='outlined'
          inputProps={{ style: { textTransform: 'uppercase' } }}
          error={!validateInput?.isValid || validateField(field, textResolve).isError || isAlsoNotify ? validateAlsoNotify(textResolve).isError : false}
          helperText={
            !validateInput?.isValid ?
              (<>
                {(validateInput?.prohibitedInfo?.countries.length > 0) &&
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <ErrorOutlineOutlined fontSize='small' />
                    &nbsp;{`Countries: ${validateInput?.prohibitedInfo?.countries.join(', ')}`}
                  </span>
                }
                {(validateInput?.prohibitedInfo?.danger_cargo.length > 0) &&
                  <>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorOutlineOutlined fontSize='small' />
                      &nbsp;{`Danger Cargo: ${validateInput?.prohibitedInfo?.danger_cargo.join(', ')}`}
                    </span>
                  </>
                }
              </>)
              : validateField(field, textResolve).errorType.split('\n').map((line, idx) => (
                <span key={idx} style={{ display: 'block', lineHeight: '20px' }}>{line}</span>
              ))
          }
          onBlur={() => handleValidateInput('RESOLVE', onConfirm, true, true)}
        />
      )
    }
  }

  return (
    <>
      {isLoadedComment && (
        <div onClick={() => dispatch(FormActions.inqViewerFocus(question.id))}>
          <div>
            {(question?.process === 'draft') &&
              <TagsComponent tagName='AMENDMENT' tagColor='primary' />
            }
            <div style={{ paddingTop: 10 }} className="flex justify-between">
              <UserInfo
                name={question.creator?.userName}
                time={displayTime(question.createdAt || question.updatedAt)}
                avatar={question.creator?.avatar}
                state={question.state}
                status={question.status}
              />
              {user.role === 'Admin' ? (
                <div className="flex items-center mr-2">
                  <PermissionProvider
                    action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}
                    extraCondition={(question.state === 'COMPL' || question.state === 'UPLOADED' || question.state === 'RESOLVED')}
                  >
                    <div className='flex' style={{ alignItems: 'center' }}>
                      <div style={{ marginRight: 15 }}>
                        <span className={classes.labelStatus}>{question.state === 'UPLOADED' ? 'Uploaded' : 'Resolved'}</span>
                      </div>
                      {listFieldDisableUpload.includes(question.field) ?
                        <div className={classes.btnBlockFields}>
                          Upload to OPUS
                          {
                            <Tooltip
                              title={'It is not allowed to upload this field, please revise information on OPUS manually.'}
                              placement='bottom-end'
                            >
                              <span>&nbsp;&nbsp;<img src="assets/images/icons/help.svg" alt="Help" style={{ paddingTop: '2px' }} /></span>
                            </Tooltip>
                          }
                        </div>
                        : <Button
                          disabled={question.state === 'UPLOADED' || listFieldDisableUpload.includes(question.field)}
                          variant="contained"
                          color="primary"
                          onClick={onUpload}
                          classes={{ root: classes.button }}
                        >
                          Upload to OPUS
                        </Button>
                      }
                    </div>
                  </PermissionProvider>
                  <div className='flex' style={{ alignItems: 'center' }}>
                    {/*.display time sent mail and label sent.*/}
                    <div style={{ marginRight: 15, display: 'flex' }}>
                      {showLabelSent && !['COMPL', 'UPLOADED', 'RESOLVED'].includes(question.state) && (
                        <>
                          <span className={clsx(classes.labelStatus, question.sentAt && classes.labelMargin)}>Sent</span>
                        </>
                      )}
                      {question.sentAt && (
                        <div className={classes.timeSent}>
                          <img alt={'vectorIcon'} src={`/assets/images/icons/vector2.svg`} />
                          <span className={classes.labelText}>{displayTime(question.sentAt)}</span>
                        </div>
                      )}
                    </div>
                    {/*..*/}

                    {showReceiver && <FormControlLabel classes={{ label: classes.labelDisabled }} control={<Radio checked disabled style={{ color: '#132535' }} />} label={question.receiver.includes('customer') ? "Customer" : "Onshore"} />}
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
                              <Tooltip title={'Edit'}>
                                <div onClick={() => handleEdit(question)}>
                                  <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                                </div>
                              </Tooltip>
                            </PermissionProvider>
                            {!['REP_SENT', 'AME_SENT', 'REP_Q_SENT', 'REP_A_SENT'].includes(question.state) && (
                              <Tooltip title="Delete">
                                <div style={{ marginLeft: '10px' }} onClick={() => removeReply(question)}>
                                  <img
                                    style={{ height: '22px', cursor: 'pointer' }}
                                    src="/assets/images/icons/trash.svg"
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
                    <Tooltip title="Edit">
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
                    <Tooltip title="Delete">
                      <div style={{ marginLeft: '10px' }} onClick={() => removeQuestion()}>
                        <img
                          style={{ height: '22px', cursor: 'pointer' }}
                          src="/assets/images/icons/trash.svg"
                        />
                      </div>
                    </Tooltip>
                  </PermissionProvider>
                </div>
              ) : (
                <div className='flex' style={{ alignItems: 'center' }}>
                  <div style={{ marginRight: 15, display: 'flex' }}>
                    {question.state === 'UPLOADED' ?
                      <span className={classes.labelStatus}>Uploaded</span> :
                      ['COMPL', 'RESOLVED'].includes(question.state) ?
                        <span className={classes.labelStatus}>Resolved</span> :
                        <>
                          {(['ANS_SENT'].includes(question.state) || submitLabel) && <span className={clsx(classes.labelStatus, question.sentAt && classes.labelMargin)}>Submitted</span>}
                          {question.sentAt && (
                            <div className={classes.timeSent}>
                              <img alt={'vectorIcon'} src={`/assets/images/icons/vector2.svg`} />
                              <span className={classes.labelText}>{displayTime(question.sentAt)}</span>
                            </div>
                          )}
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
                      {!['REP_SENT', 'AME_SENT', 'REP_Q_SENT', 'REP_A_SENT', 'ANS_SENT'].includes(question.state) && (
                        <Tooltip title="Delete">
                          <div style={{ marginLeft: '10px' }} onClick={() => removeReply(question)}>
                            <img
                              style={{ height: '22px', cursor: 'pointer' }}
                              src="/assets/images/icons/trash.svg"
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
                      <Tooltip title="Reply">
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
              ['RESOLVED', 'COMPL', 'UPLOADED', 'AME_DRF', 'AME_SENT', 'REOPEN_A', 'REOPEN_Q'].includes(question.state) && containerCheck.includes(question.field) ? (
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
                          originalValues={Array.isArray(question.content) ? question.content : question.contentCDCM}
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
                    originalValues={isJsonText(question.content) ? JSON.parse(question.content) : null}
                    validation={setValidationCDCM}
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
                  {/* Check is amendment JSON */}
                  {((question.content !== null) && isJsonText(question.content)) ?
                    `${JSON.parse(question.content).name}\n${JSON.parse(question.content).address}`
                    : `${question.content}`}
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
                    isDeleteAnswer={isDeleteAnswer}
                    setDeleteAnswer={() => {
                      setDeleteAnswer({ status: false, content: '' });
                    }}
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
                    isDeleteAnswer={isDeleteAnswer}
                    setDeleteAnswer={() => {
                      setDeleteAnswer({ status: false, content: '' });
                    }}
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
                    disabled={disableReopen}
                    onClick={() => {
                      setDisableReopen(true);
                      reOpen(question.process === 'draft' ? tempReply?.answer.id : question.id)
                    }}
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
                !['ANS_DRF', 'ANS_SENT'].includes(question.state) &&
                question.mediaFile?.map((file, mediaIndex) => (
                  <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                    {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                      <ImageAttach
                        file={file}
                        files={question.mediaFile}
                        hiddenRemove={true}
                        field={question.field}
                        indexInquiry={index}
                        style={{ margin: '2.5rem' }}
                      />
                    ) : (
                      <FileAttach
                        hiddenRemove={true}
                        file={file}
                        files={question.mediaFile}
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
                {question.mediaFilesAnswer?.length > 0 &&
                  !['ANS_DRF', 'ANS_SENT'].includes(question.state) &&
                  <h3>Attachment Answer:</h3>}
                {question.mediaFilesAnswer?.map((file, mediaIndex) => (
                  <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                    {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                      <ImageAttach
                        file={file}
                        field={question.field}
                        style={{ margin: '2.5rem' }}
                        files={question.mediaFilesAnswer}
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
                        files={question.mediaFilesAnswer}
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
                        originalValues={Array.isArray(question.content) ? question.content : question.contentCDCM}
                        setTextResolve={setTextResolve}
                      />
                      : <ContainerDetailFormOldVersion
                        container={
                          question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                        }
                        validation={setValidationCDCM}
                        question={question}
                        setTextResolve={setTextResolve}
                        setDirty={setDirty}
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
                          (isSeparate ?
                            (validatePartiesContent(textResolveSeparate.name, 'name')?.isError
                              || validatePartiesContent(textResolveSeparate.address, 'address')?.isError)
                            : validateField(question?.field, textResolve).isError) || disableAcceptResolve || !validationCDCM
                        }
                        color="primary"
                        onClick={() => {
                          setPristine()
                          setDisableAcceptResolve(true);
                          !validateInput?.isValid ? onConfirm() : handleValidateInput('RESOLVE', onConfirm)
                        }}
                        classes={{ root: clsx(classes.button, 'w120') }}>
                        Accept
                      </Button>
                      {
                        (isSeparate || isAlsoNotifies) &&
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setPristine()
                            !validateInput?.isValid ? onConfirm(true) : handleValidateInput('RESOLVE', onConfirm, true)
                          }}
                          classes={{ root: clsx(classes.button) }}>
                          Accept & Wrap Text
                        </Button>
                      }
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
                      {isReply && <div style={{ marginBottom: 15 }}>
                        {/* Edit Amendment by customer */}
                        {(isSeparate && (['AME_DRF', 'AME_SENT'].includes(question.state) && (user.role === 'Guest'))) ?
                          ['name', 'address'].map((type, index) => {
                            const labelName = Object.assign({}, ...[SHIPPER, CONSIGNEE, NOTIFY].map(key => ({ [metadata.field?.[key]]: key })))[question.field]
                            const content = (tempReply?.answer?.content) ? JSON.parse(tempReply?.answer?.content) : { name: '', address: '' };
                            return (
                              <div key={index} style={{ paddingTop: '15px' }}>
                                <label><strong>{`${labelName?.toUpperCase()} ${type.toUpperCase()}`}</strong></label>
                                <TextField
                                  className={classes.inputText}
                                  value={content[type] || ''}
                                  multiline
                                  rows={['name'].includes(type) ? 2 : 3}
                                  inputProps={{ style: { textTransform: 'uppercase' } }}
                                  onChange={(e) => handleChangeContentReply(e, type)}
                                  variant='outlined'
                                />
                              </div>
                            )
                          })
                          :
                          <TextField
                            className={classes.inputText}
                            value={tempReply?.answer?.content}
                            multiline
                            rows={2}
                            inputProps={{ style: question.state.includes("AME_") && user.role === 'Guest' ? { textTransform: 'uppercase' } : {} }}
                            InputProps={{
                              classes: { input: classes.placeholder }
                            }}
                            onChange={handleChangeContentReply}
                            variant='outlined'
                            placeholder='Reply...'
                            error={validateField(question.field, tempReply?.answer?.content).isError}
                            helperText={
                              validateField(question.field, tempReply?.answer?.content).errorType.split('\n').map((line, idx) => (
                                <span key={idx} style={{ display: 'block', lineHeight: '20px', fontSize: 14 }}>{line}</span>
                              ))
                            }
                          />}
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
                              files={tempReply.mediaFiles}
                              question={question}
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
                              files={tempReply.mediaFiles}
                              field={question.field}
                              question={question}
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
                          onClick={() => onSaveReply()}
                          disabled={
                            (question.state === "AME_DRF" && (
                              validateField(question.field, tempReply?.answer?.content).isError
                              ||
                              (
                                (question.answerObj[0].content === tempReply?.answer?.content)
                                && (tempReply && tempReply.mediaFiles && isSameFile(inquiries, tempReply))
                              )
                            ))
                            || (question.state !== "AME_DRF" && (['string'].includes(typeof tempReply?.answer?.content) ? !tempReply?.answer?.content?.trim() : !tempReply?.answer?.content) && (!tempReply.mediaFiles || tempReply.mediaFiles.length === 0))
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

export const ContainerDetailFormOldVersion = ({ container, originalValues, question, setTextResolve, disableInput = false, validation, setDirty }) => {
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const regNumber = { value: /^\s*(([0-9]\d{0,2}(,?\d{3})*)|0)(\.\d+)?\s*$/g, message: 'Must be a Number' }
  const regInteger = { value: /^\s*[0-9]\d{0,2}(,?\d{3})*\s*$/g, message: 'Must be a Number' }

  const cdUnit = [
    { field: CONTAINER_PACKAGE, title: 'PACKAGE', unit: packageUnits, required: 'This is required', pattern: regInteger },
    { field: CONTAINER_WEIGHT, title: 'WEIGHT', unit: weightUnits, required: 'This is required', pattern: regNumber },
    { field: CONTAINER_MEASUREMENT, title: 'MEASUREMENT', unit: measurementUnits, required: false, pattern: regNumber }
  ];

  const cmUnit = [
    { field: CM_PACKAGE, title: 'PACKAGE', unit: packageUnits, required: 'This is required', pattern: regInteger },
    { field: CM_WEIGHT, title: 'WEIGHT', unit: weightUnits, required: 'This is required', pattern: regNumber },
    { field: CM_MEASUREMENT, title: 'MEASUREMENT', unit: measurementUnits, required: false, pattern: regNumber }
  ];

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
  const [values, setValues] = useState(originalValues || getValueField(container) || [{}]);
  const inqType = getLabelById(metadata['inq_type_options'], question.inqType);
  const cdType =
    inqType !== CONTAINER_NUMBER ? [CONTAINER_NUMBER, inqType] : [CONTAINER_NUMBER];
  const cmType = inqType !== CONTAINER_NUMBER ? [CONTAINER_NUMBER, inqType] : [CONTAINER_NUMBER];
  const typeList = container === CONTAINER_DETAIL ? cdType : cmType;

  const onChange = (e, index, type) => {
    const temp = JSON.parse(JSON.stringify(values));
    const { value } = e.target;
    if (getTypeName(type) === CONTAINER_PACKAGE) {
      if (parseInt(value)) {
        temp[index][type] = parseInt(value).toLocaleString();
      }
      else {
        temp[index][type] = "";
      }
    } else {
      temp[index][type] = (getTypeName(type) === CONTAINER_SEAL) ? value.split(',') : value;
    }

    setValues(temp);
    setTextResolve(temp);
    setDirty()
  };

  useEffect(() => {
    if (!originalValues) {
      setValues(getValueField(container) || [{}]);
    }
    if (container === CONTAINER_MANIFEST) {
      const getVals = originalValues || getValueField(container) || [{}];
      let cmSorted = [];
      let contsNo = [];
      let containerDetail = getValueField(CONTAINER_DETAIL);
      (containerDetail || []).map(cd => {
        const containerNo = cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]];
        if (containerNo) {
          let arr = getVals.filter(cm =>
            cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === containerNo
          )
          cmSorted = [...cmSorted, ...arr];
        }
        contsNo.push(containerNo);
      });

      let cmNolist = (getVals || []).filter(cm =>
        !contsNo.includes(cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]])
      )
      if (cmNolist) cmSorted = [...cmSorted, ...cmNolist];
      if (!cmSorted.length) cmSorted = getVals;

      setValues(cmSorted)
    }
  }, [content]);

  const renderTB = () => {
    let td = [];
    validation(true);
    const valueCopy = JSON.parse(JSON.stringify(values));
    let index = 0;
    valueCopy.map((item) => {
      item.index = index;
      index += 1;
    })
    let groupsValues = [];
    if (typeList.length === 1) {
      groupsValues = [...valueCopy].map(value => ({ name: value[getType(CONTAINER_NUMBER)], value: [value], duplicate: container === CONTAINER_MANIFEST ? false : [...valueCopy].filter((cntrNo) => cntrNo[getType(CONTAINER_NUMBER)] === value[getType(CONTAINER_NUMBER)]).length > 1 }));
    }
    else {
      const groups = groupBy(valueCopy, value => value[getType(CONTAINER_NUMBER)]);
      groupsValues = [...groups].map(([name, value]) => ({ name, value, duplicate: false }));
    }

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
          <Tooltip title={type === 'HS/HTS/NCM Code' ? HS_CODE : type} enterDelay={1000}>
            <input
              className={clsx(classes.text)}
              style={{
                backgroundColor: '#FDF2F2',
                fontWeight: 600,
                borderTopLeftRadius: rowIndex === 0 && 8,
                fontSize: 14,
              }}
              disabled
              defaultValue={type === 'HS/HTS/NCM Code' ? HS_CODE : type}
            />
          </Tooltip>
          {
            rowValues.map((item, index1) => {
              if (item.value.length > rowIndex) {
                hasData = true;
              }
              let nodeValue = null;
              if (rowIndex - 1 < item.value.length) {
                nodeValue = item.value[rowIndex > 0 ? rowIndex - 1 : 0];
              }
              const disabled = !((rowIndex > 0 || inqType === CONTAINER_NUMBER) && nodeValue && !disableInput);
              const isUpperCase = inqType !== CONTAINER_NUMBER && rowIndex > 0;
              let inValidContainerNo = false;
              if (inqType === CONTAINER_NUMBER && container === CONTAINER_MANIFEST && !disableInput) {
                // Validation in CD
                const value = nodeValue ? (!isUpperCase ? formatContainerNo(nodeValue[getType(type)]) : nodeValue[getType(type)]) : '';
                const contsNo = getValueField(CONTAINER_DETAIL).map(value => value[getType(CONTAINER_NUMBER)]);
                if (!contsNo.includes(value)) {
                  inValidContainerNo = true;
                  validation(false);
                }
              } else if (inqType === CONTAINER_NUMBER && container === CONTAINER_DETAIL && !disableInput && item.duplicate) {
                validation(false);
              }
              if (CONTAINER_LIST.cdNumber.includes(type) || CONTAINER_LIST.cmNumber.includes(type)) {
                const filteredCdUnit = (CONTAINER_LIST.cdNumber.includes(type) ? cdUnit : cmUnit).filter((item) => item.field === type);
                const reg = new RegExp(filteredCdUnit[0].pattern.value);
                const inputValid = (nodeValue[getType(type)] && nodeValue[getType(type)].length === 0) || reg.test(nodeValue[getType(type)]);
                if (!inputValid) validation(false);

                return (
                  <div>
                    <input
                      className={clsx(classes.text)}
                      key={index1}
                      style={{
                        marginLeft: 5,
                        backgroundColor: disabled && '#FDF2F2',
                        fontSize: 15,
                        borderTopRightRadius: rowIndex === 0 && rowValues.length - 1 === index1 ? 8 : null,
                        textTransform: isUpperCase ? 'uppercase' : 'none',
                        borderColor: inputValid === true ? '#bac3cb' : 'red'
                      }}
                      disabled={disabled}
                      value={nodeValue ? NumberFormat(nodeValue[getType(type)]) || '' : ''}
                      onChange={(e) => onChange(e, nodeValue.index, getType(type))}
                    />
                    {inputValid ? null : <p style={{ color: 'red' }}>{filteredCdUnit[0].pattern.message}</p>}
                  </div>
                )
              }
              return (
                <input
                  className={clsx(classes.text)}
                  key={index1}
                  style={{
                    marginLeft: 5,
                    backgroundColor: disabled && '#FDF2F2',
                    fontSize: 15,
                    borderTopRightRadius: rowIndex === 0 && rowValues.length - 1 === index1 ? 8 : null,
                    textTransform: isUpperCase ? 'uppercase' : 'none',
                    borderColor: item.duplicate || inValidContainerNo ? 'red' : '#bac3cb'
                  }}
                  disabled={disabled}
                  value={nodeValue ? (!isUpperCase ? formatContainerNo(nodeValue[getType(type)]) : nodeValue[getType(type)]) : ''}
                  onChange={(e) => onChange(e, nodeValue.index, getType(type))}
                />
              );
            })
          }
        </div>);

        // View HTS code, NCM code
        if (type === 'HS/HTS/NCM Code') {
          [HTS_CODE, NCM_CODE].map((code, index) => {
            td.push(<div key={index} style={{ display: 'flex', marginTop: type === typeList[0] ? 10 : 5 }}>
              <Tooltip title={code} enterDelay={1000}>
                <input
                  className={clsx(classes.text)}
                  style={{
                    backgroundColor: '#FDF2F2',
                    fontWeight: 600,
                    borderTopLeftRadius: rowIndex === 0 && 8,
                    fontSize: 14
                  }}
                  disabled
                  defaultValue={code}
                />
              </Tooltip>
              {
                rowValues.map((item) => {
                  let nodeValue = null;
                  if (rowIndex - 1 < item.value.length) {
                    nodeValue = item.value[rowIndex > 0 ? rowIndex - 1 : 0];
                  }
                  return (
                    <input
                      className={clsx(classes.text)}
                      key={index}
                      style={{
                        marginLeft: 5,
                        backgroundColor: disableInput ? '#FDF2F2' : '#CCD3D1',
                        fontSize: 15,
                        textTransform: 'uppercase',
                        color: disableInput ? '' : '#999999'
                      }}
                      disabled
                      value={(nodeValue && nodeValue[getType(type)]) ? (index ? nodeValue[getType(type)].slice(0, 4) : nodeValue[getType(type)]) : ''}
                    />
                  );
                })
              }
            </div>);
          })
        }
        if (!hasData || typeList.length == 1) {
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
