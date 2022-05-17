import React from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton, Icon } from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';
//   component
const AttachFile = (props) => {
  const { uploadImageAttach, index, disabled } = props
  const onDrop = (acceptedFiles) => {
    index || index === 0 ? uploadImageAttach(acceptedFiles[0], index) : uploadImageAttach(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
    multiple: false
  });
  return (
    <div className="container">
      <div {...getRootProps({})}>
        <input {...getInputProps()} disabled={disabled || false} />
        <IconButton onClick={open} style={{ padding: '2px' }}>
        <Icon>attach_file</Icon>
       
        </IconButton>
      </div>
    </div>
  );
};

export default AttachFile;
