import * as Actions from '../actions/mail';

const initialState = {
  isLoading: false,
  success: false,
  error: '',
  suggestMails: [],
  inputMail: { toCustomer: '', toOnshore: '', toCustomerCc: '', toOnshoreCc: '', toCustomerBcc: '', toOnshoreBcc: '' },
  tags: { toCustomer: [], toOnshore: [], toCustomerCc: [], toOnshoreCc: [], toCustomerBcc: [], toOnshoreBcc: [] },
  mode: { isCcCustomer: false, isCcOnshore: false, isBccCustomer: false, isBccOnshore: false }
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
      ...state,
      error: '',
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
  case Actions.INPUT_MAIL: {
    return {
      ...state,
      inputMail: action.state
    };
  }
  case Actions.SET_CC: {
    return {
      ...state,
      mode: action.state
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
