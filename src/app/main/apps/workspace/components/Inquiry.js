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
  checkedIcon: {
    display: 'block',
    position: 'absolute',
    top: '0px',
    left: '4px',
    width: '5px',
    height: '10px',
    border: '1px solid #BD0F72',
    borderWidth: '0 3px 3px 0',
    transform: 'rotate(45deg)',
    '&.disabledCheck': {
      border: '1px solid #BAC3CB',
      borderWidth: '0 3px 3px 0'
    }
  }
}));

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
                <FormControl error={!valid.receiver && !q.receiver.length}>
                  <FormGroup row>
                    <FormControlLabel
                      value="onshore"
                      control={
                        <Checkbox
                          checked={q.receiver.includes('onshore')}
                          onChange={handleReceiverChange}
                          color="primary"
                          checkedIcon={
                            <>
                              <span className={clsx(classes.icon, 'borderChecked')}>
                                <span className={classes.checkedIcon} />
                              </span>
                            </>
                          }
                          icon={<span className={classes.icon} />}
                        />
                      }
                      label="Onshore"
                    />
                    <FormControlLabel
                      value="customer"
                      control={
                        <Checkbox
                          checked={q.receiver.includes('customer')}
                          onChange={handleReceiverChange}
                          color="primary"
                          checkedIcon={
                            <>
                              <span className={clsx(classes.icon, 'borderChecked')}>
                                <span className={classes.checkedIcon} />
                              </span>
                            </>
                          }
                          icon={<span className={classes.icon} />}
                        />
                      }
                      label="Customer"
                    />
                    <FormControlLabel control={<AttachFile index={indexes} />} />
                  </FormGroup>
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
