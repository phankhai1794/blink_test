import { getKeyByValue, validateExtensionFile, toFindDuplicates } from '@shared';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Divider, FormGroup, FormControlLabel, Checkbox, FormControl, FormHelperText, IconButton, Typography, Tooltip } from '@material-ui/core';
import * as AppAction from "app/store/actions";
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';


const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72',
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
  },
  fontText: {
    fontSize: '15px',
    fontFamily: 'Montserrat',
    fontWeight: '500',
    height: '18px',
    fontStyle: 'normal',
    lineHeight: '18px',
    color: "#000000",
  }
}));

const InquiryForm = (props) => {
  const { FabTitle } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const questions = useSelector(({ workspace }) =>
    workspace.inquiryReducer.question
  );
  const metadata = useSelector(({ workspace }) =>
    workspace.inquiryReducer.metadata
  );
  const valid = useSelector(({ workspace }) =>
    workspace.inquiryReducer.validation
  );
  const currentEdit = useSelector(({ workspace }) =>
    workspace.inquiryReducer.currentEdit
  );
  const inquiries = useSelector(({ workspace }) =>
    workspace.inquiryReducer.inquiries
  );
  const removeOptions = useSelector(({ workspace }) =>
    workspace.inquiryReducer.removeOptions
  );
  const open = useSelector(({ workspace }) =>
    workspace.formReducer.openDialog,
  );
  const filesUpload = useSelector(({ workspace }) =>
    workspace.inquiryReducer.filesUpload,
  )

  const copyQuestion = (index) => {
    const optionsOfQuestion = JSON.parse(JSON.stringify(questions[index]));
    optionsOfQuestion.content = optionsOfQuestion.content.replace(getKeyByValue(metadata['inq_type'], optionsOfQuestion.inqType), '{{INQ_TYPE}}');
    optionsOfQuestion.field = '';
    questions[index].mediaFile.map((file, i) => {
      optionsOfQuestion.mediaFile[i].fileUpload = file.fileUpload;
    })
    if (inquiries.length + questions.length + 1 === metadata.field_options.length) {
      dispatch(FormActions.toggleAddInquiry(false))
    }
    dispatch(InquiryActions.setQuestion([...questions, optionsOfQuestion]))
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1);
    if (currentEdit > 0 && currentEdit >= index) {
      dispatch(InquiryActions.setEdit(currentEdit - 1));
    }
    const options = [...removeOptions];
    options.splice(index, 1);
    dispatch(InquiryActions.removeSelectedOption(options));
    dispatch(FormActions.toggleAddInquiry(true))
    dispatch(InquiryActions.setQuestion(optionsOfQuestion))
    dispatch(InquiryActions.validate({ inqType: true, field: true, receiver: true, ansType: true, content: true, answerContent: true }));
  };

  const handleUploadImageAttach = (files, index) => {
    const optionsOfQuestion = [...questions];
    const inValidFile = files.find(elem => !validateExtensionFile(elem));
    if (inValidFile) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      files.forEach(src => {
        optionsOfQuestion[index].mediaFile.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, fileUpload: src });
      });
      dispatch(InquiryActions.setQuestion(optionsOfQuestion));
    }
  };

  const changeToEditor = (index) => {
    let check = true;
    const ansTypeChoice = metadata.ans_type['choice'];
    let validate = {};
    if (!questions[currentEdit].inqType || !questions[currentEdit].field || !questions[currentEdit].receiver.length || !questions[currentEdit].ansType.length || !questions[currentEdit].content || ansTypeChoice === questions[currentEdit].ansType) {
      validate = {
        ...valid,
        field: Boolean(questions[currentEdit].field),
        inqType: Boolean(questions[currentEdit].inqType),
        receiver: Boolean(questions[currentEdit].receiver.length),
        ansType: Boolean(questions[currentEdit].ansType.length),
        content: Boolean(questions[currentEdit].content),
      };
      if (ansTypeChoice === questions[currentEdit].ansType) {
        // check empty a field
        if (questions[currentEdit].answerObj.length > 0) {
          const checkOptionEmpty = questions[currentEdit].answerObj.filter(item => !item.content);
          if (checkOptionEmpty.length > 0) {
            validate = { ...validate, answerContent: false }
          } else {
            validate = { ...validate, answerContent: true }
          }
          const dupArray = questions[currentEdit].answerObj.map(ans => ans.content)
          if (toFindDuplicates(dupArray).length) {
            dispatch(AppAction.showMessage({ message: "Options value must not be duplicated", variant: 'error' }));
            return;
          }
        } else {
          validate = { ...validate, answerContent: false }
        }
      }
      dispatch(InquiryActions.validate(validate));
      check = validate.inqType && validate.field && validate.receiver && validate.ansType && validate.content && validate.answerContent;
    }
    if (ansTypeChoice !== questions[currentEdit].ansType) {
      dispatch(InquiryActions.validate({
        field: Boolean(questions[currentEdit].field),
        inqType: Boolean(questions[currentEdit].inqType),
        receiver: Boolean(questions[currentEdit].receiver.length),
        ansType: Boolean(questions[currentEdit].ansType.length),
        content: Boolean(questions[currentEdit].content),
        answerContent: true
      }));
    }
    if (check && index !== currentEdit) dispatch(InquiryActions.setEdit(index));
  };
  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...questions];
    if (e.target.checked) {
      dispatch(InquiryActions.validate({ ...valid, receiver: true }));
      optionsOfQuestion[index].receiver.push(e.target.value);
    } else {
      const i = optionsOfQuestion[index].receiver.indexOf(e.target.value);
      optionsOfQuestion[index].receiver.splice(i, 1);
    }
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };
  return (
    <>
      {questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '12px' }}>
          <div className="flex justify-between" style={{ padding: '0.5rem' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', 'color': '#BD0F72' }}>
              {question.field ? getKeyByValue(metadata['field'], question.field) : 'New Inquiry'}
            </div>
            <FormControl error={!valid.receiver && !question.receiver.length}>
              <div className={clsx('flex')}>
                <FormGroup row>
                  <FormControlLabel
                    value="onshore"
                    control={
                      <Checkbox
                        checked={question.receiver.includes('onshore')}
                        onChange={(e) => handleReceiverChange(e, index)}
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
                    label={
                      <Typography className={classes.fontText}>Onshore</Typography>
                    }
                  />
                  <FormControlLabel
                    value="customer"
                    control={
                      <Checkbox
                        checked={question.receiver.includes('customer')}
                        onChange={(e) => handleReceiverChange(e, index)}
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
                    label={
                      <Typography className={classes.fontText}>Customer</Typography>
                    }
                  />
                </FormGroup>
                <div className="flex justify-end items-center mr-2 ">
                  <AttachFile uploadImageAttach={handleUploadImageAttach} index={index} />
                  {(inquiries.length + questions.length !== metadata.field_options.length) &&
                    <Tooltip title="Clone">
                      <IconButton className="p-8" onClick={() => copyQuestion(index)}>
                        <img style={{ height: "22px" }} src="/assets/images/icons/copy.png" />
                      </IconButton>
                    </Tooltip>
                  }
                  {questions.length !== 1 &&
                    <Tooltip title="Delete">
                      <IconButton className="p-8" onClick={() => removeQuestion(index)}>
                        <img src="/assets/images/icons/delete.png" />
                      </IconButton>
                    </Tooltip>
                  }
                </div>
              </div>
              {(!valid.receiver && !question.receiver.length) ? <FormHelperText>Pick at least one!</FormHelperText> : null}
            </FormControl>
          </div>
          {currentEdit === index ? (
            <InquiryEditor
              index={index}
              questions={questions}
              question={question}
              saveQuestion={(q) => dispatch(InquiryActions.setQuestion(q))}
            />
          ) : (
            <div style={{ padding: '0.5rem ' }}>
              <div onClick={() => changeToEditor(index)}>
                <div style={{ fontSize: '19px', wordBreak: 'break-word' }}>{question.content.replace('{{INQ_TYPE}} ', '')}</div>
                <div style={{ display: 'block', margin: '1rem 0rem' }}>
                  {question.ansType === metadata.ans_type.choice && (
                    <ChoiceAnswer question={question} />
                  )}
                  {question.ansType === metadata.ans_type.paragraph && (
                    <ParagraphAnswer
                      question={question}
                    />
                  )}
                  {question.ansType === metadata.ans_type.attachment && (
                    <AttachmentAnswer
                      question={question}
                    // disabled={true}
                    />
                  )}
                </div>
              </div>
              {
                question.mediaFile.map((file, mediaIndex) => (
                  <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex} className={classes.root}>
                    {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                      <ImageAttach hiddenRemove={true} field={question.field} file={file} style={{ margin: '1rem' }} />
                    ) : (
                      <FileAttach file={file} field={question.field} />
                    )
                    }
                  </div>
                )
                )
              }
              <Divider />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default InquiryForm;
