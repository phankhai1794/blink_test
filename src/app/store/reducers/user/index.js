import * as Actions from '../../actions';

const initialState = {
  role: '',
  displayName: '',
  photoURL: '',
  permissions: []
};

const user = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_USER: {
      return { ...state, ...action.state };
    }
    case Actions.REMOVE_USER: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
};

export default user;
