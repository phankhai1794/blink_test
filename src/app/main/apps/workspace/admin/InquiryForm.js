import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as InquiryActions from './store/actions/inquiry';
import * as FormActions from './store/actions/form';
import { getKeyByValue } from '@shared';
import { makeStyles } from '@material-ui/styles';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { Divider, FormGroup, FormControlLabel, Checkbox, FormControl, FormHelperText, IconButton, Fab } from '@material-ui/core';
import ChoiceAnswer from '../shared-components/ChoiceAnswer';
import ParagraphAnswer from '../shared-components/ParagraphAnswer';
import AttachmentAnswer from '../shared-components/AttachmentAnswer';
import InquiryEditor from './components/InquiryEditor';
import Form from '../shared-components/Form';
import AttachFile from './components/AttachFile';
import ImageAttach from '../shared-components/ImageAttach';
import FileAttach from '../shared-components/FileAttach';

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
  const [questions, metadata, valid, currentEdit] = useSelector((state) => [
    state.workspace.inquiryReducer.question,
    state.workspace.inquiryReducer.metadata,
    state.workspace.inquiryReducer.validation,
    state.workspace.inquiryReducer.currentEdit,
  ]);
  const classes = useStyles();

  const [open] = useSelector((state) => [
    state.workspace.formReducer.openDialog,
  ])

  useEffect(() => {
    const check = questions.filter((q) => !q.receiver.length)
    dispatch(InquiryActions.validate({ ...valid, receiver: !Boolean(check.length) }));
  }, [questions])

  const copyQuestion = (index) => {
    const temp = JSON.parse(JSON.stringify(questions[index]));
    dispatch(InquiryActions.setQuestion([...questions, temp]))
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1);
    if (index > 0) {
      dispatch(InquiryActions.setEdit(index - 1));
    }
    dispatch(InquiryActions.setQuestion(optionsOfQuestion))
  };

  const handleUploadImageAttach = (src, index) => {
    const optionsOfQuestion = [...questions];
    const list = optionsOfQuestion[index].mediaFile;
    const formData = new FormData();
    formData.append('file', src);
    formData.append('name', src.name);
    optionsOfQuestion[index].mediaFile = [
      ...list,
      { id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData }
    ];
    dispatch(InquiryActions.setQuestion(optionsOfQuestion))
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
        error: true
      }))
    } else if (index !== currentEdit) dispatch(InquiryActions.setEdit(index));
  };
  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...questions];
    if (e.target.checked) {
      dispatch(InquiryActions.validate({ ...valid, error: false }));
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
          <>
            <div style={{ marginBottom: '12px' }}>
              <div className="flex justify-between" style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', 'color': '#BD0F72' }}>
                  {question.field ? getKeyByValue(metadata['field'], question.field) : 'New Inquiry'}
                </div>
                <div className="flex">
                  <FormControl error={valid.error && !questions[index].receiver.length}>
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
                    {valid.error && !questions[index].receiver.length && <FormHelperText>Pick at least one!</FormHelperText>}
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
                    <div style={{ fontSize: '19px' }}>{question.content}</div>
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
          </>
        ))}
      </>
    </Form>
  );
};

export default InquiryForm;
