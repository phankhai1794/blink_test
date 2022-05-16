import auth from 'app/auth/store/reducers';
import workspace from 'app/main/apps/workspace/store/reducers';
import listBlReducer from 'app/main/apps/listBL/store/reducers';

import user from './user';
import header from './header';
import fuse from './fuse';

import { combineReducers } from 'redux';

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    header,
    user,
    workspace,
    listBlReducer,
    ...asyncReducers
  });

export default createReducer;
