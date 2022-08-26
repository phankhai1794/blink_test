import React, { useState } from 'react';
import { TextField } from "@material-ui/core";
import { useSelector } from "react-redux";

import AttachFile from "./AttachFile";
import ImageAttach from "./ImageAttach";
import FileAttach from './FileAttach';

const BLFieldForm = (props) => {
  const { files } = props
  const [currentBLField, contentEdit] = useSelector(({ draftBL }) => [
    draftBL.currentBLField,
    draftBL.contentEdit,
  ]);
  const [paragraphText, setParagraphText] = useState(contentEdit[currentBLField] || '');

  const getValueChange = (value) => {
    setParagraphText(value);
    props.getValueFieldChange(value);
  };
  const getAttachment = (value) => {
    props.saveAttachment(value)
  }
  return (
    <>
      <div className="flex" style={{ alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          rowsMax={4}
          variant="outlined"
          value={paragraphText}
          onChange={(e) => getValueChange(e.target.value)}
        />
        <AttachFile setAttachment={getAttachment} />
      </div>
      {files?.map((file, mediaIndex) => (
        <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
          {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
            <ImageAttach file={file} />)
            : (
              <FileAttach file={file} />
            )}
        </div>
      ))}
    </>
  )
};

export default BLFieldForm;