import { combineReducers } from 'redux';
import fuse from './fuse';
import auth from 'app/auth/store/reducers';
import header from './header';
import user from './user';
import workspace from 'app/main/apps/workspace/admin/store/reducers';
import guestspace from 'app/main/apps/workspace/guest/store/reducers';
import listBlReducer from 'app/main/apps/listBL/store/reducers';
import mailReducer from 'app/main/apps/workspace/admin/store/reducers/mail';

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    header,
    user,
    workspace,
    guestspace,
    listBlReducer,
    mailReducer,
    ...asyncReducers
  });

export default createReducer;
