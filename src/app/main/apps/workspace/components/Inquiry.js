import { getFile } from 'app/services/fileService';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  TextField,
  Button,
  Radio, RadioGroup
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import InquiryAnswer from './InquiryAnswer';

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
  checkedIcon: {display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
    '& .container': {
      marginBottom: 5
    }}

}
));

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);
  const listIndex = originalInquiry
    .map((q, index) => q.field === currentField && index)
    .filter((q) => Number.isInteger(q));
  const indexes = originalInquiry.findIndex((q) => q.field === currentField);
  const [edit, setEdit] = useState('');

  const urlMedia = (fileExt, file) => {
    if (fileExt.match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  };
  const handleReceiverChange = (e) => {
    const optionsOfQuestion = [...inquiries];
    if (e.target.checked) {
      dispatch(InquiryActions.validate({ ...valid, receiver: true }));
      optionsOfQuestion[indexes].receiver.push(e.target.value);
    } else {
      const i = optionsOfQuestion[indexes].receiver.indexOf(e.target.value);
      optionsOfQuestion[indexes].receiver.splice(i, 1);
    }
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
  }, [currentField]);

  return (
    <>
      {listIndex.map((i, index) => {
        const q = inquiries[i];
        return (
          <div key={index}>
            {edit === index ? (
              <>
                <FormControl error={!valid.receiver && !q.receiver.length} className={classes.checkedIcon}>
                  <RadioGroup aria-label="receiver" name="receiver" value={q.receiver[0]} onChange={(e) => handleReceiverChange(e, index)}>
                    <FormControlLabel value="customer" control={<Radio color={'primary'} />} label="Customer" />
                    <FormControlLabel value="onshore" control={<Radio color={'primary'} />} label="Onshore" />
                  </RadioGroup>
                  <FormControlLabel control={<AttachFile index={indexes} />} />
                  {!valid.receiver && !q.receiver.length ? (
                    <FormHelperText>Pick at least one!</FormHelperText>
                  ) : null}
                </FormControl>
                <InquiryEditor
                  index={indexes}
                  questions={inquiries}
                  question={q}
                  saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                />
              </>
            ) : (
              <>
                <InquiryAnswer
                  index={indexes}
                  questions={inquiries}
                  question={q}
                  saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                />
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Inquiry;
