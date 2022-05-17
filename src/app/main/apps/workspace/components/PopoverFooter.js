import { saveInquiry, changeStatus } from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Button, IconButton } from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import CheckIcon from '@material-ui/icons/Check';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '34px',
    width: '120px'
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const PopoverFooter = ({ title, checkValidate }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [index, currentField, question, fields, myBL, displayCmt, valid] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEdit,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.fields,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.displayCmt,
    workspace.inquiryReducer.validation
  ]);
  const onSave = () => {
    if (!checkValidate(question[index]) || !valid.receiver) return;

    const formData = [];
    for (const q of question) {
      for (const f of q.mediaFile) {
        const form_data = f.data;
        formData.push(form_data);
      }
    }
    axios
      .all(formData.map((endpoint) => uploadFile(endpoint)))
      .then((media) => {
        saveInquiry({ question, media, blId: myBL.id })
          .then(() => {
            dispatch(FormActions.displaySuccess(true));
            dispatch(InquiryActions.saveInquiry());
            dispatch(FormActions.toggleReload());
          })
          .catch((error) => dispatch(FormActions.displayFail(true, error)));
      })
      .catch((error) => dispatch(FormActions.displayFail(true, error)));
  };
  const toggleInquiriresDialog = () => {
    dispatch(FormActions.toggleAllInquiry());
  };
  const onResolve = () => {
    changeStatus(currentField, 'COMPL')
      .then(() => {
        dispatch(FormActions.toggleReload());
      })
      .catch((error) => dispatch(FormActions.displayFail(true, error)));
  };
  const onReply = () => {
    dispatch(InquiryActions.setReply(true));
  };
  const nextQuestion = () => {
    var temp = fields.indexOf(title);
    if (temp !== fields.length - 1) {
      temp += 1;
    } else {
      temp = 0;
    }
    dispatch(InquiryActions.setField(fields[temp]));
  };
  const prevQuestion = () => {
    var temp = fields.indexOf(title);
    if (temp !== 0) {
      temp -= 1;
    } else {
      temp = fields.length - 1;
    }
    dispatch(InquiryActions.setField(fields[temp]));
  };
  return (
    <div className="flex justify-between" style={{ margin: '1.6rem auto' }}>
      <div>
        {fields.includes(title) && (
          <>
            <IconButton onClick={prevQuestion}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={nextQuestion}>
              <NavigateNextIcon />
            </IconButton>
            <Link style={{ fontSize: '16px' }} component="button" onClick={toggleInquiriresDialog}>
              Open All Inquiries
            </Link>
          </>
        )}
      </div>
      <div >
        <PermissionProvider
          action={PERMISSION.VIEW_SAVE_INQUIRY}
          extraCondition={!fields.includes(title)}
        >
          <Button variant="contained" className={classes.root} color="primary" onClick={onSave}>
            Save
          </Button>
        </PermissionProvider>
      </div>
      <div className="flex justify-end">
        <PermissionProvider
          action={PERMISSION.INQUIRY_UPDATE_INQUIRY_STATUS}
          extraCondition={fields.includes(title) && displayCmt}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={onResolve}
            classes={{ root: classes.button }}
          >
            <CheckIcon />
            Resolve
          </Button>
        </PermissionProvider>
        <PermissionProvider
          action={PERMISSION.INQUIRY_CREATE_COMMENT}
          extraCondition={fields.includes(title) && displayCmt}
        >
          <Button variant="contained" classes={{ root: classes.button }} color="primary" onClick={onReply}>
            <ReplyIcon />
            Reply
          </Button>
        </PermissionProvider>

      </div>
    </div>
  );
};

export default PopoverFooter;