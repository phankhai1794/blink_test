import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
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
  const { disable = false } = props;
  const allowCreateParagraphAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_CREATE_PARAGRAPH
  });
  const allowUpdateParagraphAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_UPDATE_PARAGRAPH
  });
  const { question, index } = props;
  const user = useSelector(({ user }) => user);
  
  const [paragraphText, setParagraphText] = useState((user.role === 'Admin' && !["ANS_SENT", "REP_Q_DRF", "REP_A_SENT", "COMPL"].includes(question.state))? "": question.answerObj[0]?.content );

  const classes = useStyles();
  const [isPermission, setPermission] = useState(false);

  const handleChangeInput = (e) => {
    setParagraphText(e.target.value);
    const body = {
      inquiry: question.id,
      content: e.target.value
    };
    props.paragrapAnswer(body);
    props.isDisableSave(false);
  };

  useEffect(() => {
    if (allowUpdateParagraphAnswer && allowUpdateParagraphAnswer && !['ANS_SENT', 'REP_Q_DRF', 'REP_A_SENT', 'COMPL'].includes(question.state) ) {
      setPermission(true);
    } else {
      setPermission(false);
    }
  }, []);

  return (
    <div>
      <div className="flex">
        <TextField
          style={{ border: 'none', display: !isPermission ? (!paragraphText ? 'none' : '') : '' }}
          fullWidth
          placeholder={isPermission ? 'Typing...' : ''}
          classes={{ root: classes.root }}
          disabled={!isPermission || disable}
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
          onChange={handleChangeInput}
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
