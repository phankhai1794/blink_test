import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { PERMISSION, PermissionProvider } from '@shared/permission';


import UserInfo from './UserInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root.MuiButton-contained': {
      position: 'absolute',
      right: '6px',
      bottom: '5px'
    },
    '& .MuiInputBase-input': {
      width: '93%'
    }
  }
}));

const ParagraphAnswer = (props) => {
  const allowCreateParagraphAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_CREATE_PARAGRAPH
  });
  const allowUpdateParagraphAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_UPDATE_PARAGRAPH
  });
  const { question, index, questions } = props;
  const [paragraphText, setParagraphText] = useState(question.answerObj[0]?.content || '');

  const classes = useStyles();
  const [isPermission, setPermission] = useState(false);

  useEffect(() => {
    if (questions) {
      if (
        (!questions[index]?.answerObj[0]?.id && allowCreateParagraphAnswer) ||
        (questions[index]?.answerObj[0]?.id && allowUpdateParagraphAnswer)
      ) {
        setPermission(true);
      } else {
        setPermission(false);
      }
    }
  }, [questions]);

  return (
    <div>
      <div className="flex">
        <TextField
          style={{ border: 'none' }}
          fullWidth
          placeholder={isPermission ? 'Customer Input' : ''}
          classes={{ root: classes.root }}
          disabled={!isPermission}
          InputProps={{
            style: {
              fontSize: '1.7rem'
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: '1.7rem'
            }
          }}
          id="outlined-multiline-flexible"
          multiline
          rowsMax={4}

          value={paragraphText}
          onChange={(e) => setParagraphText(e.target.value)}
        />
      </div>
      {question.selectedChoice && (
        <div style={{ marginTop: '1rem' }}>
          <UserInfo name="Anrew" date="today" time="10:50PM" />
          <TextField
            value={question.selectedChoice}
            disabled
            style={{ margin: '1rem 5rem' }}
            multiline
            variant="outlined"
            inputProps={{
              style: { color: 'black' }
            }}
          />
          {/* <h3 style={{ margin: "1rem 2rem" }}>{question.selectedChoice}</h3> */}
        </div>
      )}
    </div>
  );
};

export default ParagraphAnswer;
