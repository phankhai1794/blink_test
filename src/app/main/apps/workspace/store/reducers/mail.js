import * as Actions from '../actions/mail';

const initialState = {
  isloading: false,
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
        isloading: false
      };
    }
    case Actions.SENDMAIL_LOADING: {
      return {
        ...initialState,
        isloading: true
      };
    }
    case Actions.SENDMAIL_SUCCESS: {
      return {
        ...initialState,
        success: true,
        isloading: false
      };
    }
    case Actions.SENDMAIL_ERROR: {
      return {
        success: false,
        isloading: false,
        error: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default mailReducer;
