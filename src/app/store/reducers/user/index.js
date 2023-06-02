import * as Actions from '../../actions';

const initialState = {
  role: '',
  userType: '',
  displayName: '',
  photoURL: '',
  email: '',
  permissions: [],
  userProcessingBy: []
};

const user = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_USER: {
    return { ...state, ...action.state };
  }
  case Actions.REMOVE_USER: {
    return { ...initialState };
  }
  case Actions.SET_USER_PROCESSING_BY: {
    return { ...state, ...action.state };
  }
  default: {
    return state;
  }
  }
};

export default user;