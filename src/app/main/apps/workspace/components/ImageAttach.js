import React, { useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from "../store/actions/form";

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

const ImageAttach = ({ indexInquiry, file, field, hiddenRemove = false }) => {
  const inquiries = useSelector(({ workspace }) =>
    workspace.inquiryReducer.inquiries
  );
  const questions = useSelector(({ workspace }) =>
    workspace.inquiryReducer.question
  );
  const attachmentList = useSelector(({ workspace }) =>
    workspace.inquiryReducer.attachmentList
  );
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const dispatch = useDispatch();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = [file.src];
  const classes = useStyles();
  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.src;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleRemoveFile = (file) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentList];
    if (field && file.id) {
      const indexMedia = optionsOfQuestion[indexInquiry].mediaFile.findIndex(
        (f) => f.id === file.id
      );
      optionsOfQuestion[indexInquiry].mediaFile.splice(indexMedia, 1);
      dispatch(InquiryActions.editInquiry(optionsOfQuestion));
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
      if (openInquiryForm) {
        const optionsOfQuestionLocal = [...questions];
        const indexMedia = optionsOfQuestionLocal[indexInquiry].mediaFile.findIndex(
          (f) => f.name === file.name
        );
        optionsOfQuestionLocal[indexInquiry].mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(optionsOfQuestionLocal));
      } else {
        const optionsOfQuestionLocal = [...inquiries];
        const indexMedia = optionsOfQuestionLocal[indexInquiry].mediaFile.findIndex(
          (f) => f.name === file.name
        );
        optionsOfQuestionLocal[indexInquiry].mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(optionsOfQuestionLocal));
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
        src={file.src}
        onClick={openImageViewer}
      />
      <div style={{ display: 'flex', height: '30px', flexDirection: 'row' }}>
        <h3 style={{ color: '#515F6B', width: hiddenRemove ? '100%' : '80%' }} onClick={downloadFile}>
          {file.name}
        </h3>
        {!hiddenRemove && (
          <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: '2px' }}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={images}
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
