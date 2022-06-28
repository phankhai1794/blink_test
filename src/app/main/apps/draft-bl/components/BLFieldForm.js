import React, {useState} from 'react';
import {makeStyles, TextField} from "@material-ui/core";
import {useSelector} from "react-redux";
import AttachFile from "../../workspace/components/AttachFile";

const useStyles = makeStyles(() => ({
  root: {
    '& h2': {
      color: '#515E6A',
      fontSize: '15px'
    },
    '& .MuiFormControl-root': {
      width: '490px',
    },
    '& .MuiInputBase-root': {
      padding: '16px 14px'
    }
  }
}))

const BLFieldForm = (props) => {
  const classes = useStyles();
  const [content, currentBLField, contentEdit] = useSelector(({ draftBL }) => [
    draftBL.content,
    draftBL.currentBLField,
    draftBL.contentEdit,
  ]);
  const [paragraphText, setParagraphText] = useState(contentEdit[currentBLField] || '');

  const getValueChange = (value) => {
    setParagraphText(value);
    props.getValueFieldChange(value);
  };
    
  return (
    <div className={classes.root}>
      <h2>Please advise the correct BL information</h2>
      <div className="flex" style={{ alignItems: 'center' }}>
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
    </div>
  )
};

export default BLFieldForm;