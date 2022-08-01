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
    width: '130px',
    textTransform: 'none',
  },
  nextPrev: {
    '& .MuiButtonBase-root': {
      marginRight: 18,
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiIconButton-root:focus': {
      backgroundColor: 'transparent'
    },
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
        dispatch(AppActions.showMessage({ message: "Please add more options!", variant: 'error' }));
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
    const inqContentTrim = question.map(op => {
      let contentTrim = {...op, content: op.content.trim()};
      const ansTypeChoice = metadata.ans_type['choice'];
      if (ansTypeChoice === op.ansType) {
        op.answerObj.forEach(ans => {
          ans.content = ans.content.trim();
        });
      }
      return contentTrim;
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
          saveInquiry({ question: inqContentTrim, media: mediaList, blId: myBL.id })
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
      saveInquiry({ question: inqContentTrim, media: mediaList, blId: myBL.id })
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
    <div className="flex justify-between" style={{ margin: '1.6rem auto', alignItems: "center" }}>
      <div className={classes.nextPrev}>
        {inquiries.length > 0 && (
          <>
            <IconButton onClick={prevQuestion}>
              <img alt={'nextIcon'} src={`/assets/images/icons/prev.svg`} />
            </IconButton>
            <IconButton onClick={nextQuestion}>
              <img alt={'prevIcon'} src={`/assets/images/icons/next.svg`} />
            </IconButton>
          </>
        )}

        <Link
          style={{
            fontFamily: 'Montserrat',
            fontSize: '16px',
            color: '#1564EE',
            height: '20px',
            weight: '145px',
            fontWeight: '600',
          }}
          component="button" onClick={toggleInquiriresDialog}
        >
          Open all inquiries
        </Link>
      </div>
      <div style={{ alignSelf: 'center', marginRight: '20rem' }}>
        <PermissionProvider
          action={PERMISSION.VIEW_SAVE_INQUIRY}
          extraCondition={!fields.includes(title)}
        >
          <Button
            variant="contained"
            style={{
              textTransform: 'capitalize',
              left: '13.45%', right: '13.45%', top: '25%', bottom: '25%',
              fontFamily: 'Montserrat', fontStyle: 'normal', fontWeight: '600', fontSize: '16px', lineHegiht: '20px',
              textAlign: 'center',
              backgroundColor: "#BD0F72"
            }}
            className={classes.root}
            color="primary"
            onClick={onSave}
          >
            Save
          </Button>
        </PermissionProvider>
      </div>
      
    </div>
  );
};

export default PopoverFooter;
