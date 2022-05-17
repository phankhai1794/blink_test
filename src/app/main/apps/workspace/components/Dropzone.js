import React, { useMemo, useEffect , useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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

const imageStyle = {
  width: 'auto',
  height: '100px'
}
//   component
const Dropzone = (props) => {
  const [files, setFiles] = useState(props.fileName || []);
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0].type.includes("image")) {
      setFiles([...files, {file: URL.createObjectURL(acceptedFiles[0]), type: "image" }]);
    }
    else {
      const reader = new FileReader();
      const fileByteArray = [];
      reader.readAsArrayBuffer(acceptedFiles[0]);
      reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
          const arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (const a of array) {
            fileByteArray.push(a);
          }
          const blob = new Blob(fileByteArray,{type: acceptedFiles[0].type});   
          setFiles([...files, {name: acceptedFiles[0].name,file: URL.createObjectURL(blob) , type: "file" }]);
        }
      }
    }
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
          <CloudUploadIcon />
        </Button>
      </div>
      {files && (
        <div style={{ marginTop: '1rem' }} display="flex">
          { files.map((file) => (
            file.ext === "image" ?
              <img
                src={file.file}
                style={imageStyle}
              /> :
              <a download={file.name}
                href={file.file}
           
              >{file.name}</a>
          ))

          }
        </div>
      )}
    </div>
  );
};

export default Dropzone;
