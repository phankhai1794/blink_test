import { FuseChipSelect } from '@fuse';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLabelById, toFindDuplicates } from '@shared';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Button,
  Radio,
  RadioGroup,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { uploadFile } from 'app/services/fileService';
import { updateInquiry, saveInquiry, deleteInquiry } from 'app/services/inquiryService';
import * as AppActions from 'app/store/actions';
import clsx from 'clsx';
import axios from 'axios';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswerEditor from './ChoiceAnswerEditor';
import ParagraphAnswerEditor from './ParagraphAnswerEditor';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
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

  },
  button: {
    margin: theme.spacing(1),
    marginRight: 3,
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
  positionBtnImg: {
    left: '0',
    top: '-3rem'
  },
  positionBtnNotImg: {
    left: '0',
    top: '4rem'
  },
  form: {
    '& .fuse-chip-select--is-disabled': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.38)'
      },
      '& .MuiInputBase-input p': {
        color: 'rgba(0, 0, 0, 0.38)'
      },
      '& .MuiSvgIcon-root': {
        color: 'rgba(0, 0, 0, 0.38)'
      }
    }
  }
}));

// Main Component
const InquiryEditor = (props) => {
  // custom attribute must be lowercase
  const dispatch = useDispatch();
  const classes = useStyles();
  const { onCancel } = props;
  const [metadata, valid, inquiries, currentEditInq, myBL] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.myBL
  ]);
  const user = useSelector(({ user }) => user);

  const optionsAnsType = [
    {
      label: 'Option Selection',
      value: metadata.ans_type.choice
    },
    {
      label: 'Onshore/Customer Input',
      value: metadata.ans_type.paragraph
    }
  ];

  const allowCreateAttachmentAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT
  });
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const [fieldType, setFieldType] = useState(metadata.field_options.filter(data => !['vvdCode', 'podCode', 'delCode'].includes(data.keyword)));
  const [valueType, setValueType] = useState(
    metadata.inq_type_options.filter((v) => currentEditInq.inqType === v.value)[0]
  );
  const [valueAnsType, setValueAnsType] = useState(
    optionsAnsType.filter((ansType) => ansType.value === currentEditInq.ansType)
  );
  const [fieldValue, setFieldValue] = useState(
    metadata.field_options.filter((v) => currentEditInq.field === v.value)[0]
  );
  const [inqTypeOption, setInqTypeOption] = useState(metadata.inq_type_options);

  const styles = (width) => {
    return {
      control: {
        width: `${width}px`,
        borderRadius: 11
      }
    };
  };

  useEffect(() => {
    if (fieldValue) {
      const list = [currentEditInq];
      const filter = metadata.inq_type_options
        .filter((data) => {
          return (
            data.field?.includes(fieldValue.value) &&
            list.filter((q) => q.inqType === data.value && q.field === fieldValue.value).length === 0
          );
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      setInqTypeOption(filter);
    }
  }, [fieldValue]);

  const handleTypeChange = (e) => {
    const inq = { ...currentEditInq };
    inq.inqType = e.value;
    if (e.__isNew__) inq.isNew = e.__isNew__
    dispatch(InquiryActions.validate({ ...valid, inqType: true }));
    const temp = valueType ? `\\b${valueType.label}\\b` : '{{INQ_TYPE}}';
    let re = new RegExp(`${temp}`, 'g');
    inq.content = currentEditInq.content.replace(re, e.label);
    setValueType(e);
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleFieldChange = (e) => {
    const inq = { ...currentEditInq };
    inq.field = e.value;
    inq.inqType = '';
    dispatch(InquiryActions.validate({ ...valid, field: true }));
    setFieldValue(e);
    setValueType(null);
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleNameChange = (e) => {
    const inq = { ...currentEditInq };
    inq.content = e.target.value;
    dispatch(InquiryActions.validate({ ...valid, content: inq.content }));
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleAnswerTypeChange = (e) => {
    const inq = { ...currentEditInq };
    inq.ansType = e.value;
    if (e.value !== metadata.ans_type.choice) {
      inq.answerObj = [];
    }
    dispatch(InquiryActions.validate({ ...valid, ansType: true }));
    setValueAnsType(optionsAnsType.filter((ansType) => ansType.value === e.value));
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };
  const inq = (inq) => {
    return {
      content: inq.content,
      field: inq.field,
      inqType: inq.inqType,
      ansType: inq.ansType,
      receiver: inq.receiver,
      state: ['ANS_DRF'].includes(inq.state) ? 'INQ_SENT' : inq.state
    };
  };

  const handleReceiverChange = (e) => {
    const optionsOfQuestion = { ...currentEditInq };
    optionsOfQuestion.receiver = [];
    dispatch(InquiryActions.validate({ ...valid, receiver: true }));
    optionsOfQuestion.receiver.push(e.target.value);
    dispatch(InquiryActions.setEditInq(optionsOfQuestion));
  };

  const checkDuplicateInq = () => {
    const listInqOfField = [...inquiries.filter(inq => inq.field === currentEditInq.field)];
    if (currentEditInq.id) {
      listInqOfField.splice(listInqOfField.findIndex(inq => inq.id === currentEditInq.id), 1);
    }
    if (listInqOfField.length) {
      const checkDuplicate = Boolean(listInqOfField.filter(inq => (inq.inqType === currentEditInq.inqType && inq.receiver[0] === currentEditInq.receiver[0])).length);
      if (checkDuplicate) {
        dispatch(FormActions.openConfirmPopup({
          openConfirmPopup: true,
          confirmPopupMsg: 'The inquiry already existed!',
          confirmPopupType: 'warningInq'
        })
        );
        return true;
      }
    }
    return false
  }

  const onSave = async () => {
    let check = true;
    const ansTypeChoice = metadata.ans_type['choice'];
    let validate = {};
    if (
      !currentEditInq.inqType ||
      !currentEditInq.field ||
      !currentEditInq.receiver.length ||
      !currentEditInq.ansType.length ||
      !currentEditInq.content ||
      ansTypeChoice === currentEditInq.ansType
    ) {
      validate = {
        ...valid,
        field: Boolean(currentEditInq.field),
        inqType: Boolean(currentEditInq.inqType),
        receiver: Boolean(currentEditInq.receiver.length),
        ansType: Boolean(currentEditInq.ansType.length),
        content: Boolean(currentEditInq.content)
      };
      if (ansTypeChoice === currentEditInq.ansType) {
        // check empty a field
        if (currentEditInq.answerObj.length > 0) {
          const checkOptionEmpty = currentEditInq.answerObj.filter((item) => !item.content);
          if (checkOptionEmpty.length > 0) {
            validate = { ...validate, answerContent: false };
          } else {
            validate = { ...validate, answerContent: true };
          }
          const dupArray = currentEditInq.answerObj.map((ans) => ans.content);
          if (toFindDuplicates(dupArray).length) {
            dispatch(
              AppActions.showMessage({
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
    if (ansTypeChoice !== currentEditInq.ansType) {
      dispatch(
        InquiryActions.validate({
          field: Boolean(currentEditInq.field),
          inqType: Boolean(currentEditInq.inqType),
          receiver: Boolean(currentEditInq.receiver.length),
          ansType: Boolean(currentEditInq.ansType.length),
          content: Boolean(currentEditInq.content),
          answerContent: true
        })
      );
    }
    if (!check) {
      return;
    }
    let error = false;

    const inquiry = inquiries.find((q) => q.id === currentEditInq.id);
    if (inquiry) {
      if (checkDuplicateInq()) return;
      if (ansTypeChoice === currentEditInq.ansType) {
        if (currentEditInq.answerObj.length === 1) {
          dispatch(
            AppActions.showMessage({ message: 'Please add more options!', variant: 'error' })
          );
          return;
          // break;
        }
        // check empty a field
        if (inquiry.answerObj.length > 0) {
          const checkOptionEmpty = inquiry.answerObj.filter((item) => !item.content);
          if (checkOptionEmpty.length > 0) {
            dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
            error = true;
            // break;
          }
        } else {
          dispatch(AppActions.showMessage({ message: 'Options not empty!', variant: 'error' }));
          error = true;
          // break;
        }
      }
      if (ansTypeChoice === inquiry.ansType && inquiry.answerObj.length) {
        const dupArray = inquiry.answerObj.map((ans) => ans.content);
        if (toFindDuplicates(dupArray).length) {
          dispatch(
            AppActions.showMessage({
              message: 'Options value must not be duplicated',
              variant: 'error'
            })
          );
          return;
        }
      }
      const ansCreate = currentEditInq.answerObj.filter(
        ({ id: id1 }) => !inquiry.answerObj.some(({ id: id2 }) => id2 === id1)
      );
      const ansDelete = inquiry.answerObj.filter(
        ({ id: id1 }) => !currentEditInq.answerObj.some(({ id: id2 }) => id2 === id1)
      );
      const ansUpdate = currentEditInq.answerObj.filter(({ id: id1, content: c1 }) =>
        inquiry.answerObj.some(({ id: id2, content: c2 }) => id2 === id1 && c1 !== c2)
      );
      const ansCreated = currentEditInq.answerObj.filter(ans => ans.id);
      const mediaCreate = currentEditInq.mediaFile.filter(
        ({ id: id1 }) => !inquiry.mediaFile.some(({ id: id2 }) => id2 === id1)
      );
      const mediaDelete = inquiry.mediaFile.filter(
        ({ id: id1 }) => !currentEditInq.mediaFile.some(({ id: id2 }) => id2 === id1)
      );

      for (const f in mediaCreate) {
        const form_data = mediaCreate[f].data;
        const res = await uploadFile(form_data);
        mediaCreate[f].id = res.response[0].id;
      }
      if (
        JSON.stringify(inq(currentEditInq)) !== JSON.stringify(inq(inquiry)) ||
        JSON.stringify(currentEditInq.answerObj) !== JSON.stringify(inquiry.answerObj) ||
        mediaCreate.length ||
        mediaDelete.length
      ) {
        await updateInquiry(inquiry.id, {
          inq: inq(currentEditInq),
          ans: { ansDelete, ansCreate, ansUpdate, ansCreated },
          files: { mediaCreate, mediaDelete }
        });
        const editedIndex = inquiries.findIndex(inq => inq.id === inquiry.id);
        inquiries[editedIndex] = currentEditInq;
        dispatch(InquiryActions.setInquiries(inquiries));

        dispatch(
          AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
        );

        // TODO
        dispatch(InquiryActions.saveInquiry());
        dispatch(InquiryActions.setEditInq());
        dispatch(FormActions.toggleReloadInq());
      }
    } else {
      // Create INQUIRY
      if (checkDuplicateInq()) return;
      if (ansTypeChoice === currentEditInq.ansType) {
        if (currentEditInq.answerObj.length === 1) {
          dispatch(
            AppActions.showMessage({ message: 'Please add more options!', variant: 'error' })
          );
          return;
        }
      }
      const uploads = [];
      if (currentEditInq.mediaFile.length) {
        currentEditInq.mediaFile.forEach((file) => {
          const formData = new FormData();
          formData.append('files', file.fileUpload);
          uploads.push(formData);
        });
      }
      const question = [{ ...currentEditInq }];
      const inqContentTrim = question.map((op) => {
        let contentTrim = { ...op, content: op.content.trim() };
        const ansTypeChoice = metadata.ans_type['choice'];
        if (ansTypeChoice === op.ansType) {
          op.answerObj.forEach((ans) => {
            ans.content = ans.content.trim();
          });
        }
        return contentTrim;
      });
      axios
        .all(uploads.map((endpoint) => uploadFile(endpoint)))
        .then((media) => {
          let mediaList = [];
          media.forEach((file) => {
            const mediaFileList = file.response.map((item) => item);
            mediaList = [...mediaList, ...mediaFileList];
          });
          saveInquiry({ question: inqContentTrim, media: mediaList, blId: myBL.id })
            .then(() => {
              dispatch(
                AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
              );
              dispatch(InquiryActions.saveInquiry());
              dispatch(FormActions.toggleReloadInq());
              dispatch(InquiryActions.setOpenedInqForm(false));
            })
            .catch((error) =>
              dispatch(AppActions.showMessage({ message: error, variant: 'error' }))
            );
        })
        .catch((error) => console.log(error));
    }
    dispatch(InquiryActions.setEditInq());
  };

  return (
    <>
      <div className="flex justify-between" style={{ padding: '0.5rem', marginRight: '-15px' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
          {currentEditInq.field
            ? getLabelById(metadata['field_options'], currentEditInq.field)
            : 'New Inquiry'}
        </div>

        <FormControl
          className={classes.checkedIcon}>
          <RadioGroup
            aria-label="receiver"
            name="receiver"
            value={currentEditInq.receiver[0]}
            onChange={(e) => handleReceiverChange(e)}>
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

          <AttachFile />
        </FormControl>
      </div>
      {currentEditInq && (
        <div className={classes.form}>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <FormControl error={!valid.field}>
                <FuseChipSelect
                  customStyle={styles(fullscreen ? 320 : 295)}
                  value={fieldValue}
                  isDisabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                  onChange={handleFieldChange}
                  placeholder="Select Field Type"
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  options={fieldType}
                  errorStyle={valid.field}
                />
                <div style={{ height: '20px' }}>
                  {!valid.field && (
                    <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                  )}
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl error={!valid.inqType}>
                <FuseChipSelect
                  value={valueType}
                  customStyle={styles(fullscreen ? 330 : 295)}
                  isDisabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                  onChange={handleTypeChange}
                  placeholder="Type of Inquiry"
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  options={inqTypeOption}
                  errorStyle={valid.inqType}
                />
                <div style={{ height: '20px' }}>
                  {!valid.inqType && (
                    <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                  )}
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl error={!valid.ansType}>
                <FuseChipSelect
                  value={valueAnsType}
                  customStyle={styles(fullscreen ? 330 : 295)}
                  isDisabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                  onChange={handleAnswerTypeChange}
                  placeholder="Type of Question"
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  options={optionsAnsType}
                  errorStyle={valid.ansType}
                />
                <div style={{ height: '15px' }}>
                  {!valid.ansType && (
                    <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                  )}
                </div>
              </FormControl>
            </Grid>
          </Grid>
          <div className="mt-32 mx-8">
            <TextField
              value={currentEditInq.content.replace('{{INQ_TYPE}}', '')}
              multiline
              error={!valid.content}
              helperText={!valid.content ? 'This is required!' : ''}
              onFocus={(e) => e.target.select()}
              onChange={handleNameChange}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>
          {currentEditInq.ansType === metadata.ans_type.choice && (
            <div className="mt-16">
              <ChoiceAnswerEditor />
            </div>
          )}
          {currentEditInq.ansType === metadata.ans_type.paragraph && (
            <div className="mt-40">
              <ParagraphAnswerEditor />
            </div>
          )}
          {currentEditInq.ansType === metadata.ans_type.attachment && (
            <AttachmentAnswer
              style={{ marginTop: '1rem' }}
              isPermissionAttach={allowCreateAttachmentAnswer}
            />
          )}
          <Divider className="mt-12" />
          <>
            {currentEditInq.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
            {currentEditInq.mediaFile?.length > 0 &&
              currentEditInq.mediaFile?.map((file, mediaIndex) => (
                <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                  {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                    <ImageAttach file={file} field={currentEditInq.field} />
                  ) : (
                    <FileAttach file={file} field={currentEditInq.field} />
                  )}
                </div>
              ))}
          </>
          <>{user.role !== 'Admin' &&
            <>
              {currentEditInq.mediaFilesAnswer?.length > 0 && <h3>Attachment Answer:</h3>}
              {currentEditInq.mediaFilesAnswer?.map((file, mediaIndex) => (
                <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                  {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                    <ImageAttach
                      file={file}
                      field={currentEditInq.field}
                      style={{ margin: '2.5rem' }}
                      isAnswer={true}
                    />
                  ) : (
                    <FileAttach file={file} field={currentEditInq.field} isAnswer={true} />
                  )}
                </div>
              ))}
            </>
          }
          </>
          <div className="flex">
            <div className="flex">
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSave()}
                classes={{ root: classes.button }}>
                Save
              </Button>
              <Button
                variant="contained"
                classes={{ root: clsx(classes.button, 'reply') }}
                color="primary"
                onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiryEditor;
