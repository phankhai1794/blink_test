import { combineReducers } from 'redux';

import inquiryReducer from './inquiry';
import formReducer from './form';
import mailReducer from './mail';
import draftBLReducer from './draft-bl';
import dashboardReducer from './dashboard';

export default combineReducers({
  inquiryReducer,
  formReducer,
  mailReducer,
  draftBLReducer,
  dashboardReducer
});
