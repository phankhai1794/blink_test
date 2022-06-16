import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {getFile, uploadFile} from 'app/services/fileService';
import { createAttachmentAnswer } from 'app/services/inquiryService';
import * as AppAction from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import {validateExtensionFile} from "@shared";

import * as FormActions from "../store/actions/form";
import * as InquiryActions from "../store/actions/inquiry";


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
  const { question, index, questions, saveQuestion, isShowBtn, isPermissionAttach } = props;
  const [showBtn, setShowBtn] = useState(false);
  const dispatch = useDispatch();

  const uploadImageAttach = (files) => {
    const optionsOfQuestion = [...questions];
    const inValidFile = files.find(elem => !validateExtensionFile(elem));
    if (inValidFile) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      files.forEach((src) => {
        const formData = new FormData();
        formData.append('file', src);
        formData.append('name', src.name);
        if (optionsOfQuestion[index].answerObj.length === 0) {
          optionsOfQuestion[index].answerObj = [{ mediaFiles: [] }];
        }
        optionsOfQuestion[index].answerObj[0].mediaFiles.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData });
      });
      dispatch(saveQuestion(optionsOfQuestion));
      setShowBtn(true);
    }
  }
  useEffect(() => {
    setShowBtn(isShowBtn);
  }, [isShowBtn]);
  useEffect(() => {
    if (question.answerObj.length > 0 && question.answerObj[0]?.mediaFiles.length > 0) {
      setShowBtn(true);
    }
  }, [question]);
  const onDrop = (acceptedFiles) => {
    if (isPermissionAttach) {
      uploadImageAttach(acceptedFiles);
    }
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
    const mediaRest = [];
    const optionsOfQuestion = [...questions];
    for (const f of optionsOfQuestion[index].answerObj[0]?.mediaFiles) {
      if (f.id === null) {
        const form_data = f.data;
        formData.push(form_data);
      } else {
        mediaRest.push(f.id);
      }
    }
    const questionMap = {
      ansType: question.ansType,
      inqId: question.id,
    }
    axios
      .all(formData.map((endpoint) => uploadFile(endpoint)))
      .then((media) => {
        const mediaList = [];
        media.forEach(file => {
          file.response.forEach(item => {
            mediaList.push(item);
          })
        });
        createAttachmentAnswer({ question: questionMap, mediaFile: mediaList, mediaRest }).then((res) => {
          const { message } = res;
          const answerObjMediaFiles = optionsOfQuestion[index].answerObj[0]?.mediaFiles.filter((q, index) => q.id);
          mediaList.forEach((item, index) => {
            answerObjMediaFiles.push({
              id: item.id,
              name: item.name,
              ext: item.ext,
            })
          });
          optionsOfQuestion[index].answerObj[0].mediaFiles = answerObjMediaFiles;
          dispatch(saveQuestion(optionsOfQuestion));
          dispatch(FormActions.toggleReload());
          dispatch(InquiryActions.setOneInq({}));
          dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
        }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
      }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
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
          <input {...getInputProps()} disabled={!isPermissionAttach} />
          <p>Drag and drop some files here</p>
          <Button
            color="primary"
            variant="contained"
            disabled={!isPermissionAttach}
            onClick={open}
          >
            <PublishIcon />
          </Button>
        </div>
      </div>
      {isPermissionAttach && (
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
