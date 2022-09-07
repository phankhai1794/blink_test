import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { validateExtensionFile } from '@shared';
import * as AppAction from 'app/store/actions';

const AttachFile = (props) => {
  const { setAttachment } = props
  const dispatch = useDispatch();

  const handleUploadImageAttach = (files) => {
    const inValidFile = files.find((elem) => !validateExtensionFile(elem));
    if (inValidFile) return dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));

    const attachments = files.map((src) => { return { id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: src } });
    setAttachment(attachments)
  }
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop: handleUploadImageAttach
  });
  return (
    <div className="container">
      <div {...getRootProps({})}>
        <input {...getInputProps()} />
        <IconButton onClick={open} style={{ padding: '2px', height: '40px', width: '40px' }}>
          <Tooltip title="Add Attachment">
            <img style={{ height: '22px' }} src="/assets/images/icons/attach.svg" />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
}

export default AttachFile;
