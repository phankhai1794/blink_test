import { combineReducers } from 'redux';
import auth from 'app/auth/store/reducers';
import workspace from 'app/main/apps/workspace/store/reducers';
import listBlReducer from 'app/main/apps/listBL/store/reducers';
import draftBL from 'app/main/apps/draft-bl/store/reducers';

import user from './user';
import header from './header';
import fuse from './fuse';

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    header,
    user,
    workspace,
    listBlReducer,
    draftBL,
    ...asyncReducers
  });

export default createReducer;
