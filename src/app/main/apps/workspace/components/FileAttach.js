import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import * as InquiryActions from "../store/actions/inquiry";

const useStyles = makeStyles((theme) => ({
  root: {
    borderWidth: '1px',
    borderStyle: 'ridge',
    justifyContent: 'center',
    height: "100%",
    width: '165px',
    marginBottom: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    backgroundColor: '#F5F8FA',
    '& img': {
      height: '50px',
      width: '50px'
    },
    '& h3': {
      display: 'block',
      margin: 'auto 1rem',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',

    },
    '& h3:hover': {
      color: '#0000ee'
    }
  }
}));

const FileAttach = ({ indexInquiry, file, field, hiddenRemove = false }) => {
  const classes = useStyles();
  const [inquiries, metadata, questions, attachmentList, validationAttachment] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.attachmentList,
    workspace.inquiryReducer.validationAttachment,
  ]);
  const dispatch = useDispatch();
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.src;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const previewPDF = () => {
    window.open(file.src);
  };
  const handleRemoveFile = (id) => {
    const optionsOfQuestion = [...inquiries];
    const optionsAttachmentList = [...attachmentList];
    if (field && file.id) {
      const indexMedia = optionsOfQuestion[indexInquiry].mediaFile.findIndex(
        (f) => f.id === file.id
      );
      optionsOfQuestion[indexInquiry].mediaFile.splice(indexMedia, 1);
      dispatch(InquiryActions.editInquiry(optionsOfQuestion));
      // update attachment list
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));

    } else if (file.id) {
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
    } else {
      // Remove attachment at local
      const optionsOfQuestionLocal = [...questions];
      const indexMedia = optionsOfQuestionLocal[indexInquiry].mediaFile.findIndex(
        (f) => f.name === file.name
      );
      optionsOfQuestionLocal[indexInquiry].mediaFile.splice(indexMedia, 1);
      dispatch(InquiryActions.editInquiry(optionsOfQuestionLocal));
      // update attachment list
      dispatch(InquiryActions.setListAttachment(optionsAttachmentList));
    }
  };

  return (
    <div className={classes.root}>
      {file.ext.toLowerCase().includes('pdf') ? (
        <img src={`/assets/images/logos/pdf_icon.png`} />
      ) : file.ext.toLowerCase().match(/csv|xls|xlsx|excel|sheet/g) ? (
        <img src={`/assets/images/logos/excel_icon.png`} />
      ) : file.ext.toLowerCase().match(/doc/g) ? (
        <img src={`/assets/images/logos/word_icon.png`} />
      ) : (
        <DescriptionIcon />
      )}
      <div style={{ display: 'flex', flexDirection: 'row', }}>
        {file.ext.toLowerCase().includes('pdf') ? (
          <h3 style={{ width: hiddenRemove ? '180px' : '160px' }} onClick={previewPDF}>{file.name}</h3>
        ) : (
          <h3 style={{ width: hiddenRemove ? '180px' : '160px' }} onClick={downloadFile}>{file.name}</h3>
        )}
        {
          !hiddenRemove &&
          <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: '2px' }}>
            <CloseIcon />
          </IconButton>
        }
      </div>
    </div>
  );
};

export default FileAttach;
