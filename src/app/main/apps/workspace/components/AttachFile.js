import React, { useEffect } from 'react';
import { getFile } from 'app/services/fileService';
import { useDropzone } from 'react-dropzone';
import { IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as AppAction from 'app/store/actions';
import { validateExtensionFile } from '@shared';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

//   component
const AttachFile = (props) => {
  const { index, isQuestion, disabled } = props;
  const questions = useSelector(({ workspace }) => workspace.inquiryReducer.question);
  const dispatch = useDispatch();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const handleUploadImageAttach = (files) => {
    const optionsOfQuestion = [...(isQuestion ? questions : inquiries)];
    const inValidFile = files.find((elem) => !validateExtensionFile(elem));
    if (inValidFile) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      files.forEach((src) => {
        const formData = new FormData();
        formData.append('file', src);
        formData.append('name', src.name);
        optionsOfQuestion[index].mediaFile.push({
          id: null,
          src: URL.createObjectURL(src),
          ext: src.type,
          name: src.name,
          data: formData,
          fileUpload: src
        });
      });
      dispatch(InquiryActions.editInquiry(optionsOfQuestion));
      dispatch(FormActions.setEnableSaveInquiriesList(false));
    }
  };

  const onDrop = (acceptedFiles) => {
    handleUploadImageAttach(acceptedFiles);
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop
  });

  return (
    <div className="container">
      <div {...getRootProps({})}>
        <input {...getInputProps()} disabled={disabled || false} />
        <IconButton onClick={open} style={{ padding: '2px', height: '40px', width: '40px' }}>
          <Tooltip title="Add Attachment">
            <img style={{ height: '22px' }} src="/assets/images/icons/attachment.png" />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

export default AttachFile;
