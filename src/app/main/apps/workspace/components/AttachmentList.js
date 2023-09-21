import React, { useEffect, useState } from 'react';
import clsx from "clsx";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FormControl, FormHelperText, Button, LinearProgress, Tooltip } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { FuseChipSelect } from "@fuse";
import { validateExtensionFile } from '@shared';
import * as AppAction from "app/store/actions";
import { useDropzone } from "react-dropzone";
import { uploadFile, getFile } from 'app/services/fileService';
import { updateInquiryAttachment, removeMultipleMedia, replaceFile, addNewMedia, loadComment } from 'app/services/inquiryService';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { handleDuplicateAttachment, handleError } from '@shared/handleError';
import { getCommentDraftBl } from "app/services/draftblService";
import Checkbox from "@material-ui/core/Checkbox";
import * as FormActions from 'app/main/apps/workspace/store/actions/form';

import * as InquiryActions from "../store/actions/inquiry";

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
      background: '#ffffff85',
      marginTop: '20px'
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
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const dispatch = useDispatch();
  const [selectedIndexFile, setSelectedIndexFile] = useState([]);
  const [isShowReplace, setShowReplace] = useState(false);
  const [isShowRemove, setShowRemove] = useState(false);
  const [isShowConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAllSelected = attachmentFiles.length > 0 && selectedIndexFile.length === attachmentFiles.length;
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);
  const userType = useSelector(({ user }) => user.role?.toUpperCase());
  const fileRemoveIndex = useSelector(({ workspace }) => workspace.formReducer.fileRemoveIndex);
  
  const styles = (validationAttachment, width) => {
    return {
      control: {
        border: !validationAttachment && '1px solid red',
        borderRadius: '9px',
        width: `${width}px`
      }
    };
  };

  const fetchData = async (url, q) => {
    try {
      const response = await url;
      let reponseMap = [];
      if (response && response.length) {
        reponseMap = response.map(r => {
          return {
            ...r,
            inquiryId: q.id,
            inqType: q.inqType,
            field: q.field,
            process: q.process,
            creator: (r.type === 'INQ' ? 'Admin' : r.updater?.accountRole?.type) || userType
          }
        })
      }
      return reponseMap;
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    let combineFieldType = [];
    let optionInquiries = [...inquiries];
    optionInquiries.forEach((e) => {
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

    axios.all(optionInquiries.map(q => {
      if (q.process === 'pending') return fetchData(loadComment(q.id), q);
      if (q.process === 'draft') return fetchData(getCommentDraftBl(myBL.id, q.field), q);
    })) // TODO: refactor
      .then(res => {
        if (res) {
          if (res.length) {
            let attachFileCount = [];
            let collectAttachment = [];
            res.forEach((r) => {
              collectAttachment = [...collectAttachment, ...r];
            });
            if (collectAttachment.length) {
              collectAttachment = collectAttachment.filter(col => col.latestReply);
              collectAttachment.forEach(col => {
                if (col.process === 'pending') {
                  let mediaMap = [];
                  if (col.type === 'ANS') {
                    mediaMap = [...mediaMap, ...col.answersMedia];
                  } else {
                    mediaMap = [...mediaMap, ...col.mediaFile];
                  }
                  if (mediaMap.length) {
                    mediaMap = mediaMap.map(q => {
                      return {
                        ...q,
                        inquiryId: col.inquiryId,
                        inqType: col.inqType,
                        field: col.field,
                        process: col.process,
                        creator: col.updater?.accountRole?.type || col.creator
                      }
                    })
                  }
                  attachFileCount = [...attachFileCount, ...mediaMap];
                } else if (col.process === 'draft') {
                  const {mediaFile} = col.content;
                  if (col.content && mediaFile.length) {
                    const mediaMap = mediaFile.map(q => {
                      return {
                        ...q,
                        inquiryId: col.inquiryId,
                        inqType: col.inqType,
                        field: col.field,
                        process: col.process,
                        creator: col.role || col.creator
                      }
                    })
                    attachFileCount = [...attachFileCount, ...mediaMap];
                  }
                }
              })
            }
            attachFileCount.sort((a, b) => a.field.localeCompare(b.field));
            combineFieldType.sort((a, b) => a.label.localeCompare(b.label));
            setAttachmentFiles(attachFileCount);
            setFieldType(combineFieldType);
            dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
            setIsLoading(false);
          }
        }
      }).catch(err => {
        console.error(err)
      });
  }, []);

  useEffect(() => {
    if (document.getElementsByClassName('attachmentList')[0].childElementCount > 0) {
      document.querySelectorAll('#no-att span')[0].textContent = document.getElementsByClassName('attachmentList')[0].childElementCount;
    }
  }, [attachmentFiles]);

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
        setAttachmentFiles(merFile);
      }
    }
  }, [props.newFileAttachment]);

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
        formData.append('bkgNo', myBL.bkgNo);
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
            setAttachmentFiles(optionsAttachmentList);
          }).catch((error) => {
            handleError(dispatch, error);
            optionsAttachmentList[index] = {
              ...optionsAttachmentList[index],
              field: 'false',
              success: false,
            };
            setAttachmentFiles(optionsAttachmentList);
          })
        }).catch((error) => {
          handleError(dispatch, error);
          optionsAttachmentList[index] = {
            ...optionsAttachmentList[index],
            field: 'false',
            success: false,
          };
          setAttachmentFiles(optionsAttachmentList);
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
            setAttachmentFiles(optionsAttachmentList);
          }).catch((error) => {
            handleError(dispatch, error);
            optionsAttachmentList[index] = {
              ...media,
              success: false,
            };
            setAttachmentFiles(optionsAttachmentList);
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
        setAttachmentFiles(optionsAttachmentList);
      }
      // update replace
      else {
        const formData = new FormData();
        formData.append('file', file[0]);
        const findInquiry = optionsOfQuestion.find(op => (optionsAttachmentList[attachmentIndex].field === op.field && op.inquiryId === optionsAttachmentList[attachmentIndex].listIdMedia));
        formData.append('bkgNo', myBL.bkgNo);
        uploadFile(formData).then((media) => {
          // update inquiries
          const res = media.response[0];
          let draftAnsId = '';
          listCommentDraft.forEach((draftItem) => {
            if (
              draftItem.field === optionsAttachmentList[attachmentIndex].field &&
              draftItem.content.mediaFile.length > 0
            ) {
              const tempMedia = draftItem.content.mediaFile.filter(
                (f) => f.id === optionsAttachmentList[attachmentIndex].id
              );
              if (tempMedia.length > 0) draftAnsId = draftItem.draftAnswerId || draftItem.id;
            }
          });
          const currentOptionAtt = optionsAttachmentList[attachmentIndex];
          const data = {
            inquiryId: draftAnsId || findInquiry.id,
            oldMediaId: currentOptionAtt.id,
            newMediaId: res.id,
            process: currentOptionAtt.inqType ? 'pending' : 'draft'
          };
          // check duplicated file
          const isExist = handleDuplicateAttachment(
            dispatch,
            metadata,
            optionsAttachmentList,
            [...[res]],
            currentOptionAtt.field,
            findInquiry.inqType
          );
          if(!isExist) {
            replaceFile(data).then(rt => {
              // update attachment list
              const objResponse = {
                id: res.id,
                src: urlMedia(ext, file[0]),
                ext: `.${ext}`,
                name: file[0].name,
                field: optionsAttachmentList[attachmentIndex].field,
                inquiryId: optionsAttachmentList[attachmentIndex].inquiryId,
                creator: userType
              };
              if (findInquiry && findInquiry.mediaFile.length) {
                findInquiry.mediaFile.forEach((f, index) => {
                  if (f.id === optionsAttachmentList[attachmentIndex].id) {
                    findInquiry.mediaFile[index] = objResponse
                  }
                })
              }
              optionsAttachmentList[attachmentIndex] = objResponse;
              setAttachmentFiles(optionsAttachmentList);
            }).catch((error) => {
              handleError(dispatch, error);
              optionsAttachmentList[attachmentIndex] = {
                ...optionsAttachmentList[attachmentIndex],
                success: false,
              };
              setAttachmentFiles(optionsAttachmentList);
            });
          }  
        }).catch((error) => {
          handleError(dispatch, error);
          optionsAttachmentList[attachmentIndex] = {
            ...optionsAttachmentList[attachmentIndex],
            success: false,
          };
          setAttachmentFiles(optionsAttachmentList);
        });
      }
    }
  };

  const handleConfirm = () => {
    const optionsAttachmentList = [...attachmentFiles];
    const optionsInquiries = [...inquiries];
    // update attachment list
    const listIdMedia = [];

    if(fileRemoveIndex !== -1){
      if (optionsAttachmentList[fileRemoveIndex].id !== null) {
        let draftAnsId = '';
        listCommentDraft.forEach(draftItem => {
          if (draftItem.field === optionsAttachmentList[fileRemoveIndex].field && draftItem.content.mediaFile.length > 0) {
            const tempMedia = draftItem.content.mediaFile.filter(f => f.id === optionsAttachmentList[fileRemoveIndex].id);
            if (tempMedia.length > 0) draftAnsId = draftItem.draftAnswerId || draftItem.id;
          }
        })
        listIdMedia.push({ ...optionsAttachmentList[fileRemoveIndex], "draftId": draftAnsId || optionsAttachmentList[fileRemoveIndex].inquiryId });
      }
    }
    selectedIndexFile.forEach(val => {
      if (optionsAttachmentList[val].id !== null) {
        let draftAnsId = '';
        listCommentDraft.forEach(draftItem => {
          if (draftItem.field === optionsAttachmentList[val].field && draftItem.content.mediaFile.length > 0) {
            const tempMedia = draftItem.content.mediaFile.filter(f => f.id === optionsAttachmentList[val].id);
            if (tempMedia.length > 0) draftAnsId = draftItem.draftAnswerId || draftItem.id;
          }
        })
        listIdMedia.push({ ...optionsAttachmentList[val], "draftId": draftAnsId || optionsAttachmentList[val].inquiryId });
      }
    });
    if (listIdMedia.length > 0) {
      removeMultipleMedia({ medias: listIdMedia }).then(res => {
        // update attachment list
        let mediaOther = [];
        let mediaRemove = [];
        optionsAttachmentList.forEach((op, i) => {
          if (!selectedIndexFile.includes(i) && fileRemoveIndex !== i) {
            mediaOther = [...mediaOther, op];
          } else mediaRemove = [...mediaRemove, op.id];
        });
        setAttachmentFiles(mediaOther);
        setSelectedIndexFile([]);
        setShowConfirm(false);
        optionsInquiries.forEach(item => {
          item.mediaFile = item.mediaFile.filter(f => !mediaRemove.includes(f.id));
          item.mediaFilesAnswer = item.mediaFilesAnswer.filter(f => !mediaRemove.includes(f.id));
        });

        dispatch(InquiryActions.setInquiries(optionsInquiries))
        dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
        dispatch(AppAction.showMessage({ message: 'Delete attachment successfully', variant: 'success' }));
        if (mediaOther.length === 0) {
          dispatch(FormActions.toggleAttachment(false));
          dispatch(FormActions.toggleOpenNotificationAttachmentList(true));
        }
      }).catch(err => handleError(dispatch, err));
    } else {
      // update attachment list
      const restMedia = optionsAttachmentList.filter((op, i) => !selectedIndexFile.includes(i));
      setAttachmentFiles(restMedia);
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
    const mediaIndex = [];
    attachmentFiles.forEach((media, index) => userType === media.creator.toUpperCase() && mediaIndex.push(index));
    setSelectedIndexFile(selectedIndexFile.length === attachmentFiles.length ? [] : mediaIndex);
  };

  useEffect(() =>{
    if(fileRemoveIndex != -1){
      dispatch(FormActions.setFileRemoveIndex(-1));
      handleConfirm();
    }
  }, [fileRemoveIndex])

  return (
    <>
      {isLoading ? <ColoredLinearProgress /> : ''}
      <div className={classes.root}>
        {attachmentFiles.length > 0 && attachmentFiles.some(media => userType === media.creator?.toUpperCase()) && (
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
                      {
                        userType === media.creator?.toUpperCase() &&
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
                      }
                    </div>
                    <div className='flex' style={{ alignItems: 'center' }}>
                      {media.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                        <ImageAttachList file={media} files={attachmentFiles} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttachList file={media} files={attachmentFiles} />
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
                            // menuPosition={'fixed'}
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
const ImageAttachList = ({ file, files }) => {
  const classes = useStylesImage();
  const dispatch = useDispatch();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const currentInqPreview = useSelector(({ workspace }) => workspace.formReducer.currentInqPreview);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const downloadFile = () => {
    dispatch(FormActions.toggleOpenPreviewFiles({ openPreviewFiles: true, currentInqPreview: { files: files, file , isEdit: file.inquiryId ? false : true } }));
  }

  return (
    <div className={classes.root}>
      <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/image_icon.png`} />
      <Tooltip title={<span style={{ wordBreak: 'break-word' }}>{file.name}</span>}>
        <span className={classes.fileName} onClick={downloadFile}>
          {file.name}
        </span>
      </Tooltip>
      {isViewerOpen && openPreviewFiles && <PDFViewer inquiry={currentInqPreview} />}
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
const FileAttachList = ({ file, files }) => {
  const classes = useStylesFile();
  const dispatch = useDispatch();
  const [view, setView] = useState(false);
  // const [pdfUrl, setPdfUrl] = useState(null)
  const currentInqPreview = useSelector(({ workspace }) => workspace.formReducer.currentInqPreview);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);

  const previewPDF = () => {
    dispatch(FormActions.toggleOpenPreviewFiles({ openPreviewFiles: true, currentInqPreview: { files: files, file, isEdit: file.inquiryId ? false : true } }));
  }

  return (
    <div className={classes.root}>
      {view && openPreviewFiles && <PDFViewer inquiry={currentInqPreview} />}
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
          <span className={classes.fileName} onClick={previewPDF}>{file.name}</span>
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
