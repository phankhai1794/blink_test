import React, { useState } from 'react';
import { TextField } from "@material-ui/core";
import { useSelector } from "react-redux";

import AttachFile from "../../workspace/components/AttachFile";

const BLFieldForm = (props) => {
  const [currentBLField, contentEdit] = useSelector(({ draftBL }) => [
    draftBL.currentBLField,
    draftBL.contentEdit,
  ]);
  const [paragraphText, setParagraphText] = useState(contentEdit[currentBLField] || '');

  const getValueChange = (value) => {
    setParagraphText(value);
    props.getValueFieldChange(value);
  };

  return (
    <div className="flex" style={{ alignItems: 'flex-end' }}>
      <TextField
        fullWidth
        multiline
        rowsMax={4}
        variant="outlined"
        value={paragraphText}
        onChange={(e) => getValueChange(e.target.value)}
      />
      <AttachFile />
    </div>
  )
};

export default BLFieldForm;