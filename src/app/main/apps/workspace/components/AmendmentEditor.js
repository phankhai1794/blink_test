import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { Button, Typography, FormHelperText, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from 'app/services/fileService';
import { saveEditedField } from 'app/services/draftblService';
import { validateBLType, compareObject, parseNumberValue, formatDate, isDateField, isSameDate, generateFileNameTimeFormat, validateGroupOneTextBox } from '@shared';
import { NO_CONTENT_AMENDMENT, CONTAINER_DETAIL, CONTAINER_LIST, CONTAINER_MANIFEST, SHIPPER, CONSIGNEE, NOTIFY, CONTAINER_NUMBER, BL_TYPE, DATED, DATE_CARGO, DATE_LADEN, DESCRIPTION_OF_GOODS1, DESCRIPTION_OF_GOODS2, DESCRIPTION_OF_GOODS, EXPORT_REF, } from '@shared/keyword';
import { handleError } from '@shared/handleError';
import { FuseChipSelect } from '@fuse';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';
import { validateTextInput } from 'app/services/myBLService';
import { useDropzone } from 'react-dropzone';
import { SocketContext } from 'app/AppContext';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';
import * as AppAction from "../../../../store/actions";
import DateTimePickers from '../shared-components/DateTimePickers';

import UserInfo from './UserInfo';
import FileAttach from './FileAttach';
import AttachFileAmendment from './AttachFileAmendment';
import ContainerDetailForm from './ContainerDetailForm';

const colorInq = '#DC2626';
const white = '#FFFFFF';
const pink = '#BD0F72';
const greyText = '#999999';

const useStyles = makeStyles((theme) => ({
  btn: {
    width: 120,
    height: 40,
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    margin: theme.spacing(1),
    marginLeft: 0
  },
  btnCancel: {
    color: greyText,
    background: white,
    border: `1px solid ${greyText}`
  },
  inqTitle: {
    fontFamily: 'Montserrat',
    color: '#BD0F72',
    fontSize: 22,
    fontWeight: 600,
    wordBreak: 'break-word'
  },
  inputText: {
    fontFamily: 'Montserrat',
    width: '100%',
    paddingTop: 10,
    marginTop: 10,
    minHeight: 50,
    resize: 'none',
    '& .MuiOutlinedInput-multiline': {
      padding: '10.5px'
    },
    '& fieldset': {
      borderWidth: '0.5px',
      borderRadius: '8px',
      border: '1px solid red'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '1px',
      borderColor: '#BAC3CB'
    },
    '& .MuiInputBase-inputMultiline': {
      resize: 'vertical',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      fontWeight: 500,
      color: '#999999',
      fontSize: '15px',
    }
  },
  placeholder: {
    '&::placeholder': {
      textTransform: 'none',
    },
  },
  attachmentFiles: {
    marginTop: 10,
  }
}));

const Amendment = ({ question, inquiriesLength, getUpdatedAt, setDefaultAction }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const user = useSelector(({ user }) => user);
  const [metadata, content, myBL, inquiries, enableSubmit] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.content,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.enableSubmit,
  ]);
  const [filepaste, setFilepaste] = useState('');
  const [dropfiles, setDropfiles] = useState([]);
  const currentField = useSelector(({ draftBL }) => draftBL.currentField);
  const currentAmendField = useSelector(({ draftBL }) => draftBL.currentAmendField);
  const filterInqDrf = inquiries.filter(inq => inq.process === 'draft').map(val => val.field);
  const openAmendmentList = useSelector(({ workspace }) => workspace.formReducer.openAmendmentList);
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);

  const [attachments, setAttachments] = useState(question?.content?.mediaFile || []);
  const [fieldValue, setFieldValue] = useState("");
  const [fieldValueSelect, setFieldValueSelect] = useState();
  const [fieldValueSeparate, setFieldValueSeparate] = useState({ name: '', address: '' });
  const fieldType = metadata.field_options.filter(filDrf => filDrf.display && !filterInqDrf.includes(filDrf.value));
  const [isSeparate, setIsSeparate] = useState([SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(currentField));
  const [disableSave, setDisableSave] = useState(false);
  const [isChange, setChange] = useState(false);
  const [isDateTime, setIsDateTime] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  const syncData = (data, syncOptSite = false) => {
    socket.emit("sync_data", { data, syncOptSite });
  };

  const getAttachment = (value) => setAttachments([...attachments, ...value]);

  const removeAttachment = (index) => {
    const optionsAttachmentList = [...attachments];
    optionsAttachmentList.splice(index, 1);
    setAttachments(optionsAttachmentList)
  }

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const handleChange = (e, isDate = false) => {
    dispatch(FormActions.setDirtyReload({ createAme: true }));
    if (isDate) {
      if (!isNaN(e?.getTime())) {
        setFieldValue(e.toISOString());
        setIsValidDate(false);
      } else {
        setFieldValue(e);
        setIsValidDate(true);
      }
    } else {
      setFieldValue(e.target.value);
    }
    setChange(true);
  }

  const inputTextSeparate = (e, type) => {
    dispatch(FormActions.setDirtyReload({ createAme: true }));
    setFieldValueSeparate(Object.assign({}, fieldValueSeparate, { [type]: e.target.value }));
    setChange(true);
  };

  // const handleValidateInput = async (confirm = null) => {
  //   setDisableSave(true);
  //   let textInput = fieldValue || '';
  //   const { isWarning, prohibitedInfo } = await validateTextInput({ textInput, dest: myBL.bkgNo }).catch(err => handleError(dispatch, err));
  //   if (isWarning) {
  //     dispatch(FormActions.validateInput({ isValid: false, prohibitedInfo, handleConfirm: confirm }));
  //   } else {
  //     confirm && confirm();
  //   }
  // }

  const validationCDCM = (contsNo) => {
    const warningLeast1CM = [];
    const warningCmsNotInCD = [];
    // Validation container number must include at least one C/M.
    if (fieldValueSelect.keyword === CONTAINER_DETAIL) {
      let cmOfCdContainerNo = [...new Set((content[getField(CONTAINER_MANIFEST)] || []))].map(cm => cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
      contsNo.forEach((containerNo, index) => {
        if (cmOfCdContainerNo.length && !cmOfCdContainerNo.includes(containerNo)) {
          warningLeast1CM.push({ containerNo, row: index + 1 });
        }
      })
    } else if (fieldValueSelect.keyword === CONTAINER_MANIFEST) {
      // Validation The C/M below does not match any container numbers that already exist in C/D
      let cdOfCmContainerNo = [...new Set((content[getField(CONTAINER_DETAIL)] || []))].map(cm => cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
      contsNo.forEach((containerNo, index) => {
        if (cdOfCmContainerNo.length && !cdOfCmContainerNo.includes(containerNo)) {
          warningCmsNotInCD.push({ containerNo, row: index + 1 });
        }
      });
    }
    if (warningLeast1CM.length) {
      dispatch(AppAction.showMessage({ message: 'A container number must include at least one C/M. Please check again the container numbers below', variant: 'warning' }));
    }
    if (warningCmsNotInCD.length) {
      dispatch(AppAction.showMessage({ message: `Container Manifest doesn't match with Container Details`, variant: 'warning' }));
    }
  }

  const conditionAutoUpdateCDCM = (fieldIdCheck) => {
    const optionsInquires = [...inquiries];
    const isSent = [...optionsInquires].find(inq => inq.process === 'draft' && inq.field === fieldIdCheck && (['AME_SENT', 'RESOLVED', 'UPLOADED'].includes(inq.state) || (inq.state === 'REP_SENT' && inq.creator?.accountRole === 'Guest')));
    return !isSent || ![...optionsInquires].find(inq => inq.process === 'draft' && inq.field === fieldIdCheck);
  }

  const handleSave = () => {
    setDefaultAction({val: {}, action: false})
    setDisableSave(true);
    dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    fieldValueSeparate.name = fieldValueSeparate.name.toUpperCase().trim();
    fieldValueSeparate.address = fieldValueSeparate.address.toUpperCase().trim();
    if (fieldValueSeparate.name === '' && fieldValueSeparate.address === '') {
      fieldValueSeparate.name = NO_CONTENT_AMENDMENT;
      fieldValueSeparate.address = '';
    }

    let contentField = isSeparate ? JSON.stringify(fieldValueSeparate) : typeof fieldValue === 'string' ? fieldValue.toUpperCase().trim() : fieldValue;
    if (!isSeparate && (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === ''))) contentField = NO_CONTENT_AMENDMENT;

    const uploads = [];
    const fieldReq = fieldValueSelect?.value;
    const optionsInquires = [...inquiries];
    const optionsMinimize = [...listMinimize];
    if (attachments.length) {
      attachments.forEach((file) => {
        if (!file.id) {
          const formData = new FormData();
          formData.append('files', file.data);
          formData.append('bkgNo', myBL.bkgNo);
          uploads.push(formData);
        }
      });
    }
    if (openAmendmentList && !fieldReq) {
      setDisableSave(false);
      return;
    }
    if (isDateTime && contentField) {
      contentField = new Date(contentField).toISOString();
    }
    axios
      .all(uploads.map((endpoint) => uploadFile(endpoint)))
      .then((files) => {
        const mediaList = attachments.filter((file) => file.id);
        files.forEach((file) => {
          const mediaFileList = file.response.map((item) => { return { id: item.id, ext: item.ext, name: item.name } });
          mediaList.push(mediaFileList[0]);
        });

        saveEditedField({ field: fieldReq, content: { content: contentField, mediaFile: mediaList }, mybl: myBL.id, action: 'reply' })
          .then((res) => {
            // Auto Update CD/CM
            if ([CONTAINER_DETAIL, CONTAINER_MANIFEST].includes(fieldValueSelect.keyword)) {
              // CASE 1-1 CD CM
              if (contentField.length === 1 && content[fieldValueSelect.keyword === CONTAINER_DETAIL ? containerCheck[1] : containerCheck[0]].length === 1) {
                if (fieldValueSelect.keyword === CONTAINER_DETAIL) {
                  // check is amendment cm sent ?
                  if (conditionAutoUpdateCDCM(containerCheck[1])) {
                    let cm = content[containerCheck[1]]
                    if (cm) {
                      cm[0][getType(CONTAINER_NUMBER)] = contentField[0][getType(CONTAINER_NUMBER)];
                      CONTAINER_LIST.cdNumber.map((key, index) => {
                        cm[0][getType(CONTAINER_LIST.cmNumber[index])] = contentField[0][getType(key)];
                      });
                      CONTAINER_LIST.cdUnit.map((key, index) => {
                        cm[0][getType(CONTAINER_LIST.cmUnit[index])] = contentField[0][getType(key)];
                      });
                      content[containerCheck[1]] = cm;
                      saveEditedField({ field: containerCheck[1], content: { content: cm, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'createAmendment' });
                    }
                  }
                }
                else if (fieldValueSelect.keyword === CONTAINER_MANIFEST) {
                  if (conditionAutoUpdateCDCM(containerCheck[0])) {
                    let cd = content[containerCheck[0]]
                    if (cd) {
                      cd[0][getType(CONTAINER_NUMBER)] = contentField[0][getType(CONTAINER_NUMBER)];
                      CONTAINER_LIST.cmNumber.map((key, index) => {
                        cd[0][getType(CONTAINER_LIST.cdNumber[index])] = contentField[0][getType(key)];
                      });
                      CONTAINER_LIST.cmUnit.map((key, index) => {
                        cd[0][getType(CONTAINER_LIST.cdUnit[index])] = contentField[0][getType(key)];
                      });
                      content[containerCheck[0]] = cd;

                      saveEditedField({ field: containerCheck[0], content: { content: cd, mediaFile: [] }, mybl: myBL.id, autoUpdate: true, action: 'createAmendment' });
                    }
                  }
                }
              }
              // MULTIPLE CASE CD CM
              else {
                let contsNoChange = {};
                const contsNo = [];
                const orgContentField = content[getField(fieldValueSelect.keyword)];
                contentField.forEach((obj, index) => {
                  const containerNo = orgContentField[index][getType(CONTAINER_NUMBER)];
                  const getTypeName = Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === getType(CONTAINER_NUMBER));
                  if (getTypeName === CONTAINER_NUMBER && containerNo !== obj[getType(CONTAINER_NUMBER)]) {
                    contsNoChange[containerNo] = obj[getType(CONTAINER_NUMBER)];
                    contsNo.push(obj?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
                  }
                })

                const fieldCdCM = fieldValueSelect.keyword === CONTAINER_DETAIL ? containerCheck[1] : containerCheck[0];
                if (conditionAutoUpdateCDCM(fieldCdCM)) {
                  const fieldAutoUpdate = [...content[fieldCdCM]];
                  if (fieldAutoUpdate) {
                    if (fieldValueSelect.keyword === CONTAINER_DETAIL) {
                      if (fieldAutoUpdate.length) {
                        fieldAutoUpdate.map((item) => {
                          if (item[getType(CONTAINER_NUMBER)] in contsNoChange) {
                            item[getType(CONTAINER_NUMBER)] = contsNoChange[item[getType(CONTAINER_NUMBER)]];
                          }
                        })
                      }
                      content[fieldCdCM] = fieldAutoUpdate;
                      contentField.forEach((cd) => {
                        let cmOfCd = [...new Set((fieldAutoUpdate || []).filter(cm =>
                            cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
                        ))]
                        if (cmOfCd.length === 1) {
                          CONTAINER_LIST.cdNumber.map((key, index) => {
                            cmOfCd[0][getType(CONTAINER_LIST.cmNumber[index])] = cd[getType(key)];
                          });
                          CONTAINER_LIST.cdUnit.map((key, index) => {
                            cmOfCd[0][getType(CONTAINER_LIST.cmUnit[index])] = cd[getType(key)];
                          });
                        }
                      })
                    }
                    if (fieldValueSelect.keyword === CONTAINER_MANIFEST) {
                      fieldAutoUpdate.forEach((cd) => {
                        let cmOfCd = [...new Set((contentField || []).filter(cm =>
                            cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
                        ))]
                        if (cmOfCd.length > 0) {
                          CONTAINER_LIST.cmNumber.map((key, index) => {
                            let total = 0;
                            cmOfCd.map((cm) => {
                              total += parseNumberValue(cm[getType(key)]);
                            });
                            cd[getType(CONTAINER_LIST.cdNumber[index])] = parseFloat(total.toFixed(3));
                          });
                          CONTAINER_LIST.cmUnit.map((key, index) => {
                            cmOfCd.map((cm) => {
                              cd[getType(CONTAINER_LIST.cdUnit[index])] = cm[getType(key)];
                            })
                          })
                        }
                      })
                    }
                    saveEditedField({
                      field: fieldCdCM,
                      content: {content: fieldAutoUpdate, mediaFile: []},
                      mybl: myBL.id,
                      autoUpdate: true,
                      action: 'editAmendment'
                    });
                  }
                }
                validationCDCM(contsNo);
              }
            }

            dispatch(DraftBLActions.setCurrentField());
            const response = { ...res?.newAmendment, showIconEditInq: true };
            optionsInquires.push(response);
            const idMinimize = optionsMinimize.map(op => op.id);
            if (!idMinimize.includes(response.id)) {
              optionsMinimize.push(response);
              dispatch(InquiryActions.setListMinimize(optionsMinimize));
            }

            let newContent = { ...content, [fieldReq]: contentField };
            dispatch(InquiryActions.setContent(newContent));
            dispatch(InquiryActions.setInquiries(optionsInquires));
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            getUpdatedAt();
            setDisableSave(false);
            dispatch(FormActions.toggleCreateAmendment(false));
            dispatch(FormActions.toggleAmendmentsList(true));
            dispatch(InquiryActions.addAmendment());
            dispatch(InquiryActions.setOneInq({}));
            dispatch(FormActions.setDirtyReload({ createAme: false }));

            // sync create amendment
            syncData({ inquiries: optionsInquires, listMinimize: optionsMinimize, content: newContent });
          }).catch((err) => handleError(dispatch, err));
      })
      .catch((err) => handleError(dispatch, err))
  }

  const handleCancel = () => {
    dispatch(InquiryActions.addAmendment());
    dispatch(FormActions.toggleCreateAmendment(false));
  }

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];


  const renderDoGLine1Line2 = () => {
    const descriptionOfGoods1 = metadata.field[DESCRIPTION_OF_GOODS1];
    const descriptionOfGoods2 = metadata.field[DESCRIPTION_OF_GOODS2];
    const contentDoG1 = content[descriptionOfGoods1] || '';
    const contentDoG2 = content[descriptionOfGoods2] || '';
    return(
      <>
        {[contentDoG1, contentDoG2].map((item, index) => 
          item && <TextField
            keu={index}
            className={classes.inputText}
            value={item}
            inputProps={{ style: { textTransform: 'uppercase', padding: '10px' } }}
            variant='outlined'
            disabled
          />
        )}
      </>
    )
  }

  // Separate Shipper/Consignee/Notify 
  const renderSeparateField = (field) => {
    if (isSeparate) {
      const LABEL_TYPE = ['name', 'address']
      const labelName = Object.assign({}, ...[SHIPPER, CONSIGNEE, NOTIFY].map(key => ({ [metadata.field?.[key]]: key })))[fieldValueSelect ? fieldValueSelect.value : field];
      return LABEL_TYPE.map((type, index) =>
        <div key={index} style={{ paddingTop: '15px' }}>
          <label><strong>{`${labelName?.toUpperCase()} ${type.toUpperCase()}`}</strong></label>
          <TextField
            placeholder='Typing...'
            className={classes.inputText}
            value={fieldValueSeparate[type]}
            multiline
            rows={3}
            rowsMax={10}
            inputProps={{ style: { textTransform: 'uppercase' } }}
            InputProps={{
              classes: { input: classes.placeholder }
            }}
            onChange={(e) => inputTextSeparate(e, type, field)}
            variant='outlined'
            autoFocus
            onPaste={onPaste}
          />
        </div>)
    } else {
      const isDoG = metadata.field[DESCRIPTION_OF_GOODS] === field;

      return (
        isDateTime ?
          <DateTimePickers time={fieldValue ? formatDate(fieldValue, 'YYYY-MM-DD') : ''} onChange={e => handleChange(e, true)} /> :
          <>
            {isDoG && renderDoGLine1Line2()}
            <TextField
              placeholder='Typing...'
              className={classes.inputText}
              value={fieldValue}
              multiline
              rows={isDoG ? 5 : 3}
              rowsMax={10}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              InputProps={{
                classes: { input: classes.placeholder }
              }}
              onChange={handleChange}
              variant='outlined'
              autoFocus
              onPaste={onPaste}
              error={validateField(field, fieldValue).isError}
              helperText={
                validateField(field, fieldValue).errorType.split('\n').map((line, idx) => (
                  <span key={idx} style={{ display: 'block', lineHeight: '20px', fontSize: 14, color: 'red' }}>{line}</span>
                ))
              }
            />
          </>
      )
    }
  }

  const setValueSeparate = (fieldValue) => {
    const checkSeparate = [SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(fieldValue);
    setIsSeparate(checkSeparate);
    if (checkSeparate) {
      const arrFields = [SHIPPER, CONSIGNEE, NOTIFY];
      const fieldIndex = arrFields.findIndex(key => metadata.field[key] === fieldValue);
      const fieldName = metadata.field?.[`${arrFields[fieldIndex]}Name`] ? content[metadata.field?.[`${arrFields[fieldIndex]}Name`]] : '';
      const fieldAddress = metadata.field?.[`${arrFields[fieldIndex]}Address`] ? content[metadata.field?.[`${arrFields[fieldIndex]}Address`]] : '';
      setFieldValueSeparate({
        name: fieldName || '',
        address: fieldAddress || ''
      })
    }
  };

  const handleChangeField = (e) => {
    setFieldValueSelect(e);
    setFieldValue(content[e.value] || "");
    setIsSeparate([SHIPPER, CONSIGNEE, NOTIFY].map(key => metadata.field?.[key]).includes(e.value));
    setValueSeparate(e.value);
    setChange(false);
  };

  const checkCurField = () => {
    let getCurField = currentField;
    if (containerCheck.includes(currentField)) getCurField = currentAmendField;
    const filterCurrentField = fieldType.find(f => f.value === getCurField);
    const findAme = inquiries.filter(({ field, process }) => field === currentField && process === 'draft');
    if (findAme.length || !filterCurrentField) {
      setFieldValueSelect();
      setFieldValue();
      setValueSeparate();
    } else {
      if (filterCurrentField) {
        setFieldValueSelect(filterCurrentField);
        setFieldValue(content[filterCurrentField.value]);
        setValueSeparate(filterCurrentField.value);
      }
    }
  };

  const validateField = (field, value) => {
    let response = { isError: false, errorType: "" };
    const fieldId = field || fieldValueSelect?.value;
    if (isChange && fieldValueSelect && fieldValueSelect.keyword === BL_TYPE) {
      response = validateBLType(value);
    }
    return response;
  }

  useEffect(() => {
    return () => dispatch(FormActions.setDirtyReload({ createAme: false }));
  }, [])

  useEffect(() => {
    if (!openAmendmentList) {
      let contentField = content[currentField];
      if (containerCheck.includes(currentField)) {
        contentField = content[currentAmendField];
      }
      setFieldValue(contentField || "")
      checkCurField();
    } else {
      setFieldValue('');
      setIsSeparate(false);
    }
  }, [content, currentField])

  useEffect(() => {
    fieldValueSelect && setIsDateTime(isDateField(metadata, fieldValueSelect.value));
  }, [fieldValueSelect])

  const styles = (width) => {
    return {
      control: {
        width: `${width}px`,
        borderRadius: 11
      }
    };
  };

  const onPaste = (e) => {
    if (e.clipboardData.files.length) {
      const fileObject = e.clipboardData.files[0];
      const newFileName = generateFileNameTimeFormat(fileObject.name)
      const myRenamedFile = new File([fileObject], newFileName, {
        type: "image/png"
      });
      setFilepaste(myRenamedFile);
    }
  }

  const { isDragActive, getRootProps } = useDropzone({
    onDrop: files => setDropfiles(files),
    noClick: true
  });

  return (
    <div style={{ paddingLeft: 18, borderLeft: `2px solid ${colorInq}`, position: 'relative' }} {...getRootProps({})}>
      {isDragActive && <div className='dropzone'>Drop files here</div>}
      {!openAmendmentList && (
        <p style={{
          color: pink,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '17px',
          padding: '3.5px 10px',
          background: '#FDF2F2',
          borderRadius: 4,
          display: 'inline-block',
          marginTop: 0,
          marginBottom: 15,
        }}>
          AMENDMENT
        </p>
      )}

      <div className='flex justify-between' style={{ marginBottom: 15 }}>
        {!openAmendmentList ? (
          <UserInfo
            name={user?.displayName}
            time=""
            avatar=""
          />
        ) : <Typography color="primary" variant="h5" className={classes.inqTitle}>New Amendment</Typography>}
        <div className={'flex'} style={{ alignItems: 'center' }}>
          <AttachFileAmendment filepaste={filepaste} dropfiles={dropfiles} setAttachment={getAttachment} attachmentFiles={attachments} />
        </div>
      </div>

      {(
        <FormControl error={!fieldValueSelect}>
          <FuseChipSelect
            customStyle={styles(fullscreen ? 320 : 295)}
            value={fieldValueSelect}
            onChange={handleChangeField}
            placeholder="BL Data Field"
            textFieldProps={{
              variant: 'outlined'
            }}
            options={fieldType}
            errorStyle={fieldValueSelect}
          />
          <div style={{ height: '20px' }}>
            {!fieldValueSelect && (<FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
            )}
          </div>
        </FormControl>
      )}

      {containerCheck.includes(fieldValueSelect?.value) ? (
        <div style={{ margin: '15px 0' }}>
          <ContainerDetailForm
            container={
              (fieldValueSelect?.value || currentField) === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
            }
            setEditContent={(value) => {
              setFieldValue(value);
            }}
            disableInput={false}
          />
        </div>
      ) : <div style={{ paddingTop: '5px' }}>
        {renderSeparateField(currentField)}
      </div>
      }

      <div className={classes.attachmentFiles}>
        {attachments?.map((file, mediaIndex) => (
          <>
            <FileAttach
              file={file}
              files={attachments}
              question={question}
              draftBL={true}
              removeAttachmentDraftBL={() => removeAttachment(mediaIndex)}
              isEdit={true}
            />
          </>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <Button
          className={classes.btn}
          disabled={
            (isSeparate ? (
              (fieldValueSelect && (attachments.length === 0 && content[fieldValueSelect.value] === (fieldValueSeparate.name.trim() + '\n' + fieldValueSeparate.address.trim())))
              ||
              (fieldValueSelect && !content[fieldValueSelect.value] && (fieldValueSeparate.name === '' && fieldValueSeparate.address === '') && attachments.length === 0)
            ) : (
              validateField(fieldValueSelect?.value, fieldValue).isError
              ||
              (
                (fieldValue && fieldValueSelect && ['containerDetail', 'containerManifest'].includes(fieldValueSelect.keyword)) ? (
                  (compareObject(content[fieldValueSelect.value], fieldValue) && attachments.length === 0)
                ) : (
                  (fieldValueSelect && [DATED, DATE_CARGO, DATE_LADEN].includes(fieldValueSelect.keyword) ?
                    (isValidDate ||
                      (
                        (fieldValue && fieldValueSelect && isSameDate(fieldValue, content[fieldValueSelect.value]) && attachments.length === 0)
                        ||
                        (!fieldValue && fieldValueSelect && isSameDate('', content[fieldValueSelect.value]) && attachments.length === 0)
                      )
                    )
                    : (
                      (fieldValue && fieldValueSelect && (fieldValue.trim() === content[fieldValueSelect.value]?.trim() && attachments.length === 0))
                      ||
                      (fieldValueSelect && !content[fieldValueSelect.value] && (!fieldValue || fieldValue.trim() === '') && attachments.length === 0)
                      ||
                      (
                        (!fieldValue || fieldValue.trim() === '')
                        && fieldValueSelect
                        && content[fieldValueSelect.value]
                        && typeof content[fieldValueSelect.value] === 'string'
                        && content[fieldValueSelect.value].trim() === ''
                        && attachments.length === 0
                      )
                    ))
                )
              )))
            || !fieldValueSelect
            || disableSave
            || isValidDate
          }
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
        {
          (
            (openAmendmentList && inquiriesLength > 0)
            ||
            !openAmendmentList
          ) && (
            <Button className={clsx(classes.btn, classes.btnCancel)} onClick={handleCancel}>
              Cancel
            </Button>
          )
        }
      </div>
    </div>
  );
};

export default Amendment;
