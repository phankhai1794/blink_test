import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION, PermissionProvider } from "@shared/permission";

import * as InquiryActions from "../store/actions/inquiry";
import * as FormActions from "../store/actions/form";

const useStyles = makeStyles((theme) => ({
  root: {
    borderWidth: 1,
    borderStyle: 'ridge',
    justifyContent: 'center',
    height: "100%",
    width: 165,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#F5F8FA',
    '& img': {
      height: 110,
      width: 110
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
  },
  fontSizeLarge: {
    fontSize: 110
  }
}));

const FileAttach = ({ indexInquiry, file, field, hiddenRemove = false }) => {
  const classes = useStyles();
  const [valid, currentEditInq, attachmentList] =
  useSelector(({ workspace }) => [
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.attachmentList,
  ]);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
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
    const optionsOfQuestion = {...currentEditInq};
    const optionsAttachmentList = [...attachmentList];
    if (field && file.id) {
      const indexMedia = optionsOfQuestion.mediaFile.findIndex(
        (f) => f.id === file.id
      );
      optionsOfQuestion.mediaFile.splice(indexMedia, 1);
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
      if (openInquiryForm) {
        const optionsOfQuestionLocal = {...currentEditInq};
        const indexMedia = optionsOfQuestionLocal.mediaFile.findIndex(
          (f) => f.name === file.name
        );
        optionsOfQuestionLocal.mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(optionsOfQuestionLocal));
      } else {
        const optionsOfQuestionLocal = {...currentEditInq};
        const indexMedia = optionsOfQuestionLocal.mediaFile.findIndex(
          (f) => f.name === file.name
        );
        optionsOfQuestionLocal.mediaFile.splice(indexMedia, 1);
        dispatch(InquiryActions.editInquiry(optionsOfQuestionLocal));
      }
    }
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  return (
    <div className={classes.root}>
      <div style={{ height: 126, textAlign: 'center' }}>
        {file.ext.toLowerCase().includes('pdf') ? (
          <img src={`/assets/images/logos/pdf_icon.png`} />
        ) : file.ext.toLowerCase().match(/csv|xls|xlsx|excel|sheet/g) ? (
          <img src={`/assets/images/logos/excel_icon.png`} />
        ) : file.ext.toLowerCase().match(/doc/g) ? (
          <img src={`/assets/images/logos/word_icon.png`} />
        ) : (
          <DescriptionIcon classes={{ fontSizeLarge: classes.fontSizeLarge }} fontSize='large' />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', height: 30 }}>
        <h3
          style={{ width: hiddenRemove ? 180 : 160 }}
          onClick={file.ext.toLowerCase().includes('pdf') ? previewPDF : downloadFile}
        >
          {file.name}
        </h3>
        {
          !hiddenRemove &&
          <PermissionProvider action={PERMISSION.INQUIRY_REMOVE_MEDIA}>
            <IconButton onClick={() => handleRemoveFile(file)} style={{ padding: 2 }}>
              <CloseIcon />
            </IconButton>
          </PermissionProvider>
        }
      </div>
    </div>
  );
};

export default FileAttach;
