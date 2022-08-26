import React from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as AppAction from 'app/store/actions';
import { validateExtensionFile } from '@shared';
import { handleDuplicateAttachment } from '@shared/handleError';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

const AttachFile = (props) => {
  const { disabled, isAnswer, isReply, question, questions, setAttachmentReply } = props;
  const dispatch = useDispatch();
  const [currentEditInq, reply, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.reply
  ]);

  const handleUploadImageAttach = (files) => {
    const inValidFile = files.find((elem) => !validateExtensionFile(elem));
    if (inValidFile) return dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));

    if (isReply) {
      const attachmentReplies = [];
      files.forEach((src) => {
        attachmentReplies.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: src });
      });
      return setAttachmentReply(attachmentReplies);
    }
    else if (isAnswer) {
      const optionsInquires = [...questions];
      const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
      files.forEach((src) => {
        optionsInquires[editedIndex].mediaFilesAnswer.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: src });
      });
      optionsInquires[editedIndex].attachmentAnswer = { inquiry: question.id };
      return dispatch(InquiryActions.setInquiries(optionsInquires));
    }

    const isExist = handleDuplicateAttachment(
      dispatch,
      metadata,
      currentEditInq.mediaFile,
      files,
      currentEditInq.field,
      currentEditInq.inqType
    );
    if (!isExist) {
      if (!currentEditInq.inqType) return dispatch(AppAction.showMessage({ message: 'Type of inquiry is required !', variant: 'error' }));
      const inq = { ...currentEditInq };
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
      dispatch(InquiryActions.setEditInq(inq));
      dispatch(FormActions.setEnableSaveInquiriesList(false));
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop: handleUploadImageAttach
  });

  return (
    <div className="container">
      <div {...getRootProps({})}>
        <input {...getInputProps()} disabled={disabled || false} />
        <IconButton onClick={open} style={{ padding: '2px', height: '40px', width: '40px' }}>
          <Tooltip title="Add Attachment">
            <img style={{ height: "22px" }} src="/assets/images/icons/attach.svg" />
          </Tooltip >
        </IconButton>
      </div>
    </div>
  );
};

export default AttachFile;
