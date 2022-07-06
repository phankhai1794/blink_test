import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, FormControl, FormHelperText} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DescriptionIcon from '@material-ui/icons/Description';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {FuseChipSelect} from "@fuse";
import {validateExtensionFile} from '@shared';
import * as AppAction from "app/store/actions";
import {useDropzone} from "react-dropzone";
import {uploadFile} from 'app/services/fileService';
import {updateInquiryAttachment, addNewMedia, removeFile, replaceFile} from 'app/services/inquiryService';
import {makeStyles} from "@material-ui/core/styles";
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as InquiryActions from "../store/actions/inquiry";


const AttachmentList = (props) => {
  const [inquiries, metadata, questions, attachmentList, validationAttachment] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.attachmentList,
    workspace.inquiryReducer.validationAttachment,
  ]);
  const { pathname } = window.location;
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const [fieldType, setFieldType] = useState(metadata.field_options.filter(meta => inquiries.find(inq => meta.value === inq.field)));
  const dispatch = useDispatch();
  const [isShowIconSuccess, setShowIconSuccess] = useState();
  const styles = (validationAttachment, width) => {
    return {
      control: {
        border: !validationAttachment && '1px solid red',
        borderRadius: '9px',
        width: `${width}px`
      }
    };
  };
  const stylesNotErr = (width) => {
    return {
      control: {
        width: `${width}px`
      }
    };
  }
  useEffect(() => {
    const optionsAttachmentList = [...attachmentList];
    if (optionsAttachmentList.length > 0) {
      dispatch(
        InquiryActions.validateAttachment({
          field: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].field),
          nameFile: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].name),
        }));
    }
  }, []);

  const handleFieldChange = (e, index) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentList];
    // update replace
    if (optionsAttachmentList[index].field && optionsAttachmentList[index].id) {
      // update inquiries
      const indexInquiryOld = optionsOfQuestion.findIndex(op => optionsAttachmentList[index].field === op.field);
      const indexMediaOld = optionsOfQuestion[indexInquiryOld].mediaFile?.findIndex(f => f.id === optionsAttachmentList[index].id);
      const indexInquiryNew = optionsOfQuestion.findIndex(op => e.value === op.field);
      const data = {
        newInquiryId: optionsOfQuestion[indexInquiryNew].id,
        oldInquiryId: optionsOfQuestion[indexInquiryOld].id,
        mediaId: optionsAttachmentList[index].id,
      };
      updateInquiryAttachment(data).then(res => {
        // update attachment list
        optionsAttachmentList[index].field = e.value;
        dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
      }).catch((error) => console.log(error));
    }
    // add new
    else {
      const file = optionsAttachmentList[index].fileUpload;
      const formData = new FormData();
      const indexInquiryOld = optionsOfQuestion.findIndex(op => e.value === op.field);
      formData.append('file', file);
      uploadFile(formData).then((media) => {
        //update inquiries
        const res = media.response[0];
        addNewMedia({inquiryId: optionsOfQuestion[indexInquiryOld].id, mediaId: res.id}).then(rs => {
          //update attachment list
          optionsAttachmentList[index] = {
            ...optionsAttachmentList[index],
            id: res.id,
            src: URL.createObjectURL(file),
            field: e.value,
          };
          dispatch(
            InquiryActions.validateAttachment({
              field: Boolean(optionsAttachmentList[index].field),
              nameFile: Boolean(optionsAttachmentList[index].name),
            })
          );
          dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
          setShowIconSuccess(true);
        });
      }).catch((error) => console.log(error));
    }
  };

  const onFileReplaceChange = (file, mediaIndex) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentList];
    if (!validateExtensionFile(file[0])) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      // update replace
      if (optionsAttachmentList[mediaIndex].field && optionsAttachmentList[mediaIndex].id) {
        const formData = new FormData();
        formData.append('file', file[0]);
        const indexInquiry = optionsOfQuestion.findIndex(op => optionsAttachmentList[mediaIndex].field === op.field);
        const indexMedia = optionsOfQuestion[indexInquiry].mediaFile.findIndex(f => f.id === optionsAttachmentList[mediaIndex].id);
        uploadFile(formData).then((media) => {
          //update inquiries
          const res = media.response[0];
          const data = {
            inquiryId: optionsOfQuestion[indexInquiry].id,
            oldMediaId: optionsAttachmentList[mediaIndex].id,
            newMediaId: res.id,
          };
          replaceFile(data).then(rt => {
            //update attachment list
            optionsAttachmentList[mediaIndex] = {
              id: res.id,
              src: URL.createObjectURL(file[0]),
              ext: file[0].type,
              name: file[0].name,
              field: optionsAttachmentList[mediaIndex].field,
              inquiryId: optionsAttachmentList[mediaIndex].inquiryId
            };
            dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
          }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
        }).catch((error) => console.log(error));
      }
      // add new
      else {
        optionsAttachmentList[mediaIndex] = {
          ...optionsAttachmentList[mediaIndex],
          ext: file[0].type,
          name: file[0].name,
          fileUpload: file[0]
        };
        dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
      }
    }
  };

  const handleRemove = (index) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentList];
    if (optionsAttachmentList[index].field && optionsAttachmentList[index].id) {
      removeFile(optionsAttachmentList[index].id).then(res => {
        // update inquiries
        const indexInquiry = optionsOfQuestion.findIndex(op => optionsAttachmentList[index].field === op.field);
        const indexMedia = optionsOfQuestion[indexInquiry].mediaFile.findIndex(f => f.id === optionsAttachmentList[index].id);
        optionsOfQuestion[indexInquiry].mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(optionsOfQuestion));
        // update attachment list
        optionsAttachmentList.splice(index, 1);
        dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
        setShowIconSuccess()
      });
    } else {
      // update attachment list
      optionsAttachmentList.splice(index, 1);
      if (optionsAttachmentList.length > 0) {
        dispatch(
          InquiryActions.validateAttachment({
            field: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].field),
            nameFile: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].name),
          }));
      }
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
      setShowIconSuccess();
    }
  };

  const checkValidateAddNew = (attachment) => {
    if (typeof (attachment) !== 'undefined') {
      if (!attachment.field || !attachment.name) {
        dispatch(
          InquiryActions.validateAttachment({
            field: Boolean(attachment.field),
            nameFile: Boolean(attachment.name),
          })
        );
        return true;
      }
      return false;
    }
  };

  const handleAddNew = (file) => {
    const optionsAttachmentList = [...attachmentList];
    if (!checkValidateAddNew(optionsAttachmentList[optionsAttachmentList.length -1])) {
      if (file) {
        if (!validateExtensionFile(file[0])) {
          dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
        } else {
          const templateMedia = {
            field: null,
            inquiryId: null,
            id: null,
            src: null,
            ext: file[0].type,
            name: file[0].name,
            fileUpload: file[0]
          };
          optionsAttachmentList.push(templateMedia);
          dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
          setShowIconSuccess(false)
        }
      }
    }
  };

  return (
    <>
      {attachmentList.map((media, index) => {
        const filter = fieldType.filter(v => media.field === v?.value)[0];
        const lowerCaseExt = media.ext.toLowerCase();
        return (
          <div key={index}>
            <div className="flex">
              <div className="flex" style={{ width: "300px", alignItems: 'center' }}>
                {lowerCaseExt.includes("pdf") ?
                  <img style={{ height: '25px', width: '25px' }} src={`/assets/images/logos/pdf_icon.png`} />
                  :
                  lowerCaseExt.match(/jpeg|jpg|png/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/image_icon.png`} />
                    :
                    lowerCaseExt.match(/doc/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/word_icon.png`} />
                      :
                      (lowerCaseExt.match(/csv|xls/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/excel_icon.png`} />
                        :
                        <DescriptionIcon />)
                }
                <span style={{ width: "200px", textOverflow: "ellipsis", overflow: "hidden", fontSize: '18px', fontWeight: 600, lineHeight: '22px', marginLeft: '1rem' }}>
                  {media.name}
                </span>
              </div>
              <div className="flex justify-between" style={{ width: '600px' }}>
                <PermissionProvider action={PERMISSION.INQUIRY_INQ_ATT_MEDIA}
                  extraCondition={pathname.includes('/workspace')}
                  fallback={
                    <div style={{ fontSize: '16px', color: '#BD0F72', fontWeight: 600, lineHeight: '20px' }}>
                      {filter?.label}
                    </div>
                  }
                >
                  {index === attachmentList.length - 1 && (
                    <FormControl error={!validationAttachment.field}>
                      <div className='selectForm' style={{ display: 'flex', alignItems: 'center' }}>
                        <FuseChipSelect
                          className="m-auto"
                          customStyle={styles(validationAttachment.field, fullscreen ? 320 : 290)}
                          value={filter}
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="None"
                          textFieldProps={{
                            variant: 'outlined'
                          }}
                          options={fieldType}
                        />
                        {isShowIconSuccess &&
                          <CheckCircleOutlineIcon
                            style={{height: '25px', width: '25px', color: '#36B37E', marginLeft: '11px'}}/>
                        }
                      </div>

                      {index === attachmentList.length - 1 && !validationAttachment.field && <FormHelperText>This is required!</FormHelperText>}
                    </FormControl>
                  )}
                  {index !== attachmentList.length - 1 && (
                    <FormControl>
                      <FuseChipSelect
                        className="m-auto"
                        customStyle={stylesNotErr(fullscreen ? 320 : 290)}
                        value={filter}
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="None"
                        textFieldProps={{
                          variant: 'outlined'
                        }}
                        options={fieldType}
                      />
                    </FormControl>
                  )}
                </PermissionProvider>
                
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <PermissionProvider action={PERMISSION.INQUIRY_REPLACE_MEDIA}>
                    <div className={'replace'}>
                      <AttachFile
                        uploadImageAttach={onFileReplaceChange}
                        mediaIndex={index}
                        isAttachmentList={false}
                        type={'replace'}
                      >
                        <CachedIcon style={{ height: '20px', width: '20px', color: 'gray' }} />
                        <span style={{ fontSize: '15px', marginLeft: '5px', fontWeight: '500', color: 'gray' }}>Replace</span>
                      </AttachFile>
                    </div>
                  </PermissionProvider>
                  <PermissionProvider action={PERMISSION.INQUIRY_REMOVE_MEDIA}>
                    <div className={'remove'} style={{ display: 'flex', cursor: 'pointer' }} onClick={() => handleRemove(index)}>
                      <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/remove_icon.png`} />
                      <span style={{ fontSize: '15px', marginLeft: '5px', fontWeight: '500', color: 'gray' }}>Remove</span>
                    </div>
                  </PermissionProvider>
                </div>
              </div>
            </div>
            {index !== attachmentList.length && <Divider className="mt-16 mb-16" />}
          </div>
        )
      })}
      <PermissionProvider action={PERMISSION.INQUIRY_ADD_MEDIA}>
        <AttachFile
          uploadImageAttach={handleAddNew}
          isAttachmentList={true}
          isShowIconSuccess={isShowIconSuccess}
          type={'addNew'}
        >
          <AddCircleIcon style={{ color: '#BD0F72', width: '50px', fontSize: '50px', cursor: 'pointer' }} />
        </AttachFile>
      </PermissionProvider>
    </>
  )
};

const useStyles = makeStyles(() => ({
  styleActionReplace: {
    padding: '2px',
    display: 'flex',
    cursor: 'pointer',
    marginRight: '20px'
  },
  styleActionAddMore: {
    display: 'flex',
    width: '50px',
    justifyContent: 'flex-end',
    margin: '36px 0 0 850px'
  }
}));

const AttachFile = (props) => {
  const { uploadImageAttach, mediaIndex, children, isAttachmentList, isShowIconSuccess, type } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const onDrop = (acceptedFiles) => {
    uploadImageAttach(acceptedFiles, mediaIndex);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  const openUploadFile = () => {
    if (type !== 'replace') {
      if (typeof(isShowIconSuccess) !== 'undefined' && !isShowIconSuccess) {
        dispatch(
          InquiryActions.validateAttachment({
            field: false,
            nameFile: false
          })
        );
        return;
      }
    }
    open();
  };

  return (
    <div className="container">
      <div {...getRootProps({})}>
        <input {...getInputProps()} disabled={false} />
        <div className={isAttachmentList ? classes.styleActionAddMore : classes.styleActionReplace} onClick={openUploadFile}>
          {children}
        </div>
      </div>
    </div>
  )
};

export default AttachmentList;
