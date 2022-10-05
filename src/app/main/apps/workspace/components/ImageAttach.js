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
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& h3:hover': {
      color: '#0000ee'
    }
  }
}));

const ImageAttach = ({ indexMedia, file, field, hiddenRemove = false, isAnswer = false, isReply = false, question, questions, templateReply, setTemplateReply, draftBL = false, removeAttachmentDraftBL }) => {
  const [currentEditInq, attachmentList] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.attachmentList
  ]);
  const dispatch = useDispatch();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [srcUrl, setSrcUrl] = useState(file.src || null);
  const [isDeletedFile, setDeletedFile] = useState(false);
  const classes = useStyles();

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
    } else if (!file.id && file.src) {
      setSrcUrl(file.src)
    }
  }, [file]);

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
    const optionsOfQuestion = { ...currentEditInq };
    const optionsAttachmentList = [...attachmentList];

    if (isAnswer) {
      const optionsInquires = [...questions];
      const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
      optionsInquires[editedIndex].attachmentAnswer = { inquiry: question.id };
      optionsInquires[editedIndex].mediaFilesAnswer.splice(indexMedia, 1);
      dispatch(InquiryActions.setInquiries(optionsInquires));
    }
    else if (isReply) {
      const temp = {...templateReply};
      temp.mediaFiles.splice(indexMedia, 1);
      setTemplateReply(temp);
    }
    else if (field && file.id) {
      const indexMedia = optionsOfQuestion.mediaFile.findIndex(
        (f) => f.id === file.id
      );
      optionsOfQuestion.mediaFile.splice(indexMedia, 1);
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
    }
    else if (file.id) {
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
    }
    else {
      const indexMedia = optionsOfQuestion.mediaFile.findIndex(
        (f) => f.name === file.name
      );
      optionsOfQuestion.mediaFile.splice(indexMedia, 1);
    }
    // setDeletedFile(!isDeletedFile);
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
        <Tooltip title={<span style={{ wordBreak: 'break-word' }}>{file.name}</span>}>
          <h3
            style={{ color: '#515F6B', width: hiddenRemove ? '100%' : '80%' }}
            onClick={downloadFile}>
            {file.name}
          </h3>
        </Tooltip>
        {isAnswer && (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_ANSWER_ATTACHMENT}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
        {isReply && (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_UPDATE_REPLY}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
        {!isAnswer && !isReply && (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_UPDATE_INQUIRY}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
        {draftBL &&
          <IconButton onClick={removeAttachmentDraftBL} style={{ padding: 2 }}>
            <CloseIcon />
          </IconButton>
        }
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
