import * as Actions from '../actions';

const initialState = {
  user: {},
  openInquiry: false,
  openEdit: 0,
  anchorEl: null,
  currentField: '',
  fields: [],
  inquiries: []
};

const inquiryReducer = function (state = initialState, action) {
  switch (action.type) {
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
    case Actions.SET_EDIT: {
      return { ...state, openEdit: action.state };
    }
    default: {
      return state;
    }
  }
};

export default inquiryReducer;
