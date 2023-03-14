import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { Button, Typography, FormHelperText, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from 'app/services/fileService';
import { saveEditedField } from 'app/services/draftblService';
import { validateBLType } from '@shared';
import { CONTAINER_DETAIL, CONTAINER_LIST, CONTAINER_MANIFEST, SHIPPER, CONSIGNEE, NOTIFY, CONTAINER_NUMBER, BL_TYPE } from '@shared/keyword';
import { FuseChipSelect } from '@fuse';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';
import { validateTextInput } from 'app/services/myBLService';
import { useUnsavedChangesWarning } from 'app/hooks'

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import UserInfo from './UserInfo';
import ImageAttach from './ImageAttach';
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

const Amendment = ({ question, inquiriesLength, getUpdatedAt }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const [metadata, content, myBL, inquiries, enableSubmit] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.content,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.enableSubmit,
  ]);
  const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
  const currentField = useSelector(({ draftBL }) => draftBL.currentField);
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

  const handleChange = (e) => {
    setDirty();
    setFieldValue(e.target.value);
    setChange(true);
  }

  const inputTextSeparate = (e, type) => {
    setDirty();
    setFieldValueSeparate(Object.assign({}, fieldValueSeparate, { [type]: e.target.value }));
    setChange(true);
  };

  const handleValidateInput = async (confirm = null) => {
    setDisableSave(true);
    let textInput = fieldValue || '';
    const { isWarning, prohibitedInfo } = await validateTextInput({ textInput, dest: myBL.bkgNo });
    if (isWarning) {
      dispatch(FormActions.validateInput({ isValid: false, prohibitedInfo, handleConfirm: confirm }));
    } else {
      confirm && confirm();
    }
  }

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
    if (warningLeast1CM.length) dispatch(FormActions.toggleWarningCDCM({ status: true, contentsWarning: warningLeast1CM, warningType: 'atLeast1CM' }));
    if (warningCmsNotInCD.length) dispatch(FormActions.toggleWarningCDCM({ status: true, contentsWarning: warningCmsNotInCD, warningType: 'CmNotMatch' }));
  }

  const handleSave = () => {
    dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    fieldValueSeparate.name = fieldValueSeparate.name.toUpperCase().trim();
    fieldValueSeparate.address = fieldValueSeparate.address.toUpperCase().trim();
    let contentField = isSeparate ? JSON.stringify(fieldValueSeparate) : typeof fieldValue === 'string' ? fieldValue.toUpperCase().trim() : fieldValue;
    const uploads = [];
    const fieldReq = fieldValueSelect?.value;
    const optionsInquires = [...inquiries];
    const optionsMinimize = [...listMinimize];
    if (attachments.length) {
      attachments.forEach((file) => {
        if (!file.id) {
          const formData = new FormData();
          formData.append('files', file.data);
          uploads.push(formData);
        }
      });
    }
    if (openAmendmentList && !fieldReq) {
      setDisableSave(false);
      return;
    }

    axios
      .all(uploads.map((endpoint) => uploadFile(endpoint)))
      .then((files) => {
        const mediaList = attachments.filter((file) => file.id);
        files.forEach((file) => {
          const mediaFileList = file.response.map((item) => { return { id: item.id, ext: item.ext, name: item.name } });
          mediaList.push(mediaFileList[0]);
        });

        saveEditedField({ field: fieldReq, content: { content: contentField, mediaFile: mediaList }, mybl: myBL.id })
          .then((res) => {
            if ([CONTAINER_DETAIL, CONTAINER_MANIFEST].includes(fieldValueSelect.keyword)) {
              // CASE 1-1 CD CM
              if (contentField.length === 1 && content[fieldValueSelect.keyword === CONTAINER_DETAIL ? containerCheck[1] : containerCheck[0]].length === 1) {
                if (fieldValueSelect.keyword === CONTAINER_DETAIL) {
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
                else if (fieldValueSelect.keyword === CONTAINER_MANIFEST) {
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
              // MULTIPLE CASE CD CM
              else {
                let contsNoChange = {};
                const contsNo = [];
                const orgContentField = content[getField(fieldValueSelect.keyword)];
                contentField.forEach((obj, index) => {
                  const containerNo = orgContentField[index][getType(CONTAINER_NUMBER)];
                  const getTypeName = Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === getType(CONTAINER_NUMBER));
                  if (getTypeName === CONTAINER_NUMBER) {
                    contsNoChange[containerNo] = obj[getType(CONTAINER_NUMBER)];
                    contsNo.push(obj?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
                  }
                })
                const fieldId = getField(fieldValueSelect.keyword === CONTAINER_DETAIL ? CONTAINER_MANIFEST : CONTAINER_DETAIL)
                let fieldAutoUpdate = content[fieldId];
                fieldAutoUpdate.map((item) => {
                  if (item[getType(CONTAINER_NUMBER)] in contsNoChange) {
                    item[getType(CONTAINER_NUMBER)] = contsNoChange[item[getType(CONTAINER_NUMBER)]]
                  }
                })
                if (fieldAutoUpdate) {
                  content[fieldId] = fieldAutoUpdate;
                  if (fieldValueSelect.keyword === CONTAINER_DETAIL) {
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
                            total += parseFloat(cm[getType(key)]);
                          });
                          cd[getType(CONTAINER_LIST.cdNumber[index])] = parseFloat(total.toFixed(3));
                        });
                      }
                    })
                  }
                  saveEditedField({ field: fieldId, content: { content: fieldAutoUpdate, mediaFile: [] }, mybl: myBL.id, autoUpdate: true });
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

            dispatch(InquiryActions.setInquiries(optionsInquires));
            dispatch(InquiryActions.setListMinimize(optionsMinimize));
            dispatch(InquiryActions.checkSubmit(!enableSubmit));
            getUpdatedAt();
            setDisableSave(false);
            dispatch(InquiryActions.setContent({ ...content, [fieldReq]: contentField }));
            dispatch(FormActions.toggleCreateAmendment(false));
            dispatch(FormActions.toggleAmendmentsList(true));
            dispatch(InquiryActions.addAmendment());
            dispatch(InquiryActions.setOneInq({}));
            setPristine()
          }).catch((err) => console.error(err));
      });
  }

  const handleCancel = () => {
    dispatch(InquiryActions.addAmendment());
    dispatch(FormActions.toggleCreateAmendment(false));
  }

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

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
            rows={['name'].includes(type) ? 2 : 3}
            inputProps={{ style: { textTransform: 'uppercase' } }}
            InputProps={{
              classes: { input: classes.placeholder }
            }}
            onChange={(e) => inputTextSeparate(e, type, field)}
            variant='outlined'
          />
        </div>)
    } else {
      return (
        <TextField
          placeholder='Typing...'
          className={classes.inputText}
          value={fieldValue}
          multiline
          rows={3}
          inputProps={{ style: { textTransform: 'uppercase' } }}
          InputProps={{
            classes: { input: classes.placeholder }
          }}
          onChange={handleChange}
          variant='outlined'
          error={validateField(field, fieldValue).isError}
          helperText={
            validateField(field, fieldValue).errorType.split('\n').map((line, idx) => (
              <span key={idx} style={{ display: 'block', lineHeight: '20px', fontSize: 14 }}>{line}</span>
            ))
          }
        />
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
    const filterCurrentField = fieldType.find(f => f.value === currentField);
    const findInqs = inquiries.filter(inq => inq.field === currentField);
    if (findInqs.length) {
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
    if (Object.keys(metadata.field).find(key => metadata.field[key] === fieldId) === BL_TYPE) {
      response = validateBLType(value);
    }
    return response;
  }

  useEffect(() => {
    if (!openAmendmentList) {
      setFieldValue(content[currentField] || "")
      checkCurField();
    } else {
      setFieldValue('');
      setIsSeparate(false);
    }
  }, [content, currentField])

  const styles = (width) => {
    return {
      control: {
        width: `${width}px`,
        borderRadius: 11
      }
    };
  };

  return (
    <div style={{ paddingLeft: 18, borderLeft: `2px solid ${colorInq}` }}>
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
          <AttachFileAmendment setAttachment={getAttachment} attachmentFiles={attachments} />
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
          <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
            {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
              <ImageAttach file={file} draftBL={true} removeAttachmentDraftBL={() => removeAttachment(mediaIndex)} />)
              : (
                <FileAttach file={file} draftBL={true} removeAttachmentDraftBL={() => removeAttachment(mediaIndex)} />
              )}
          </div>
        ))}
      </div>


      <div style={{ marginTop: 20 }}>
        <Button
          className={classes.btn}
          disabled={
            (isSeparate ? (
              !fieldValueSeparate.name
              && !fieldValueSeparate.address
              && !isChange
            ) : (
              validateField(fieldValueSelect?.value, fieldValue).isError
              ||
              (!isChange && fieldValue && (fieldValue.length === 0 || (['string'].includes(typeof fieldValue) && fieldValue.trim().length === 0)))
              || (!fieldValue && !isChange)
            ))
            ||
            disableSave
          }
          onClick={() => handleValidateInput(handleSave)}
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
