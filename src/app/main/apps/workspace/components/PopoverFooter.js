import { saveInquiry, changeStatus } from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Button, IconButton } from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import CheckIcon from '@material-ui/icons/Check';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import axios from 'axios';
import * as AppActions from 'app/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '34px',
    width: '120px'
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const PopoverFooter = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [index, currentField, question, fields, myBL, displayCmt, valid, filesUpload, inquiries] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEdit,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.fields,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.displayCmt,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.filesUpload,
    workspace.inquiryReducer.inquiries,
  ]);
  const onSave = () => {
    const check = question.filter((q) => !q.receiver.length)
    if (!question[index].inqType || !question[index].field || check.length) {
      dispatch(InquiryActions.validate({
        ...valid, field: Boolean(question[index].field),
        inqType: Boolean(question[index].inqType), receiver: !check.length
      }));
      return;
    }
    const checkGeneral = question.filter((q) => !q.inqType || !q.field)
    if (checkGeneral.length) {
      dispatch(AppActions.showMessage({ message: "There is empty field or inquiry type", variant: 'error' }));
      return;
    }
    const mediaList = [];
    const filesUpload = [];
    question.forEach((q) => {
      if (q.filesUpload && q.filesUpload.length > 0) {
        q.filesUpload.forEach(files => {
          files.forEach((file) => {
            filesUpload.push(file)
          })
        })
      }
    });
    if (filesUpload.length > 0) {
      const formData = new FormData();
      filesUpload.forEach((file) => {
        formData.append('files', file);
      });
      uploadFile(formData).then(media => {
        media.response.forEach((item) => {
          mediaList.push(item);
        });
        saveInquiry({ question, media: mediaList, blId: myBL.id })
          .then(() => {
            dispatch(
              AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
            );
            dispatch(InquiryActions.saveInquiry());
            dispatch(FormActions.toggleReload());
          })
          .catch((error) => dispatch(AppActions.showMessage({ message: error, variant: 'error' })));
      }).catch((error) => dispatch(AppActions.showMessage({ message: error, variant: 'error' })));
    } else {
      saveInquiry({ question, media: mediaList, blId: myBL.id })
        .then(() => {
          dispatch(
            AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
          );
          dispatch(InquiryActions.saveInquiry());
          dispatch(FormActions.toggleReload());
        })
        .catch((error) => dispatch(AppActions.showMessage({ message: error, variant: 'error' })));
    }
  };
  const toggleInquiriresDialog = () => {
    dispatch(FormActions.toggleAllInquiry(true));
    dispatch(FormActions.toggleInquiry(true));
    dispatch(FormActions.toggleSaveInquiry(true))
  };
  const onResolve = () => {
    changeStatus(currentField, 'COMPL')
      .then(() => {
        dispatch(FormActions.toggleReload());
      })
      .catch((error) => dispatch(AppActions.showMessage({ message: error, variant: 'error' })));
  };
  const onReply = () => {
    dispatch(InquiryActions.setReply(true));
  };
  const nextQuestion = () => {
    let temp = inquiries.findIndex((inq) => inq.field === title);
    if (temp !== fields.length - 1) {
      temp += 1;
    } else {
      temp = 0;
    }
    dispatch(InquiryActions.setOneInq(inquiries[temp]));
    dispatch(InquiryActions.setField(fields[temp]));
  };
  const prevQuestion = () => {
    let temp = inquiries.findIndex((inq) => inq.field === title);
    if (temp !== 0) {
      temp -= 1;
    } else {
      temp = fields.length - 1;
    }
    dispatch(InquiryActions.setOneInq(inquiries[temp]));
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
