import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, FormControl, FormHelperText, Button, LinearProgress} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ImageViewer from "react-simple-image-viewer";
import {FuseChipSelect} from "@fuse";
import {validateExtensionFile} from '@shared';
import * as AppAction from "app/store/actions";
import {useDropzone} from "react-dropzone";
import {uploadFile, getFile} from 'app/services/fileService';
import {updateInquiryAttachment, removeMultipleMedia, replaceFile} from 'app/services/inquiryService';
import {makeStyles} from "@material-ui/core/styles";
import { PERMISSION, PermissionProvider } from '@shared/permission';
import Checkbox from "@material-ui/core/Checkbox";
import clsx from "clsx";

import * as InquiryActions from "../store/actions/inquiry";

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
    }
  },
}));

const AttachmentList = (props) => {
  const [inquiries, metadata, questions, validationAttachment, isShowBackground] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.validationAttachment,
    workspace.inquiryReducer.isShowBackground,
  ]);
  const { pathname } = window.location;
  const classes = attachmentStyle();
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const [fieldType, setFieldType] = useState(metadata.field_options.filter(meta => inquiries.find(inq => meta.value === inq.field)));
  const [attachmentFiles, setAttachmentFile] = useState([]);
  const dispatch = useDispatch();
  const [listIdMedia, setListIdMedia] = useState([]);
  const [isShowIconSuccess, setShowIconSuccess] = useState();
  const [isShowReplace, setShowReplace] = useState(false);
  const [isShowRemove, setShowRemove] = useState(false);
  const [isShowConfirm, setShowConfirm] = useState(false);
  const isAllSelected = attachmentFiles.length > 0 && listIdMedia.length === attachmentFiles.length;

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
  };

  const urlMedia = (fileExt, file) => {
    if (fileExt.match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  }
  useEffect(() => {
    let getAttachmentFiles = [];
    inquiries.forEach((e) => {
      const mediaFile = e.mediaFile.map((f) => {
        return {
          ...f,
          field: e.field,
          inquiryId: e.id
        };
      });
      getAttachmentFiles = [...getAttachmentFiles, ...mediaFile];
    });
    for (let f in getAttachmentFiles) {
      getFile(getAttachmentFiles[f].id).then((file) => {
        getAttachmentFiles[f].src = urlMedia(getAttachmentFiles[f].ext, file);
        setAttachmentFile(getAttachmentFiles);
      })
    }
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
  }, []);

  const handleFieldChange = (e, index) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentFiles];
    // update inquiries
    const indexInquiryOld = optionsOfQuestion.findIndex(op => optionsAttachmentList[index].field === op.field);
    const indexInquiryNew = optionsOfQuestion.findIndex(op => e.value === op.field);
    const data = {
      newInquiryId: optionsOfQuestion[indexInquiryNew].id,
      oldInquiryId: optionsOfQuestion[indexInquiryOld].id,
      mediaId: optionsAttachmentList[index].id,
    };
    updateInquiryAttachment(data).then(res => {
      // update attachment list
      optionsAttachmentList[index].field = e.value;
      setAttachmentFile(optionsAttachmentList);
    }).catch((error) => console.log(error));
  };

  const onFileReplaceChange = (file) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentFiles];
    if (!validateExtensionFile(file[0])) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      // update replace
      const attachmentIndex = optionsAttachmentList.findIndex(op => op.id === listIdMedia[0]);
      const findInquiry = optionsOfQuestion.find(op => optionsAttachmentList[attachmentIndex].field === op.field);
      const formData = new FormData();
      formData.append('file', file[0]);
      uploadFile(formData).then((media) => {
        //update inquiries
        const res = media.response[0];
        const data = {
          inquiryId: findInquiry.id,
          oldMediaId: listIdMedia[0],
          newMediaId: res.id,
        };
        replaceFile(data).then(rt => {
          //update attachment list
          optionsAttachmentList[attachmentIndex] = {
            id: res.id,
            src: URL.createObjectURL(file[0]),
            ext: file[0].type,
            name: file[0].name,
            field: optionsAttachmentList[attachmentIndex].field,
            inquiryId: optionsAttachmentList[attachmentIndex].inquiryId
          };
          setAttachmentFile(optionsAttachmentList);
          const listId = [res.id];
          setListIdMedia(listId);
        }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
      }).catch((error) => console.log(error));
    }
  };

  const handleConfirm = () => {
    const optionsAttachmentList = [...attachmentFiles];
    removeMultipleMedia({mediaIds: listIdMedia}).then(res => {
      // update attachment list
      const restMedia = optionsAttachmentList.filter(op => !listIdMedia.includes(op.id));
      setAttachmentFile(restMedia);
      setListIdMedia([]);
      setShowConfirm(false);
      dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
    dispatch(InquiryActions.setShowBackgroundAttachmentList(false));
  };

  const handleRemove = () => {
    setShowConfirm(true);
    dispatch(InquiryActions.setShowBackgroundAttachmentList(true));
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

  const handleCheck = (e, media) => {
    const list = [...listIdMedia];
    const index = list.indexOf(media.id);
    index === -1 ? list.push(media.id) : list.splice(index, 1);
    setListIdMedia(list);
  };

  useEffect(() => {
    if (listIdMedia.length > 1) {
      setShowReplace(false);
      setShowRemove(true);
    } else if (listIdMedia.length > 0) {
      setShowReplace(true);
      setShowRemove(true);
    } else if (listIdMedia.length === 0) {
      setShowReplace(false);
      setShowRemove(false)
    }
  }, [listIdMedia]);

  const handleCheckAll = () => {
    const mediaIds = attachmentFiles.map(at => at.id);
    setListIdMedia(listIdMedia.length === attachmentFiles.length ? [] : mediaIds);
  };

  return (
    <>
      {attachmentFiles.length <= 0 ? <ColoredLinearProgress /> : ''}
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
                  icon={(listIdMedia.length > 0 && !isAllSelected) ? (
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
                      <AttachFile
                        uploadImageAttach={onFileReplaceChange}
                        // mediaIndex={index}
                        isAttachmentList={false}
                        type={'replace'}
                      >
                        <CachedIcon style={{ height: '22px', width: '22px', color: '#BD0F72' }} />
                        <span style={{ fontSize: '15px', marginLeft: '5px', fontWeight: '500', color: '#BD0F72' }}>Replace</span>
                      </AttachFile>
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
                  <Button variant="outlined" style={{ marginRight: 15 }} onClick={handleConfirm}>Confirm</Button>
                  <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            )}
          </>
        )}
        <div className='attachmentList'>
          {attachmentFiles.map((media, index) => {
            const filter = fieldType.filter(v => media.field === v?.value)[0];
            const lowerCaseExt = media.ext.toLowerCase();
            return (
              <div key={index}>
                <div className="flex justify-between">
                  <div className="flex" style={{alignItems: 'center' }}>
                    <div className='checkboxDetail' style={{ marginRight: '11px' }}>
                      <Checkbox
                        checked={listIdMedia.includes(media.id)}
                        onChange={(e) => handleCheck(e, media)}
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
                    <div className='flex' style={{alignItems: 'center' }}>
                      {media.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                        <ImageAttachList file={media} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttachList file={media} />
                      )}
                    </div>
                  </div>
                  <div className={'selectField'}>
                    <PermissionProvider action={PERMISSION.INQUIRY_INQ_ATT_MEDIA}
                      extraCondition={pathname.includes('/workspace')}
                      fallback={
                        <div style={{ fontSize: '16px', color: '#BD0F72', fontWeight: 600, lineHeight: '20px' }}>
                          {filter?.label}
                        </div>
                      }
                    >
                      {index === attachmentFiles.length - 1 && (
                        <FormControl error={!validationAttachment.field}>
                          <div className={clsx(classes.customSelect, "selectForm")} style={{ display: 'flex', alignItems: 'center' }}>
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

                          {index === attachmentFiles.length - 1 && !validationAttachment.field && <FormHelperText>This is required!</FormHelperText>}
                        </FormControl>
                      )}
                      {index !== attachmentFiles.length - 1 && (
                        <FormControl>
                          <div className={classes.customSelect}>
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
                          </div>
                        </FormControl>
                      )}
                    </PermissionProvider>
                  </div>
                </div>
                {index !== attachmentFiles.length && <Divider className="mt-16 mb-16" style={{ backgroundColor: listIdMedia.includes(media.id) ? '#BD0F72' : '#BAC3CB' }}/>}
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
    uploadImageAttach(acceptedFiles);
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
    const link = document.createElement('a');
    link.href = file.src;
    link.setAttribute(
      'download',
      file.name,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  return (
    <div className={classes.root}>
      <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/image_icon.png`} />
      <span className={classes.fileName} onClick={downloadFile}>
        {file.name}
      </span>
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
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.src;
    link.setAttribute(
      'download',
      file.name,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const previewPDF = () => {
    window.open(file.src);
  }

  return (
    <div className={classes.root}>
      {file.ext.toLowerCase().includes("pdf") ?
        <img style={{ height: '25px', width: '25px' }} src={`/assets/images/logos/pdf_icon.png`} />
        :
        (file.ext.toLowerCase().match(/csv|xls|sheet/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/excel_icon.png`} />
          :
          (file.ext.toLowerCase().match(/doc/g) ? <img style={{ height: '20px', width: '20px' }} src={`/assets/images/logos/word_icon.png`} />
            :
            <DescriptionIcon />))
      }
      {file.ext.toLowerCase().includes("pdf") ? <span className={classes.fileName} onClick={previewPDF}>{file.name}</span> : <span className={classes.fileName} onClick={downloadFile}>{file.name}</span>}
    </div>
  );
};

const useStylesLinear = () => ({
  colorPrimary: {
    backgroundColor: '#e8eaf6'
  },
  barColorPrimary: {
    backgroundColor: '#03a9f4'
  }
});
const ColoredLinearProgress = () => {
  const classes = useStylesLinear();
  return (
    <LinearProgress
      classes={{
        colorPrimary: classes.colorPrimary,
        barColorPrimary: classes.barColorPrimary
      }}
    />
  );
};

export default AttachmentList;
