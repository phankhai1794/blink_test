import React from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton } from '@material-ui/core';
//   component
const AttachFile = (props) => {
  const { uploadImageAttach, index, disabled } = props
  const onDrop = (acceptedFiles) => {
    index || index === 0 ? uploadImageAttach(acceptedFiles, index) : uploadImageAttach(acceptedFiles);
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
  });
  return (
    <div className="container">
      <div {...getRootProps({})}>
        <input {...getInputProps()} disabled={disabled || false} />
        <IconButton onClick={open} style={{ padding: '2px', height: '40px', width: '40px' }}>
          <img style={{ height: "22px" }} src="/assets/images/icons/attachment.png" />
        </IconButton>
      </div>
    </div>
  );
};

export default AttachFile;
