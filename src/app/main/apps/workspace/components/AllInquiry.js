import { getKeyByValue } from '@shared';
import { getFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import {
  Card,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  IconButton,
  Checkbox,
  FormHelperText
} from '@material-ui/core';

import * as InquiryActions from '../store/actions/inquiry';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';

const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { receiver } = props;
  const [inquiries, currentEdit, currentField, metadata, valid] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.validation
  ]);
  const allowCreateAttachmentAnswer = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT });

  const indexes = inquiries.findIndex((q) => q.field === currentField);
  const changeToEditor = (index) => {
    if (index !== currentEdit) dispatch(InquiryActions.setEditInq(index));
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...inquiries];
    optionsOfQuestion.splice(index, 1);
    if (index > 0) {
      dispatch(InquiryActions.setEdit(index - 1));
    }
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };

  const handleUploadImageAttach = (src, index) => {
    const optionsOfQuestion = [...inquiries];
    const list = optionsOfQuestion[index].mediaFile;
    const formData = new FormData();
    formData.append('file', src);
    formData.append('name', src.name);
    optionsOfQuestion[index].mediaFile = [
      ...list,
      { id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData }
    ];
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };

  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...inquiries];
    if (e.target.checked) {
      dispatch(InquiryActions.validate({ ...valid, error: false }));
      optionsOfQuestion[index].receiver.push(e.target.value);
    } else {
      const i = optionsOfQuestion[index].receiver.indexOf(e.target.value);
      optionsOfQuestion[index].receiver.splice(i, 1);
    }
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
  };
  useEffect(() => {
    const optionsOfQuestion = [...inquiries];
    for (let i in inquiries) {
      if (inquiries[i].mediaFile.length && !inquiries[i].mediaFile[0].src) {
        for (let f in inquiries[i].mediaFile) {
          getFile(inquiries[i].mediaFile[f].id)
            .then((file) => {
              let url = '';
              if (inquiries[i].mediaFile[f].ext.match(/jpeg|jpg|png/g)) {
                url = URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
              } else {
                url = URL.createObjectURL(new Blob([file]));
              }
              optionsOfQuestion[i].mediaFile[f].src = url;
              dispatch(InquiryActions.editInquiry(optionsOfQuestion));
            })
            .catch((error) => console.error(error));
        }
      }
    }
  }, []);
  return (
    <>
      {inquiries.map((q, index) => {
        if (receiver && !q.receiver.includes(receiver)) {
          return (
            <div
              style={{ display: 'flex' }}
              onClick={() => changeToEditor(index)}></div>
          );
        }
        const type = q.ansType;
        return (
          <div key={index} style={{ marginBottom: '24px' }} onClick={() => changeToEditor(index)}>
            <PermissionProvider
              action={PERMISSION.VIEW_EDIT_INQUIRY}
              extraCondition={currentEdit === index}
              fallback={
                <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                  <div className="flex justify-between">
                    <Typography color="primary" variant="h5">
                      Inquiry {index + 1} - {getKeyByValue(metadata['field'], q.field)}
                    </Typography>
                  </div>
                  <Typography variant="h5">{q.name}</Typography>
                  <Typography variant="h5">{q.content}</Typography>
                  <div style={{ display: 'block', margin: '1rem 0rem' }}>
                    {type === metadata.ans_type.choice && (
                      <ChoiceAnswer
                        index={indexes}
                        questions={inquiries}
                        question={q}
                        saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                      />
                    )}
                    {type === metadata.ans_type.paragraph && (
                      <ParagraphAnswer
                        question={q}
                        index={indexes}
                        questions={inquiries}
                        saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                      />
                    )}
                    {type === metadata.ans_type.attachment && (
                      <AttachmentAnswer
                        question={q}
                        index={indexes}
                        questions={inquiries}
                        saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                        isPermissionAttach={allowCreateAttachmentAnswer}
                        // disabled={true}
                      />
                    )}
                  </div>
                  {q.mediaFile.map((file, index) =>
                    file.ext.match(/jpeg|jpg|png/g) ? (
                      <ImageAttach src={file.src} style={{ margin: '1rem' }} />
                    ) : (
                      <FileAttach file={file} />
                    )
                  )}
                </Card>
              }>
              <div className="flex justify-between">
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
                  {getKeyByValue(metadata['field'], q.field)}
                </div>
                <div className="flex justify-end">
                  <FormControl error={valid.error && !q.receiver.length}>
                    <FormGroup row>
                      <FormControlLabel
                        value="onshore"
                        control={
                          <Checkbox
                            checked={q.receiver.includes('onshore')}
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
                            checked={q.receiver.includes('customer')}
                            onChange={(e) => handleReceiverChange(e, index)}
                            color="primary"
                          />
                        }
                        label="Customer"
                      />
                    </FormGroup>
                    {valid.error && !q.receiver.length && (
                      <FormHelperText>Pick at least one!</FormHelperText>
                    )}
                  </FormControl>
                  <div className="flex justify-end items-center mr-2 ">
                    <AttachFile uploadImageAttach={handleUploadImageAttach} index={index} />
                    <IconButton disabled className="p-8" onClick={() => removeQuestion(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              <InquiryEditor
                index={index}
                questions={inquiries}
                question={q}
                saveQuestion={(e) => dispatch(InquiryActions.editInquiry(e))}
              />
            </PermissionProvider>
          </div>
        );
      })}
    </>
  );
};

export default AllInquiry;
