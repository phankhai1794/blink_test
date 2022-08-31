import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { saveEditedField } from 'app/services/draftblService';
import { uploadFile } from 'app/services/fileService';
import * as AppActions from 'app/store/actions';
import { displayTime } from '@shared'

import * as Actions from '../store/actions';
import ImageAttach from '../../workspace/components/ImageAttach';
import FileAttach from '../../workspace/components/FileAttach';
import UserInfo from '../../workspace/components/UserInfo';

import AttachFile from "./AttachFile";

const white = '#FFFFFF';
const pink = '#BD0F72';
const greyText = '#999999';

const useStyles = makeStyles((theme) => ({
  btn: {
    width: 120,
    height: 40,
    borderRadius: 8,
    boxShadow: 'none',
    margin: theme.spacing(1),
  },
  btnCancel: {
    color: greyText,
    background: white,
    border: `1px solid ${greyText}`
  }
}));

const BLFieldForm = (props) => {
  const { question } = props
  const classes = useStyles();
  const dispatch = useDispatch();
  const [myBL, currentField, content] = useSelector(({ draftBL }) => [
    draftBL.myBL,
    draftBL.currentField,
    draftBL.content,
  ]);
  const [fieldValue, setFieldValue] = useState(question?.content?.content || content[currentField]);
  const [attachments, setAttachments] = useState(question?.content?.mediaFile || []);

  const getAttachment = (value) => setAttachments([...attachments, ...value]);

  const removeAttachment = (index) => {
    const optionsAttachmentList = [...attachments];
    optionsAttachmentList.splice(index, 1);
    setAttachments(optionsAttachmentList)
  }
  const handleChange = (e) => setFieldValue(e.target.value);

  const handleSave = () => {
    dispatch(Actions.setContent({ ...content, [currentField]: fieldValue }));
    dispatch(Actions.toggleDraftBLEdit(false));

    const uploads = [];
    if (attachments.length) {
      attachments.forEach((file) => {
        if (!file.id) {
          const formData = new FormData();
          formData.append('files', file.data);
          uploads.push(formData);
        }
      });
    }

    axios
      .all(uploads.map((endpoint) => uploadFile(endpoint)))
      .then((files) => {
        const mediaList = attachments.filter((file) => file.id);
        files.forEach((file) => {
          const mediaFileList = file.response.map((item) => { return { id: item.id, ext: item.ext, name: item.name } });
          mediaList.push(mediaFileList[0]);
        })
        saveEditedField({ field: currentField, content: { content: fieldValue, mediaFile: mediaList }, mybl: myBL.id }).then(() => {
          dispatch(
            AppActions.showMessage({ message: 'Edit field successfully', variant: 'success' })
          );
          dispatch(Actions.toggleReload());
        }).catch((err) => console.error(err))
      })
  };

  const handleClose = () => {
    dispatch(Actions.toggleDraftBLEdit(false));
    dispatch(Actions.toggleEditInquiry(false))
  }

  return (
    <>
      {question &&
        <div className='flex justify-between'>
          <UserInfo
            name={question.creator.userName}
            time={displayTime(question.createdAt)}
            avatar={question.creator.avatar}
          />
          <AttachFile setAttachment={getAttachment} />
        </div>
      }
      <div className="flex" style={{ alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          rowsMax={4}
          variant="outlined"
          value={fieldValue}
          onChange={handleChange}
        />
        {!question && <AttachFile setAttachment={getAttachment} />}
      </div>

      {attachments?.map((file, mediaIndex) => (
        <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
          {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
            <ImageAttach file={file} draftBL={true} removeAttachmentDraftBL={() => removeAttachment(mediaIndex)} />)
            : (
              <FileAttach file={file} draftBL={true} removeAttachmentDraftBL={() => removeAttachment(mediaIndex)} />
            )}
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <Button
          className={classes.btn}
          disabled={content[currentField] === fieldValue}
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
        <Button className={clsx(classes.btn, classes.btnCancel)} onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </>
  )
};

export default BLFieldForm;