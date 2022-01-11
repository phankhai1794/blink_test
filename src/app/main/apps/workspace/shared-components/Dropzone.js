import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import PublishIcon from '@material-ui/icons/Publish';
import { useState } from 'react';
// style
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

//   component
const Dropzone = (props) => {
  const [name, setName] = useState(props.fileName || '');
  const onDrop = (acceptedFiles) => {
    setName(acceptedFiles[0].path);
  };
  const { isDragActive, isDragAccept, isDragReject, getRootProps, getInputProps, open } =
    useDropzone({
      // Disable click and keydown behavior
      noClick: true,
      noKeyboard: true,
      onDrop,
      multiple: false
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} disabled={props.disabled || false} />
        <p>Drag and drop some files here</p>
        <Button
          color="primary"
          variant="contained"
          disabled={props.disabled || false}
          onClick={open}
        >
          <PublishIcon />
        </Button>
      </div>
      {name !== '' && (
        <div style={{ marginTop: '1rem' }} display="flex">
          <DescriptionIcon />
          <h2 style={{ display: 'inline-block', margin: 'auto 1rem' }}>{name}</h2>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
