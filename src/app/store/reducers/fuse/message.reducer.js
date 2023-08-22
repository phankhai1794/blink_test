import * as Actions from '../../actions/fuse/index';

const initialState = {
  state: null,
  deploying: false,
  options: {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center'
    },
    autoHideDuration: null,
    message: 'Hi',
    variant: null
  }
};

const message = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SHOW_MESSAGE: {
    return {
      state: true,
      options: {
        ...initialState.options,
        ...action.options
      }
    };
  }
  case Actions.HIDE_MESSAGE: {
    return {
      ...state,
      state: null
    };
  }
  case Actions.DEPLOYING: {
    return {
      ...state,
      deploying: action.state
    };
  }
  default: {
    return state;
  }
  }
};

export default message;
