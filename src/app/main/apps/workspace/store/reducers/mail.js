import * as Actions from '../actions/mail';

const initialState = {
  isLoading: false,
  success: false,
  error: ''
};

const mailReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SENDMAIL_NONE: {
    return {
      ...initialState,
      success: false,
      error: '',
      isLoading: false
    };
  }
  case Actions.SENDMAIL_LOADING: {
    return {
      ...initialState,
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
      success: false,
      isLoading: false,
      error: action.payload
    };
  }
  default: {
    return state;
  }
  }
};

export default mailReducer;
