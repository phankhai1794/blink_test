import { combineReducers } from 'redux';
import inquiryReducer from './inquiry';
import formReducer from './form';

export default combineReducers({
  inquiryReducer,
  formReducer
});
