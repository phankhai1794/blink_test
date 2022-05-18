import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Fab } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { uploadFile } from '../../../../services/fileService';
import { createAttachmentAnswer } from '../../../../services/inquiryService';
import * as FormActions from '../store/actions/form';


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
  const { question, user, index, questions, saveQuestion, isShowBtn } = props;
  const [name, setName] = useState(question.fileName || '');
  const [showBtn, setShowBtn] = useState(false);
  const dispatch = useDispatch();

  const uploadImageAttach = (files) => {
    const optionsOfQuestion = [...questions];
    files.forEach((src) => {
      const formData = new FormData();
      formData.append('file', src);
      formData.append('name', src.name);
      if (optionsOfQuestion[index].answerObj.length > 0) {
        optionsOfQuestion[index].answerObj[0].mediaFiles.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData });
      }
    });
    dispatch(saveQuestion(optionsOfQuestion));
    setShowBtn(true);
  }
  useEffect(() => {
    setShowBtn(isShowBtn);
  }, [isShowBtn]);
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
  const handleSave = () => {
    const formData = [];
    for (const f of question.mediaFile) {
      const form_data = f.data;
      formData.push(form_data);
    }
    const questionMap = {
      ansType: question.ansType,
      inqId: question.id
    }
    axios
      .all(formData.map((endpoint) => uploadFile(endpoint)))
      .then((media) => {
        createAttachmentAnswer({ question: questionMap, mediaFile: media }).then(() => {
          dispatch(FormActions.displaySuccess(true));
        }).catch((error) => dispatch(FormActions.displayFail(true, error)));
      }).catch((error) => dispatch(FormActions.displayFail(true, error)));
  };
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
          <input {...getInputProps()} disabled={user !== 'guest'} />
          <p>Drag and drop some files here</p>
          <Button
            color="primary"
            variant="contained"
            disabled={user !== 'guest'}
            onClick={open}
          >
            <PublishIcon />
          </Button>
        </div>
      </div>
      {showBtn && (
        <div className="justify-end flex" style={{ marginTop: '1rem' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
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
