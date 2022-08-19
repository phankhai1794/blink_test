import ImageViewer from 'react-simple-image-viewer';
import React, { useEffect, useState } from 'react';
import { getFile } from 'app/services/fileService';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION, PermissionProvider } from "@shared/permission";

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '165px',
    height: '100%',
    borderWidth: '1px',
    borderStyle: 'ridge',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    backgroundColor: '#F5F8FA',
    '& h3': {
      display: 'block',
      margin: '5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    '& h3:hover': {
      color: '#0000ee'
    }
  }
}));

const ImageAttach = ({ indexMedia, file, field, hiddenRemove = false, isAnswer = false }) => {
  const [valid, currentEditInq, attachmentList] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.attachmentList
  ]);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const dispatch = useDispatch();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [srcUrl, setSrcUrl] = useState(file.src || null);
  const classes = useStyles();
  const allowUpdateInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_UPDATE_INQUIRY });
  const allowAnswerAttachment = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT });

  const urlMedia = (fileExt, file) => {
    if (fileExt.toLowerCase().match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.toLowerCase().match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  };

  useEffect(() => {
    if (file.id) {
      getFile(file.id)
        .then((f) => {
          setSrcUrl(urlMedia(file.ext, f));
        })
        .catch((error) => console.error(error));
    }
  }, []);
  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = srcUrl;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleRemoveFile = (file) => {
    const inq = { ...currentEditInq };
    const optionsAttachmentList = [...attachmentList];
    if (isAnswer) {
      inq.attachmentAnswer = {inquiry: inq.id};
      if (inq?.mediaFilesAnswer?.length) {
        inq.mediaFilesAnswer.splice(indexMedia, 1);
        dispatch(InquiryActions.setEditInq(inq));
      }
    } else {
      if (field && file.id) {
        const indexMedia = inq.mediaFile.findIndex((f) => f.id === file.id);
        inq.mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(inq));
        // update attachment list
        dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
      } else if (file.id) {
        // update attachment list
        for (var i = 0; i < optionsAttachmentList.length; i++) {
          const item = optionsAttachmentList[i];
          if (file.id && item.id == file.id) {
            optionsAttachmentList.splice(i, 1);
            break;
          }
        }
        dispatch(
          InquiryActions.validateAttachment({
            field: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].field),
            nameFile: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].name)
          })
        );
        dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
      } else {
        // Remove attachment at local
        const inqLocal = { ...currentEditInq };
        const indexMedia = inqLocal.mediaFile.findIndex((f) => f.name === file.name);
        inqLocal.mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(inqLocal));
      }
    }
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };


  return (
    <div className={classes.root}>
      <img
        style={{
          height: '120px',
          width: '100%',
          objectFit: 'cover'
        }}
        src={srcUrl}
        onClick={openImageViewer}
      />
      <div style={{ display: 'flex', height: '30px', flexDirection: 'row' }}>
        <h3
          style={{ color: '#515F6B', width: hiddenRemove ? '100%' : '80%' }}
          onClick={downloadFile}>
          {file.name}
        </h3>
        {isAnswer ? (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_ANSWER_ATTACHMENT}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        ) : (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_UPDATE_INQUIRY}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={[srcUrl]}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
};

export default ImageAttach;
