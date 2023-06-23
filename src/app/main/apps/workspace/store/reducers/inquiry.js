import * as Actions from '../actions/inquiry';

export const MSG_INQUIRY_CONTENT = 'We found discrepancy in the information between SI and OPUS booking details';

const initialState = {
  myBL: {},
  metadata: {},
  orgContent: {},
  contentInqResolved: {},
  content: {},
  getDataCDInq: [],
  getDataCMInq: [],
  oldDataCdCmInq: {},
  currentEditInq: null,
  currentAmendment: undefined,
  displayCmt: false,
  currentField: '',
  reply: false,
  fields: [],
  removeOptions: [],
  validation: { inqType: true, field: true, receiver: true, ansType: true, content: true, answerContent: true },
  validationAttachment: { field: true, mediaId: true, nameFile: true },
  inquiries: [],
  inquiryEdit: null,
  currentInq: {},
  listInqMinimize: [],
  listMinimize: [],
  attachmentList: [],
  lastField: '',
  openedInquiresForm: false,
  isShowBackground: false,
  enableSubmit: false,
  enableSend: false,
  listCommentDraft: [],
  objectNewAmendment: { oldAmendmentId: null, newAmendment: null },
  openQueueList: false,
  searchQueueQuery: { bookingNo: '', from: '', to: '', blStatus: 'PENDING,IN_QUEUE', currentPageNumber: 1, pageSize: 10, totalPageNumber: 5, sortField: '' },
  cancelAmePopup: false,
  originValueCancel: {},
  enableExpandAttachment: []
};

const inquiryReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_MYBL: {
    return { ...state, myBL: action.state };
  }
  case Actions.SET_REPLY: {
    return { ...state, reply: action.state };
  }
  case Actions.SET_CURRENT_FIELD: {
    return { ...state, currentField: action.state };
  }
  case Actions.SET_QUESTION: {
    return { ...state, question: action.state };
  }

  case Actions.SET_EDIT_INQUIRY: {
    return { ...state, currentEditInq: action.state, validation: { inqType: true, field: true, receiver: true, ansType: true, content: true, answerContent: true } }; // RESET VALIDATION
  }
  case Actions.ADD_QUESTION: {
    return {
      ...state,
      currentEditInq: {
        content: MSG_INQUIRY_CONTENT,
        inqType: '',
        ansType: '',
        inqGroup: [],
        field: action.state,
        answerObj: [],
        addOther: '',
        receiver: ['customer'],
        mediaFile: []
      }
    };
  }
  case Actions.ADD_AMENDMENT: {
    return { ...state, currentAmendment: action.state };
  }
  case Actions.SAVE_INQUIRY: {
    return {
      ...state,
      currentEdit: 0,
      question: [
        {
          content: MSG_INQUIRY_CONTENT,
          inqType: '',
          ansType: '',
          field: '',
          inqGroup: [],
          answerObj: [],
          addOther: '',
          receiver: [],
          mediaFile: []
        }
      ]
    };
  }
  // case Actions.SET_INQUIRY_EDIT:
  // {
  //   return { ...state, inquiryEdit: action.state };
  // }
  case Actions.SAVE_FIELD: {
    return { ...state, fields: action.state };
  }
  case Actions.SAVE_METADATA: {
    return { ...state, metadata: action.state };
  }
  case Actions.SET_ORG_CONTENT: {
    return { ...state, orgContent: action.state };
  }
  case Actions.SET_CONTENT: {
    return { ...state, content: action.state };
  }
  case Actions.SET_CONTENT_INQ_RESOLVED: {
    return { ...state, contentInqResolved: action.state };
  }
  case Actions.REMOVE_SELECTED_OPTION: {
    return { ...state, removeOptions: action.state };
  }
  case Actions.VALIDATE: {
    return { ...state, validation: action.state };
  }
  case Actions.SET_INQUIRY: {
    return { ...state, inquiries: action.state };
  }
  case Actions.DISPLAY_COMMENT: {
    return { ...state, displayCmt: action.state };
  }
  case Actions.SET_ONE_INQUIRY: {
    return { ...state, currentInq: action.state };
  }
  case Actions.SET_LIST_MINIMIZE_INQUIRY: {
    return { ...state, listInqMinimize: action.state };
  }
  case Actions.SET_LIST_MINIMIZE: {
    return { ...state, listMinimize: action.state };
  }
  case Actions.VALIDATE_ATTACHMENT: {
    return { ...state, validationAttachment: action.state };
  }
  case Actions.SET_LAST_FIELD: {
    return { ...state, lastField: action.state };
  }
  case Actions.SET_OPENED_INQ_FORM: {
    return { ...state, openedInquiresForm: action.state };
  }
  case Actions.SET_BACKGROUND_ATTACHMENT_LIST: {
    return { ...state, isShowBackground: action.state };
  }
  case Actions.CHECK_SUBMIT: {
    return { ...state, enableSubmit: action.state };
  }
  case Actions.CHECK_SEND: {
    return { ...state, enableSend: action.state };
  }
  case Actions.SET_LIST_COMMENT_DRAFT: {
    return { ...state, listCommentDraft: action.state };
  }
  case Actions.SET_NEW_AMENDMENT: {
    return { ...state, objectNewAmendment: { ...state.objectNewAmendment, ...action.state } };
  }
  case Actions.OPEN_QUEUE_LIST: {
    return { ...state, openQueueList: action.state };
  }
  case Actions.SEARCH_QUEUE_QUERY: {
    return { ...state, searchQueueQuery: action.state };
  }
  case Actions.SET_DATA_CM_INQ: {
    return { ...state, getDataCMInq: action.state };
  }
  case Actions.SET_DATA_CD_INQ: {
    return { ...state, getDataCDInq: action.state };
  }
  case Actions.SET_OLD_DATA_CD_CM_INQ: {
    return { ...state, oldDataCdCmInq: action.state };
  }
  case Actions.SET_CANCEL_AME_POPUP: {
    return { ...state, cancelAmePopup: action.state };
  }
  case Actions.ORIGIN_VALUE_CANCEL: {
    return { ...state, originValueCancel: action.state };
  }
  case Actions.SET_EXPAND_ATTACHMENT: {
    return {...state, enableExpandAttachment: action.state}
  }
  default: {
    return state;
  }
  }
};

export default inquiryReducer;
