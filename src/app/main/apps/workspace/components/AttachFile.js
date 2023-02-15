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
  const { disabled, isAnswer, isReply, question, questions, setAttachmentReply, isUploadFile } = props;
  const dispatch = useDispatch();
  const [currentEditInq, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
  ]);

  const checkDuplicate = (mediaFiles, newMediaFiles) => {
    const attachmentsName = newMediaFiles.map(att => att.name);
    let isExist = false;
    if (mediaFiles.length) {
      isExist = mediaFiles.some(media => attachmentsName.includes(media.name));
    }
    return isExist;
  }

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
      if (optionsInquires[editedIndex].selectChoice) {
        optionsInquires[editedIndex].answerObj.forEach((item, i) => {
          optionsInquires[editedIndex].answerObj[i].confirmed = false;
        });
        const answerIndex = optionsInquires[editedIndex].answerObj.findIndex(item => item.id === optionsInquires[editedIndex].selectChoice.answer);
        const answerUpdate = optionsInquires[editedIndex].answerObj[answerIndex];
        answerUpdate.confirmed = true;
      }
      if (checkDuplicate(optionsInquires[editedIndex].mediaFilesAnswer, files)) {
        dispatch(AppAction.showMessage({
          message: `Duplicate file(s)`,
          variant: 'error'
        }));
        return;
      }
      files.forEach((src) => {
        optionsInquires[editedIndex].mediaFilesAnswer.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: src });
      });
      optionsInquires[editedIndex].attachmentAnswer = { inquiry: question.id };
      props.setIsUploadFile(!isUploadFile);
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
