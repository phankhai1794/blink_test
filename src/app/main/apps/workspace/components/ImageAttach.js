import React, { useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { updateInquiryAttachment, addNewMedia, removeFile } from 'app/services/inquiryService';

import * as InquiryActions from '../store/actions/inquiry';

const useStyles = makeStyles((theme) => ({
  root: {
    borderWidth: '1px',
    borderStyle: 'ridge',
    margin: '10px',
    '& img': {
      height: '220px',
      width: '190px',
      objectFit: 'fill'
    },
    '& h3': {
      display: 'block',
      margin: '5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
     
    },
    '& h3:hover': {
      color: '#0000ee'
    }
  }
}));

const ImageAttach = ({ file, field, hiddenRemove = false }) => {
  const [inquiries, metadata, questions, attachmentList, validationAttachment] = useSelector(
    ({ workspace }) => [
      workspace.inquiryReducer.inquiries,
      workspace.inquiryReducer.metadata,
      workspace.inquiryReducer.question,
      workspace.inquiryReducer.attachmentList,
      workspace.inquiryReducer.validationAttachment
    ]
  );
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
      const indexInquiry = optionsOfQuestion.findIndex((op) => field === op.field);
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
      const optionsOfQuestionLocal = [...questions];
      const indexInquiry = optionsOfQuestionLocal.findIndex((op) => field === op.field);
      const indexMedia = optionsOfQuestionLocal[indexInquiry].mediaFile.findIndex(
        (f) => f.name === file.name
      );
      optionsOfQuestionLocal[indexInquiry].mediaFile.splice(indexMedia, 1);
      dispatch(InquiryActions.editInquiry(optionsOfQuestionLocal));
      // update attachment list
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
    }
  };

  return (
    <div className={classes.root}>
      <img src={file.src} onClick={openImageViewer} />
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <h3 style={{width: hiddenRemove?'180px': '160px',}} onClick={downloadFile}>{file.name}</h3>
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
            backgroundColor: 'rgba(0,0,0,0.9)'
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
};

export default ImageAttach;
