import { getKeyByValue, stateResquest, displayTime } from '@shared';
import { getFile } from 'app/services/fileService';
import { deleteInquiry, loadComment } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  FormControl,
  FormGroup,
  Tooltip,
  FormControlLabel,
  IconButton,
  Checkbox,
  FormHelperText,
  Divider,
  RadioGroup,
  Radio,
  Grid,
} from '@material-ui/core';
import IconAttachFile from '@material-ui/icons/AttachFile';
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ChoiceAnswer from './ChoiceAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';

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
  inqTitle: {
    fontFamily: 'Montserrat',
    color: '#BD0F72',
    fontSize: 22,
    fontWeight: 600,
    wordBreak: 'break-word'
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    color: '#8A97A3 !important'
  },
  viewMoreBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 'fit-content',
    position: 'sticky',
    left: '100%',
    color: '#BD0F72',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer'
  },
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical',
  },
  boxItem: {
    borderLeft: '2px solid',
    borderColor: '#DC2626',
    paddingLeft: '2rem'
  },
  boxHasComment: {
    borderColor: '#2F80ED',
  }
}));
const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { receiver, openInquiryReview } = props;
  const classes = useStyles();
  const [allowDeleteInq, setAllowDeleteInq] = useState(true);
  const [viewDropDown, setViewDropDown] = useState('');
  const [inqHasComment, setInqHasComment] = useState([]);
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
  let CURRENT_NUMBER = 0;

  const changeToEditor = (index, field) => {
    if (index !== currentEdit) {
      dispatch(InquiryActions.setEditInq(index));
      dispatch(InquiryActions.setField(field));
      setViewDropDown('');
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
    dispatch(InquiryActions.editInquiry(optionsOfQuestion));
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

  const handleViewMore = (id) => viewDropDown === id ? setViewDropDown('') : setViewDropDown(id);

  useEffect(() => {
    (myBL?.state !== stateResquest) && setAllowDeleteInq(false)
    for (let i in inquiries) {
      loadComment(inquiries[i].id)
        .then((res) => {
          if (res.length) {
            const listInqId = inqHasComment;
            listInqId.push(inquiries[i].id);
            setInqHasComment(listInqId)
          }
        })
        .catch((error) => console.error(error));

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
          return <div key={index} style={{ display: 'flex' }} onClick={() => changeToEditor(index, q.field)}></div>;
        }
        const type = q.ansType;
        CURRENT_NUMBER++;
        return (
          <PermissionProvider
            key={index}
            action={PERMISSION.VIEW_EDIT_INQUIRY}
            extraCondition={currentEdit === index}
            fallback={
              <Card elevation={0} style={{ padding: '1rem ' }}>
                <div className={clsx(classes.boxItem, inqHasComment.includes(q.id) && classes.boxHasComment)}>
                  <div style={{ marginBottom: '12px' }}>
                    <div className="flex justify-between">
                      <Typography color="primary" variant="h5" className={classes.inqTitle}>
                        {`${CURRENT_NUMBER}. ${getKeyByValue(metadata['field'], q.field)}`}
                      </Typography>
                      <div className="flex justify-end" style={{ width: '350px' }}>
                        <PermissionProvider action={PERMISSION.VIEW_EDIT_INQUIRY}>
                          <Tooltip title="Edit Inquiry">
                            <div className="flex justify-end items-center mr-2 " onClick={() => changeToEditor(index, q.field)}>
                              <img
                                style={{ width: 20, cursor: 'pointer' }}
                                src='/assets/images/icons/edit.svg'
                              />
                            </div>
                          </Tooltip>
                        </PermissionProvider>
                        <div className="flex justify-end items-center mr-2 ">
                          {q.mediaFile?.length > 0 && <IconAttachFile className={clsx(classes.attachIcon)} />}
                          {/* {allowDeleteInq &&
                              <IconButton className="p-8" onClick={() => removeQuestion(index)}>
                                <DeleteIcon />
                              </IconButton>} */}
                        </div>
                        <div className="flex justify-end items-center" onClick={() => removeQuestion(index)} >
                          {allowDeleteInq && <img style={{ height: "22px", cursor: 'pointer' }} src="/assets/images/icons/trash-gray.svg" />}
                        </div>
                      </div>
                    </div>
                    <div className='py-20'>
                      <UserInfo
                        name={q.creator.userName}
                        time={displayTime(q.createdAt)}
                        avatar={q.creator.avatar} />
                    </div>
                    <Typography variant="h5">{q.name}</Typography>
                    <Typography
                      className={(viewDropDown !== q.id) ? classes.hideText : ''}
                      variant="h5"
                      style={{
                        wordBreak: 'break-word',
                        fontFamily: 'Montserrat',
                        fontSize: 15,
                        color: '#132535',
                      }}>
                      {q.content}
                    </Typography>
                    {(viewDropDown === q.id) &&
                      <div style={{ display: 'block', margin: '1rem 0rem' }}>
                        {type === metadata.ans_type.choice && (
                          <ChoiceAnswer
                            index={index}
                            questions={inquiries}
                            question={q}
                            saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                          />
                        )}
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
                      </div>}
                    <>
                      <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={6}>
                          {q.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.viewMoreBtn} onClick={() => handleViewMore(q.id)}>
                            {viewDropDown !== q.id ?
                              <>
                                View All
                                <ArrowDropDown />
                              </> : <>
                                Hide All
                                <ArrowDropUp />
                              </>}
                          </div>
                        </Grid>
                      </Grid>
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
                  </div>
                </div>
                <Divider className='my-32' variant='middle' style={{ height: '2px', color: '#BAC3CB' }} />
              </Card>
            }>
            <div className="flex justify-between">
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
                {getKeyByValue(metadata['field'], q.field)}
              </div>
              <div className="flex justify-end">
                <FormControl error={!valid.receiver && !q.receiver.length} className={classes.checkedIcon}>
                  <RadioGroup aria-label="receiver" name="receiver" value={q.receiver[0]} onChange={(e) => handleReceiverChange(e, index)}>
                    <FormControlLabel value="customer" control={<Radio color={'primary'} />} label="Customer" />
                    <FormControlLabel value="onshore" control={<Radio color={'primary'} />} label="Onshore" />
                  </RadioGroup>
                  {!valid.receiver && !q.receiver.length ? (
                    <FormHelperText>Pick at least one!</FormHelperText>
                  ) : null}
                </FormControl>
                <div className="flex justify-end items-center mr-2 ">
                  <AttachFile index={index} />
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
          </PermissionProvider >
        );
      })}
    </>
  );
};

export default AllInquiry;
