import { getKeyByValue, stateResquest } from '@shared';
import { getFile } from 'app/services/fileService';
import { deleteInquiry } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
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
    display: 'block',
    position: 'absolute',
    top: '0px',
    left: '4px',
    width: '5px',
    height: '10px',
    border: '1px solid #BD0F72',
    borderWidth: '0 2px 2px 0',
    transform: 'rotate(45deg)',
    'input:hover ~ &': {
      backgroundColor: '#106ba3'
    }
  },
  inqTitle: {
    fontFamily: 'Montserrat',
    color: '#BD0F72',
    fontSize: 22,
    fontWeight: 600,
    wordBreak: 'break-word'
  }
}));
const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { receiver } = props;
  const classes = useStyles();
  const [allowDeleteInq, setAllowDeleteInq] = useState(true);
  const [inquiries, currentEdit, metadata, valid, myBL] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.myBL,
  ]);
  const allowCreateAttachmentAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT
  });

  const changeToEditor = (index, field) => {
    if (index !== currentEdit) {
      dispatch(InquiryActions.setEditInq(index));
      dispatch(InquiryActions.setField(field));
    }
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...inquiries];
    const inqDelete = optionsOfQuestion.splice(index, 1)[0];
    deleteInquiry(inqDelete.id).then(() => {
      dispatch(InquiryActions.editInquiry(optionsOfQuestion));
      dispatch(InquiryActions.setOriginalInquiry(optionsOfQuestion));
    }).catch((error) => console.error(error))
  };

  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = [...inquiries];
    optionsOfQuestion[index].receiver = [];
    dispatch(InquiryActions.validate({ ...valid, receiver: true }));
    optionsOfQuestion[index].receiver.push(e.target.value);
    dispatch(InquiryActions.setQuestion(optionsOfQuestion));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
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
  useEffect(() => {
    (myBL?.state !== stateResquest) && setAllowDeleteInq(false)
    for (let i in inquiries) {
      if (inquiries[i].mediaFile.length && !inquiries[i].mediaFile[0].src) {
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
  }, []);

  return (
    <>
      {inquiries.map((q, index) => {
        if (receiver && !q.receiver.includes(receiver)) {
          return <div style={{ display: 'flex' }} onClick={() => changeToEditor(index, q.field)}></div>;
        }
        const type = q.ansType;
        return (
          <div key={index} style={{ marginBottom: '24px' }} onClick={() => changeToEditor(index, q.field)}>
            <PermissionProvider
              action={PERMISSION.VIEW_EDIT_INQUIRY}
              extraCondition={currentEdit === index}
              fallback={
                <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                  <div className="flex justify-between">
                    <Typography color="primary" variant="h5" className={classes.inqTitle}>
                      {getKeyByValue(metadata['field'], q.field)}
                    </Typography>
                    <div className="flex justify-end" style={{ width: '350px' }}>
                      <FormControl error={!valid.receiver && !q.receiver.length}>
                        <FormGroup row>
                          <FormControlLabel
                            value="onshore"
                            control={
                              <Checkbox
                                checked={q.receiver?.includes('onshore')}
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
                            label="Onshore"
                          />
                          <FormControlLabel
                            value="customer"
                            control={
                              <Checkbox
                                checked={q.receiver.includes('customer')}
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
                            label="Customer"
                          />
                        </FormGroup>
                        {!valid.receiver && !q.receiver.length ? (
                          <FormHelperText>Pick at least one!</FormHelperText>
                        ) : null}
                      </FormControl>
                    </div>
                  </div>
                  <Typography variant="h5">{q.name}</Typography>
                  <Typography
                    variant="h5"
                    style={{
                      wordBreak: 'break-word',
                      fontFamily: 'Montserrat',
                      fontSize: 15,
                      color: '#132535'
                    }}>
                    {q.content}
                  </Typography>
                  <div style={{ display: 'block', margin: '1rem 0rem' }}>
                    {type === metadata.ans_type.paragraph && (
                      <ParagraphAnswer
                        question={q}
                        index={index}
                        questions={inquiries}
                        saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                      />
                    )}
                    {type === metadata.ans_type.attachment && (
                      <AttachmentAnswer
                        question={q}
                        index={index}
                        questions={inquiries}
                        saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                        isPermissionAttach={allowCreateAttachmentAnswer}
                      />
                    )}
                  </div>
                  <>
                    {q.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
                    {q.mediaFile?.length > 0 &&
                  q.mediaFile?.map((file, mediaIndex) => (
                    <div
                      style={{ position: 'relative', display: 'inline-block' }}
                      key={mediaIndex}>
                      {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                        <ImageAttach file={file} field={q.field} indexInquiry={index} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttach file={file} field={q.field} indexInquiry={index} />
                      )}
                    </div>
                  ))}
                  </>
                  <>
                    {q.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
                    {q.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
                      <div
                        style={{ position: 'relative', display: 'inline-block' }}
                        key={mediaIndex}>
                        {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                          <ImageAttach file={file} field={q.field} style={{ margin: '2.5rem' }} />
                        ) : (
                          <FileAttach file={file} field={q.field} />
                        )}
                      </div>
                    ))}
                  </>
                </Card>
              }>
              <div className="flex justify-between">
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
                  {getKeyByValue(metadata['field'], q.field)}
                </div>
                <div className="flex justify-end">
                  <FormControl error={!valid.receiver && !q.receiver.length}>
                    <FormGroup row>
                      <FormControlLabel
                        value="onshore"
                        control={
                          <Checkbox
                            checked={q.receiver.includes('onshore')}
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
                        label="Onshore"
                      />
                      <FormControlLabel
                        value="customer"
                        control={
                          <Checkbox
                            checked={q.receiver.includes('customer')}
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
                        label="Customer"
                      />
                    </FormGroup>
                    {!valid.receiver && !q.receiver.length ? (
                      <FormHelperText>Pick at least one!</FormHelperText>
                    ) : null}
                  </FormControl>
                  <div className="flex justify-end items-center mr-2 ">
                    <AttachFile index={index}/>
                    {allowDeleteInq &&
                      <IconButton className="p-8" onClick={() => removeQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>}
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
