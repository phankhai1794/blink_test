import { getKeyByValue, validateExtensionFile } from '@shared';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { Divider, FormGroup, FormControlLabel, Checkbox, FormControl, FormHelperText, IconButton, Fab } from '@material-ui/core';
import * as AppAction from "app/store/actions";

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import Form from './Form';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '15px',
    position: 'absolute',
    left: '215px',
    top: '-5px',
    height: '25px',
    width: '25px',
    backgroundColor: 'silver'
  }
}));
const InquiryForm = (props) => {
  const { FabTitle } = props;
  const dispatch = useDispatch();
  const [questions, metadata, valid, currentEdit] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.currentEdit,
  ]);
  const classes = useStyles();

  const [open] = useSelector(({ workspace }) => [
    workspace.formReducer.openDialog,
  ])

  useEffect(() => {
    const checkGeneral = questions.filter((q) => !q.inqType || !q.field)
    dispatch(InquiryActions.validate({ ...valid, general: !checkGeneral.length }));
  }, [questions])

  const copyQuestion = (index) => {
    const optionsOfQuestion = JSON.parse(JSON.stringify(questions[index]));
    optionsOfQuestion.field = ''
    dispatch(InquiryActions.setQuestion([...questions, optionsOfQuestion]))
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1);
    if (index > 0) {
      dispatch(InquiryActions.setEdit(index - 1));
    }
    dispatch(InquiryActions.setQuestion(optionsOfQuestion))
  };

  const handleUploadImageAttach = (files, index) => {
    const optionsOfQuestion = [...questions];
    const inValidFile = files.find(elem => !validateExtensionFile(elem));
    if (inValidFile) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      files.forEach(src => {
        const formData = new FormData();
        formData.append('file', src);
        formData.append('name', src.name);
        optionsOfQuestion[index].mediaFile.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData });
      });
      dispatch(InquiryActions.setQuestion(optionsOfQuestion));
    }
  };
  const handleRemoveImageAttach = (i, index) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].mediaFile.splice(i, 1);
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };

  const changeToEditor = (index) => {
    if (!questions[currentEdit].inqType || !questions[currentEdit].field || !questions[currentEdit].receiver.length) {
      dispatch(InquiryActions.validate({
        field: Boolean(questions[currentEdit].field),
        inqType: Boolean(questions[currentEdit].inqType),
        receiver: Boolean(questions[currentEdit].receiver.length),
      }))
    } else if (index !== currentEdit) dispatch(InquiryActions.setEdit(index));
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
    <Form
      FabTitle={FabTitle}
      title="Inquiry Creation"
      toggleForm={(status) => dispatch(FormActions.toggleCreateInquiry(status))}
      open={open}
    >
      <>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <div className="flex justify-between" style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', 'color': '#BD0F72' }}>
                {question.field ? getKeyByValue(metadata['field'], question.field) : 'New Inquiry'}
              </div>
              <div className="flex">
                <FormControl error={!valid.receiver && !question.receiver.length}>
                  <FormGroup row>
                    <FormControlLabel
                      value="onshore"
                      control={
                        <Checkbox
                          checked={question.receiver.includes('onshore')}
                          onChange={(e) => handleReceiverChange(e, index)}
                          color="primary"
                        />
                      }
                      label="Onshore"
                    />
                    <FormControlLabel
                      value="customer"
                      control={
                        <Checkbox
                          checked={question.receiver.includes('customer')}
                          onChange={(e) => handleReceiverChange(e, index)}
                          color="primary"
                        />
                      }
                      label="Customer"
                    />
                  </FormGroup>
                  {(!valid.receiver && !question.receiver.length) ? <FormHelperText>Pick at least one!</FormHelperText> : null}
                </FormControl>
                <div className="flex justify-end items-center mr-2 ">
                  <AttachFile uploadImageAttach={handleUploadImageAttach} index={index} />
                  <IconButton className="p-8" onClick={() => copyQuestion(index)}>
                    <FileCopyIcon />
                  </IconButton>
                  <IconButton disabled={questions.length === 1} className="p-8" onClick={() => removeQuestion(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
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
                  question.mediaFile.map((file, mediaIndex) =>
                    file.ext.match(/jpeg|jpg|png/g) ? (
                      <div style={{ position: 'relative' }}>
                        <Fab
                          classes={{
                            root: classes.root
                          }}
                          size="small"
                          onClick={() => handleRemoveImageAttach(mediaIndex, index)}
                        >
                          <CloseIcon style={{ fontSize: 20 }} />
                        </Fab>
                        <ImageAttach src={file.src} style={{ margin: '1rem' }} />
                      </div>
                    ) : (
                      <FileAttach file={file} />
                    )
                  )
                }
                <Divider />
              </div>
            )}
          </div>
        ))}
      </>
    </Form>
  );
};

export default InquiryForm;
