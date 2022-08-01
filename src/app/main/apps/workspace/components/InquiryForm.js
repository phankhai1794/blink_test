import { getKeyByValue, validateExtensionFile, toFindDuplicates } from '@shared';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  Typography,
  Tooltip,
  RadioGroup,
  Radio
} from '@material-ui/core';
import * as AppAction from 'app/store/actions';
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
      backgroundColor: 'transparent'
    }
  },
  formCreate: {
    '& .errorReceiver': {
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '180px',
      marginBottom: '10px',
    },
    '& .errorReceiver .MuiFormHelperText-root': {
      color: 'red',
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
    }
  },
  checkedIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
  },
  fontText: {
    fontSize: '15px',
    fontFamily: 'Montserrat',
    fontWeight: '500',
    height: '18px',
    fontStyle: 'normal',
    lineHeight: '18px',
    color: '#000000'
  }
}));

const InquiryForm = (props) => {
  const { FabTitle } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const questions = useSelector(({ workspace }) => workspace.inquiryReducer.question);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);
  const currentEdit = useSelector(({ workspace }) => workspace.inquiryReducer.currentEdit);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const removeOptions = useSelector(({ workspace }) => workspace.inquiryReducer.removeOptions);
  const open = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const filesUpload = useSelector(({ workspace }) => workspace.inquiryReducer.filesUpload);

  const copyQuestion = (index) => {
    const optionsOfQuestion = JSON.parse(JSON.stringify(questions[index]));
    optionsOfQuestion.content = optionsOfQuestion.content.replace(
      getKeyByValue(metadata['inq_type'], optionsOfQuestion.inqType),
      '{{INQ_TYPE}}'
    );
    optionsOfQuestion.inqType = '';
    questions[index].mediaFile.map((file, i) => {
      optionsOfQuestion.mediaFile[i].fileUpload = file.fileUpload;
    });
    if (inquiries.length + questions.length + 1 === metadata.field_options.length) {
      dispatch(FormActions.toggleAddInquiry(false));
    }
    dispatch(InquiryActions.setQuestion([...questions, optionsOfQuestion]));
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
    dispatch(FormActions.toggleAddInquiry(true));
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
    dispatch(
      InquiryActions.validate({
        inqType: true,
        field: true,
        receiver: true,
        ansType: true,
        content: true,
        answerContent: true
      })
    );
  };

  const changeToEditor = (index) => {
    let check = true;
    const ansTypeChoice = metadata.ans_type['choice'];
    let validate = {};
    if (
      !questions[currentEdit].inqType ||
      !questions[currentEdit].field ||
      !questions[currentEdit].receiver.length ||
      !questions[currentEdit].ansType.length ||
      !questions[currentEdit].content ||
      ansTypeChoice === questions[currentEdit].ansType
    ) {
      validate = {
        ...valid,
        field: Boolean(questions[currentEdit].field),
        inqType: Boolean(questions[currentEdit].inqType),
        receiver: Boolean(questions[currentEdit].receiver.length),
        ansType: Boolean(questions[currentEdit].ansType.length),
        content: Boolean(questions[currentEdit].content)
      };
      if (ansTypeChoice === questions[currentEdit].ansType) {
        // check empty a field
        if (questions[currentEdit].answerObj.length > 0) {
          const checkOptionEmpty = questions[currentEdit].answerObj.filter((item) => !item.content);
          if (checkOptionEmpty.length > 0) {
            validate = { ...validate, answerContent: false };
          } else {
            validate = { ...validate, answerContent: true };
          }
          const dupArray = questions[currentEdit].answerObj.map((ans) => ans.content);
          if (toFindDuplicates(dupArray).length) {
            dispatch(
              AppAction.showMessage({
                message: 'Options value must not be duplicated',
                variant: 'error'
              })
            );
            return;
          }
        } else {
          validate = { ...validate, answerContent: false };
        }
      }
      dispatch(InquiryActions.validate(validate));
      check =
        validate.inqType &&
        validate.field &&
        validate.receiver &&
        validate.ansType &&
        validate.content &&
        validate.answerContent;
    }
    if (ansTypeChoice !== questions[currentEdit].ansType) {
      dispatch(
        InquiryActions.validate({
          field: Boolean(questions[currentEdit].field),
          inqType: Boolean(questions[currentEdit].inqType),
          receiver: Boolean(questions[currentEdit].receiver.length),
          ansType: Boolean(questions[currentEdit].ansType.length),
          content: Boolean(questions[currentEdit].content),
          answerContent: true
        })
      );
    }
    if (check && index !== currentEdit) dispatch(InquiryActions.setEdit(index));
  };
  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].receiver = [];
    dispatch(InquiryActions.validate({ ...valid, receiver: true }));
    optionsOfQuestion[index].receiver.push(e.target.value);
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };
  return (
    <>
      {questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '12px' }} className={classes.formCreate}>
          <div className="flex justify-between" style={{ padding: '0.5rem' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
              {question.field ? getKeyByValue(metadata['field'], question.field) : 'New Inquiry'}
            </div>
            <FormControl
              error={!valid.receiver && !question.receiver.length}
              className={classes.checkedIcon}>
              <RadioGroup
                aria-label="receiver"
                name="receiver"
                value={question.receiver[0]}
                onChange={(e) => handleReceiverChange(e, index)}>
                <FormControlLabel
                  value="customer"
                  control={<Radio color={'primary'} />}
                  label="Customer"
                />
                <FormControlLabel
                  value="onshore"
                  control={<Radio color={'primary'} />}
                  label="Onshore"
                />
              </RadioGroup>
              <div className="flex justify-end items-center mr-2" style={{ marginBottom: 2 }}>
                <AttachFile index={index} />
                {inquiries.length + questions.length !== metadata.field_options.length && (
                  <Tooltip title="Clone Inquiry">
                    <IconButton className="p-8" onClick={() => copyQuestion(index)}>
                      <img style={{ height: '22px' }} src="/assets/images/icons/copy.svg" />
                    </IconButton>
                  </Tooltip>
                )}
                {questions.length !== 1 && (
                  <Tooltip title="Delete Inquiry">
                    <IconButton className="p-8" onClick={() => removeQuestion(index)}>
                      <img src="/assets/images/icons/trash.svg" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </FormControl>
          </div>
          <div className={'errorReceiver'}>
            {!valid.receiver && !question.receiver.length ? (
              <FormHelperText>Pick at least one!</FormHelperText>
            ) : null}
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
                <div style={{ fontSize: '19px', wordBreak: 'break-word' }}>
                  {question.content.replace('{{INQ_TYPE}} ', '')}
                </div>
                <div style={{ display: 'block', margin: '1rem 0rem' }}>
                  {question.ansType === metadata.ans_type.choice && (
                    <ChoiceAnswer question={question} />
                  )}
                  {question.ansType === metadata.ans_type.paragraph && (
                    <ParagraphAnswer question={question} />
                  )}
                  {question.ansType === metadata.ans_type.attachment && (
                    <AttachmentAnswer
                      question={question}
                      // disabled={true}
                    />
                  )}
                </div>
              </div>
              {question.mediaFile.map((file, mediaIndex) => (
                <div
                  style={{ position: 'relative', display: 'inline-block' }}
                  key={mediaIndex}
                  className={classes.root}>
                  {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                    <ImageAttach
                      hiddenRemove={true}
                      field={question.field}
                      file={file}
                      style={{ margin: '1rem' }}
                    />
                  ) : (
                    <FileAttach hiddenRemove={true} file={file} field={question.field} />
                  )}
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default InquiryForm;
