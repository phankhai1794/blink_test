import * as Actions from '../../actions';

const initialState = {
  role: "",
  type: ""
};

const user = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SET_BROADCAST_DATA: {
    return { ...state, ...action.state };
  }
  default: {
    return state;
  }
  }
};

export default user;