import inquiryReducer from './inquiry';
import formReducer from './form';
import transReducer from './transaction';
import mailReducer from './mail';

import { combineReducers } from 'redux';

export default combineReducers({
  inquiryReducer,
  formReducer,
  mailReducer,
  transReducer
});
