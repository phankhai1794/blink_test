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
import { parseNumberValue, getLabelById, displayTime, validatePartiesContent, validateBLType, groupBy, isJsonText, formatContainerNo, isSameFile, validateGroupOneTextBox, NumberFormat, compareObject, formatDate, isDateField, formatNumber, isSameDate, generateFileNameTimeFormat } from '@shared';
import { saveEditedField, updateDraftBLReply, getCommentDraftBl, deleteDraftBLReply, wraptextDummyField } from 'app/services/draftblService';
import { uploadFile } from 'app/services/fileService';
import { getBlInfo, validateTextInput } from 'app/services/myBLService';
import { sendmailResolve, getMail } from 'app/services/mailService';
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
  DESCRIPTION_OF_GOODS1,
  DESCRIPTION_OF_GOODS2,
  DESCRIPTION_OF_GOODS,
  BL_PRINT_COUNT,
  FREIGHT_TERM,
  PREPAID,
  COLLECT,
  FREIGHTED_AS,
  RATE,
  SERVICE_CONTRACT_NO,
  RD_TERMS, CM_DESCRIPTION,
  FORWARDER,
  ORIGINAL_BL,
  SEAWAY_BILL,
  EXPORT_REF,
  T_VVD,
} from '@shared/keyword';
import { packageUnits, weightUnits, measurementUnits } from '@shared/units';
import { handleError } from '@shared/handleError';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import * as AppAction from 'app/store/actions';
import { useDropzone } from 'react-dropzone';
import { SocketContext } from 'app/AppContext';

import Diff from "../shared-components/react-diff";
import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';
import * as Actions from '../store/actions';
import DateTimePickers from '../shared-components/DateTimePickers';
import { TrashIcon } from '../shared-components';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from './AttachFile';
import Comment from './Comment';
import TagsComponent from './TagsComponent';
import ContainerDetailForm from './ContainerDetailForm';
import ContainerDetailInquiry from "./ContainerDetailInquiry";
import InquiryWithGroup from "./InquiryWithGroup";

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
    '& .MuiOutlinedInput-multiline': {
      padding: '10.5px'
    },
    '& .MuiInputBase-inputMultiline': {
      resize: 'vertical',
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
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      fontWeight: 500,
      color: '#999999',
      fontSize: '15px',
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
  },
  textFieldDateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

const InquiryViewer = (props) => {
  const { index, showReceiver, isSaved, currentQuestion, openInquiryReview, field, isSaveAnswer, isAllInq } = props;
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [filepaste, setFilepaste] = useState('');
  const [dropfiles, setDropfiles] = useState([]);

  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const orgContent = useSelector(({ workspace }) => workspace.inquiryReducer.orgContent);
  const contentInqResolved = useSelector(({ workspace }) => workspace.inquiryReducer.contentInqResolved);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const enableSubmit = useSelector(({ workspace }) => workspace.inquiryReducer.enableSubmit);
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const expandFileQuestionIds = useSelector(({ workspace }) => workspace.inquiryReducer.enableExpandAttachment);
  const cancelAmePopup = useSelector(({ workspace }) => workspace.inquiryReducer.cancelAmePopup);
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
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
  const [isAlsoNotifies, setIsAlsoNotifies] = useState([ALSO_NOTIFY, FORWARDER, DESCRIPTION_OF_GOODS, EXPORT_REF].map(key => metadata.field?.[key]).includes(question.field));
  const [tempReply, setTempReply] = useState({});
  const [showLabelSent, setShowLabelSent] = useState(false);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);
  const openConfirmPopup = useSelector(({ workspace }) => workspace.formReducer.openConfirmPopup);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const eventClickContNo = useSelector(({ workspace }) => workspace.formReducer.eventClickContNo);
  const [isSaveComment, setSaveComment] = useState(false);
  const [checkStateReplyDraft, setStateReplyDraft] = useState(false);
  const [submitLabel, setSubmitLabel] = useState(false);
  const [isShowViewAll, setShowViewAll] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [isRemoveFile, setIsRemoveFile] = useState(false);
  const [disableSaveReply, setDisableSaveReply] = useState(false);
  const [isDisableSaveCdCm, setDisableSaveCdCm] = useState(true);
  const [disableAcceptResolve, setDisableAcceptResolve] = useState(false);
  const [disableReopen, setDisableReopen] = useState(false);
  const inqViewerFocus = useSelector(({ workspace }) => workspace.formReducer.inqViewerFocus);
  const [inqAnsId, setInqAnsId] = useState('');
  const validateInput = useSelector(({ workspace }) => workspace.formReducer.validateInput);
  const [isDeleteAnswer, setDeleteAnswer] = useState({ status: false, content: '' });
  const [getContentCDCMInquiry, setContentCDCMInquiry] = useState({});
  const [listFieldDisableUpload, setListFieldDisableUpload] = useState([]);
  const [isDateTime, setIsDateTime] = useState(false);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const [isValidDate, setIsValidDate] = useState(false);
  const [disableCDCMInquiry, setDisableCDCM] = useState(true);
  const [isAllowEdit, setAllowEdit] = useState(false);
  const [disableCDCMAmendment, setDisableCDCMAmendment] = useState(true);
  const [getDataCD, setDataCD] = useState([]);
  const [getDataCM, setDataCM] = useState([]);
  const [isHasEditCdCm, setHasEditCdCm] = useState(false);
  const [isResolveAndUpload, setIsResolveAndUpload] = useState(false);
  const socket = useContext(SocketContext);
  const triggerOnpaste = useRef(null);
  const [mailHistory, setMailHistory] = useState({
    toCustomer: [],
    toCustomerCc: [],
    toCustomerBcc: [],
    toOnshore: [],
    toOnshoreCc: [],
    toOnshoreBcc: [],
  });
  const syncData = (data, syncOptSite = "") => {
    socket.emit("sync_data", { data, syncOptSite });
  };

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
    DATE_LADEN,
    BL_PRINT_COUNT,
    FREIGHT_TERM,
    PREPAID,
    COLLECT,
    FREIGHTED_AS,
    RATE,
    SERVICE_CONTRACT_NO,
    RD_TERMS,
    BL_TYPE,
    T_VVD,
    SHIPPER,
    CONSIGNEE,
    FORWARDER,
    ALSO_NOTIFY,
    NOTIFY
  ];

  const isDisableBtnUpload = () => {
    const listField = [];
    metadata['field_options'].forEach(item => {
      if (fieldsNotSendOPUS.includes(item.keyword)) {
        listField.push(item.value);
      }
    });
    setListFieldDisableUpload(listField);
  }

  const isDateTimeField = () => {
    const result = isDateField(metadata, question.field)
    setIsDateTime(result);
    if (result) {
      if (question.process === 'pending') {
        const originTime = content[question.field] ? formatDate(content[question.field], 'YYYY-MM-DD') : '';
        const resolveVal = textResolve ? formatDate(textResolve, 'YYYY-MM-DD') : '';
        setIsValidDate(originTime !== resolveVal);
      } else {
        setIsValidDate(true);
      }
    }
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
    const isFieldMaxFineLine = [
      metadata.field[FORWARDER],
      metadata.field[ALSO_NOTIFY],
      metadata.field[DESCRIPTION_OF_GOODS],
      metadata.field[EXPORT_REF]
    ].includes(field);
    if (Object.keys(metadata.field).find(key => metadata.field[key] === field) === BL_TYPE) {
      response = validateBLType(value);
    }
    if (isFieldMaxFineLine) {
      response = validateGroupOneTextBox(value, metadata.field[DESCRIPTION_OF_GOODS] === field);
    }
    return response;
  }

  const checkSetActionCurrentState = (getQuestion) => {
    if (getQuestion.process === 'pending') {
      setIsReply(false);
      setIsReplyCDCM(false);
      setIsResolve(false);
      setIsResolveCDCM(false);
      setStateReplyDraft(false);
      props.getStateReplyDraft(false);
      if (['REOPEN_A', 'REOPEN_Q'].includes(getQuestion.state)) {
        getQuestion.showIconReply = true;
      }
      if (user.role === 'Admin') {
        if (getQuestion.state === 'REP_Q_SENT') {
          setStateReplyDraft(true);
          getQuestion.showIconReply = false;
        } else if (getQuestion.state === 'REP_Q_DRF') {
          setStateReplyDraft(true);
          getQuestion.showIconReply = false;
        }
        if (['REP_A_SENT', 'ANS_SENT'].includes(getQuestion.state)) {
          getQuestion.showIconReply = true;
          getQuestion.showIconEdit = false;
          setStateReplyDraft(false);
        } else if (['OPEN', 'INQ_SENT'].includes(getQuestion.state)) {
          getQuestion.showIconReply = false;
          setStateReplyDraft(false);
        }
      }
      else {
        if (getQuestion.state === 'REP_A_DRF') {
          setStateReplyDraft(true);
          props.getStateReplyDraft(true);
          //
        } else if (['REP_Q_SENT'].includes(getQuestion.state)) {
          getQuestion.showIconReply = true;
          setStateReplyDraft(false);
          setSubmitLabel(false);
        } else if (getQuestion.state === 'REP_Q_DRF') {
          setSubmitLabel(true);
          getQuestion.showIconEdit = true;
        } else if (getQuestion.state === 'ANS_DRF') {
          setSubmitLabel(false);
          setStateReplyDraft(false);
          getQuestion.showIconEdit = true;
        } else if (getQuestion.state === 'INQ_SENT') {
          setSubmitLabel(false);
          getQuestion.showIconReply = true;
          getQuestion.showIconEdit = false;
          setStateReplyDraft(false);
        } else if (getQuestion.state === 'COMPL') {
          setStateReplyDraft(false);
        }
        if (['REP_A_SENT', 'ANS_SENT'].includes(getQuestion.state)) {
          setSubmitLabel(true);
          setStateReplyDraft(false);
          getQuestion.showIconEdit = true;
        }
      }
      if (containerCheck.includes(getQuestion.field)) {
        getQuestion.isShowTableToReply = false;
        setDisableCDCM(true);
        if (getQuestion.oldData && Object.keys(getQuestion.oldData).length) {
          if (getQuestion.oldData.cdCmDataOld && Object.keys(getQuestion.oldData.cdCmDataOld).length) {
            setDataCD(getQuestion.oldData.cdCmDataOld[containerCheck[0]])
            setDataCM(getQuestion.oldData.cdCmDataOld[containerCheck[1]])
          }
        }
      }
      getQuestion.showIconAttachAnswerFile = false;
      getQuestion.showIconAttachReplyFile = false;
    } else {
      getQuestion.showIconEdit = true;
      getQuestion.showIconAttachAnswerFile = false;
      getQuestion.showIconAttachReplyFile = false;
      setIsReply(false);
      setIsReplyCDCM(false);
      setStateReplyDraft(false);
      setIsResolve(false);
      setIsResolveCDCM(false);
      setDisableCDCM(true);
      //
      if (getQuestion.state === 'RESOLVED') {
        setDisableReopen(false);
        setIsReplyCDCM(false);
        setIsResolveCDCM(false);
      }
      if (user.role === 'Admin') {
        if (getQuestion.role === 'Guest') {
          if (['REP_SENT', 'AME_SENT'].includes(getQuestion.state)) {
            getQuestion.showIconReply = true;
            setTempReply({});
          }
        } else {
          if (['REP_DRF'].includes(getQuestion.state)) {
            getQuestion.showIconReply = false;
            setShowLabelSent(false);
            setStateReplyDraft(true);
          } else if (['REP_SENT'].includes(getQuestion.state)) {
            getQuestion.showIconReply = false;
            setShowLabelSent(true);
            setStateReplyDraft(true);
          }
        }
        if (['REOPEN_A'].includes(getQuestion.state)) {
          getQuestion.showIconReply = true;
        } else if (['REOPEN_Q'].includes(getQuestion.state)) {
          getQuestion.showIconReply = true;
        }
        if (['REOPEN_A', 'REOPEN_Q'].includes(getQuestion.state)) {
          if (typeof getQuestion.content === 'string') {
            setTempReply({})
          }
        }
      }
      else {
        if (getQuestion.role === 'Guest') {
          if (['REP_SENT', 'AME_SENT'].includes(getQuestion.state)) {
            getQuestion.showIconReply = false;
            setSubmitLabel(true);
            setStateReplyDraft(true);
          } else if (['AME_DRF', 'REP_DRF'].includes(getQuestion.state)) {
            setSubmitLabel(false);
            setStateReplyDraft(true);
          }
        } else {
          if (['REP_SENT'].includes(getQuestion.state)) {
            getQuestion.showIconReply = true;
            getQuestion.showIconEdit = false;
            setSubmitLabel(false);
            setTempReply({});
          }
        }
        if (['UPLOADED'].includes(getQuestion.state)) {
          setStateReplyDraft(false);
        } else if (['REOPEN_A'].includes(getQuestion.state)) {
          getQuestion.showIconReply = true;
          getQuestion.showIconEdit = false;
        } else if (['REOPEN_Q'].includes(getQuestion.state)) {
          getQuestion.showIconReply = true;
          getQuestion.showIconEdit = false;
        }
        if (['REOPEN_A', 'REOPEN_Q'].includes(getQuestion.state)) {
          // is CM CD Amendment
          if (typeof getQuestion.content === 'string') setTempReply({});
          setSubmitLabel(false);
        }
      }
    }
    return getQuestion
  }

  const setDefaultAction = (val) => {
    const optionsInquires = [...inquiries];
    optionsInquires.forEach(op => {
      op.showIconAttachAnswerFile = (val.type === 'ANS' || ['INQ_SENT', 'ANS_DRF', 'ANS_SENT'].includes(val.state)) && op.groupId === val.groupId;
    });
    dispatch(InquiryActions.setInquiries(optionsInquires));
    //
    const getQuestion = { ...question };
    if (getQuestion.process === 'pending' ? getQuestion.groupId === val.groupId : getQuestion.id === val.id) {
      if (val.state === 'OPEN' && !isResolve && !isResolveCDCM) {
        dispatch(InquiryActions.setEditInq(val));
      } else {
        dispatch(InquiryActions.setEditInq());
      }
      if (!confirmClick && !['INQ', 'ANS'].includes(val.type)) {
        getQuestion.content = val.content;
        setQuestion(getQuestion);
      }
    }
    if (getQuestion.process === 'pending' ? getQuestion.groupId !== val.groupId : getQuestion.id !== val.id) {
      // reset answer
      if (getQuestion.showIconAttachAnswerFile || getQuestion.showIconAttachFile || getQuestion.showIconAttachReplyFile) {
        if (getQuestion.showIconAttachAnswerFile || getQuestion.showIconAttachFile) {
          props.onCancel(getQuestion)
        } else {
          cancelReply(getQuestion)
        }
      } else if (isResolve || isResolveCDCM) {
        const currStateQuestion = checkSetActionCurrentState(getQuestion);
        setQuestion(currStateQuestion);
      }
    }
  }

  useEffect(() => {
    if (['INQ_SENT', 'REP_Q_SENT'].includes(question.state))
      getMail(myBL.id)
        .then(({ data: { toCustomer, toCustomerCc, toCustomerBcc, toOnshore, toOnshoreCc, toOnshoreBcc } }) => {
          setMailHistory({
            toCustomer,
            toCustomerCc,
            toCustomerBcc,
            toOnshore,
            toOnshoreCc,
            toOnshoreBcc
          });
        })
        .catch((err) => handleError(dispatch, err));
  }, []);

  useEffect(() => {
    if (props.inqActing && props.inqActing.val && props.inqActing.action) {
      setDefaultAction(props.inqActing.val);
    }
  }, [props.inqActing]);

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
    if (eventClickContNo.status && eventClickContNo.questionId === question.id && user.role === 'Guest') {
      if ((['INQ', 'ANS'].includes(question.type) && ['INQ_SENT'].includes(question.state)) || ['REOPEN_A', 'REOPEN_Q'].includes(question.state)) {
        onReply(question)
        setAllowEdit(true);
        // open popup amendment
        dispatch(FormActions.eventClickContNo({ status: false, questionId: '', isHasActionClick: true }));
      } else if (!['COMPL', 'UPLOADED'].includes(question.state)) {
        if (['INQ', 'ANS', 'REP'].includes(question.type)) {
          if (['REP'].includes(question.type) && question.state !== 'REP_Q_SENT') {
            const reqReply = {
              inqAns: {
                inquiry: question.id,
                confirm: false,
                type: 'REP'
              },
              answer: {
                id: question.answerId,
                content: tempReply && tempReply.answer ? tempReply.answer.content : question.content,
                type: metadata.ans_type['paragraph']
              }
            };
            setTempReply({ ...tempReply, ...reqReply, mediaFiles: question.mediaFile || [] });
          }
        }
        handleEdit(question)
        setAllowEdit(true);
        dispatch(FormActions.eventClickContNo({ status: false, questionId: '', isHasActionClick: true }));
      }
    }
  }, [eventClickContNo, eventClickContNo.status])

  useEffect(() => {
    setQuestion(props.question);

    // sync state - refresh after syncing data
    props.getUpdatedAt && props.getUpdatedAt();
  }, [props.question]);

  useEffect(() => {
    let isUnmounted = false;
    setTempReply({});
    setIsSeparate([SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(question.field));
    setIsAlsoNotifies([ALSO_NOTIFY, FORWARDER, DESCRIPTION_OF_GOODS, EXPORT_REF].map(key => metadata.field?.[key]).includes(question.field));
    setIsResolve(false);
    setIsResolveCDCM(false);
    setIsReply(false);
    setIsReplyCDCM(false);
    if (question && question.process === 'pending') {
      loadComment(question.id)
        .then((res) => {
          if (isUnmounted) return;
          const lastest = { ...question };
          if (res.length > 0) {
            // res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
            // console.log(res)
            let filterCDCM = res;
            let objCdCmData;
            let getIndexLatestCdCm;
            const filterOffshoreSent = filterCDCM.filter(f => f.type !== 'ANS_CD_CM')[0];
            if (containerCheck.includes(question.field)) {
              setDisableCDCM(true);
              const cloneContent = JSON.parse(JSON.stringify(contentInqResolved));
              const latestCdCmData = [...res].find((el, i) => {
                getIndexLatestCdCm = i;
                return el.type === 'ANS_CD_CM' && el.status !== 'DELETED'
              });
              if (latestCdCmData && isJsonText(latestCdCmData.content) && latestCdCmData.type === 'ANS_CD_CM') {
                setContentCDCMInquiry({ ansId: latestCdCmData.id });
                const parseJs = JSON.parse(latestCdCmData.content);
                setDataCD(parseJs?.[getField(CONTAINER_DETAIL)]);
                setDataCM(parseJs?.[getField(CONTAINER_MANIFEST)]);
                //
                objCdCmData = parseJs;
                lastest.dataCdInq = parseJs?.[getField(CONTAINER_DETAIL)]
                lastest.dataCmInq = parseJs?.[getField(CONTAINER_MANIFEST)]
                if (latestCdCmData.state === 'REP_A_DRF') {
                  setHasEditCdCm(true);
                }
                // filterCDCM = res.filter((r, i) => i !== 0);
              } else {
                setDataCD(cloneContent?.[getField(CONTAINER_DETAIL)]);
                setDataCM(cloneContent?.[getField(CONTAINER_MANIFEST)]);
                //
                objCdCmData = {
                  [getField(CONTAINER_DETAIL)]: cloneContent?.[getField(CONTAINER_DETAIL)],
                  [getField(CONTAINER_MANIFEST)]: cloneContent?.[getField(CONTAINER_MANIFEST)],
                }
              }
            }
            // filter comment
            if (containerCheck.includes(question.field)) {
              if (['REOPEN_A', 'REOPEN_Q', 'COMPL', 'UPLOADED'].includes(filterOffshoreSent.state)) {
                const parseJs = JSON.parse(filterOffshoreSent.content);
                setDataCD(parseJs?.[getField(CONTAINER_DETAIL)]);
                setDataCM(parseJs?.[getField(CONTAINER_MANIFEST)]);
              }

              let contentOld = '';
              if (filterOffshoreSent.type === 'ANS' && filterOffshoreSent.answerObj && filterOffshoreSent.answerObj.length) {
                contentOld = filterOffshoreSent.answerObj[0].content;
              } else if (filterOffshoreSent.type === 'REP') {
                contentOld = filterOffshoreSent.content;
                lastest.answerId = filterOffshoreSent.id;
              }
              lastest.oldData = {
                cdCmDataOld: objCdCmData,
                contentOld
              };
            }
            if (filterOffshoreSent.type === 'REP' && ['COMPL', 'UPLOADED']) {
              setInqAnsId(filterOffshoreSent.id);
            }

            lastest.mediaFile = filterOffshoreSent.mediaFile;
            lastest.mediaFilesAnswer = filterOffshoreSent.answersMedia;
            lastest.answerObj = filterOffshoreSent.answerObj;
            lastest.content = filterOffshoreSent.content;
            lastest.type = filterOffshoreSent.type;
            lastest.status = filterOffshoreSent.status;
            lastest.sentAt = filterOffshoreSent.sentAt;
            lastest.name = "";
            lastest.process = 'pending';
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
              if (['REP_Q_DRF', 'REP_A_DRF', 'ANS_DRF', 'OPEN'].includes(filterOffshoreSent.state)) {
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
                  lastest.showIconReply = false;
                } else if (filterOffshoreSent.state === 'REP_Q_DRF') {
                  setStateReplyDraft(true);
                  setShowLabelSent(false);
                  lastest.showIconReply = false;
                }
                if (['REP_A_SENT', 'ANS_SENT'].includes(filterOffshoreSent.state)) {
                  lastest.showIconReply = true;
                  lastest.showIconEdit = false;
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  setShowLabelSent(false);
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
              }
              else {
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
                  setSubmitLabel(false);
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
                } else if (filterOffshoreSent.state === 'COMPL') {
                  setStateReplyDraft(false);
                }
                if (['REP_A_SENT', 'ANS_SENT'].includes(filterOffshoreSent.state)) {
                  setSubmitLabel(true);
                  setStateReplyDraft(false);
                  lastest.showIconAttachReplyFile = false;
                  lastest.showIconAttachAnswerFile = false;
                  lastest.showIconEdit = true;
                  lastest.showIconReply = false;
                  //
                  setTempReply({ ...tempReply, ...reqReply, mediaFiles: filterOffshoreSent.mediaFile });
                }
              }
            }
            //
            const sortComments = [...filterCDCM].sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
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
              filterCDCM.splice(0, 0, markReopen);
            }
            let listComments = [...filterCDCM].map(r => {
              return {
                ...r,
                process: 'pending'
              }
            });
            // setType(metadata.ans_type.paragraph);
            setQuestion(lastest);
            if (filterCDCM.length > 1) {
              setInqHasComment(true);
              if (
                (
                  (['REP_A_DRF', 'REP_A_SENT', 'ANS_DRF', 'ANS_SENT'].includes(filterOffshoreSent.state) && user.role === 'Guest')
                  ||
                  (['REP_A_SENT', 'ANS_SENT'].includes(filterOffshoreSent.state) && user.role === 'Admin')
                ) && getIndexLatestCdCm
              ) {
                listComments.splice(getIndexLatestCdCm, 1);
              }
              if (['UPLOADED', 'COMPL'].includes(listComments[0].state)) {
                listComments.splice(0, 2);
              } else {
                listComments.splice(0, 1);
              }
            }
            if (filterCDCM.length === 1) {
              // setShowViewAll(false);
              setInqHasComment(false)
            }
            setComment(listComments);

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
          // res.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          const lastest = { ...question };
          if (res.length > 0) {
            let getRes = res;
            // console.log('getRes', getRes)
            const filterRepAmend = res.filter(r => r.state.includes('REP_AME_') && !['REP_DRF_DELETED', 'REP_AME_DRF_DELETED'].includes(r.state));
            const getLatest = getRes[0];
            const { content: contentField, mediaFile } = getLatest.content;
            setDisableCDCMAmendment(true);
            const lastestComment = res[0];
            let inqAnsId = lastestComment.id;
            if (['RESOLVED', 'UPLOADED'].includes(lastestComment.state)) {
              if (lastestComment.draftAnswerId) {
                inqAnsId = lastestComment.draftAnswerId;
              }
              setInqAnsId(inqAnsId);
            }
            // filter latest reply amendment
            if (filterRepAmend.length) {
              const getRepAmend = filterRepAmend[0];
              if (
                lastestComment.role === 'Guest'
                &&
                (
                  (user.role === 'Guest' && ['REP_DRF', 'REP_SENT'].includes(lastestComment.state))
                  ||
                  (user.role === 'Admin' && ['REP_SENT'].includes(lastestComment.state))
                )
              )
                getRes = res.filter(r => r.id !== getRepAmend.id);
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
            lastest.role = lastestComment.role;
            lastest.process = 'draft';
            if (containerCheck.includes(question.field)) {
              const lastestContentCDCM = res.filter(r => (r.state.includes('AME_') || r.state.includes('REOPEN_')) && !['REP_AME_DRF_DELETED', 'REP_AME_SENT_DELETED'].includes(r.state));
              lastest.contentCDCM = lastestContentCDCM[0].content.content;
              if (filterRepAmend.length) {
                lastest.contentReplyCDCM = filterRepAmend[0].content.content;
              } else {
                lastest.contentReplyCDCM = lastestContentCDCM[0].content.content;
              }
              lastest.isShowTableToReply = res.some(r => ['REP_DRF', 'REP_SENT'].includes(r.state));
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
                  id: inqAnsId,
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
            }
            else {
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
              } else if (['REOPEN_A'].includes(lastest.state)) {
                lastest.showIconReply = true;
                lastest.showIconEdit = false;
                setStateReplyDraft(false);
              } else if (['REOPEN_Q'].includes(lastest.state)) {
                lastest.showIconReply = true;
                lastest.showIconEdit = false;
                setStateReplyDraft(false);
              }
              if (['REOPEN_A', 'REOPEN_Q'].includes(lastest.state)) {
                // is CM CD Amendment
                if (typeof lastest.content === 'string') setTempReply({});
                setSubmitLabel(false);
              }
            }
            setQuestion(lastest);

            // push new lastestComment if not already exist
            !listCommentDraft.find(ele => ele.id === lastestComment.id) && dispatch(InquiryActions.setListCommentDraft([...listCommentDraft, ...[lastestComment]]));

            let comments = [];

            getRes.map(r => {
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
              comments.splice(0, 0, markReopen);
            }
            if (containerCheck.includes(question.field)) {
              comments = comments.filter(c => c.content !== '');
            }
            if (comments.length) {
              if (['UPLOADED', 'RESOLVED'].includes(comments[0].state)) {
                comments.splice(0, 2);
              } else {
                comments.splice(0, 1);
              }
            }
            setComment(comments);
            if (comments.length >= 1) {
              setInqHasComment(true);
            } else {
              setInqHasComment(false);
            }
          }
          setIsLoadedComment(true);
        })
        .catch((error) => handleError(dispatch, error));
    }

    return () => {
      isUnmounted = true;
      dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    }
  }, [isSaveComment, isSaveAnswer, cancelAmePopup]);

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
      if (answerObj && answerObj.length > 0) {
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
      if (quest.answerObj && quest.answerObj.length && editedIndex !== -1) {
        quest.answerObj.forEach(ans => {
          ans.confirmed = false;
          if (ans.id === optionsInquires[editedIndex].selectChoice?.answer) {
            ans.confirmed = true;
          }
        })
      }
      setQuestion(quest);
      setFilepaste('');
      setDropfiles([]);
      setSaveComment(!isSaveComment);
    }
    if (containerCheck.includes(quest.field)) setAllowEdit(false);
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
        if (answerIndex !== -1) {
          const answerUpdate = answersObj[answerIndex];
          answerUpdate.confirmed = true;
        }
        quest.answerObj = answersObj;
      }
    }
    //
    setQuestion({ ...quest, mediaFilesAnswer: currentEditInq.mediaFilesAnswer });
  }

  const removeFileReply = (val) => {
    let valReply = val;
    if (Object.keys(valReply).length) {
      const contentReply = ['string'].includes(typeof valReply.answer.content) && valReply.answer.content === ONLY_ATT && valReply.mediaFiles.length === 0;
      if (contentReply) {
        valReply = {
          ...valReply,
          answer: {
            ...valReply.answer,
            content: ''
          }
        }
      }
    }
    setTempReply(valReply);
  }

  useEffect(() => {
    updateQuestionFile()
  }, [isUploadFile, isRemoveFile]);

  useEffect(() => {
    question?.state !== 'OPEN' && setAllowDeleteInq(false);
    question?.state === 'OPEN' && setAllowDeleteInq(true);
    if (!['REOPEN_A', 'REOPEN_Q'].includes(question.state)) {
      setDisableReopen(false);
    }
    isDateTimeField();
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
    if (confirmClick) props.setDefaultAction({ val: {}, action: false })
    if (confirmClick && confirmPopupType === 'removeInq' && replyRemove) {
      const optionsOfQuestion = [...inquiries];
      if (replyRemove.inqId) {
        const indexInqRemove = optionsOfQuestion.findIndex(inq => replyRemove.inqId === inq.id);
        deleteInquiry(replyRemove.inqId)
          .then(() => {
            if (indexInqRemove !== -1) {
              const inqDelete = optionsOfQuestion.splice(indexInqRemove, 1)[0];
              const hidePopupEmpty = !optionsOfQuestion.filter(inq => inq.field === inqDelete.field).length;
              dispatch(InquiryActions.setInquiries(optionsOfQuestion));

              // sync delete inquiry
              syncData({ inquiries: optionsOfQuestion });

              if (hidePopupEmpty) {
                dispatch(InquiryActions.setOneInq({}));
                dispatch(FormActions.toggleCreateInquiry(false));
              }
            }
            const isEmptyInq = optionsOfQuestion.filter(op => op.process === 'pending');
            if (!isEmptyInq.length) {
              (field === 'INQUIRY_LIST') && dispatch(FormActions.toggleAllInquiry(false));
              dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BX", "", {
                idReply: myBL.id,
                action: 'deleteAll',
              })) //BX: Delete all inquiries draft
            }
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            props.getUpdatedAt();
          })
          .catch((error) => handleError(dispatch, error));
      }
    } else if (confirmPopupType === 'removeReplyAmendment' && replyRemove && replyRemove?.draftId) {
      deleteDraftBLReply(replyRemove?.draftId, replyRemove.field, myBL.id)
        .then((res) => {
          // update mediaFile in inquiries
          const optionsInquires = [...inquiries];
          const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);

          if (comment.length > 2) {
            const newMediaFile = comment.at(1).answersMedia.filter(({ id: id1 }) => !comment.at(0).answersMedia.some(({ id: id2 }) => id2 === id1));
            const removeMediaFile = comment.at(0).answersMedia.filter(({ id: id1 }) => !comment.at(1).answersMedia.some(({ id: id2 }) => id2 === id1)).map(({ id }) => id);
            optionsInquires[editedIndex].mediaFile = optionsInquires[editedIndex].mediaFile.filter(inq => !removeMediaFile.includes(inq.id));
            optionsInquires[editedIndex].mediaFile.push(...newMediaFile);
          }

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
            let newContent = { ...content };
            setViewDropDown('');
            setDisableSaveReply(false);
            const optionsOfQuestion = [...inquiries];
            const removeAmendment = optionsOfQuestion.filter(inq => inq.field === question.field && inq.process === 'draft');
            let removeIndex = -1;
            if (removeAmendment.length) {
              removeIndex = optionsOfQuestion.findIndex(inq => inq.id === removeAmendment[0].id);
            }
            const inquiriesByField = optionsOfQuestion.filter(inq => inq.field === question.field && inq.process === 'pending');
            if (res.updatedAt !== null) {
              optionsInquires[editedIndex].createdAt = res.updatedAt;
            }
            if (res.checkEmpty) {
              if (removeIndex !== -1) {
                newContent = { ...newContent, [question.field]: contentInqResolved[question.field] };
                optionsOfQuestion.splice(removeIndex, 1);
              }
              // remove all cd cm amendment
              if (res.removeAllCDCM) {
                getBlInfo(myBL.id).then((res) => {
                  if (res) {
                    newContent = { ...newContent, [containerCheck[0]]: res.myBL.content[containerCheck[0]], [containerCheck[1]]: res.myBL.content[containerCheck[1]] }
                  }
                })
              }
              else {
                const idCD = metadata.field[CONTAINER_DETAIL];
                const idCM = metadata.field[CONTAINER_MANIFEST];
                if (res.drfAnswersTrans) {
                  if (question.field === idCM) {
                    // response drfAnswersTrans cd content
                    const response = res.drfAnswersTrans.length ? res.drfAnswersTrans : orgContent[idCD];
                    newContent = { ...newContent, [idCD]: response };
                    // map cd -> cm
                    let cm = content[containerCheck[1]]
                    if (cm) {
                      cm[0][getTypeCDCM(CM_DESCRIPTION)] = orgContent[containerCheck[1]][0][getTypeCDCM(CM_DESCRIPTION)];
                      cm[0][getTypeCDCM(CONTAINER_NUMBER)] = res.drfAnswersTrans[0][getTypeCDCM(CONTAINER_NUMBER)];
                      CONTAINER_LIST.cdNumber.map((key, index) => {
                        cm[0][getTypeCDCM(CONTAINER_LIST.cmNumber[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                      });
                      CONTAINER_LIST.cdUnit.map((key, index) => {
                        cm[0][getTypeCDCM(CONTAINER_LIST.cmUnit[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                      });
                      const isSent = [...optionsInquires].find(inq => (
                        inq.process === 'draft'
                        && inq.field === containerCheck[0]
                        && (
                          (['AME_SENT', 'REP_SENT', 'REP_AME_SENT'].includes(inq.state) && user.role === 'guest')
                          ||
                          ['RESOLVED', 'UPLOADED'].includes(inq.state)
                        )
                      ));
                      if (!isSent) {
                        saveEditedField({ field: containerCheck[1], content: { content: cm, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'deleteAmendment' })
                      }
                    }
                  } else if (question.field === idCD) {
                    // response drfAnswersTrans cm content
                    const response = res.drfAnswersTrans.length ? res.drfAnswersTrans : orgContent[idCM];
                    newContent = { ...newContent, [idCM]: response };
                    // map cm -> cd
                    let cd = content[containerCheck[0]]
                    if (cd) {
                      cd[0][getTypeCDCM(CONTAINER_NUMBER)] = res.drfAnswersTrans[0][getTypeCDCM(CONTAINER_NUMBER)];
                      CONTAINER_LIST.cmNumber.map((key, index) => {
                        cd[0][getTypeCDCM(CONTAINER_LIST.cdNumber[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                      });
                      CONTAINER_LIST.cmUnit.map((key, index) => {
                        cd[0][getTypeCDCM(CONTAINER_LIST.cdUnit[index])] = res.drfAnswersTrans[0][getTypeCDCM(key)];
                      });
                      const isSent = [...optionsInquires].find(inq => (
                        inq.process === 'draft'
                        && inq.field === containerCheck[1]
                        && (
                          (['AME_SENT', 'REP_SENT', 'REP_AME_SENT'].includes(inq.state) && user.role === 'guest')
                          ||
                          ['RESOLVED', 'UPLOADED'].includes(inq.state)
                        )
                      ));
                      if (!isSent) {
                        saveEditedField({ field: containerCheck[0], content: { content: cd, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'deleteAmendment' })
                      }
                    }
                  }
                }
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
            }
            else {
              if (res.checkReplyEmpty) {
                if (removeIndex !== -1) {
                  if (comment.length) {
                    const revertHistory = comment.filter(c => c.state !== 'REP_DRF_DELETED').at(0)
                    optionsOfQuestion[removeIndex].creator = revertHistory && { ...revertHistory.creator, accountRole: revertHistory.creator.accountRole.name }
                    optionsOfQuestion[removeIndex].state = revertHistory && revertHistory.state;
                  } else {
                    optionsOfQuestion[removeIndex].state = user.role === 'Admin' ? 'AME_SENT' : 'REP_SENT';
                  }
                }
                dispatch(InquiryActions.setInquiries(optionsOfQuestion));
              }
              //
              const idCD = metadata.field[CONTAINER_DETAIL];
              const idCM = metadata.field[CONTAINER_MANIFEST];
              if (res.drfAnswersTrans && question.state.includes('AME_')) {
                if (question.field === idCD) {
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
                    const isSent = [...optionsInquires].find(inq => (
                      inq.process === 'draft'
                      && inq.field === containerCheck[1]
                      && (
                        (['AME_SENT', 'REP_SENT', 'REP_AME_SENT'].includes(inq.state) && user.role === 'guest')
                        ||
                        ['RESOLVED', 'UPLOADED'].includes(inq.state)
                      )
                    ));
                    if (!isSent) {
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
                  }
                } else if (question.field === idCM) {
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
                    const isSent = [...optionsInquires].find(inq => (
                      inq.process === 'draft'
                      && inq.field === containerCheck[0]
                      && (
                        (['AME_SENT', 'REP_SENT', 'REP_AME_SENT'].includes(inq.state) && user.role === 'guest')
                        ||
                        ['RESOLVED', 'UPLOADED'].includes(inq.state)
                      )
                    ));
                    if (!isSent) {
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
                }

                if (res.isEditOriginalAmendment) {
                  newContent = { ...newContent, [question.field]: res.drfAnswersTrans }
                }

                if (res.emptyCDorCMAmendment) {
                  if (removeIndex !== -1) optionsOfQuestion.splice(removeIndex, 1);
                  newContent = { ...newContent, [question.field]: res.drfAnswersTrans };
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

            dispatch(InquiryActions.setContent(newContent));
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            dispatch(InquiryActions.addAmendment());
            props.getUpdatedAt();

            // sync delete amendment / reply amendment
            syncData({ inquiries: optionsOfQuestion, content: newContent });
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
              if (res.response && res.response?.statePrev) {
                optionsOfQuestion[indexQuestion].state = res.response?.statePrev || 'ANS_SENT';
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
                  optionsOfQuestion[indexQuestion].paragraphAnswer = {
                    inquiry: question.id,
                    content: '',
                  };
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
                  optionsOfQuestion[indexQuestion].answerObj.forEach((a) => { a.confirmed = false })
                  optionsOfQuestion[indexQuestion].selectChoice = '';
                }
              }
            }
            if (res.updatedTime) {
              optionsOfQuestion[indexQuestion].createdAt = res.updatedTime;
            }
            dispatch(InquiryActions.setInquiries(optionsOfQuestion));

            // sync delete answer inquiry
            syncData({ inquiries: optionsOfQuestion });

            setReplyRemove();
            setFilepaste('');
            setDropfiles([]);
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
      const fieldName = metadata.field?.[`${arrFields[fieldIndex]}Name`] ? (getAnswerResolve() || content[metadata.field?.[`${arrFields[fieldIndex]}Name`]]) : '';
      const fieldAddress = metadata.field?.[`${arrFields[fieldIndex]}Address`] ? content[metadata.field?.[`${arrFields[fieldIndex]}Address`]] : '';
      setTextResolveSeparate({
        name: fieldName || '',
        address: fieldAddress || ''
      })
    } else {
      if (containerCheck.includes(question.field)) {
        const answer = content[question.field] && JSON.parse(JSON.stringify(content[question.field])) || '';
        const ansResolved = getAnswerResolve();
        if (ansResolved) {
          answer.forEach((ans) => {
            ans[question.inqType] = Array.isArray(ans[question.inqType]) ? ansResolved.split(',') : ansResolved
          })
        }
        setTextResolve(answer);
      }
      else {
        setTextResolve(getAnswerResolve() || content[question.field] || '');
      }
    }
  }, [isResolve])

  useEffect(() => {
    if (user.role === 'Admin') {
      setDisableCDCMAmendment(true);
    } else if (user.role === 'Guest') {
      setDisableCDCMAmendment(disableCDCMAmendment);
    }
  }, [disableCDCMAmendment]);

  const removeQuestion = (question) => {
    if (tempReply.answer) {
      question.inqId = tempReply.answer.id;
    }
    setReplyRemove(question);
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
    } else {
      props.setDefaultAction({ val: question, action: true })
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
      props.setDefaultAction({ val: inqEdit, action: true });
      inqEdit.answerObj = inqEdit.answerObj.map((ans) => ({ ...ans, index: 0 }))
      inqEdit.mediaFile = inqEdit.mediaFile.map((med) => ({ ...med, index: 0 }))
      inqEdit.ansType = optionsOfQuestion[index].ansType;
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inq.field));
    }
  };

  const isChangeCdCmContent = (contentOrgCd, contentOrgCm, contentAnsCd, contentAnsCm, caseOneOne) => {
    let typeChangeCD = {};
    let typeChangeCM = {};
    if (caseOneOne) {
      if (contentOrgCd.length && contentAnsCd.length) {
        CONTAINER_LIST.cdMap.forEach(cd => {
          if (contentOrgCd[0][getType(cd)].toString() !== contentAnsCd[0][getType(cd)].toString()) {
            // init object
            const keyChange = '0';
            if (!typeChangeCD[keyChange]) {
              typeChangeCD = {
                [keyChange]: [
                  { key: getType(cd), val: contentAnsCd[0][getType(cd)].toString() },
                ]
              }
            } else {
              typeChangeCD[keyChange].push(
                { key: getType(cd), val: contentAnsCd[0][getType(cd)].toString() },
              )
            }
          }
        })
      }
      if (contentOrgCm.length && contentAnsCm.length) {
        CONTAINER_LIST.cmMap.forEach(cm => {
          if (contentOrgCm[0][getType(cm)].toString() !== contentAnsCm[0][getType(cm)].toString()) {
            // init object
            const keyChange = '0';
            if (!typeChangeCM[keyChange]) {
              typeChangeCM = {
                [keyChange]: [
                  { key: getType(cm), val: contentAnsCm[0][getType(cm)].toString() },
                ]
              }
            } else {
              typeChangeCM[keyChange].push(
                { key: getType(cm), val: contentAnsCm[0][getType(cm)].toString() },
              )
            }
          }
        })
      }
    } else {
      if (contentOrgCd.length && contentAnsCd.length) {
        CONTAINER_LIST.cdMap.forEach(cd => {
          contentOrgCd.forEach((org, index) => {
            if (org[getType(cd)].toString() !== contentAnsCd[index][getType(cd)].toString()) {
              const keyChange = index;
              if (!typeChangeCD[keyChange]) {
                Object.assign(typeChangeCD, {
                  [keyChange]: [
                    { key: getType(cd), val: contentAnsCd[index][getType(cd)].toString() },
                  ]
                });
              } else {
                typeChangeCD[keyChange].push(
                  { key: getType(cd), val: contentAnsCd[index][getType(cd)].toString() },
                )
              }
            }
          })
        })
      }
      if (contentOrgCm.length && contentAnsCm.length) {
        CONTAINER_LIST.cmMap.forEach(cm => {
          contentOrgCm.forEach((org, index) => {
            if (org[getType(cm)].toString() !== contentAnsCm[index][getType(cm)].toString()) {
              const keyChange = index;
              if (!typeChangeCM[keyChange]) {
                Object.assign(typeChangeCM, {
                  [keyChange]: [
                    { key: getType(cm), val: contentAnsCm[index][getType(cm)].toString() },
                  ]
                });
              } else {
                typeChangeCM[keyChange].push(
                  { key: getType(cm), val: contentAnsCm[index][getType(cm)].toString() },
                )
              }
            }
          })
        })
      }
    }
    return { typeChangeCD, typeChangeCM };
  }

  const combineCdCmResolveAndAns = () => {
    const cloneContent = JSON.parse(JSON.stringify(content));
    const cloneOrgContent = JSON.parse(JSON.stringify(orgContent));
    // content original cd cm
    let contentOrgCd = [];
    let contentOrgCm = [];
    if (cloneOrgContent?.[getField(CONTAINER_DETAIL)].length) {
      contentOrgCd = cloneOrgContent?.[getField(CONTAINER_DETAIL)];
    }
    if (cloneOrgContent?.[getField(CONTAINER_MANIFEST)].length) {
      contentOrgCm = cloneOrgContent?.[getField(CONTAINER_MANIFEST)];
    }
    // content resolve inquiry cd cm
    let contentResolveCd = [];
    let contentResolveCm = [];
    if (cloneContent?.[getField(CONTAINER_DETAIL)].length) {
      contentResolveCd = cloneContent?.[getField(CONTAINER_DETAIL)];
    }
    if (cloneContent?.[getField(CONTAINER_MANIFEST)].length) {
      contentResolveCm = cloneContent?.[getField(CONTAINER_MANIFEST)];
    }
    // content customer answer or reply cd cm
    let contentCd = [];
    let contentCm = [];

    let stateFilRepADrf = [];
    if (comment.length > 0) {
      stateFilRepADrf = comment.filter(c => !['REP_Q_DRF', 'REP_Q_SENT'].includes(c.state));
    }
    if (['REP_A_SENT', 'ANS_SENT'].includes(question.state) || (stateFilRepADrf.length && stateFilRepADrf[0].state === 'REP_A_SENT')) {
      if (question.dataCdInq && question.dataCdInq.length) {
        contentCd = question.dataCdInq;
      }
      if (question.dataCmInq && question.dataCmInq.length) {
        contentCm = question.dataCmInq;
      }
    }
    let typeChanged;
    // CASE 1-1 CD CM
    if (contentResolveCd.length === 1 && contentResolveCm.length === 1 && contentCd.length === 1 && contentCm.length === 1) {
      typeChanged = isChangeCdCmContent(contentOrgCd, contentOrgCm, contentCd, contentCm, true);
    } else if (contentResolveCd.length && contentResolveCm.length && contentCd.length && contentCm.length) {
      // CASE n-n 1-n CD CM
      typeChanged = isChangeCdCmContent(contentOrgCd, contentOrgCm, contentCd, contentCm, false);
    }
    if (typeChanged && Object.keys(typeChanged.typeChangeCD).length) {
      contentResolveCd.forEach((contRes, index) => {
        const getValIndex = typeChanged.typeChangeCD[index];
        if (getValIndex && getValIndex.length) {
          getValIndex.forEach(valIndex => {
            if (valIndex.key === getType(CONTAINER_SEAL)) {
              contRes[valIndex.key] = valIndex.val.split(',')
            }
            else if (contRes?.[valIndex.key]) {
              contRes[valIndex.key] = valIndex.val
            }
          })
        }
      });
    }
    if (typeChanged && Object.keys(typeChanged.typeChangeCM).length) {
      contentResolveCm.forEach((contRes, index) => {
        const getValIndex = typeChanged.typeChangeCM[index];
        if (getValIndex && getValIndex.length) {
          getValIndex.forEach(valIndex => {
            if (contRes?.[valIndex.key] || contRes?.[valIndex.key] === '') {
              contRes[valIndex.key] = valIndex.val
            }
          })
        }
      });
    }
    setDataCD(contentResolveCd)
    setDataCM(contentResolveCm)
  }

  const onResolve = (hasUpload = false) => {
    props.setDefaultAction({ val: question, action: true });
    if (Array.isArray(question.content)) {
      setIsResolveCDCM(true);
    } else {
      setDisableCDCM(false);
      setIsResolve(true);
    }

    setIsResolveAndUpload(hasUpload);

    if (containerCheck.includes(question.field)) {
      setShowViewAll(false);
      setInqHasComment(false);
      question.isShowTableToReply = false;
      //
      combineCdCmResolveAndAns();
    }
    if (question.process === 'draft') setIsValidDate(false);
  };

  const getAnswerResolve = () => {
    let result = "";
    let isHadResolved = false;
    if (comment.length) {
      const mapStates = comment.filter(an => an.state !== null);
      for (let i = 0; i < mapStates.length; i++) {
        if (['REOPEN_A', 'REOPEN_Q', 'COMPL', 'UPLOADED', 'RESOLVED'].includes(mapStates[i].state)) {
          isHadResolved = true;
          break;
        }
      }
    }
    const data = inquiries.find(({ id }) => question.id === id);
    if (data && data.answerObj?.length && !isHadResolved) {
      result = (metadata.ans_type.choice === data.ansType) ? data.answerObj?.find(choice => choice.confirmed)?.content : "";
    }
    // Change full text BL type text option to value B or W
    if (question.field === metadata.field[BL_TYPE]) {
      if (result === ORIGINAL_BL) result = 'B'
      else if (result === SEAWAY_BILL) result = 'W'
    }
    return result;
  }

  const handleValidateInput = async (type, confirm = null, isWrapText = false, isLostFocus = false) => {
    // Check if no CM/CD
    if (['string'].includes(typeof textResolve) && !containerCheck.includes(question.field)) {
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

  const autoSendMailResolve = (inquiries, type, process, currentContent) => {
    const check = inquiries.filter(inq => inq.process === process && inq.receiver[0] === type);
    if (check.every(inq => ['COMPL', 'RESOLVED'].includes(inq.state))) {
      const ids = []
      check.forEach(inq => {
        const find = metadata?.field_options.find(field => field.value === inq.field);
        ids.push({ id: inq.id, field: find.label })
      })
      sendmailResolve({ type: type === 'customer' ? 'Customer' : 'Onshore', myBL, user, content: currentContent, ids, process })
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

  const checkAllItemUpload = (question) => {
    let result = false;
    const inqCheck = inquiries.filter(inq => (inq.process === 'pending' && inq.receiver.includes(question.receiver[0])));
    const ameCheck = inquiries.filter(inq => (inq.process === 'draft' && inq.receiver.includes(question.receiver[0])));

    // Check inquiry
    if (question.process === 'pending') {
      // Check other field has been UPLOADED, field disable upload only State = 'COMPL'
      result = !inqCheck.some(inq => (!['COMPL', 'UPLOADED'].includes(inq.state) && inq.id !== question.id && !(fieldsNotSendOPUS.includes(metadata['field_options'].find(f => f.value === inq.field).keyword) && inq.state === 'COMPL')));
    }
    // Check amendment
    if (question.process === 'draft') {
      // Check other field has been UPLOADED, field disable upload only State = 'COMPL'
      result = !ameCheck.some(ame => (!['RESOLVED', 'UPLOADED'].includes(ame.state) && ame.id !== question.id && !(fieldsNotSendOPUS.includes(metadata['field_options'].find(f => f.value === ame.field).keyword) && ame.state === 'RESOLVED')));
    }
    return result;
  }

  const checkAllInqAmeResolved = (question) => {
    let resultInq = false;
    let resultAme = false;

    const inqCheck = inquiries.filter(inq => (inq.process === 'pending' && inq.receiver.includes(question.receiver[0])));
    const ameCheck = inquiries.filter(inq => (inq.process === 'draft' && inq.receiver.includes(question.receiver[0])));

    // Check inquiry
    // Check other field has been UPLOADED, field disable upload only State = 'COMPL'
    resultInq = !inqCheck.some(inq => (
      !['COMPL', 'UPLOADED'].includes(inq.state)
      && inq.id !== question.id
      && !fieldsNotSendOPUS.includes(
        metadata['field_options'].find(f => f.value === inq.field).keyword
        && inq.state === 'COMPL'
      )
    ));
    // Check amendment
    // Check other field has been UPLOADED, field disable upload only State = 'COMPL'
    resultAme = !ameCheck.some(ame => (
      !['RESOLVED', 'UPLOADED'].includes(ame.state)
      && ame.id !== question.id
      && !fieldsNotSendOPUS.includes(
        metadata['field_options'].find(f => f.value === ame.field).keyword
        && ame.state === 'RESOLVED'
      )
    ));

    return resultInq && resultAme;
  }

  const onConfirm = (isWrapText = false) => {
    props.setDefaultAction({ val: {}, action: false });
    let contentField = '';
    let isAllItemUpload = false;
    const contsNoChange = {};
    if (!validationCDCM) {
      setDisableAcceptResolve(false);
      return;
    }
    if (containerCheck.includes(question.field) && question.process === 'pending') {
      const contentCDCM = {
        [getField(CONTAINER_DETAIL)]: getDataCD,
        [getField(CONTAINER_MANIFEST)]: getDataCM
      };
      contentField = contentCDCM;
      if (Array.isArray(contentField)) {
        const orgContentField = content[question.field];
        const contsNo = [];
        contentField.forEach((obj, index) => {
          if (question.process === 'pending') {
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
              if ([CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT, CM_WEIGHT, CM_MEASUREMENT].includes(getTypeName) && !isNaN(obj[question.inqType])) {
                obj[question.inqType] = (typeof obj[question.inqType] === 'string' ? parseFloat(obj[question.inqType]).toFixed(3) : obj[question.inqType])
              } else {
                obj[question.inqType] = (typeof obj[question.inqType] === 'string' && getTypeName !== 'HS/HTS/NCM Code') ? obj[question.inqType].toUpperCase().replace(/^0*/g, "").trim() : obj[question.inqType];
              }
            }
          } else if (question.process === 'draft') {
            // map container no
            contsNo.push(obj?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
            const containerNo = orgContentField[index][getType(CONTAINER_NUMBER)];
            contsNoChange[containerNo] = obj[getType(CONTAINER_NUMBER)];
          }
        });

        validationCDCMContainerNo(contsNo);
      }
    } else if (isSeparate) {
      if (textResolveSeparate.name.trim() === '' && textResolveSeparate.address.trim() === '') {
        contentField = NO_CONTENT_AMENDMENT;
      } else {
        contentField = `${textResolveSeparate.name.toUpperCase().trim()}\n${textResolveSeparate.address.toUpperCase().trim()}`;
      }
    } else if (typeof textResolve === 'string') {
      contentField = textResolve ? textResolve.toUpperCase().trim() : NO_CONTENT_AMENDMENT;
    } else {
      contentField = textResolve;
    }

    const body = {
      fieldId: question.field,
      inqId: question?.id || tempReply?.answer.id,
      fieldContent: contentField,
      blId: myBL.id,
      contsNoChange,
      fieldNameContent:
        textResolveSeparate.name.trim() === '' && textResolveSeparate.address.trim() === ''
          ? NO_CONTENT_AMENDMENT
          : textResolveSeparate.name.toUpperCase().trim(),
      fieldAddressContent: textResolveSeparate.address.toUpperCase().trim() || '',
      isWrapText: [EXPORT_REF].map((key) => metadata.field?.[key]).includes(question.field)
        ? true
        : isWrapText,
      hasUpload: isResolveAndUpload,
      isExpRefField: [EXPORT_REF].map((key) => metadata.field?.[key]).includes(question.field)
    };
    if (containerCheck.includes(question.field)) {
      setIsResolveCDCM(true);
    }
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    isResolveAndUpload && dispatch(FormActions.isLoadingProcess(true));
    resolveInquiry(body)
      .then((res) => {
        if (isResolveAndUpload && res.status === 'F') {
          setDisableAcceptResolve(false);
          dispatch(AppAction.showMessage({ message: res.message || res.warning, variant: 'error', icon: 'failed' }));
        } else {
          if (editedIndex !== -1) {
            // setQuestion((q) => ({ ...q, state: 'COMPL' }));
            optionsInquires[editedIndex].state = isResolveAndUpload ? 'UPLOADED' : 'COMPL';
            optionsInquires[editedIndex].createdAt = res.updatedAt;
            const receiver = optionsInquires[editedIndex].receiver[0];
            const process = optionsInquires[editedIndex].process;
            if (process === 'draft') {
              const optionsMinimize = [...listMinimize];
              const index = optionsMinimize.findIndex((e) => e.id === optionsInquires[editedIndex].id);
              optionsMinimize[index].id = res.id;
              optionsInquires[editedIndex].id = res.id;
              optionsInquires[editedIndex].state = isResolveAndUpload ? 'UPLOADED' : 'RESOLVED';
              dispatch(InquiryActions.setListMinimize(optionsMinimize));
            }
            //auto send mail if every inquiry is resolved
            autoSendMailResolve(optionsInquires, receiver, process, res?.content || content);
          }

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
          dispatch(InquiryActions.setInquiries(optionsInquires));
          dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));

          props.getUpdatedAt();
          setIsResolve(false);
          setIsResolveCDCM(false);
          setViewDropDown('');

          let newContent = { ...content };
          // sync content amendment
          if (optionsInquires[editedIndex]?.receiver?.[0].toUpperCase() === "ONSHORE") {
            newContent = JSON.parse(sessionStorage.getItem("content"));
          }

          if (!isSeparate || isAlsoNotifies) {
            if (containerCheck.includes(question.field)) {
              setQuestion((q) => ({ ...q, content: isAlsoNotifies ? res.contentWrapText.fieldContentWrap : contentField }));
              newContent = { ...newContent, [containerCheck[0]]: res.content[containerCheck[0]], [containerCheck[1]]: res.content[containerCheck[1]] };
            }
            else newContent = {
              ...newContent,
              [question.field]: isAlsoNotifies ? res.contentWrapText.fieldContentWrap : contentField,
              [metadata.field[DESCRIPTION_OF_GOODS]]: res.content[metadata.field[DESCRIPTION_OF_GOODS]]
            };
          } else {
            const contentWrapText = res?.contentWrapText || '';
            const arrFields = [SHIPPER, CONSIGNEE, NOTIFY];
            const fieldIndex = arrFields.findIndex(key => metadata.field[key] === question.field);
            // setContent here
            newContent = {
              ...newContent,
              [metadata.field?.[`${arrFields[fieldIndex]}Address`]]: isWrapText ? (contentWrapText.fieldAddressContentWrap || '') : textResolveSeparate.address.trim(),
              [metadata.field?.[`${arrFields[fieldIndex]}Name`]]: isWrapText ? (contentWrapText.fieldNameContentWrap || '') : textResolveSeparate.name.trim(),
              [question.field]: isWrapText ? `${contentWrapText.fieldNameContentWrap}\n${contentWrapText.fieldAddressContentWrap}` : contentField,
              [metadata.field[DESCRIPTION_OF_GOODS]]: res.content[metadata.field[DESCRIPTION_OF_GOODS]]
            };
          }
          dispatch(InquiryActions.setContent(newContent));

          // sync content amendment
          // save onshore's content into sessionStorage
          if (optionsInquires[editedIndex]?.receiver?.[0].toUpperCase() === "ONSHORE") {
            sessionStorage.setItem('content', JSON.stringify(newContent));
          }
          // sync resolve inquiry / amendment
          syncData(
            { inquiries: optionsInquires, content: newContent, listMinimize },
            optionsInquires[editedIndex]?.receiver?.[0].toUpperCase() || "CUSTOMER" // if receiver is undefined -> customer amendment
          );

          // Case click btn: Resolve & Upload
          isAllItemUpload = checkAllItemUpload(question);
          if (isAllItemUpload && question.process === 'pending') {
            // BL Inquired Resolved (BR), Upload all to Opus. RO: Return to Customer via BLink
            let filterPending = optionsInquires.filter(inq => inq.process === 'pending')
            dispatch(Actions.updateOpusStatus(myBL.bkgNo, 'BR', question.receiver.includes('customer') ? 'RO' : 'RW', {
              idReply: filterPending.length ? filterPending.map(q => q.id) : [],
              action: 'pending'
            }));
          }
          if (question.process === 'draft' && checkAllInqAmeResolved(question)) {
            // BL Inquired Resolved (BR), Upload all to Opus. RO: Return to Customer via BLink
            let filterDraft = optionsInquires.filter(inq => inq.process === 'draft')
            dispatch(Actions.updateOpusStatus(myBL.bkgNo, 'BS', '', {
              idReply: filterDraft.length ? filterDraft.map(q => q.id) : [],
              action: 'draft'
            }));
          }

          if (myBL && myBL.bkgNo) {
            setStateReplyDraft(false);
            setDisableAcceptResolve(false);
            setDisableReopen(false);
            if (isResolveAndUpload) dispatch(AppAction.showMessage({ message: 'Upload to OPUS successfully', variant: 'success' }));
          }
        }
      })
      .catch((error) => handleError(dispatch, error))
      .finally(() => dispatch(FormActions.isLoadingProcess(false)));
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
          let optionAmendment = [];
          let newContent = { ...content };
          let editedIdx = optionsInquires.findIndex(inq => question.id === inq.id);
          if (optionsInquires[editedIdx]?.process === 'pending') {
            optionsInquires[editedIdx].state = 'UPLOADED';
            dispatch(InquiryActions.setInquiries(optionsInquires));
          } else {
            // Update list amendment
            editedIdx = optionsInquires.findIndex(inq => (question.field === inq.field && inq.process === 'draft'));
            if (editedIdx !== -1) {
              optionsInquires[editedIdx].state = 'UPLOADED';
              dispatch(InquiryActions.setInquiries(optionsInquires));

              optionAmendment = [...listCommentDraft];
              editedIdx = optionAmendment.findIndex(ame => question.id === ame.id);
              if (optionAmendment[editedIdx]) {
                optionAmendment[editedIdx].state = 'UPLOADED';
                dispatch(InquiryActions.setListCommentDraft(optionAmendment));
              }
            }
          }

          // Set new Content when EBL has new data
          if (res?.newData) newContent = { ...newContent, ...res.newData };
          if (res.warning) {
            // dispatch(FormActions.toggleWarningUploadOpus({ status: true, message: res.warning, icon: 'warning' }));
            dispatch(AppAction.showMessage({ message: res.warning, variant: 'warning' }));
          } else {
            // dispatch(FormActions.toggleWarningUploadOpus({ status: true, message: 'Upload to OPUS successfully', icon: 'success' }));
            dispatch(AppAction.showMessage({ message: 'Upload to OPUS successfully', variant: 'success' }));
          }

          // change status
          const filterFieldPendingNotUploadOpus = optionsInquires.filter(op => op.process === 'pending' && listFieldDisableUpload.includes(op.field) && ((op.receiver.length && op.receiver[0]) === (question.receiver.length && question.receiver[0])));
          const filterFieldDrfNotUploadOpus = optionsInquires.filter(op => op.process === 'draft' && listFieldDisableUpload.includes(op.field) && ((op.receiver.length && op.receiver[0]) === (question.receiver.length && question.receiver[0])));
          //
          const mapFieldPending = filterFieldPendingNotUploadOpus.map(f => f.field);
          const inqsPending = optionsInquires?.filter(inq => inq.process === 'pending' && !mapFieldPending.includes(inq.field) && ((inq.receiver.length && inq.receiver[0]) === (question.receiver.length && question.receiver[0])));
          //
          const mapFieldDraft = filterFieldDrfNotUploadOpus.map(f => f.field);
          const inqsDraft = optionsInquires?.filter(inq => inq.process === 'draft' && !mapFieldDraft.includes(inq.field) && ((inq.receiver.length && inq.receiver[0]) === (question.receiver.length && question.receiver[0])));
          //
          if (myBL && myBL.bkgNo) {
            if (
              question.process === "pending"
              && inqsPending.length
              && inqsPending.every(q => ['UPLOADED'].includes(q.state))
              && (filterFieldPendingNotUploadOpus.length ? filterFieldPendingNotUploadOpus.every(q => ['COMPL', 'UPLOADED'].includes(q.state)) : true)
            ) {
              if (question.receiver && question.receiver.length && question.receiver.includes('customer') && inqsPending.filter(q => q.receiver.includes('customer')).length > 0) {
                // BL Inquired Resolved (BR), Upload all to Opus. RO: Return to Customer via BLink
                const filters = inqsPending.filter(q => q.receiver.includes('customer'))
                dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BR", "RO", {
                  idReply: filters.length ? filters.map(q => q.id) : [],
                  action: 'pending'
                }))
              }
              if (question.receiver && question.receiver.length && question.receiver.includes('onshore') && inqsPending.filter(q => q.receiver.includes('onshore')).length > 0) {
                //BL Inquired Resolved (BR) , Upload all to Opus.  RW: Return to Onshore via BLink
                const filters = inqsPending.filter(q => q.receiver.includes('onshore'))
                dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BR", "RW", {
                  idReply: filters.length ? filters.map(q => q.id) : [],
                  action: 'pending'
                }))
              }
            } else if (
              question.process === 'draft'
              && inqsDraft.length
              && inqsDraft.every(q => ['UPLOADED'].includes(q.state))
              && (filterFieldDrfNotUploadOpus.length ? filterFieldDrfNotUploadOpus.every(q => ['COMPL', 'RESOLVED', 'UPLOADED'].includes(q.state)) : true)
            ) {
              // BL Amendment Success (BS), Upload all to Opus.
              dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BS", "", {
                idReply: inqsDraft.length ? inqsDraft.map(q => q.id) : [],
                action: 'draft'
              }))
            }
          }

          dispatch(InquiryActions.setContent(newContent));

          // sync upload inquiry / amendment
          syncData(
            { inquiries: optionsInquires },
            optionsInquires[editedIdx]?.receiver?.[0].toUpperCase() || "CUSTOMER"
          );
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
    props.setDefaultAction({ val: {}, action: false });
    dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    setTextResolve(content[question.field] || '');
    setIsResolve(false);
    setIsResolveCDCM(false);
    setDisableCDCM(true);
    dispatch(InquiryActions.setCancelAmePopup(!cancelAmePopup));
    // setTempReply({});
    dispatch(FormActions.setDirtyReload({ inputReply: false }));
  };

  const inputText = (e, isDate = false) => {
    !validateInput?.isValid && dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    if (isDate) {
      const originTime = content[question.field] ? formatDate(content[question.field], 'YYYY-MM-DD') : '';
      if (!isNaN(e?.getTime())) {
        setTextResolve(e.toISOString());
        if (question.process === 'pending') {
          setIsValidDate(originTime !== formatDate(e?.toISOString(), 'YYYY-MM-DD'))
        } else setIsValidDate(true);
      } else {
        setTextResolve(e);
        setIsValidDate(true);
      }
    } else {
      setTextResolve(e.target.value);
    }
    dispatch(FormActions.setDirtyReload({ inputReply: true }));
  };

  const inputTextSeparate = (e, type) => {
    dispatch(FormActions.setDirtyReload({ inputReply: true }));
    !validateInput?.isValid && dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    setTextResolveSeparate(Object.assign({}, textResolveSeparate, { [type]: e.target.value }));
  };

  const handleChangeContentReply = (e, type = '', isDate = false) => {
    let value = '';
    if (isDate) {
      if (!isNaN(e?.getTime())) {
        value = e.toISOString();
        setIsValidDate(false);
      } else {
        value = e;
        setIsValidDate(true);
      }
    } else {
      value = e.target.value;
    }
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
    dispatch(FormActions.setDirtyReload({ inputReply: true }));
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

  const autoUpdateCDCM = (contentCDCM) => {
    // Auto Update CD CM
    if (containerCheck.includes(question.field)) {
      //CASE 1-1 CD CM
      if (contentCDCM.length === 1 && content[question.field === getField(CONTAINER_DETAIL) ? containerCheck[1] : containerCheck[0]].length === 1) {
        let fieldCdCM = question.field === getField(CONTAINER_DETAIL) ? containerCheck[1] : containerCheck[0];
        let arr = content[fieldCdCM]
        if (arr.length > 0) {
          arr[0][getType(CONTAINER_NUMBER)] = contentCDCM[0][getType(CONTAINER_NUMBER)];
          if (question.field === getField(CONTAINER_DETAIL)) {
            CONTAINER_LIST.cdNumber.map((key, index) => {
              arr[0][getType(CONTAINER_LIST.cmNumber[index])] = contentCDCM[0][getType(key)];
            });
            CONTAINER_LIST.cdUnit.map((key, index) => {
              arr[0][getType(CONTAINER_LIST.cmUnit[index])] = contentCDCM[0][getType(key)];
            });
          } else {
            CONTAINER_LIST.cmNumber.map((key, index) => {
              arr[0][getType(CONTAINER_LIST.cdNumber[index])] = contentCDCM[0][getType(key)];
            });
            CONTAINER_LIST.cmUnit.map((key, index) => {
              arr[0][getType(CONTAINER_LIST.cdUnit[index])] = contentCDCM[0][getType(key)];
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
        contentCDCM.forEach((obj, index) => {
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
            contentCDCM.forEach((cd) => {
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
              let cmOfCd = [...new Set((contentCDCM || []).filter(cm =>
                cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
              ))]
              if (cmOfCd.length > 0) {
                CONTAINER_LIST.cmNumber.map((key, index) => {
                  let total = 0;
                  cmOfCd.map((cm) => {
                    total += parseNumberValue(cm[getType(key)]);
                  });
                  cd[getType(CONTAINER_LIST.cdNumber[index])] = parseFloat(total.toFixed(3));
                });
                CONTAINER_LIST.cmUnit.map((key, index) => {
                  cmOfCd.map((cm) => {
                    cd[getType(CONTAINER_LIST.cdUnit[index])] = cm[getType(key)];
                  })
                })
              }
            })
          }
          saveEditedField({ field: fieldCdCM, content: { content: fieldAutoUpdate, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'editAmendment' });
        }
        validationCDCMContainerNo(contsNo)
      }
    }
  }

  const isEditedReplyCDCM = () => {
    let contentCDCM = {};
    if (containerCheck.includes(question.field)) {
      if (question.process === 'pending') {
        if (user.role === 'Guest') {
          contentCDCM = {
            [getField(CONTAINER_DETAIL)]: getDataCD,
            [getField(CONTAINER_MANIFEST)]: getDataCM
          };
          // check edited content cd cm
          if (
            question.oldData
            && Object.keys(question.oldData).length
            && JSON.stringify(question.oldData.cdCmDataOld) === JSON.stringify(contentCDCM)
          ) {
            setDisableSaveCdCm(true);
          }
          // check edited content cd cm
          if (
            question.oldData
            && Object.keys(question.oldData).length
            && JSON.stringify(question.oldData.cdCmDataOld) === JSON.stringify(contentCDCM)
          ) {
            setDisableSaveCdCm(true);
          }
          // check empty content input
          if (
            Object.keys(tempReply).length
            && question.oldData
            && Object.keys(question.oldData).length
            && question.oldData.contentOld === tempReply.answer.content
          ) {
            setDisableSaveCdCm(true);
          }
          if (tempReply && Object.keys(tempReply).length && tempReply.answer.content === '') {
            setDisableSaveCdCm(true);
          }
          if (question.oldData && Object.keys(question.oldData).length) {
            if (JSON.stringify(question.oldData.cdCmDataOld) !== JSON.stringify(contentCDCM)) {
              setDisableSaveCdCm(false);
            }
          }
          if (
            Object.keys(tempReply).length
            && question.oldData
            && Object.keys(question.oldData).length
          ) {
            if (question.oldData.contentOld !== tempReply.answer.content) {
              setDisableSaveCdCm(false);
            }
          }
        }
        else if (
          (question.type === 'REP' || (user.role === 'Admin' && question.state === 'ANS_SENT'))
          && Object.keys(tempReply).length
          && question.oldData
          && Object.keys(question.oldData).length) {
          if (tempReply.answer.content === '') {
            setDisableSaveCdCm(true);
          } else if (question.oldData.contentOld !== tempReply.answer.content) {
            setDisableSaveCdCm(false);
          } else {
            setDisableSaveCdCm(true);
          }
        }
      } else if (question.process === 'draft') {
        if (!question.state.includes("AME_DRF")
          && (!question.state.includes("AME_SENT") || user.role !== 'Guest')
          && (['string'].includes(typeof tempReply?.answer?.content) ? !tempReply?.answer?.content?.trim() : !tempReply?.answer?.content)
          && (!tempReply.mediaFiles || tempReply.mediaFiles.length === 0)) {
          setDisableSaveCdCm(true)
        } else {
          setDisableSaveCdCm(false)
        }
      }
    }
  }

  useEffect(() => {
    isEditedReplyCDCM();
  }, [getDataCD, getDataCM, tempReply, question.oldData]);

  const onSaveReply = async () => {
    props.setDefaultAction({ val: {}, action: false });

    setDisableSaveReply(true);
    dispatch(FormActions.setDirtyReload({ inputReply: false }))
    const mediaListId = [];
    let mediaListAmendment = [];
    const mediaRest = [];
    let mediaFilesResp;
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    setDisableCDCM(true);
    const newMediaFile = [];
    if (tempReply.mediaFiles?.length) {
      const formData = new FormData();
      tempReply.mediaFiles.forEach((mediaFileAns, index) => {
        if (mediaFileAns.id === null) {
          formData.append('files', mediaFileAns.data);
          formData.append('bkgNo', myBL.bkgNo);
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
        let answerCDCM = {};
        let contentReply;
        let replyType;
        let inqAns;
        if (containerCheck.includes(question.field) && user.role === 'Guest') {
          const contentCDCM = {
            [getField(CONTAINER_DETAIL)]: getDataCD,
            [getField(CONTAINER_MANIFEST)]: getDataCM
          };
          answerCDCM.content = JSON.stringify(contentCDCM);
          answerCDCM.type = metadata.ans_type['paragraph'];
          if (!Object.keys(tempReply).length) {
            replyType = metadata.ans_type['paragraph'];
            inqAns = {
              inquiry: question.id,
              confirm: false,
              type: 'REP'
            }
            contentReply = ''
          }
        }
        if (Object.keys(tempReply).length) {
          replyType = tempReply?.answer.type;
          inqAns = tempReply?.inqAns;
          contentReply = ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim() || ONLY_ATT) : (tempReply.answer.content || ONLY_ATT);
        }

        const reqReply = {
          inqAns,
          answer: {
            content: contentReply,
            type: replyType
          },
          answerCDCM,
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

            // sync create comment inquiry
            syncData({ inquiries: optionsInquires });

            props.getUpdatedAt();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            dispatch(InquiryActions.checkSend(true));
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
            setViewDropDown('');
            setDisableSaveReply(false);
            dispatch(InquiryActions.setReply(false));
          }).catch((error) => handleError(dispatch, error));
      } else {
        let answerCDCM = {};
        let contentReply;
        if (containerCheck.includes(question.field) && Object.keys(getContentCDCMInquiry).length && user.role === 'Guest') {
          const contentCDCM = {
            [getField(CONTAINER_DETAIL)]: getDataCD,
            [getField(CONTAINER_MANIFEST)]: getDataCM
          };
          answerCDCM.content = JSON.stringify(contentCDCM);
          answerCDCM.ansCDCMId = getContentCDCMInquiry.ansId;
          if (Object.keys(tempReply).length) {
            contentReply = ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim()) : (tempReply.answer.content)
          }
        } else {
          contentReply = ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim() || ONLY_ATT) : (tempReply.answer.content || ONLY_ATT);
        }
        // Edit
        const reqReply = {
          content: contentReply,
          mediaFiles: mediaListId.map(media => media.id),
          answerCDCM,
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
            if (mediaListAmendment.length) optionsInquires[editedIndex].mediaFilesAnswer.push(...mediaListAmendment);
            dispatch(InquiryActions.setInquiries(optionsInquires));

            // sync edit comment inquiry
            syncData({ inquiries: optionsInquires });

            props.getUpdatedAt();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            // if (props.isInquiryDetail) {
            //   setSaveComment(!isSaveComment);
            // }
            //
            dispatch(InquiryActions.checkSend(true));
            setDisableSaveReply(false);
            dispatch(InquiryActions.setReply(false));
            dispatch(
              AppAction.showMessage({ message: 'Save Reply SuccessFully', variant: 'success' })
            );
          }).catch((error) => handleError(dispatch, error));
      }
    } else {
      if (!tempReply.answer?.id) { // Create reply amendment
        const reqReply = {
          field: question.field,
          content: {
            content: ['string'].includes(typeof tempReply.answer.content) ? (tempReply.answer.content.trim() || ONLY_ATT) : (tempReply.answer.content || ONLY_ATT),
            mediaFile: mediaListAmendment
          },
          contentCDCM: question.contentReplyCDCM,
          mybl: myBL.id,
          action: 'reply'
        };
        saveEditedField({ ...reqReply })
          .then((res) => {
            optionsInquires[editedIndex].createdAt = res.createdAt;
            if (question.state.includes('AME_DRF')) {
              dispatch(InquiryActions.setContent({
                ...content,
                [question.field]: question.content
              }));
              optionsInquires[editedIndex].state = 'AME_DRF';
            } else {
              optionsInquires[editedIndex].state = 'REP_DRF';
              if (user.role === 'Guest' && containerCheck.includes(question.field)) {
                const contentCDCM = question.contentReplyCDCM;
                dispatch(InquiryActions.setContent({
                  ...content,
                  [question.field]: contentCDCM
                }));
                // Auto update CD CM reply
                const fieldCheck = question.field === containerCheck[0] ? containerCheck[1] : containerCheck[0];
                const isCmSent = [...optionsInquires].find(inq => inq.process === 'draft' && inq.field === fieldCheck && (['AME_DRF', 'REP_DRF', 'REP_AME_DRF'].includes(inq.state) || (['REP_SENT', 'REP_AME_SENT'].includes(inq.state) && inq.creator?.accountRole === 'Admin'))
                ) || ![...optionsInquires].find(inq => inq.process === 'draft' && inq.field === fieldCheck);
                if (isCmSent) {
                  autoUpdateCDCM(contentCDCM);
                }
              }
            }
            dispatch(InquiryActions.setInquiries(optionsInquires));
            props.getUpdatedAt();
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            setDisableSaveReply(false);
            dispatch(InquiryActions.setReply(false));
            dispatch(AppAction.showMessage({ message: 'Save Reply successfully', variant: 'success' }));
            dispatch(InquiryActions.setNewAmendment({ oldAmendmentId: question.id, newAmendment: res.newAmendment }));

            // sync create reply amendment
            syncData({ inquiries: optionsInquires });
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
            if (!isReply || question.state.includes('AME_')) {
              newContent = newContent.toUpperCase();
              if (isDateTime && newContent) {
                newContent = new Date(newContent).toISOString();
              }
            }
          }
        }

        const reqReply = {
          field: question.field,
          content: {
            content: newContent,
            mediaFile: mediaListAmendment
          },
          contentCDCM: question.contentReplyCDCM,
          mybl: myBL.id
        };

        updateDraftBLReply({ ...reqReply }, tempReply.answer?.id)
          .then((res) => {
            if (res) dispatch(InquiryActions.setNewAmendment({ newAmendment: res.newAmendment }));

            optionsInquires[editedIndex].mediaFile = mediaListAmendment;
            optionsInquires[editedIndex].createdAt = res.createdAt;
            setDisableSaveReply(false);
            const fieldUpdate = containerCheck[0] === question.field ? containerCheck[1] : containerCheck[0];

            let contentCDCM = question.contentReplyCDCM;
            let newDrfRepContent = { ...content };
            if (question.state.includes('AME_')) {
              if (containerCheck.includes(question.field)) {
                const isResolvedAmend = optionsInquires.find(inq => inq.process === 'draft' && inq.field === fieldUpdate && ['RESOLVED', 'UPLOADED', 'AME_SENT', 'REP_SENT'].includes(inq.state));
                const currState = optionsInquires.find(inq => inq.process === 'draft' && inq.field === question.field && ['AME_DRF', 'REP_DRF'].includes(inq.state));
                newDrfRepContent = { ...newDrfRepContent, [res.newAmendment?.field]: newContent, [fieldUpdate]: isResolvedAmend && currState ? content[fieldUpdate] : res.contentIsMap }
              } else {
                newDrfRepContent = { ...newDrfRepContent, [res.newAmendment?.field]: newContent }
              }
              contentCDCM = tempReply.answer.content;
            } else if (user.role === 'Guest' && containerCheck.includes(question.field)) {
              const isResolved = optionsInquires.find(inq => inq.process === 'draft' && inq.field === fieldUpdate && ['RESOLVED', 'UPLOADED', 'AME_SENT', 'REP_SENT'].includes(inq.state));
              const currState = optionsInquires.find(inq => inq.process === 'draft' && inq.field === question.field && ['AME_DRF', 'REP_DRF'].includes(inq.state));
              newDrfRepContent = { ...newDrfRepContent, [question.field]: question.contentReplyCDCM, [fieldUpdate]: isResolved && currState ? content[fieldUpdate] : res.contentIsMap };
            }

            setIsResolveCDCM(false);
            dispatch(InquiryActions.setInquiries(optionsInquires));
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            dispatch(InquiryActions.setContent(newDrfRepContent));
            props.getUpdatedAt();

            // sync edit amendment / reply amendment
            syncData(
              {
                inquiries: optionsInquires,
                ...(optionsInquires[editedIndex].state.includes('AME_') && { content: newDrfRepContent })
              },
              optionsInquires[editedIndex].state === 'REP_SENT' ?
                (user.userType === "ADMIN" ? "CUSTOMER" : "ADMIN") :
                (optionsInquires[editedIndex].state === 'AME_SENT' ? "ADMIN" : "")
            );
          })
          .catch((err) => handleError(dispatch, err));
      }
    }
    setIsReply(false);
    setIsReplyCDCM(false);
    dispatch(InquiryActions.setExpand(expandFileQuestionIds.filter(item => item !== question.id)));
  }

  const cancelReply = (q) => {
    dispatch(FormActions.setDirtyReload({ inputReply: false }));
    setDisableCDCM(true);
    setDisableCDCMAmendment(true);
    dispatch(InquiryActions.setReply(false));
    setIsReply(false);
    setIsReplyCDCM(false);
    setAllowEdit(false);
    const reply = { ...question };
    reply.mediaFilesAnswer = reply.mediaFile;
    reply.mediaFile = [];
    setQuestion(reply);
    setFilepaste('');
    setDropfiles([]);
    setSaveComment(!isSaveComment);
    dispatch(InquiryActions.setExpand(expandFileQuestionIds.filter(item => item !== question.id)));
  };

  const onReply = (q) => {
    if (triggerOnpaste.current) {
      triggerOnpaste.current.focus({ preventScroll: true });
    }
    // case: Reply Answer
    props.setDefaultAction({ val: question, action: true });
    const optionsInquires = [...inquiries];
    if (user.role === 'Guest') {
      setDisableCDCM(false);
      setDisableCDCMAmendment(false);
    }
    if (containerCheck.includes(q.field)) {
      if (q.oldData && Object.keys(q.oldData).length) {
        dispatch(InquiryActions.setOldDataCdCm(q.oldData));
      }
      if (q.dataCdInq && Object.keys(q.dataCdInq).length) {
        dispatch(InquiryActions.setDataCdInq(q.dataCdInq));
      }
      if (q.dataCmInq && Object.keys(q.dataCmInq).length) {
        dispatch(InquiryActions.setDataCmInq(q.dataCmInq));
      }
    }
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
      dispatch(InquiryActions.setReply(true));
      setQuestion(q => ({ ...q, showIconReply: false, showIconAttachAnswerFile: false, showIconAttachReplyFile: true }));
      setTempReply({})
    }
  };

  // TODO
  const handleEdit = (q) => {
    if (triggerOnpaste.current) {
      triggerOnpaste.current.focus({ preventScroll: true });
    }
    props.setDefaultAction({ val: q, action: true });
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => q.id === inq.id);
    // case: Edit Answer
    const reply = { ...question };
    reply.showIconEdit = false;
    reply.showIconReply = false;
    setFilepaste('');
    setShowViewAll(false);
    if (user.role === 'Guest') {
      dispatch(InquiryActions.addAmendment())
      setDisableCDCM(false);
      setDisableCDCMAmendment(false);
    }
    if (containerCheck.includes(q.field)) {
      if (q.oldData && Object.keys(q.oldData).length) {
        dispatch(InquiryActions.setOldDataCdCm(q.oldData));
      }
      if (q.dataCdInq && Object.keys(q.dataCdInq).length) {
        dispatch(InquiryActions.setDataCdInq(q.dataCdInq));
      }
      if (q.dataCmInq && Object.keys(q.dataCmInq).length) {
        dispatch(InquiryActions.setDataCmInq(q.dataCmInq));
      }
    }
    if (['ANS_DRF', 'ANS_SENT'].includes(question.state) || (user.role === 'Guest' && ['REP_Q_DRF'].includes(question.state)) || (isHasEditCdCm && question.type !== 'REP')) {
      optionsInquires[editedIndex].showIconEdit = false;
      optionsInquires[editedIndex].showIconReply = false;
      optionsInquires[editedIndex].showIconAttachReplyFile = false;
      optionsInquires[editedIndex].showIconAttachAnswerFile = true;
      // set default value cd cm
      if (
        containerCheck.includes(reply.field)
        &&
        (isJsonText(reply.answerObj[0].content) || reply.ansForType !== 'ANS_CD_CM')
      ) {
        optionsInquires[editedIndex].paragraphAnswer = {
          inquiry: reply.id,
          content: reply.answerObj[0].content || '',
        }
      }
      optionsInquires[editedIndex].selectChoice = '';
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
      dispatch(InquiryActions.setReply(true));
      setIsReply(true);
      setIsResolve(false);
      if (!containerCheck.includes(reply.field)) {
        reply.content = '';
      }
      reply.mediaFilesAnswer = [];
      reply.mediaFile = [];
      reply.showIconAttachReplyFile = true;
      reply.showIconAttachAnswerFile = false;
    }
    setQuestion(reply);
    setStateReplyDraft(false);
    setViewDropDown('');
    setInqHasComment(false);
    setIsDateTime(isDateField(metadata, question.field));
    dispatch(InquiryActions.setExpand([...expandFileQuestionIds, question.id]));
  }

  const reOpen = (idInq) => {
    props.setDefaultAction({ val: {}, action: false });
    reOpenInquiry(idInq)
      .then((res) => {
        const optionsInquires = [...inquiries];
        if (res) {
          let idx = -1;
          if (question.process === 'draft') {
            const optionAmendment = [...listCommentDraft.filter(({ id }) => id !== question.id)];
            dispatch(InquiryActions.setListCommentDraft(optionAmendment));

            idx = optionsInquires.findIndex(inq => (inq.field === question.field && inq.process === 'draft'))
            // optionsInquires[idx].state = res?.prevState;
            optionsInquires[idx].state = user.role === 'Admin' ? 'REOPEN_Q' : 'REOPEN_A';
            optionsInquires[idx].createdAt = res.updatedAt;
          } else {
            idx = optionsInquires.findIndex(inq => inq.id === idInq)
            // optionsInquires[idx].state = res?.prevState;
            optionsInquires[idx].createdAt = res.updatedAt;
            optionsInquires[idx].state = user.role === 'Admin' ? 'REOPEN_Q' : 'REOPEN_A';
          }
          dispatch(InquiryActions.setInquiries(optionsInquires));

          // sync reopen inquiry / amendment
          syncData(
            { inquiries: optionsInquires },
            (user.userType === "ADMIN" ? optionsInquires[idx].receiver?.[0].toUpperCase() : "ADMIN") || ""
          );

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

  // useEffect(() => {
  //   const el = document.getElementById(question.id);
  //   if (el && el.scrollHeight > el.clientHeight) setShowViewAll(true);
  // }, [isLoadedComment]);

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
          <span style={{ display: 'flex', alignItems: 'center', color: '#F39200' }}>
            <WarningIcon fontSize='small' />
            &nbsp;{`Countries: ${prohibitedInfo?.countries.join(', ')}`}
          </span>
        }
        {(prohibitedInfo?.danger_cargo.length > 0) &&
          <>
            <span style={{ display: 'flex', alignItems: 'center', color: '#F39200' }}>
              <WarningIcon fontSize='small' />
              &nbsp;{`Danger Cargo: ${prohibitedInfo?.danger_cargo.join(', ')}`}
            </span>
          </>
        }
      </>)
    }

    return { isErr, textHelper };
  }

  const renderContent = (content) => {
    let result = content || '';
    if (result && isDateTime && ['AME_DRF', 'AME_SENT', 'AME_ORG', 'REOPEN_Q', 'REOPEN_A', 'COMPL', 'RESOLVED', 'UPLOADED'].includes(question.state)) {
      result = formatDate(result, 'DD MMM YYYY');
    }
    return result;
  }

  const getNewValueDiffViewer = (content) => {
    if (content !== null && isJsonText(content)) {
      const { name, address } = JSON.parse(content);
      if (name !== NO_CONTENT_AMENDMENT || address) return `${name}\n${address}`;
      else return '';
    }
    return `${renderContent(content)}` === NO_CONTENT_AMENDMENT ? '' : `${renderContent(content)}`;
  }

  const renderDoGLine1Line2 = () => {
    const descriptionOfGoods1 = metadata.field[DESCRIPTION_OF_GOODS1];
    const descriptionOfGoods2 = metadata.field[DESCRIPTION_OF_GOODS2];
    const contentDoG1 = content[descriptionOfGoods1] || '';
    const contentDoG2 = content[descriptionOfGoods2] || '';
    return (
      <>
        {[contentDoG1, contentDoG2].map((item, index) =>
          item && <TextField
            keu={index}
            className={classes.inputText}
            value={item}
            inputProps={{ style: { textTransform: 'uppercase', padding: '10px' } }}
            variant='outlined'
            disabled
          />
        )}
      </>
    )
  }

  const contentDoGLine1Line2 = (content) => {
    return content[metadata.field[DESCRIPTION_OF_GOODS1]] ?
      `${content[metadata.field[DESCRIPTION_OF_GOODS1]]}\n${content[metadata.field[DESCRIPTION_OF_GOODS2]]}`
      : content[metadata.field[DESCRIPTION_OF_GOODS2]]
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
            value={(type === 'name' && textResolveSeparate[type] === NO_CONTENT_AMENDMENT) ? '' : textResolveSeparate[type]}
            multiline
            autoFocus
            onPaste={onPaste}
            // rows={['name'].includes(type) ? 2 : 3}
            rows={3}
            rowsMax={10}
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
      const isLimitRows = [metadata.field[ALSO_NOTIFY], metadata.field[EXPORT_REF]].includes(field);
      const isDoG = metadata.field[DESCRIPTION_OF_GOODS] === field;
      return (
        isDateTime ?
          <DateTimePickers time={textResolve ? formatDate(textResolve, 'YYYY-MM-DD') : ''} onChange={e => inputText(e, true)} /> :
          <>
            {isDoG && renderDoGLine1Line2()}
            <TextField
              className={classes.inputText}
              value={`${(textResolve === NO_CONTENT_AMENDMENT) ? '' : textResolve}`}
              multiline
              rows={isDoG ? 5 : 3}
              rowsMax={10}
              onChange={inputText}
              variant='outlined'
              autoFocus
              onPaste={onPaste}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              error={
                !validateInput?.isValid
                ||
                (
                  validateField(field, textResolve).isError
                  &&
                  (
                    isResolve
                    ||
                    (['AME_DRF', 'AME_SENT'].includes(question.state) && user.role === 'Guest')
                  )
                )
                ||
                (isLimitRows ? validateGroupOneTextBox(textResolve).isError : false)
              }
              helperText={!validateInput?.isValid ?
                <>
                  {(validateInput?.prohibitedInfo?.countries.length > 0) &&
                    <span style={{ display: 'flex', alignItems: 'center', color: '#F39200' }}>
                      <WarningIcon fontSize='small' />
                      &nbsp;{`Countries: ${validateInput?.prohibitedInfo?.countries.join(', ')}`}
                    </span>
                  }
                  {(validateInput?.prohibitedInfo?.danger_cargo.length > 0) &&
                    <>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#F39200' }}>
                        <WarningIcon fontSize='small' />
                        &nbsp;{`Danger Cargo: ${validateInput?.prohibitedInfo?.danger_cargo.join(', ')}`}
                      </span>
                    </>
                  }
                </>
                : validateField(field, textResolve).errorType.split('\n').map((line, idx) => (
                  <span key={idx} style={{ display: 'block', lineHeight: '20px', color: (isResolve || (['AME_DRF', 'AME_SENT'].includes(question.state) && user.role === 'Guest')) ? 'red' : 'rgba(0, 0, 0, 0.54)' }}>{line}</span>
                ))
              }
              onBlur={() => handleValidateInput('RESOLVE', onConfirm, true, true)}
            />
          </>
      )
    }
  }

  const onPaste = (e) => {
    if (e.clipboardData.files.length && e.clipboardData.files[0]) {
      const fileObject = e.clipboardData.files[0];
      const newFileName = generateFileNameTimeFormat(fileObject.name);
      const myRenamedFile = new File(
        [fileObject],
        newFileName,
        { type: "image/png" }
      );
      setFilepaste(myRenamedFile);
    }
  }

  const { isDragActive, getRootProps } = useDropzone({
    onDrop: files => (isReply || question.showIconAttachAnswerFile) && setDropfiles(files),
    noClick: true
  });

  return (
    <>
      {isLoadedComment && (
        <div
          style={{ position: 'relative' }}
          onClick={() => dispatch(FormActions.inqViewerFocus(question.id))}
          {...getRootProps({})}>
          {(isReply || question.showIconAttachAnswerFile) && isDragActive && <div className='dropzone'>Drop files here</div>}
          <div onPaste={onPaste}>
            {(question?.process === 'draft') &&
              <TagsComponent tagName='AMENDMENT' tagColor='primary' question={question} isAllInq={isAllInq} />
            }
            <div style={{ paddingTop: 10 }} className="flex justify-between">
              <UserInfo
                name={question.creator?.userName}
                time={displayTime(question.createdAt || question.updatedAt)}
                avatar={question.creator?.avatar}
                state={question.state}
                status={question.status}
                userType={user.role}
                emails={mailHistory}
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
                            filepaste={filepaste}
                            dropfiles={dropfiles}
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
                            <PermissionProvider
                              action={PERMISSION.INQURIY_DELETE_COMMENT}
                              extraCondition={!['REP_SENT', 'AME_SENT', 'REP_Q_SENT', 'REP_A_SENT'].includes(question.state)}
                            >
                              <TrashIcon onDelete={() => removeReply(question)} />
                            </PermissionProvider>
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
                    <TrashIcon onDelete={() => removeQuestion(question)} />
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

                  <PermissionProvider
                    action={PERMISSION.DRAFTBL_UPDATE_DRAFT_BL_REPLY}
                    extraCondition={
                      (
                        question.showIconEdit
                        && ['ANS_DRF', 'REP_A_SENT', 'ANS_SENT', 'REP_Q_DRF', 'REP_SENT', 'AME_SENT'].includes(question.state)
                      ) || checkStateReplyDraft
                    }
                  >
                    <Tooltip title={'Edit'}>
                      <div onClick={() => handleEdit(question)}>
                        <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                      </div>
                    </Tooltip>
                    {(!['REP_Q_DRF', 'REP_SENT', 'AME_SENT', 'REP_Q_SENT', 'REP_A_SENT', 'ANS_SENT'].includes(question.state) || ['REP_Q_DRF'].includes(question.state) && user.role === 'Admin') && (
                      <TrashIcon onDelete={() => removeReply(question)} />
                    )}
                  </PermissionProvider>

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
                            filepaste={filepaste}
                            dropfiles={dropfiles}
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
                          filepaste={filepaste}
                          dropfiles={dropfiles}
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
                        // className={viewDropDown !== question.id ? classes.hideText : ''}
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
                          isResolveCDCM={isResolveCDCM}
                          setEditContent={(value) => {
                            if (isReplyCDCM || isResolveCDCM) {
                              handleChangeContainerDetail(value);
                              setTextResolve(value);
                            }
                            question.contentReplyCDCM = value;
                          }}
                          disableInput={(user.role === 'Guest') ? disableCDCMAmendment : (!isResolveCDCM && !isReplyCDCM)}
                          currentQuestion={question}
                        />
                    }
                  </> :
                  <ContainerDetailInquiry
                    setDataCD={(value) => setDataCD(value)}
                    setDataCM={(value) => setDataCM(value)}
                    getDataCD={getDataCD}
                    getDataCM={getDataCM}
                    disableInput={disableCDCMInquiry}
                    isAllowEdit={isAllowEdit}
                    currentQuestion={question}
                  />
              ) :
                (['RESOLVED', 'COMPL', 'UPLOADED'].includes(question.state) || (question.process === 'draft' && question.state === 'REOPEN_Q') || (['AME_DRF', 'AME_SENT'].includes(question.state) && !isReply) ?
                  <>
                    {(question?.field === metadata.field[DESCRIPTION_OF_GOODS]) &&
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {contentDoGLine1Line2(content)}
                      </div>
                    }
                    <Diff
                      inputA={orgContent[question.field] ? renderContent(orgContent[question.field]) : ''}
                      inputB={question.content ? getNewValueDiffViewer(question.content) : ''}
                      type="chars"
                    />
                  </>
                  :
                  <>
                    {(question?.field === metadata.field[DESCRIPTION_OF_GOODS] && ['REOPEN_A', 'REOPEN_Q'].includes(question.state)) &&
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {contentDoGLine1Line2(content)}
                      </div>
                    }
                    <Typography
                      // className={viewDropDown !== question.id ? classes.hideText : ''}
                      variant="h5"
                      id={question.id}
                      style={{
                        wordBreak: 'break-word',
                        fontFamily: 'Montserrat',
                        fontSize: 15,
                        fontStyle: ((!['INQ', 'ANS'].includes(question.type) && !['COMPL', 'REOPEN_Q', 'REOPEN_A', 'UPLOADED', 'OPEN', 'INQ_SENT', 'ANS_DRF', 'ANS_SENT'].includes(question.state) && question.process === 'pending') ||
                          (!['AME_DRF', 'AME_SENT', 'REOPEN_A', 'REOPEN_Q', 'RESOLVED', 'UPLOADED'].includes(question.state) && question.process === 'draft')) && 'italic',
                        color: '#132535',
                        whiteSpace: 'pre-wrap'
                      }}>
                      {/* Check is amendment JSON */}
                      {((question.content !== null && isJsonText(question.content)) ? `${JSON.parse(question.content).name}\n${JSON.parse(question.content).address}` : `${renderContent(question.content)}`
                      )}
                      {((['OPEN', 'INQ_SENT', 'ANS_DRF', 'ANS_SENT', 'REP_A_DRF'].includes(question.state) && question.type !== 'REP') &&
                        question.inqGroup &&
                        question.inqGroup.length &&
                        question.process === 'pending') ?
                        question.inqGroup.map(q => {
                          return (
                            <div key={q.id}>
                              <InquiryWithGroup inqGroup={q} role={user.role} />
                            </div>
                          )
                        }) : ``}
                    </Typography>
                  </>
                )
            }
            {/*Allow edit table when customer reply amendment*/}
            {(question.isShowTableToReply
              && containerCheck.includes(question.field)
              && question.process === 'draft'
              && !['RESOLVED', 'REOPEN_A', 'REOPEN_Q', 'AME_SENT'].includes(question.state)
            ) ? (
              <div style={{ marginTop: 15 }}>
                <ContainerDetailForm
                  container={question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST}
                  originalValues={Array.isArray(question.contentReplyCDCM) ? question.contentReplyCDCM : content}
                  isResolveCDCM={isResolveCDCM}
                  setEditContent={(value) => {
                    question.contentReplyCDCM = value;
                  }}
                  disableInput={disableCDCMAmendment}
                  currentQuestion={question}
                />
              </div>
            ) : ``}
            {/*Allow edit table when reply amendment*/}

            <input
              ref={triggerOnpaste}
              type="text"
              style={{
                position: 'absolute',
                left: '-99999px',
              }}
              onPaste={onPaste}
            />
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

            {/*Show Table Cd Cm Inquiry*/}
            {
              question.process !== 'draft'
              && (
                ![
                  'COMPL', 'REOPEN_A', 'REOPEN_Q', 'UPLOADED', ...(((user.role === 'Admin' || user.role === 'Guest') && !disableCDCMInquiry) ? [] : ['OPEN', 'INQ_SENT'])
                ].includes(question.state)
                || (user.role === 'Guest' && ['INQ_SENT'].includes(question.state))
              )
              && containerCheck.includes(question.field)
              && (
                <ContainerDetailInquiry
                  setDataCD={(value) => setDataCD(value)}
                  setDataCM={(value) => setDataCM(value)}
                  getDataCD={getDataCD}
                  getDataCM={getDataCM}
                  disableInput={disableCDCMInquiry}
                  isAllowEdit={isAllowEdit}
                  currentQuestion={question}
                />
              )}
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
                          History
                          <ArrowDropDown />
                        </>
                      ) : (
                        <>
                          History
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
                <Comment question={props.question} comment={comment} isDateTime={isDateTime} currentQuestion={question} />
              )}

              {!isShowViewAll && (
                <Grid item xs={12}>
                  <div
                    className={classes.viewMoreBtn}
                    onClick={() => handleViewMore(question.id)}>
                    {viewDropDown === question.id && ( // TODO
                      <>
                        Show Less
                        <ArrowDropUp />
                      </>
                    )}
                  </div>
                </Grid>
              )}

              <div
                style={{ width: fullscreen ? 1230 : 890 }}
                onMouseLeave={() => { dispatch(InquiryActions.setExpand(expandFileQuestionIds.filter(item => item !== question.id))) }}
              >
                {
                  question.mediaFile?.length > 0
                  &&
                  (
                    !['ANS_DRF', 'ANS_SENT', 'REP_Q_DRF'].includes(question.state)
                    ||
                    (['REP_Q_DRF'].includes(question.state) && user.role === 'Admin')
                  )
                  && question.mediaFile?.map((file, mediaIndex) => (
                    <>
                      <FileAttach
                        hiddenRemove={true}
                        file={file}
                        files={question.mediaFile}
                        field={question.field}
                        indexInquiry={index}
                        indexMedia={mediaIndex}
                        question={question}
                        isEdit={false}
                      />
                    </>
                  ))}
              </div>
            </>
            {
              question.mediaFilesAnswer?.length > 0 &&
              <>
                {question.mediaFilesAnswer?.length > 0 &&
                  !['ANS_DRF', 'ANS_SENT', 'REP_Q_DRF'].includes(question.state)
                  && <h3>Attachment Answer:</h3>}
                <div
                  style={{ width: 885 }}
                  onMouseLeave={() => { question.showIconEdit && dispatch(InquiryActions.setExpand(expandFileQuestionIds.filter(item => item !== question.id))) }}
                >
                  {question.mediaFilesAnswer?.map((file, mediaIndex) => (
                    <>
                      <FileAttach
                        file={file}
                        files={question.mediaFilesAnswer}
                        field={question.field}
                        indexMedia={mediaIndex}
                        isAnswer={true}
                        question={question}
                        isEdit={false}
                        index={index}
                        questions={inquiries}
                        hiddenRemove={!question.showIconAttachAnswerFile}
                        isRemoveFile={isRemoveFile}
                        setIsRemoveFile={(val) => {
                          setIsRemoveFile(val)
                        }}
                      />
                    </>
                  ))}
                </div>
              </>
            }
          </div>
          {!['COMPL', 'RESOLVED'].includes(question.state) && question.state !== 'UPLOADED' && (
            <>
              {isResolve || isResolveCDCM ? (
                <>
                  {containerCheck.includes(question.field) && <>
                    {question?.process === 'draft' &&
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
                        currentQuestion={question}
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
                            : validateField(question?.field, textResolve).isError) || disableAcceptResolve || !validationCDCM || (isDateTime && !isValidDate)
                        }
                        color="primary"
                        onClick={() => {
                          dispatch(FormActions.setDirtyReload({ inputReply: false }));
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
                          disabled={disableAcceptResolve}
                          onClick={() => {
                            dispatch(FormActions.setDirtyReload({ inputReply: false }));
                            setDisableAcceptResolve(true);
                            !validateInput?.isValid ? onConfirm(true) : handleValidateInput('RESOLVE', onConfirm, true);
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
                                  value={((type === 'name' && content[type] === NO_CONTENT_AMENDMENT) ? '' : (content[type] || ''))}
                                  multiline
                                  rows={3}
                                  rowsMax={10}
                                  inputProps={{ style: { textTransform: 'uppercase' } }}
                                  onChange={(e) => handleChangeContentReply(e, type)}
                                  variant='outlined'
                                  autoFocus
                                  onPaste={onPaste}
                                />
                              </div>
                            )
                          })
                          :
                          (isDateTime && question.state.includes("AME_") && user.role === 'Guest') ?
                            <DateTimePickers time={tempReply?.answer?.content ? formatDate(tempReply?.answer?.content, 'YYYY-MM-DD') : ''} onChange={e => handleChangeContentReply(e, '', true)} />
                            :
                            <>
                              {((question?.field === metadata.field[DESCRIPTION_OF_GOODS]) && question?.state.includes("AME_") && user.role === 'Guest') ? renderDoGLine1Line2() : ''}
                              <TextField
                                className={classes.inputText}
                                value={tempReply?.answer?.content === NO_CONTENT_AMENDMENT ? '' : (tempReply?.answer?.content || '')}
                                multiline
                                rows={(question?.field === metadata.field[DESCRIPTION_OF_GOODS]) ? 5 : 3}
                                rowsMax={10}
                                inputProps={{ style: question.state.includes("AME_") && user.role === 'Guest' ? { textTransform: 'uppercase' } : {} }}
                                InputProps={{
                                  classes: { input: classes.placeholder }
                                }}
                                onChange={handleChangeContentReply}
                                autoFocus
                                onPaste={onPaste}
                                variant='outlined'
                                placeholder='Reply...'
                                error={validateField(question.field, tempReply?.answer?.content).isError && (isResolve || (['AME_DRF', 'AME_SENT'].includes(question.state) && user.role === 'Guest'))}
                                helperText={
                                  !isAlsoNotifies && validateField(question.field, tempReply?.answer?.content).errorType.split('\n').map((line, idx) => (
                                    <span key={idx} style={{ display: 'block', lineHeight: '20px', fontSize: 14, color: (isResolve || (['AME_DRF', 'AME_SENT'].includes(question.state) && user.role === 'Guest')) ? 'red' : 'rgba(0, 0, 0, 0.54)' }}>{line}</span>
                                  ))
                                }
                              />
                            </>}
                      </div>
                      }
                      <div
                        className='attachment-reply'
                        style={{ width: 900 }}
                        onMouseLeave={() => { question.showIconEdit && dispatch(InquiryActions.setExpand(expandFileQuestionIds.filter(item => item !== question.id))) }}
                        onPaste={onPaste}
                      >
                        {tempReply?.mediaFiles?.map((file, mediaIndex) => (
                          <>
                            <FileAttach
                              hiddenRemove={!question.showIconAttachReplyFile}
                              file={file}
                              files={tempReply.mediaFiles}
                              field={question.field}
                              question={question}
                              indexMedia={mediaIndex}
                              isReply={true}
                              isHideFiles={true}
                              templateReply={tempReply}
                              isEdit={true}
                              setTemplateReply={(val) => {
                                removeFileReply(val)
                              }}
                            />
                          </>
                        ))}
                      </div>

                      <div className="flex">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => onSaveReply()}
                          disabled={
                            ((question.state.includes("AME_DRF") || (question.state.includes("AME_SENT") && user.role === 'Guest')) && (
                              // Case Enable Save when Edit Amendment
                              (!isReply && validateField(question.field, tempReply?.answer?.content).isError)
                              ||
                              (
                                [metadata.field[CONTAINER_DETAIL], metadata.field[CONTAINER_MANIFEST]].includes(question.field) ?
                                  (question.contentCDCM && compareObject(question.contentCDCM, tempReply?.answer?.content) && isSameFile(inquiries, tempReply))
                                  : (
                                    ([metadata.field[DATED], metadata.field[DATE_CARGO], metadata.field[DATE_LADEN]].includes(question.field) ?
                                      (
                                        isValidDate ||
                                        (isSameDate(question.answerObj[0].content, tempReply?.answer?.content) && isSameFile(inquiries, tempReply))
                                      )
                                      : (
                                        (question.answerObj[0].content?.trim()?.toLowerCase() === tempReply?.answer?.content?.trim()?.toLowerCase())
                                        && (tempReply && tempReply.mediaFiles && isSameFile(inquiries, tempReply))
                                      )
                                    )
                                  )
                              ))
                            )
                            ||
                            (
                              !containerCheck.includes(question.field) ?
                                (
                                  !question.state.includes("AME_DRF")
                                  && (!question.state.includes("AME_SENT") || user.role !== 'Guest')
                                  && (['string'].includes(typeof tempReply?.answer?.content) ? !tempReply?.answer?.content?.trim() : !tempReply?.answer?.content)
                                  && (!tempReply.mediaFiles || tempReply.mediaFiles.length === 0)
                                ) :
                                isDisableSaveCdCm
                            )
                            ||
                            disableSaveReply
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
                          onClick={() => onResolve()}
                          classes={{ root: clsx(classes.button, 'w120') }}>
                          Resolve
                        </Button>
                        {!listFieldDisableUpload.includes(question.field) ?
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onResolve(true)}
                            classes={{ root: clsx(classes.button) }}>
                            Resolve & Upload
                          </Button> : ''
                        }
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
  const dispatch = useDispatch();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const regNumber = { value: /^\s*(([1-9]\d{0,2}(,?\d{3})*))(\.\d+)?\s*$/g, message: 'Invalid number' }
  const regInteger = { value: /^\s*[1-9]\d{0,2}(,?\d{3})*\s*$/g, message: 'Invalid number' }

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
      if ([CONTAINER_WEIGHT, CONTAINER_MEASUREMENT, CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT].includes(getTypeName(type)) && !isNaN(value)) {
        temp[index][type] = formatNumber(value)
      } else temp[index][type] = (getTypeName(type) === CONTAINER_SEAL) ? value.split(',') : value;
    }

    setValues(temp);
    setTextResolve(temp);
    dispatch(FormActions.setDirtyReload({ inputReply: true }));
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
        td.push(<div style={{ display: 'flex', marginTop: type === typeList[0] ? 10 : 5 }}>
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
              value={type === 'HS/HTS/NCM Code' ? HS_CODE : type}
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
                if ([CONTAINER_PACKAGE, CM_PACKAGE].includes(type)) nodeValue[getType(type)] = NumberFormat(nodeValue[getType(type)], 0);
                const inputValid = (nodeValue[getType(type)] && nodeValue[getType(type)].length === 0) || reg.test(nodeValue[getType(type)]);
                if (!inputValid) validation(false);
                const minFrac = [CONTAINER_PACKAGE, CM_PACKAGE].includes(type) ? 0 : 3;

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
                      value={nodeValue ? disabled ? NumberFormat(nodeValue[getType(type)], minFrac) : nodeValue[getType(type)] || '' : ''}
                      onChange={(e) => onChange(e, nodeValue.index, getType(type))}
                    />
                    {inputValid ? null : <p style={{ color: 'red' }}>{filteredCdUnit[0].pattern.message}</p>}
                  </div>
                )
              }
              return (
                <input
                  className={clsx(classes.text)}
                  maxLength={type === 'HS/HTS/NCM Code' ? "6" : "1000"}
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
