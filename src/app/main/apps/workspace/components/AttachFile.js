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
  const { index, isQuestion, disabled, isAnswer, inqIndex } = props;
  const dispatch = useDispatch();
  const [valid, currentEditInq] =
  useSelector(({ workspace }) => [
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.currentEditInq
  ]);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const handleUploadImageAttach = (files) => {
    const inValidFile = files.find((elem) => !validateExtensionFile(elem));
    if (inValidFile) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      if (!isAnswer) {
        const inq = {...currentEditInq};
        files.forEach((src) => {
          const formData = new FormData();
          formData.append('file', src);
          formData.append('name', src.name);
          inq.mediaFile.push({
            id: null,
            src: URL.createObjectURL(src),
            ext: src.type,
            name: src.name,
            data: formData,
            fileUpload: src
          });
        });
        dispatch(InquiryActions.editInquiry(inq));
        dispatch(FormActions.setEnableSaveInquiriesList(false));
      } else {
        const optionsOfQuestion = [...inquiries];
        files.forEach((src) => {
          const formData = new FormData();
          formData.append('file', src);
          formData.append('name', src.name);
          if (optionsOfQuestion[inqIndex].answerObj.length === 0) {
            optionsOfQuestion[inqIndex].answerObj = [{ mediaFiles: [] }];
          }
          optionsOfQuestion[inqIndex].answerObj[0].mediaFiles.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData });
        });
        dispatch(InquiryActions.setInquiries(optionsOfQuestion));
      }
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
            <img style={{ height: "22px" }} src="/assets/images/icons/paperclip.svg" />
          </Tooltip >
        </IconButton>
      </div>
    </div>
  );
};

export default AttachFile;
