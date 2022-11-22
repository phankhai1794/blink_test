import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FormControl, FormHelperText, Button, LinearProgress, Tooltip } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ImageViewer from "react-simple-image-viewer";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { FuseChipSelect } from "@fuse";
import { validateExtensionFile } from '@shared';
import * as AppAction from "app/store/actions";
import { useDropzone } from "react-dropzone";
import { uploadFile, getFile } from 'app/services/fileService';
import { updateInquiryAttachment, removeMultipleMedia, replaceFile, addNewMedia } from 'app/services/inquiryService';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { handleDuplicateAttachment } from '@shared/handleError';
import { getCommentDraftBl } from "app/services/draftblService";
import Checkbox from "@material-ui/core/Checkbox";
import clsx from "clsx";

import * as InquiryActions from "../store/actions/inquiry";
import {loadComment} from 'app/services/inquiryService';

import PDFViewer from './PDFViewer';

const attachmentStyle = makeStyles(() => ({
  root: {
    position: 'relative',
    '& .actions': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 24px',
      marginBottom: '16px',
      background: '#FDF2F2',
    },
    '& .actions .actionAttachment': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .attachmentList': {
      padding: '0 24px',
      background: '#ffffff85'
    },
    '& .checkAll .MuiSvgIcon-root': {
      width: '25px',
      height: '25px'
    },
    '& .attachmentList .checkboxDetail .MuiSvgIcon-root': {
      width: '25px',
      height: '25px'
    },
    '& .dialogConfirm': {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '73px',
      background: '#BD0F72',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& p': {
        marginLeft: '27px',
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
        letterSpacing: 1
      },
      '& .btnConfirm': {
        marginRight: '24px',
        '& .MuiButton-label': {
          color: '#BD0F72'
        },
        '& .MuiButtonBase-root': {
          background: '#FFFFFF',
          borderRadius: 6
        }
      },
    }
  },
  selectField: {
    display: 'flex',
    alignItems: 'center',
    '& .selectType': {
      '& .MuiPaper-root .fuse-chip-select__menu-list .MuiMenuItem-root': {
        whiteSpace: 'normal'
      }
    },
    '& .MuiFormControl-root .MuiInputBase-root p.MuiTypography-root': {
      fontSize: 15
    }
  },
  backgroundConfirm: {
    top: 74,
    left: 0,
    position: 'absolute',
    width: '950px',
    minHeight: '100%',
    background: '#ffffff85'
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 17,
    height: 17,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72',
    }
  },
  checkedIcon: {
    display: 'block',
    position: 'absolute',
    top: '0px',
    left: '5px',
    width: '5px',
    height: '10px',
    border: '1px solid #BD0F72',
    borderWidth: '0 2px 2px 0',
    transform: 'rotate(45deg)',
  },
  checkedNotAllIcon: {
    top: '3px',
    left: '7px',
    width: '0px',
    border: '1px solid #BD0F72',
    height: '8px',
    display: 'block',
    position: 'absolute',
    transform: 'rotate(90deg)',
  },
  customSelect: {
    '& .MuiTypography-root': {
      color: '#515E6A',
      fontWeight: 600,
    },
    '& .Mui-focused': {
      '& .MuiTypography-root': {
        color: '#BD0F72',
      }
    }
  },
  selectError: {
    '& .MuiTypography-root': {
      color: '#BD0F72',
      fontWeight: 600,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '2px solid #BD0F72',
      borderRadius: '9px'
    }
  }
}));

const urlMedia = (fileExt, file) => {
  if (fileExt.toLowerCase().match(/jpeg|jpg|png/g)) {
    return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
  } else if (fileExt.toLowerCase().match(/pdf/g)) {
    return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
  } else {
    return URL.createObjectURL(new Blob([file]));
  }
};

const AttachmentList = (props) => {
  const [inquiries, metadata, isShowBackground] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.isShowBackground,
  ]);
  const { pathname } = window.location;
  const classes = attachmentStyle();
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const [fieldType, setFieldType] = useState([]);
  const [attachmentFiles, setAttachmentFile] = useState([]);
  const dispatch = useDispatch();
  const [selectedIndexFile, setSelectedIndexFile] = useState([]);
  const [isShowReplace, setShowReplace] = useState(false);
  const [isShowRemove, setShowRemove] = useState(false);
  const [isShowConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAllSelected = attachmentFiles.length > 0 && selectedIndexFile.length === attachmentFiles.length;
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  const styles = (validationAttachment, width) => {
    return {
      control: {
        border: !validationAttachment && '1px solid red',
        borderRadius: '9px',
        width: `${width}px`
      }
    };
  };

  useEffect(() => {
    if (document.getElementsByClassName('attachmentList')[0].childElementCount > 0){
      document.querySelectorAll('#no-att span')[0].textContent = document.getElementsByClassName('attachmentList')[0].childElementCount;
    }
  }, [attachmentFiles])

  useEffect(() => {
    if (props.newFileAttachment) {
      const files = props.newFileAttachment;
      const optionsAttachmentList = [...attachmentFiles];
      const inValidFile = files.find((elem) => !validateExtensionFile(elem));
      if (inValidFile) {
        dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
      } else {
        const newFile = [];
        files.forEach(f => {
          const ext = f.path.split(".").pop();
          const templateMedia = {
            field: null,
            inquiryId: null,
            id: null,
            src: null,
            ext: `.${ext}`,
            name: f.name,
            fileUpload: f,
          };
          templateMedia.src = urlMedia(f.type, f);
          newFile.push(templateMedia);
        });
        const merFile = [...optionsAttachmentList, ...newFile];
        setAttachmentFile(merFile);
      }
    }
  }, [props.newFileAttachment]);

  useEffect(() => {
    let getAttachmentFiles = [];
    let combineFieldType = [];
    inquiries.forEach((e) => {
      const mediaFile = e.mediaFile.map((f) => {
        return {
          ...f,
          field: e.field,
          inquiryId: e.id,
          inqType: e.inqType
        };
      });
      const mediaAnswer = e.mediaFilesAnswer.map((f) => {
        return {
          ...f,
          field: e.field,
          inquiryId: e.id,
          inqType: e.inqType
        };

      })

      getAttachmentFiles = [...getAttachmentFiles, ...mediaFile, ...mediaAnswer];
     
      getCommentDraftBl(myBL.id, e.field).then((res) => {
        res.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        if (res.length > 0) {
          let commentDraftIdList = [];
          res.forEach((r) => {
            if (!commentDraftIdList.includes(r.id)) {
              commentDraftIdList.push(r.id);
              const attachmentAmendment = r.content.mediaFile.map ((f) => {
                return {
                  ...f,
                  field: e.field,
                  inquiryId: e.id,
                  inqType: e.inqType,
                }
              })
              // if reply file in attachment of inquiry -> not add file to att list
              attachmentAmendment.forEach(att => {
                const fileNameList = getAttachmentFiles.map((item) => {
                  if (item.inqType === e.inqType) return item.name
                })
                if (att && !e.inqType && !fileNameList.includes(att.name)) getAttachmentFiles.push(att)
              })
            }
          })
        }
      })
      
      loadComment(e.id).then((res) => {
        res.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        if (res.length > 0){
          let commentIdlist = []
          res.forEach((r) => {
            if (!commentIdlist.includes(r.id)) {
              commentIdlist.push(r.id);
              if (r.mediaFile?.length > 0) {
                const attachmentTemp = r.mediaFile.map ((f) => {
                  return {
                    ...f,
                      field: e.field,
                      inquiryId: e.id,
                      inqType: e.inqType,
                  }
                })
                // if reply file in attachment of inquiry -> not add file to att list
                attachmentTemp.forEach(att => {
                  const fileNameList = getAttachmentFiles.map((item) => {
                    if (item.inqType === e.inqType) return item.name
                  })
                  if (att && !fileNameList.includes(att.name)) getAttachmentFiles.push(att)
                })
              }
            }
          })
        }
      })
     
      const fieldOptions = metadata.field_options.find(ops => ops.value === e.field);
      const inqType = metadata.inq_type_options.find(ops => ops.value === e.inqType);
      combineFieldType = [
        ...combineFieldType,
        {
          label: inqType?.label ? `${fieldOptions?.label} - ${inqType?.label}` : `${fieldOptions?.label} - AMENDMENT`,
          value: { fieldId: fieldOptions?.value, inqId: e.id, inqType: e.inqType }
        }
      ];
    });
    const wait = setTimeout( () => {
      getAttachmentFiles.sort((a, b) => a.field.localeCompare(b.field));
      combineFieldType.sort((a, b) => a.label.localeCompare(b.label));
      setAttachmentFile(getAttachmentFiles);
      
      setFieldType(combineFieldType);
      dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
      setIsLoading(false);
    },600)
  }, []);

  const handleFieldChange = (e, index) => {
    let optionsAttachmentList = [...attachmentFiles];
    // add new replace
    if (!optionsAttachmentList[index].field && !optionsAttachmentList[index].id) {
      const file = optionsAttachmentList[index].fileUpload;
      const isExist = handleDuplicateAttachment(
        dispatch,
        metadata,
        optionsAttachmentList,
        [...[file]],
        e.value.fieldId,
        e.value.inqType
      );
      if (!isExist) {
        const formData = new FormData();
        formData.append('file', file);
        uploadFile(formData).then((media) => {
          // update inquiries
          const res = media.response[0];
          addNewMedia({ inquiryId: e.value.inqId, mediaId: res.id }).then(rs => {
            optionsAttachmentList = optionsAttachmentList.map(op => {
              return { ...op, success: null }
            });
            optionsAttachmentList[index] = {
              ...optionsAttachmentList[index],
              id: res.id,
              field: e.value.fieldId,
              inquiryId: e.value.inqId,
              inqType: e.value.inqType,
              success: true,
            };
            setAttachmentFile(optionsAttachmentList);
          }).catch((error) => {
            console.error(error);
            optionsAttachmentList[index] = {
              ...optionsAttachmentList[index],
              field: 'false',
              success: false,
            };
            setAttachmentFile(optionsAttachmentList);
          })
        }).catch((error) => {
          console.error(error);
          optionsAttachmentList[index] = {
            ...optionsAttachmentList[index],
            field: 'false',
            success: false,
          };
          setAttachmentFile(optionsAttachmentList);
        });
      }
    }
    // update
    else {
      // update inquiries
      const media = optionsAttachmentList[index];
      if (
        e.value.fieldId !== optionsAttachmentList[index].field
        || e.value.inqType !== optionsAttachmentList[index].inqType
      ) {
        const isExist = handleDuplicateAttachment(
          dispatch,
          metadata,
          optionsAttachmentList,
          [...[media]],
          e.value.fieldId,
          e.value.inqType
        );
        if (!isExist) {
          const data = {
            newInquiryId: e.value.inqId,
            oldInquiryId: optionsAttachmentList[index].inquiryId,
            mediaId: media.id,
          };
          updateInquiryAttachment(data).then(res => {
            // update attachment list
            optionsAttachmentList[index] = {
              ...optionsAttachmentList[index],
              inquiryId: e.value.inqId,
              field: e.value.fieldId,
              inqType: e.value.inqType,
            };
            setAttachmentFile(optionsAttachmentList);
          }).catch((error) => {
            console.error(error);
            optionsAttachmentList[index] = {
              ...media,
              success: false,
            };
            setAttachmentFile(optionsAttachmentList);
          });
        }
      }
    }
  };

  const onFileReplaceChange = (file) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentFiles];
    if (!validateExtensionFile(file[0])) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      const ext = file[0].path.split(".").pop();
      const attachmentIndex = selectedIndexFile[0];
      //add new replace
      if (!optionsAttachmentList[attachmentIndex].field && !optionsAttachmentList[attachmentIndex].id) {
        optionsAttachmentList[attachmentIndex] = {
          ...optionsAttachmentList[attachmentIndex],
          src: urlMedia(ext, file[0]),
          ext: `.${ext}`,
          name: file[0].name,
          fileUpload: file[0],
        };
        setAttachmentFile(optionsAttachmentList);
      }
      // update replace
      else {
        const formData = new FormData();
        formData.append('file', file[0]);
        const findInquiry = optionsOfQuestion.find(op => optionsAttachmentList[attachmentIndex].field === op.field);
        uploadFile(formData).then((media) => {
          // update inquiries
          const res = media.response[0];
          const data = {
            inquiryId: findInquiry.id,
            oldMediaId: optionsAttachmentList[attachmentIndex].id,
            newMediaId: res.id,
          };
          replaceFile(data).then(rt => {
            // update attachment list
            optionsAttachmentList[attachmentIndex] = {
              id: res.id,
              src: urlMedia(ext, file[0]),
              ext: `.${ext}`,
              name: file[0].name,
              field: optionsAttachmentList[attachmentIndex].field,
              inquiryId: optionsAttachmentList[attachmentIndex].inquiryId
            };
            setAttachmentFile(optionsAttachmentList);
          }).catch((error) => {
            console.error(error);
            optionsAttachmentList[attachmentIndex] = {
              ...optionsAttachmentList[attachmentIndex],
              success: false,
            };
            setAttachmentFile(optionsAttachmentList);
          });
        }).catch((error) => {
          console.error(error);
          optionsAttachmentList[attachmentIndex] = {
            ...optionsAttachmentList[attachmentIndex],
            success: false,
          };
          setAttachmentFile(optionsAttachmentList);
        });
      }
    }
  };

  const handleConfirm = () => {
    const optionsAttachmentList = [...attachmentFiles];
    // update attachment list
    const listIdMedia = [];
    selectedIndexFile.forEach(val => {
      if (optionsAttachmentList[val].id !== null) {
        listIdMedia.push(optionsAttachmentList[val].id);
      }
    });
    if (listIdMedia.length > 0) {
      removeMultipleMedia({ mediaIds: listIdMedia }).then(res => {
        // update attachment list
        let mediaR = [];
        optionsAttachmentList.forEach((op, i) => {
          if (!selectedIndexFile.includes(i)) {
            mediaR = [...mediaR, op];
          }
        });
        setAttachmentFile(mediaR);
        setSelectedIndexFile([]);
        setShowConfirm(false);
        dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
        dispatch(AppAction.showMessage({ message: 'Delete attachment successfully', variant: 'success' }));
      });
    } else {
      // update attachment list
      const restMedia = optionsAttachmentList.filter((op, i) => !selectedIndexFile.includes(i));
      setAttachmentFile(restMedia);
      setSelectedIndexFile([]);
      setShowConfirm(false);
      dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
  };

  const handleRemove = () => {
    setShowConfirm(true);
    dispatch(InquiryActions.setShowBackgroundAttachmentList(true));
  };

  const handleCheck = (e, media, idx) => {
    // set index
    let listIndex = [...selectedIndexFile];
    if (listIndex.includes(idx)) {
      listIndex = listIndex.filter(val => val !== idx);
    } else {
      listIndex.push(idx);
    }
    setSelectedIndexFile(listIndex);
  };

  useEffect(() => {
    if (selectedIndexFile.length > 1) {
      setShowReplace(false);
      setShowRemove(true);
    } else if (selectedIndexFile.length > 0) {
      setShowReplace(true);
      setShowRemove(true);
    } else if (selectedIndexFile.length === 0) {
      setShowReplace(false);
      setShowRemove(false)
    }
  }, [selectedIndexFile]);

  const handleCheckAll = () => {
    const mediaIndex = attachmentFiles.map((at, index) => index);
    setSelectedIndexFile(selectedIndexFile.length === attachmentFiles.length ? [] : mediaIndex);
  };

  return (
    <>
      {isLoading ? <ColoredLinearProgress /> : ''}
      <div className={classes.root}>
        {attachmentFiles.length > 0 && (
          <>
            <div className='actions'>
              <div className='checkAll'>
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleCheckAll}
                  checkedIcon={
                    <>
                      <span className={clsx(classes.icon, 'borderChecked')}>
                        <span className={classes.checkedIcon} />
                      </span>
                    </>
                  }
                  icon={(selectedIndexFile.length > 0 && !isAllSelected) ? (
                    <>
                      <span className={clsx(classes.icon, 'borderChecked')}>
                        <span className={classes.checkedNotAllIcon} />
                      </span>
                    </>
                  ) : (
                    <span className={clsx(classes.icon, 'borderChecked')} />
                  )}
                />
              </div>
              <div className='actionAttachment'>
                {isShowReplace && (
                  <PermissionProvider action={PERMISSION.INQUIRY_REPLACE_MEDIA}>
                    <div className={'replace'}>
                      <AttachFileList
                        uploadImageAttach={onFileReplaceChange}
                        // mediaIndex={index}
                        isAttachmentList={false}
                        type={'replace'}
                      >
                        <CachedIcon style={{ height: '22px', width: '22px', color: '#BD0F72' }} />
                        <span style={{ fontSize: '15px', marginLeft: '5px', fontWeight: '500', color: '#BD0F72' }}>Replace</span>
                      </AttachFileList>
                    </div>
                  </PermissionProvider>
                )}
                {isShowRemove && (
                  <PermissionProvider action={PERMISSION.INQUIRY_REMOVE_MEDIA}>
                    <div className={'remove'} style={{ display: 'flex', cursor: 'pointer' }}
                      onClick={handleRemove}
                    >
                      <DeleteOutlineIcon style={{ height: '22px', width: '22px', color: '#BD0F72' }} />
                      <span style={{ fontSize: '15px', marginLeft: '5px', fontWeight: '500', color: '#BD0F72' }}>Remove</span>
                    </div>
                  </PermissionProvider>
                )}
              </div>
            </div>
            {isShowConfirm && (
              <div className='dialogConfirm'>
                <p>Are you sure you want to remove these files?</p>
                <div className='btnConfirm'>
                  <Button variant="outlined" style={{ marginRight: 15, textTransform: 'none', fontSize: 16 }} onClick={handleConfirm}>Confirm</Button>
                  <Button variant="outlined" onClick={handleCancel} style={{ textTransform: 'none', fontSize: 16 }}>Cancel</Button>
                </div>
              </div>
            )}
          </>
        )}
        <div className='attachmentList'>
          {attachmentFiles.map((media, index) => {
            const filter = fieldType.filter(v => {
              if (media.id && media.field && media.inquiryId) {
                return media.field === v.value.fieldId && media.inquiryId === v.value.inqId;
              }
            });
            return (
              <div key={index}>
                <div className="flex justify-between">
                  <div className="flex" style={{ alignItems: 'center' }}>
                    <div className='checkboxDetail' style={{ marginRight: '11px' }}>
                      <Checkbox
                        checked={selectedIndexFile.includes(index)}
                        onChange={(e) => handleCheck(e, media, index)}
                        checkedIcon={
                          <>
                            <span className={clsx(classes.icon, 'borderChecked')}>
                              <span className={classes.checkedIcon} />
                            </span>
                          </>
                        }
                        icon={<span className={classes.icon} />}
                      />
                    </div>
                    <div className='flex' style={{ alignItems: 'center' }}>
                      {media.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                        <ImageAttachList file={media} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttachList file={media} />
                      )}
                    </div>
                  </div>
                  <div className={classes.selectField}>
                    <PermissionProvider action={PERMISSION.INQUIRY_INQ_ATT_MEDIA}
                      extraCondition={pathname.includes('/workspace')}
                      fallback={
                        <div style={{ fontSize: '16px', color: '#BD0F72', fontWeight: 600, lineHeight: '20px' }}>
                          {filter?.label}
                        </div>
                      }
                    >
                      {media.field && media.id && media.success &&
                        <CheckCircleOutlineIcon
                          style={{ height: '25px', width: '25px', color: '#36B37E', marginRight: '11px' }} />}
                      {media.success !== null && media.success === false &&
                        <ErrorOutlineIcon
                          style={{ height: '25px', width: '25px', color: '#DC2626', marginRight: '11px' }} />}

                      <FormControl error={!media.field}>
                        <div className={clsx(media.success === false ? classes.selectError : classes.customSelect)} style={{ display: 'flex', alignItems: 'center' }}>
                          <FuseChipSelect
                            className="m-auto selectType"
                            customStyle={styles(media.field, fullscreen ? 320 : 290)}
                            value={filter}
                            onChange={(e) => handleFieldChange(e, index)}
                            placeholder="None"
                            textFieldProps={{
                              variant: 'outlined'
                            }}
                            options={fieldType}
                            maxMenuHeight={200}
                            menuPosition={'fixed'}
                            menuShouldBlockScroll={true}
                          />
                        </div>
                        {!media.field && <FormHelperText style={{ color: 'red' }}>This is required!</FormHelperText>}
                      </FormControl>
                    </PermissionProvider>
                  </div>
                </div>
                {index !== attachmentFiles.length && <Divider className="mt-16 mb-16" style={{ backgroundColor: selectedIndexFile.includes(index) ? '#BD0F72' : '#BAC3CB' }} />}
              </div>
            )
          })}
        </div>
        {isShowBackground && <div className={classes.backgroundConfirm}></div>}
      </div>
    </>
  )
};

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    width: 902,
    display: 'flex',
    padding: '0 24px',
    justifyContent: 'flex-end',
    margin: '10px 0 21px 0'
  },
  styleActionReplace: {
    padding: '2px',
    display: 'flex',
    cursor: 'pointer',
    marginRight: '20px'
  },
}));
const AttachFileList = (props) => {
  const [isShowBackground] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.isShowBackground,
  ]);
  const { uploadImageAttach, children, isAttachmentList, type } = props;
  const classes = useStyles();
  const onDrop = (acceptedFiles) => {
    uploadImageAttach(acceptedFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    multiple: type === 'addNew',
    onDrop,
  });

  const openUploadFile = () => {
    open();
  };

  return (
    <div className={type === 'addNew' ? classes.root : ''}>
      <div {...getRootProps({})}>
        <input {...getInputProps()} disabled={isShowBackground} />
        <div className={isAttachmentList ? classes.styleActionAddMore : classes.styleActionReplace} onClick={openUploadFile}>
          {children}
        </div>
      </div>
    </div>
  )
};


const useStylesImage = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& h2': {
      display: 'block',
      margin: 'auto 1rem',
      cursor: 'pointer'
    }
  },
  fileName: {
    width: "200px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '22px',
    marginLeft: '1rem',
    cursor: 'pointer'
  }
}));
const ImageAttachList = ({ file }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = [file.src];
  const classes = useStylesImage();
  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  const downloadFile = () => {
    getFile(file.id).then((f) => {
      const link = document.createElement('a');
      link.href = urlMedia(file.ext, f);
      link.setAttribute(
        'download',
        file.name,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className={classes.root}>
      <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/image_icon.png`} />
      <Tooltip title={<span style={{ wordBreak: 'break-word' }}>{file.name}</span>}>
        <span className={classes.fileName} onClick={downloadFile}>
          {file.name}
        </span>
      </Tooltip>
      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
};


const useStylesFile = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& h2': {
      display: 'block',
      margin: 'auto 1rem',
      cursor: 'pointer'
    }
  },
  fileName: {
    width: "200px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '22px',
    marginLeft: '1rem',
    cursor: 'pointer'
  }
}));
const FileAttachList = ({ file }) => {
  const classes = useStylesFile();
  const [view, setView] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)

  const downloadFile = () => {
    getFile(file.id).then((f) => {
      const link = document.createElement('a');
      link.href = urlMedia(file.ext, f);
      link.setAttribute(
        'download',
        file.name,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }).catch((error) => {
      console.error(error);
    });
  }
  const handleClose = () => {
    setView(false)
  }

  const previewPDF = () => {
    getFile(file.id).then((f) => {
      setPdfUrl(urlMedia(file.ext, f));
      setView(true)
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className={classes.root}>
      <PDFViewer view={view} handleClose={handleClose} pdfUrl={pdfUrl} name={file.name} />
      {file.ext.toLowerCase().includes("pdf") ?
        <img style={{ height: '25px', width: '25px' }} src={`/assets/images/logos/pdf_icon.png`} />
        :
        (file.ext.toLowerCase().match(/csv|xls|sheet/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/excel_icon.png`} />
          :
          (file.ext.toLowerCase().match(/doc/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/word_icon.png`} />
            :
            <DescriptionIcon />))
      }
      {file.ext.toLowerCase().includes("pdf") ?
        <Tooltip title={<span style={{ wordBreak: 'break-word' }}>{file.name}</span>}>
          <span className={classes.fileName} onClick={previewPDF}>{file.name}</span>
        </Tooltip>
        :
        <Tooltip title={<span style={{ wordBreak: 'break-word' }}>{file.name}</span>}>
          <span className={classes.fileName} onClick={downloadFile}>{file.name}</span>
        </Tooltip>
      }
    </div>
  );
};

const ColoredLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#e8eaf6'
  },
  barColorPrimary: {
    backgroundColor: '#03a9f4'
  }
})(LinearProgress);

export { AttachmentList, AttachFileList };
