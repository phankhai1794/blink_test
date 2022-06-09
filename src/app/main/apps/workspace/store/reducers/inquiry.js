import * as Actions from '../actions/inquiry';

const initialState = {
  myBL: {},
  metadata: {},
  currentEdit: 0,
  currentEditInq: null,
  displayCmt: false,
  currentField: '',
  reply: false,
  fields: [],
  removeOptions: [],
  validation: { inqType: true, field: true, receiver: true },
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
      return { ...state, currentEdit: action.state };
    }
    case Actions.SET_EDIT_INQUIRY: {
      return { ...state, currentEditInq: action.state };
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
        currentEdit: 0,
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
    case Actions.SAVE_FIELD: {
      return { ...state, fields: action.state };
    }
    case Actions.SAVE_METADATA: {
      return { ...state, metadata: action.state };
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
    case Actions.DISPLAY_COMMENT: {
      return { ...state, displayCmt: action.state };
    }
    default: {
      return state;
    }
  }
};

export default inquiryReducer;
