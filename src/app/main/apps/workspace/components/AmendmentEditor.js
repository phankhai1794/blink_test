import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from 'app/services/fileService';
import { saveEditedField, updateDraftBLReply } from 'app/services/draftblService';
import * as AppActions from 'app/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import UserInfo from './UserInfo';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import AttachFileAmendment from './AttachFileAmendment';

const colorInq = '#DC2626';
const white = '#FFFFFF';
const pink = '#BD0F72';
const greyText = '#999999';

const useStyles = makeStyles((theme) => ({
  btn: {
    width: 120,
    height: 40,
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    margin: theme.spacing(1),
  },
  btnCancel: {
    color: greyText,
    background: white,
    border: `1px solid ${greyText}`
  }
}));

const Amendment = ({ question }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [content, currentField, inquiries, myBL] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.content,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.myBL
  ]);

  const [attachments, setAttachments] = useState(question?.content?.mediaFile || []);
  const [fieldValue, setFieldValue] = useState("");

  const getAttachment = (value) => setAttachments([...attachments, ...value]);

  const removeAttachment = (index) => {
    const optionsAttachmentList = [...attachments];
    optionsAttachmentList.splice(index, 1);
    setAttachments(optionsAttachmentList)
  }

  const handleChange = (e) => setFieldValue(e.target.value);

  const handleSave = () => {
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
        });
        
        let service;
        // if (edit) service = updateDraftBLReply({ content: { content: fieldValue, mediaFile: mediaList } }, question.id);
        service = saveEditedField({ field: currentField, content: { content: fieldValue, mediaFile: mediaList }, mybl: myBL.id });
        service.then(() => {
          dispatch(
            AppActions.showMessage({ message: 'Edit field successfully', variant: 'success' })
          );
          dispatch(InquiryActions.addAmendment());
          dispatch(FormActions.toggleReload());
        }).catch((err) => console.error(err));
      })

    dispatch(InquiryActions.setContent({ ...content, [currentField]: fieldValue }));
    dispatch(FormActions.toggleCreateAmendment(false));
  }

  const handleCancle = () => {
    dispatch(InquiryActions.addAmendment());
    dispatch(FormActions.toggleCreateAmendment(false));
  }

  useEffect(() => {
    setFieldValue(content[currentField]);
  }, [content, currentField])

  return (
    <div style={{ paddingLeft: 18, borderLeft: `2px solid ${colorInq}` }}>
      <p style={{
        color: pink,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '17px',
        padding: '3.5px 10px',
        background: '#FDF2F2',
        borderRadius: 4,
        display: 'inline-block',
        marginTop: 0,
        marginBottom: 15,
      }}>
        AMENDMENT
      </p>
      <div className='flex justify-between'>
        <UserInfo
          name="Customer"
          time=""
          avatar=""
        />
        <AttachFileAmendment setAttachment={getAttachment} />
      </div>
      <div className="flex" style={{ alignItems: 'flex-end', margin: '15px 0' }}>
        <TextField
          fullWidth
          multiline
          rowsMax={4}
          variant="outlined"
          value={fieldValue}
          onChange={handleChange}
        />
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
          // disabled={content[currentField] === fieldValue}
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
        <Button className={clsx(classes.btn, classes.btnCancel)} onClick={handleCancle}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Amendment;