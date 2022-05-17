import React, { useMemo , useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Fab } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';

import * as InquiryActions from '../store/actions/inquiry';

import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
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
const AttachmentAnswer = (props) => {
  const { question, user, index, questions, saveQuestion } = props;
  const [name, setName] = useState(question.fileName || '');
  const [showBtn, setShowBtn] = useState(false);
  const dispatch = useDispatch();
  const handleSaveSelectedChoice = () => {
    let savedQuestion = question;
    savedQuestion = {
      ...savedQuestion,
      fileName: name
    };
    setShowBtn(false);
    props.onSaveSelectedChoice(savedQuestion);
  };
  const uploadImageAttach = (files) => {
    const optionsOfQuestion = [...questions];
    files.forEach((src) => {
      const formData = new FormData();
      formData.append('file', src);
      formData.append('name', src.name);
      optionsOfQuestion[index].mediaFile.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData });
    });
    dispatch(saveQuestion(optionsOfQuestion));
  }
  const onDrop = (acceptedFiles) => {
    uploadImageAttach(acceptedFiles);
  }
  const { isDragActive, isDragAccept, isDragReject, getRootProps, getInputProps, open } =
    useDropzone({
      // Disable click and keydown behavior
      noClick: true,
      noKeyboard: true,
      onDrop,
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
    <div>
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
      </div>
      {showBtn && (
        <div className="justify-end flex" style={{ marginTop: '1rem' }}>
          <Button variant="contained" color="primary" onClick={handleSaveSelectedChoice}>
            {' '}
            <SaveIcon />
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttachmentAnswer;
