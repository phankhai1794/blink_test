import { saveInquiry, changeStatus } from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { toFindDuplicates } from '@shared'
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
import { setLastField } from "../store/actions/inquiry";


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '8px',
    width: '130px'
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const PopoverFooter = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [index, currentField, question, fields, myBL, displayCmt, valid, inquiries, metadata, lastField, openedInquiresForm] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEdit,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.fields,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.displayCmt,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.lastField,
    workspace.inquiryReducer.openedInquiresForm,
  ]);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);

  const onSave = () => {
    const check = question.filter((q) => !q.receiver.length);
    if (!question[index].inqType || !question[index].field || check.length || !question[index].ansType || !question[index].content) {
      dispatch(InquiryActions.validate({
        ...valid,
        field: Boolean(question[index].field),
        inqType: Boolean(question[index].inqType),
        ansType: Boolean(question[index].ansType),
        receiver: !check.length,
        content: Boolean(question[index].content),
      }));
      return;
    }
    //check empty type choice
    const ansTypeChoice = metadata.ans_type['choice'];
    if (ansTypeChoice === question[index].ansType) {
      if (question[index].answerObj.length === 1) {
        dispatch(AppActions.showMessage({ message: "Please create another option!", variant: 'error' }));
        return;
      }
      // check empty a field
      if (question[index].answerObj.length > 0) {
        const checkOptionEmpty = question[index].answerObj.filter(item => !item.content);
        if (checkOptionEmpty.length > 0) {
          dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
          return;
        }
      } else {
        dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
        return;
      }
    }
    //
    const checkGeneral = question.filter((q) => !q.inqType || !q.field)
    if (checkGeneral.length) {
      dispatch(AppActions.showMessage({ message: "There is empty field or inquiry type", variant: 'error' }));
      return;
    }
    if (ansTypeChoice === question[index].ansType && question[index].answerObj.length) {
      const dupArray = question[index].answerObj.map(ans => ans.content)
      if (toFindDuplicates(dupArray).length) {
        dispatch(AppActions.showMessage({ message: "Options value must not be duplicated", variant: 'error' }));
        return;
      }
    }
    let mediaList = [];
    const filesUpload = [];
    question.forEach((q) => {
      if (q.mediaFile.length > 0) {
        filesUpload.push(q.mediaFile)
      }
    });
    if (filesUpload.length > 0) {
      const uploads = [];
      filesUpload.forEach((files) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file.fileUpload);
        });
        uploads.push(formData);
      })
      axios
        .all(uploads.map((endpoint) => uploadFile(endpoint)))
        .then((media) => {
          media.forEach(file => {
            const mediaFileList = file.response.map(item => item);
            mediaList = [...mediaList, ...mediaFileList];
          });
          saveInquiry({ question, media: mediaList, blId: myBL.id })
            .then(() => {
              dispatch(
                AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
              );
              dispatch(InquiryActions.saveInquiry());
              dispatch(FormActions.toggleReload());
              dispatch(InquiryActions.setOpenedInqForm(false));
            })
            .catch((error) => dispatch(AppActions.showMessage({ message: error, variant: 'error' })));
        }).catch((error) => console.log(error));
    } else {
      saveInquiry({ question, media: mediaList, blId: myBL.id })
        .then(() => {
          dispatch(
            AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
          );
          dispatch(InquiryActions.saveInquiry());
          dispatch(FormActions.toggleReload());
          dispatch(InquiryActions.setOpenedInqForm(false));
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
    dispatch(setLastField(question[question.length - 1].field));
    // check next if inquiry form opened
    if (openInquiryForm) {
      dispatch(InquiryActions.setOpenedInqForm(true));
      dispatch(FormActions.toggleCreateInquiry(false));
    }
    let temp = inquiries.findIndex((inq) => inq.field === title);
    if (temp !== inquiries.length - 1) {
      temp += 1;
      dispatch(InquiryActions.setOneInq(inquiries[temp]));
      dispatch(InquiryActions.setField(fields[temp]));
    } else {
      if (openedInquiresForm) {
        dispatch(InquiryActions.setOneInq({}));
        dispatch(FormActions.toggleCreateInquiry(true));
        dispatch(InquiryActions.setField(lastField));
      } else {
        temp = 0;
        dispatch(InquiryActions.setOneInq(inquiries[temp]));
        dispatch(InquiryActions.setField(fields[temp]));
      }
    }
  };
  const prevQuestion = () => {
    dispatch(setLastField(question[question.length - 1].field));
    // check prev if inquiry form opened
    if (openInquiryForm) {
      dispatch(InquiryActions.setOpenedInqForm(true));
      dispatch(FormActions.toggleCreateInquiry(false));
    }
    let temp = inquiries.findIndex((inq) => inq.field === title);
    if (temp === -1) {
      temp = inquiries.length - 1;
      dispatch(InquiryActions.setOneInq(inquiries[temp]));
      dispatch(InquiryActions.setField(fields[temp]));
    } else if (temp === 0) {
      if (openedInquiresForm) {
        dispatch(InquiryActions.setOneInq({}));
        dispatch(FormActions.toggleCreateInquiry(true));
        dispatch(InquiryActions.setField(lastField));
      } else {
        temp = inquiries.length - 1;
        dispatch(InquiryActions.setOneInq(inquiries[temp]));
        dispatch(InquiryActions.setField(fields[temp]));
      }
    } else {
      temp -= 1;
      dispatch(InquiryActions.setOneInq(inquiries[temp]));
      dispatch(InquiryActions.setField(fields[temp]));
    }
  };
  return (
    <div className="flex justify-between" style={{ margin: '1.6rem auto' }}>
      <div>
        <IconButton onClick={prevQuestion}>
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton onClick={nextQuestion}>
          <NavigateNextIcon />
        </IconButton>

        <Link style={{ fontSize: '16px', color: '#1564EE' }} component="button" onClick={toggleInquiriresDialog}>
          Open All Inquiries
        </Link>
      </div>
      <div style={{ alignSelf: 'center', marginRight: '20rem' }}>
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
