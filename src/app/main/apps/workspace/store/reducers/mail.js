import * as Actions from '../actions/mail';

const initialState = {
  isLoading: false,
  success: false,
  error: '',
  suggestMails: [],
  validateMail: {},
  tags: {},
};

const mailReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SENDMAIL_NONE: {
    return {
      ...state,
      success: false,
      error: '',
      isLoading: false
    };
  }
  case Actions.SENDMAIL_LOADING: {
    return {
      ...state,
      isLoading: true
    };
  }
  case Actions.SENDMAIL_SUCCESS: {
    return {
      ...initialState,
      success: true,
      isLoading: false
    };
  }
  case Actions.SENDMAIL_ERROR: {
    return {
      ...state,
      success: false,
      isLoading: false,
      error: action.payload
    };
  }
  case Actions.SUGGEST_MAIL_SUCCESS: {
    return {
      ...state,
      suggestMails: action.mails
    };
  }
  case Actions.VALIDATE_MAIL: {
    return {
      ...state,
      validateMail: action.state
    };
  }
  case Actions.SET_TAGS: {
    return {
      ...state,
      tags: action.state
    };
  }
  default: {
    return state;
  }
  }
};

export default mailReducer;
