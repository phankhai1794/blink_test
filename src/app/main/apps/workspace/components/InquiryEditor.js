import { FuseChipSelect } from '@fuse';
import React, { useEffect, useRef, useState, useContext } from 'react';
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
import { updateInquiry, saveInquiry, getUpdatedAtAnswer } from 'app/services/inquiryService';
import * as AppActions from 'app/store/actions';
import clsx from 'clsx';
import axios from 'axios';
import { validateTextInput } from 'app/services/myBLService';
import { SocketContext } from 'app/AppContext';

import * as Actions from '../store/actions';
import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';
import { MSG_INQUIRY_CONTENT } from '../store/reducers/inquiry';

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
    }
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
  const { onCancel, setSave } = props;
  const scrollTopPopup = useRef(null);
  const socket = useContext(SocketContext);
  const [metadata, valid, inquiries, currentEditInq, myBL, listMinimize] = useSelector(
    ({ workspace }) => [
      workspace.inquiryReducer.metadata,
      workspace.inquiryReducer.validation,
      workspace.inquiryReducer.inquiries,
      workspace.inquiryReducer.currentEditInq,
      workspace.inquiryReducer.myBL,
      workspace.inquiryReducer.listMinimize
    ]
  );
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
  const fieldType = metadata.field_options.filter(field => field.display);
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
  const [nameType, setNameType] = useState(valueType?.label);
  const [fieldEdited, setFieldEdited] = useState();
  const [nameTypeEdited, setNameTypeEdited] = useState();
  const [contentEdited, setContentEdited] = useState(valueType?.label);
  const [isDisabled, setDisabled] = useState(false);
  const [prevField, setPrevField] = useState('');
  const styles = (width) => {
    return {
      control: {
        width: `${width}px`,
        borderRadius: 11
      }
    };
  };

  useEffect(() => {
    setPrevField(currentEditInq.field);
  }, []);

  useEffect(() => {
    if (fieldValue) {
      const filter = metadata.inq_type_options
        .filter((data) => data.field?.includes(fieldValue.value))
        .sort((a, b) => a.label.localeCompare(b.label));
      setInqTypeOption(filter);
    }
    if (scrollTopPopup.current) {
      scrollTopPopup.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fieldValue]);

  const handleTypeChange = (e) => {
    const inq = { ...currentEditInq };
    inq.inqType = e.value;
    if (e.__isNew__) inq.isNew = e.__isNew__;
    dispatch(InquiryActions.validate({ ...valid, inqType: true }));
    if (inq.field === fieldEdited && inq.inqType === nameTypeEdited) {
      inq.content = contentEdited;
    } else {
      inq.content =
        MSG_INQUIRY_CONTENT.replace(
          '{{INQ_TYPE}}',
          e.label
        );
    }
    setValueType(e);
    setNameType(e.label);
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleFieldChange = (e) => {
    const inq = { ...currentEditInq };
    inq.field = e.value;
    inq.inqType = '';

    if (inq.field === fieldEdited && inq.inqType === nameTypeEdited) {
      inq.content = contentEdited;
    } else {
      inq.content =
        MSG_INQUIRY_CONTENT.replace(
          '{{INQ_TYPE}}',
          ''
        );
    }
    dispatch(InquiryActions.validate({ ...valid, field: true }));
    setFieldValue(e);
    setValueType(null);
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleNameChange = (e) => {
    const inq = { ...currentEditInq };

    inq.content = e.target.value;
    setFieldEdited(inq.field);
    setNameTypeEdited(inq.inqType);
    setContentEdited(inq.content);

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
    const listInqOfField = [...inquiries.filter((inq) => inq.field === currentEditInq.field)];
    if (currentEditInq.id) {
      listInqOfField.splice(
        listInqOfField.findIndex((inq) => inq.id === currentEditInq.id),
        1
      );
    }
    if (listInqOfField.length) {
      const checkDuplicate = Boolean(
        listInqOfField.filter(
          (inq) =>
            inq.inqType === currentEditInq.inqType && inq.receiver[0] === currentEditInq.receiver[0]
        ).length
      );
      if (checkDuplicate) {
        dispatch(
          FormActions.openConfirmPopup({
            openConfirmPopup: true,
            confirmPopupMsg: 'The inquiry already existed!',
            confirmPopupType: 'warningInq'
          })
        );
        return true;
      }
    }
    return false;
  };

  const onSave = async () => {
    setDisabled(true);
    const inquiriesOp = [...inquiries];
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
          const dupArray = currentEditInq.answerObj.map((ans) => ans.content.trim());
          if (toFindDuplicates(dupArray).length) {
            dispatch(
              AppActions.showMessage({
                message: 'Options value must not be duplicated',
                variant: 'error'
              })
            );
            setDisabled(false);
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
      setDisabled(false);
      return;
    }
    let error = false;

    let inquiry = inquiriesOp.find((q) => q.id === currentEditInq.id);
    if (inquiry) {
      if (checkDuplicateInq()) {
        setDisabled(false);
        return;
      }
      if (ansTypeChoice === currentEditInq.ansType) {
        if (currentEditInq.answerObj.length === 1) {
          dispatch(
            AppActions.showMessage({ message: 'Please add more options!', variant: 'error' })
          );
          setDisabled(false);
          return;
        }
        // check empty a field
        if (inquiry.answerObj.length > 0) {
          const checkOptionEmpty = inquiry.answerObj.filter((item) => !item.content);
          if (checkOptionEmpty.length > 0) {
            dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
            setDisabled(false);
            error = true;
            // break;
          }
        } else {
          dispatch(AppActions.showMessage({ message: 'Options not empty!', variant: 'error' }));
          setDisabled(false);
          error = true;
          // break;
        }
      }
      const ansCreate = currentEditInq.answerObj.filter(
        ({ id: id1 }) => !inquiry.answerObj.some(({ id: id2 }) => id2 === id1)
      );

      const ansDelete = inquiry.answerObj.filter(
        ({ id: id1 }) => !currentEditInq.answerObj.some(({ id: id2 }) => id2 === id1)
      );
      //
      const ansUpdate = currentEditInq.answerObj.filter(({ id: id1, content: c1 }) =>
        inquiry.answerObj.some(({ id: id2, content: c2 }) => id2 === id1 && c1 !== c2)
      );
      const ansCreated = currentEditInq.answerObj.filter((ans) => ans.id);
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
        const update = await updateInquiry(inquiry.id, {
          inq: inq(currentEditInq),
          ans: { ansDelete, ansCreate, ansUpdate, ansCreated },
          files: { mediaCreate, mediaDelete }
        });
        const editedIndex = inquiriesOp.findIndex((inq) => inq.id === inquiry.id);
        inquiriesOp[editedIndex] = currentEditInq;
        if (update.data.length && editedIndex !== -1) {
          inquiriesOp[editedIndex].answerObj = [
            ...currentEditInq.answerObj,
            ...update.data
          ].filter((inq) => inq.id);
        }
        if (prevField !== currentEditInq.field) {
          const hasInq = inquiriesOp.filter((inq) => inq.field === prevField);
          if (!hasInq.length) {
            dispatch(InquiryActions.setOneInq({}));
            dispatch(FormActions.toggleCreateInquiry(false));
          }
        }
        //
        const dataDate = await getUpdatedAtAnswer(inquiry.id);
        inquiriesOp[editedIndex].createdAt = dataDate.data;
        inquiriesOp[editedIndex].showIconAttachAnswerFile = false;
        dispatch(InquiryActions.setEditInq());
        dispatch(InquiryActions.setInquiries(inquiriesOp));

        dispatch(AppActions.isSyncingInquiry(true));
        socket.emit('sync/update_inquiry', inquiriesOp);

        props.getUpdatedAt();
        setDisabled(false);
        // setSave();
        dispatch(
          AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
        );
      } else {
        dispatch(InquiryActions.setEditInq());
      }
    } else {
      // Create INQUIRY
      if (checkDuplicateInq()) {
        setDisabled(false);
        return;
      }
      if (ansTypeChoice === currentEditInq.ansType) {
        if (currentEditInq.answerObj.length === 1) {
          dispatch(
            AppActions.showMessage({ message: 'Please add more options!', variant: 'error' })
          );
          setDisabled(false);
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
            .then((res) => {
              const mediaFile = [];
              mediaList.forEach(({ id, name, ext }) => mediaFile.push({ id, name, ext }));
              const inqResponse = res.inqResponse || {};
              inqResponse.creator = {
                userName: user.displayName || '',
                avatar: user.photoURL || ''
              };
              inqResponse.mediaFile = mediaFile;
              const optionsMinimize = [...listMinimize];
              const optionsInquires = [...inquiries];
              optionsInquires.push(inqResponse);
              optionsMinimize.push(inqResponse);
              if (optionsInquires.length === 1) {
                dispatch(Actions.updateOpusStatus(myBL.bkgNo, "DC", "")) // Draft of Inquiry Created (DC)
              }

              dispatch(
                AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
              );
              dispatch(InquiryActions.saveInquiry());
              dispatch(InquiryActions.setField(inqContentTrim[0].field));
              dispatch(InquiryActions.setOpenedInqForm(false));
              dispatch(InquiryActions.setEditInq());
              dispatch(InquiryActions.setInquiries(optionsInquires));
              dispatch(InquiryActions.setListMinimize(optionsMinimize));
              setDisabled(false);

              dispatch(AppActions.isSyncingInquiry(true));
              socket.emit('sync/create_inquiry', optionsInquires);
            })
            .catch((error) =>
              dispatch(AppActions.showMessage({ message: error, variant: 'error' }))
            );
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <div className="flex justify-between" style={{ padding: '0.5rem', marginRight: '-15px' }}>
        <div ref={scrollTopPopup} style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
          {currentEditInq.field
            ? getLabelById(metadata['field_options'], currentEditInq.field)
            : 'New Inquiry'}
        </div>

        <FormControl className={classes.checkedIcon}>
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
                  placeholder="BL Data Field"
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
                  placeholder="Type of Question"
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
                  placeholder="Type of Answer"
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
          <div style={{ width: '80%' }}>
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
          </div>
          <>
            {user.role !== 'Admin' && (
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
            )}
          </>
          <div className="flex">
            <div className="flex">
              <Button
                variant="contained"
                color="primary"
                disabled={isDisabled}
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
