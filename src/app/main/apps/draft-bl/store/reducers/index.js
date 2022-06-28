import * as Actions from '../actions';


const initialState = {
  metadata: {},
  bl: '',
  content: {},
  contentEdit: {},
  contentChanged: {},
  openDraftBL: false,
  currentBLField: '',
};

const draftBL = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_METADATA: {
    return { ...state, metadata: action.state };
  }
  case Actions.SET_BL: {
    return { ...state, bl: action.state };
  }
  case Actions.SET_CONTENT: {
    return { ...state, content: action.state };
  }
  case Actions.OPEN_EDIT_DRAFT_BL: {
    return { ...state, openDraftBL: action.state };
  }
  case Actions.SET_CURRENT_BL_FIELD: {
    return { ...state, currentBLField: action.state };
  }
  case Actions.SET_NEW_CONTENT: {
    return { ...state, contentEdit: action.state };
  }
  case Actions.SET_NEW_CONTENT_CHANGED: {
    return { ...state, contentChanged: action.state };
  }
  default: {
    return state;
  }
  }
};

export default draftBL;
