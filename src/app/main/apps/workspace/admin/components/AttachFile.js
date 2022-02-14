import React from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton } from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';
//   component
const AttachFile = (props) => {
  const onDrop = (acceptedFiles) => {
    props.uploadImageAttach(acceptedFiles[0]);
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
        <input {...getInputProps()} disabled={props.disabled || false} />
        <IconButton onClick={open} style={{ padding: '2px' }}>
          <AttachFileIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default AttachFile;
