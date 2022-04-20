import * as Actions from '../actions';

const initialState = {
  myBL: {},
  user: {},
  success: false,
  fail: false,
  metadata: {},
  openDialog: false,
  openAllInquiry: false,
  openInquiry: false,
  openEdit: 0,
  openEditInq: null,
  anchorEl: null,
  currentField: '',
  reload: false,
  reply: false,
  fields: [],
  removeOptions: [],
  validation: { inqType: true, field: true },
  originalInquiry: [],
  inquiries: [],
  question: [
    {
      content:
        'We found discrepancy in the {{INQ_TYPE}} information between SI and OPUS booking details',
      inqType: '',
      ansType: '',
      field: '',
      answerObj: [],
      addOther: '',
      receiver: [],
      mediaFile: []
    }
  ]
};

const inquiryReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_MYBL: {
      return { ...state, myBL: action.state };
    }
    case Actions.OPEN_CREATE_INQUIRY: {
      return { ...state, openDialog: action.state };
    }
    case Actions.OPEN_ALL_INQUIRY: {
      return { ...state, openAllInquiry: !state.openAllInquiry };
    }
    case Actions.OPEN_INQUIRY: {
      return { ...state, openInquiry: action.state };
    }
    case Actions.SET_ANCHOR_EL: {
      return { ...state, anchorEl: action.state };
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
    case Actions.SET_EDIT: {
      return { ...state, openEdit: action.state };
    }
    case Actions.SET_EDIT_INQUIRY: {
      return { ...state, openEditInq: action.state };
    }
    case Actions.ADD_QUESTION: {
      return {
        ...state,
        question: [
          ...state.question,
          {
            content:
              'We found discrepancy in the {{INQ_TYPE}} information between SI and OPUS booking details',
            inqType: '',
            ansType: '',
            field: '',
            answerObj: [],
            addOther: '',
            receiver: [],
            mediaFile: []
          }
        ]
      };
    }
    case Actions.ADD_QUESTION1: {
      return {
        ...state,
        inquiries: [
          ...state.inquiries,
          {
            content:
              'We found discrepancy in the {{INQ_TYPE}} information between SI and OPUS booking details',
            inqType: '',
            ansType: '',
            field: '',
            answerObj: [],
            addOther: '',
            receiver: [],
            mediaFile: []
          }
        ]
      };
    }
    case Actions.EDIT_INQUIRY: {
      return { ...state, inquiries: action.state };
    }
    case Actions.SAVE_INQUIRY: {
      return {
        ...state,
        reload: !state.reload,
        openEdit: 0,
        openDialog: false,
        question: [
          {
            content:
              'We found discrepancy in the {{INQ_TYPE}} information between SI and OPUS booking details',
            inqType: '',
            ansType: '',
            field: '',
            answerObj: [],
            addOther: '',
            receiver: [],
            mediaFile: []
          }
        ]
      };
    }
    case Actions.RELOAD: {
      return { ...state, reload: !state.reload, openInquiry: false, openAllInquiry: false };
    }
    case Actions.SAVE_FIELD: {
      return { ...state, fields: action.state };
    }
    case Actions.SAVE_METADATA: {
      return { ...state, metadata: action.state };
    }
    case Actions.SAVE_USER: {
      return { ...state, user: action.state };
    }
    case Actions.DISPLAY_SUCCESS: {
      return { ...state, success: action.state };
    }
    case Actions.DISPLAY_FAIL: {
      return { ...state, fail: { openDialog: action.state, error: action.message } };
    }
    case Actions.REMOVE_SELECTED_OPTION: {
      return { ...state, removeOptions: action.state };
    }
    case Actions.VALIDATE: {
      return { ...state, validation: action.state };
    }
    case Actions.SET_ORIGINAL_INQUIRY: {
      return { ...state, originalInquiry: action.state };
    }
    default: {
      return state;
    }
  }
};

export default inquiryReducer;
