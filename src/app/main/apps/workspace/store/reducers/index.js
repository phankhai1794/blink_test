import { combineReducers } from 'redux';

import inquiryReducer from './inquiry';
import formReducer from './form';
import mailReducer from './mail';
import dashboardReducer from './dashboard';

export default combineReducers({
  inquiryReducer,
  formReducer,
  mailReducer,
  dashboardReducer
});
