import { combineReducers } from 'redux';
import fuse from './fuse';
import auth from 'app/auth/store/reducers';
import workspace from 'app/main/apps/workspace/admin/store/reducers'
import guestspace from 'app/main/apps/workspace/guest/store/reducers'

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    workspace,
    guestspace,
    ...asyncReducers
  });

export default createReducer;
