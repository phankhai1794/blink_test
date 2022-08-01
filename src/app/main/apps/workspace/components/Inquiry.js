import React, { useEffect, useState } from 'react';
import { updateInquiry } from 'app/services/inquiryService';
import { getFile, uploadFile } from 'app/services/fileService';
import { displayTime, toFindDuplicates } from '@shared';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Button,
  Radio,
  RadioGroup,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import * as AppAction from 'app/store/actions';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import InquiryAnswer from './InquiryAnswer';
import UserInfo from './UserInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72'
    },
    '&.disabledCheck': {
      backgroundColor: '#DDE3EE'
    }
  },
  checkedIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
    '& .container': {
      marginBottom: 5
    }
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 8,
    width: 120,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
  },
}));

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);
  const listIndex = originalInquiry
    .map((q, index) => q.field === currentField && index)
    .filter((q) => Number.isInteger(q));
  const indexes = originalInquiry.findIndex((q) => q.field === currentField);
  const [edit, setEdit] = useState('');

  const toggleEdit = (id) => {
    dispatch(FormActions.toggleSaveInquiry(true))
    setEdit(id);
  };

  const urlMedia = (fileExt, file) => {
    if (fileExt.match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  };
  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...inquiries];
    optionsOfQuestion[index].receiver = [];
    dispatch(InquiryActions.validate({ ...valid, receiver: true }));
    optionsOfQuestion[index].receiver.push(e.target.value);
    dispatch(InquiryActions.editInquiry(optionsOfQuestion));
  };

  useEffect(() => {
    for (let index in listIndex) {
      const i = listIndex[index];
      if (inquiries[i]?.mediaFile.length && !inquiries[i].mediaFile[0].src) {
        const optionsOfQuestion = [...inquiries];
        for (let f in inquiries[i].mediaFile) {
          getFile(inquiries[i].mediaFile[f].id)
            .then((file) => {
              optionsOfQuestion[i].mediaFile[f].src = urlMedia(inquiries[i].mediaFile[f].ext, file);
              dispatch(InquiryActions.editInquiry(optionsOfQuestion));
            })
            .catch((error) => console.error(error));
        }
      }
      if (inquiries[i]?.answerObj[0]?.mediaFiles && inquiries[i]?.answerObj[0]?.mediaFiles.length) {
        const optionsOfQuestion = [...inquiries];
        for (let f in inquiries[i]?.answerObj[0].mediaFiles) {
          getFile(inquiries[i]?.answerObj[0].mediaFiles[f].id)
            .then((file) => {
              optionsOfQuestion[i].answerObj[0].mediaFiles[f].src = urlMedia(
                inquiries[i].answerObj[0].mediaFiles[f].ext,
                file
              );
              dispatch(InquiryActions.editInquiry(optionsOfQuestion));
            })
            .catch((error) => console.error(error));
        }
      }
    }
  }, [currentField, edit]);

  const onCancel = () => {
    setEdit(null);
    dispatch(InquiryActions.editInquiry(JSON.parse(JSON.stringify(originalInquiry))));
  }

  const onSave = async (i) => {
    const ansTypeChoice = metadata.ans_type['choice'];
    if (ansTypeChoice === inquiries[i].ansType) {
      if (inquiries[i].answerObj.length === 1) {
        dispatch(AppAction.showMessage({ message: "Please add more options!", variant: 'error' }));
        return
      }
      // check empty a field
      if (inquiries[i].answerObj.length > 0) {
        const checkOptionEmpty = inquiries[i].answerObj.filter(item => !item.content);
        if (checkOptionEmpty.length > 0) {
          dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
          return;
        }
      } else {
        dispatch(AppAction.showMessage({ message: "Options not empty!", variant: 'error' }));
        return;
      }
    }
    if (ansTypeChoice === inquiries[i].ansType && inquiries[i].answerObj.length) {
      const dupArray = inquiries[i].answerObj.map(ans => ans.content)
      if (toFindDuplicates(dupArray).length) {
        dispatch(AppAction.showMessage({ message: "Options value must not be duplicated", variant: 'error' }));
        return;
      }
    }
    const ansCreate = inquiries[i].answerObj.filter(
      ({ id: id1 }) => !originalInquiry[i].answerObj.some(({ id: id2 }) => id2 === id1)
    );
    const ansDelete = originalInquiry[i].answerObj.filter(
      ({ id: id1 }) => !inquiries[i].answerObj.some(({ id: id2 }) => id2 === id1)
    );
    const ansUpdate = inquiries[i].answerObj.filter(({ id: id1, content: c1 }) =>
      originalInquiry[i].answerObj.some(({ id: id2, content: c2 }) => id2 === id1 && c1 !== c2)
    );
    const mediaCreate = inquiries[i].mediaFile.filter(
      ({ id: id1 }) => !originalInquiry[i].mediaFile.some(({ id: id2 }) => id2 === id1)
    );
    const mediaDelete = originalInquiry[i].mediaFile.filter(
      ({ id: id1 }) => !inquiries[i].mediaFile.some(({ id: id2 }) => id2 === id1)
    );
    for (const f in mediaCreate) {
      const form_data = mediaCreate[f].data;
      const res = await uploadFile(form_data);
      mediaCreate[f].id = res.response[0].id;
    }
    await updateInquiry(inquiries[i].id, {
      inq: {
        content: inquiries[i].content,
        field: inquiries[i].field,
        inqType: inquiries[i].inqType,
        ansType: inquiries[i].ansType,
        receiver: inquiries[i].receiver
      },
      ans: { ansDelete, ansCreate, ansUpdate },
      files: { mediaCreate, mediaDelete }
    })
    dispatch(
      AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
    );
    dispatch(FormActions.toggleReload());
    dispatch(InquiryActions.setOneInq({}));
  }
  return (
    <>
      {listIndex.map((i, index) => {
        const q = inquiries[i];
        const user = q.creator;
        const isEdit = Number.isInteger(edit) && edit !== index
        return (
          <div key={index} style={{ filter: isEdit && 'opacity(0.4)', pointerEvents: isEdit && 'none' }}>
            {edit === index ? (
              <>

                <div className="flex justify-between">
                  <UserInfo name={user.userName} time={displayTime(q.createdAt)} avatar={user.avatar} />
                  <FormControl error={!valid.receiver && !q.receiver.length} className={classes.checkedIcon}>
                    <RadioGroup aria-label="receiver" name="receiver" value={q.receiver[0]} onChange={(e) => handleReceiverChange(e, i)}>
                      <FormControlLabel value="customer" control={<Radio color={'primary'} />} label="Customer" />
                      <FormControlLabel value="onshore" control={<Radio color={'primary'} />} label="Onshore" />
                    </RadioGroup>
                    <FormControlLabel control={<AttachFile index={indexes} />} />
                    {!valid.receiver && !q.receiver.length ? (
                      <FormHelperText>Pick at least one!</FormHelperText>
                    ) : null}
                  </FormControl>
                </div>
                <InquiryEditor
                  index={i}
                  questions={inquiries}
                  question={q}
                  saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                />
                <div className="flex">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSave(i)}
                    classes={{ root: classes.button }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    classes={{ root: clsx(classes.button, 'reply') }}
                    color="primary"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <InquiryAnswer
                  toggleEdit={() => toggleEdit(index)}
                  index={i}
                  questions={inquiries}
                  question={q}
                  saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                />
                {listIndex.length - 1 !== index && <Divider className="mt-16 mb-16" />}
              </>
            )}
          </div >
        );
      })}
    </>
  );
};

export default Inquiry;
