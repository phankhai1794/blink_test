import React, { useState, useEffect } from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION, PermissionProvider } from "@shared/permission";
import { getFile } from 'app/services/fileService';
import { getSrcFileIcon } from '@shared';

import * as InquiryActions from "../store/actions/inquiry";
import * as FormActions from "../store/actions/form";

import PDFViewer from './PDFViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    backgroundColor: '#F5F8FA',
    '&:first-child': {
      marginLeft: 0
    },
    '& img': {
      height: 110,
      width: 165
    },
    '& h3': {
      display: 'block',
      margin: '5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& h3:hover': {
      color: '#0000ee'
    }
  },
  fontSizeLarge: {
    fontSize: 110
  },
  overAttachment: {
    fontSize: '60px',
    fontFamily: 'Montserrat',
    color: 'White',
    fontWeight: '600',
    lineHeight: '73.14px',
    position: 'absolute',
    width: '70px',
    height: '73px',
    left: '20%',
    top: '18%',
    background: 'none',
    border: 'none'
  },
  backgroupOverFile: {
    position: 'absolute',
    background: 'rgba(19, 37, 53, 0.6)',
    width: 166,
    height: 141,
    zIndex: 11
  }
}));

const FileAttach = ({
  indexMedia,
  file,
  files,
  field,
  hiddenRemove = false,
  isAnswer = false,
  isReply = false,
  questions,
  question,
  templateReply,
  setTemplateReply,
  draftBL = false,
  removeAttachmentDraftBL,
  isRemoveFile,
  setIsRemoveFile
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [attachmentList, currentEditInq, enableExpandAttachment] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.attachmentList,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.enableExpandAttachment,
  ]);
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);

  const [srcUrl, setSrcUrl] = useState(file.src || null);

  const urlMedia = (fileExt, file) => {
    if (fileExt.toLowerCase().match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.toLowerCase().match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  };

  useEffect(() => {
    if (file.id) {
      getFile(file.id)
        .then((f) => {
          setSrcUrl(urlMedia(file.ext, f));
        })
        .catch((error) => console.error(error));
    } else if (file.src) {
      setSrcUrl(file.src);
    }
  }, [file]);

  const previewFile = () =>
    dispatch(FormActions.toggleOpenPreviewFiles({ openPreviewFiles: true, currentInqPreview: { files: files, file } }));

  const handleRemoveFile = (id) => {
    const optionsOfQuestion = { ...currentEditInq };
    const optionsAttachmentList = [...attachmentList];

    if (isAnswer) {
      const optionsInquires = [...questions];
      const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
      optionsInquires[editedIndex].attachmentAnswer = { inquiry: question.id };
      let indexMediaFile = indexMedia;
      if (file.id) {
        indexMediaFile = optionsInquires[editedIndex].mediaFilesAnswer.findIndex(m => file.id === m.id);
      }
      optionsInquires[editedIndex].mediaFilesAnswer.splice(indexMediaFile, 1);
      dispatch(InquiryActions.setInquiries(optionsInquires));
      setIsRemoveFile(!isRemoveFile);
    }
    else if (isReply) {
      const temp = { ...templateReply };
      temp.mediaFiles.splice(indexMedia, 1);
      setTemplateReply(temp)
    }
    else if (field && file.id) {
      const indexMedia = optionsOfQuestion.mediaFile.findIndex(
        (f) => f.id === file.id
      );
      optionsOfQuestion.mediaFile.splice(indexMedia, 1);
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
    }
    else if (file.id) {
      // update attachment list
      for (var i = 0; i < optionsAttachmentList.length; i++) {
        const item = optionsAttachmentList[i];
        if (file.id && item.id == file.id) {
          optionsAttachmentList.splice(i, 1);
          break;
        }
      }
      dispatch(
        InquiryActions.validateAttachment({
          field: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].field),
          nameFile: Boolean(optionsAttachmentList[optionsAttachmentList.length - 1].name)
        })
      );
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
    }
    else {
      const indexMedia = optionsOfQuestion.mediaFile.findIndex(
        (f) => f.name === file.name
      );
      optionsOfQuestion.mediaFile.splice(indexMedia, 1);
    }

    dispatch(FormActions.setEnableSaveInquiriesList(false));
  }

  const handleExpand = () => {
    dispatch(InquiryActions.setExpand([...enableExpandAttachment, question.id]));
  }

  const srcFile = getSrcFileIcon(file);

  const indexNumberExpand = fullscreen ? 5 : 4;

  return (
    <div
      className={classes.root}
      style={{ display: (question && !enableExpandAttachment.includes(question.id) && indexMedia > indexNumberExpand) ? 'none' : 'block' }}>
      {(question && !enableExpandAttachment.includes(question.id) && indexMedia === indexNumberExpand && files.length > indexNumberExpand + 1) &&
        <div className={classes.backgroupOverFile}>
          <button className={classes.overAttachment} onClick={handleExpand} >
            +{files.length - indexNumberExpand}
          </button>
        </div>
      }
      <div style={{ border: '1px solid #BAC3CB', borderRadius: '4px 4px 0px 0px', width: '165px', height: '110px' }}>
        {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
          <img
            style={{
              position: 'relative',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%'
            }}
            src={srcUrl}
            onClick={previewFile}
            onDragStart={(event) => event.preventDefault()}
          />
        ) : (
          srcFile ? (
            <img
              style={{
                position: 'relative',
                top: '14%',
                left: '14%',
                height: '75%',
                width: '75%'
              }}
              src={srcFile} onClick={previewFile}
            />
          ) : (
            <DescriptionIcon
              fontSize='large'
              classes={{ fontSizeLarge: classes.fontSizeLarge }}
              style={{
                position: 'relative',
                top: '14%',
                left: '14%',
                height: '75%',
                width: '75%'
              }}
              onClick={previewFile}
              onDragStart={(event) => event.preventDefault()}
            />
          )
        )
        }
      </div>

      <div style={{ display: 'flex', width: 165, height: 27, flexDirection: 'row', border: '1px solid #BAC3CB', borderRadius: '0px 0px 4px 4px' }}>
        {srcFile ?
          (<img style={{ width: 17, height: 17, padding: '7px 2px' }} src={srcFile} onClick={previewFile} />)
          : (
            (file.ext.toLowerCase().match(/jpeg|jpg|png/g) ?
              <img src={'/assets/images/logos/image_icon.png'} style={{ width: 16, height: 15, padding: '7px 2px' }} />
              : <DescriptionIcon style={{ width: 17, height: 17, padding: '7px 2px' }} onClick={previewFile} />)
          )
        }
        <Tooltip title={<span style={{ wordBreak: 'break-word' }}>{file.name}</span>}>
          <h3
            style={{ fontSize: '14px', color: '#515F6B', width: hiddenRemove ? '100%' : '80%' }}
            onClick={previewFile}>
            {file.name}
          </h3>
        </Tooltip>
        {isAnswer && (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_ANSWER_ATTACHMENT}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
        {isReply && (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_UPDATE_REPLY}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
        {!isAnswer && !isReply && (
          !hiddenRemove && (
            <PermissionProvider
              action={PERMISSION.INQUIRY_UPDATE_INQUIRY}>
              <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
                <CloseIcon />
              </IconButton>
            </PermissionProvider>
          )
        )}
        {draftBL &&
          <IconButton onClick={removeAttachmentDraftBL} style={{ padding: 2 }}>
            <CloseIcon />
          </IconButton>
        }
      </div>
    </div>
  );
};

export default FileAttach;
