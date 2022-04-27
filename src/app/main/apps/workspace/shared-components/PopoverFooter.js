import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Grid, Button, IconButton } from '@material-ui/core';
import TextsmsIcon from '@material-ui/icons/Textsms';
import SaveIcon from '@material-ui/icons/Save';
import ReplyIcon from '@material-ui/icons/Reply';
import CheckIcon from '@material-ui/icons/Check';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { saveInquiry, changeStatus } from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { PERMISSION, PermissionProvider } from '@shared';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  }
}));
const PopoverFooter = ({ title, checkValidate }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [index, currentField, question, fields, myBL, displayCmt, valid] = useSelector((state) => [
    state.workspace.inquiryReducer.currentEdit,
    state.workspace.inquiryReducer.currentField,
    state.workspace.inquiryReducer.question,
    state.workspace.inquiryReducer.fields,
    state.workspace.inquiryReducer.myBL,
    state.workspace.inquiryReducer.displayCmt,
    state.workspace.inquiryReducer.validation

  ]);
  const onSave = () => {
    if (!checkValidate(question[index]) || !valid.receiver) return;

    let inquiry = [],
      answer = [],
      inqAns = [],
      inqMedia = [],
      formData = [];
    for (const q of question) {
      const inq_id = uuidv4();
      const inq = {
        id: inq_id,
        content: q.content,
        field: q.field,
        inqType: q.inqType,
        ansType: q.ansType,
        receiver: q.receiver,
        mybl: myBL.id
      };
      for (const f of q.mediaFile) {
        const inq_media = {
          media: f.id,
          inquiry: inq_id
        };
        inqMedia.push(inq_media);
        const form_data = f.data;
        form_data.append('id', f.id);
        formData.push(form_data);
      }
      for (const k of q.answerObj) {
        const ans_id = uuidv4();
        const inq_ans = {
          inquiry: inq_id,
          answer: ans_id,
          confirm: false
        };
        const ans = {
          id: ans_id,
          content: k.content,
          type: q.ansType
        };
        answer.push(ans);
        inqAns.push(inq_ans);
      }
      inquiry.push(inq);
    }
    axios
      .all(formData.map((endpoint) => uploadFile(endpoint)))
      .then(() => {
        saveInquiry({ inquiry, inqAns, answer, inqMedia })
          .then(() => {
            dispatch(Actions.displaySuccess(true));
            dispatch(Actions.saveInquiry());
          })
          .catch((error) => dispatch(Actions.displayFail(true, error)));
      })
      .catch((error) => dispatch(Actions.displayFail(true, error)));
  };
  const toggleInquiriresDialog = () => {
    dispatch(Actions.toggleAllInquiry());
  };
  const onResolve = () => {
    changeStatus(currentField, 'COMPL')
      .then(() => {
        dispatch(Actions.toggleReload());
      })
      .catch((error) => dispatch(Actions.displayFail(true, error)));
  };
  const onReply = () => {
    dispatch(Actions.setReply(true));
  };
  const nextQuestion = () => {
    var temp = fields.indexOf(title);
    if (temp !== fields.length - 1) {
      temp += 1;
    } else {
      temp = 0;
    }
    dispatch(Actions.setField(fields[temp]));
  };
  const prevQuestion = () => {
    var temp = fields.indexOf(title);
    if (temp !== 0) {
      temp -= 1;
    } else {
      temp = fields.length - 1;
    }
    dispatch(Actions.setField(fields[temp]));
  };
  return (
    <Grid container style={{ margin: '3rem auto' }}>
      <Grid item xs={5}>
        {fields.includes(title) && (
          <>
            <Link style={{ fontSize: '16px' }} onClick={toggleInquiriresDialog}>
              Open All Inquiries
            </Link>
            <IconButton onClick={prevQuestion}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={nextQuestion}>
              <NavigateNextIcon />
            </IconButton>
          </>
        )}
      </Grid>

      <Grid item xs={7} className="flex justify-end">
        <PermissionProvider
          action={PERMISSION.RESOLVE_INQUIRY}
          extraCondition={[fields.includes(title), displayCmt]}
        >
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={onResolve}
          >
            <CheckIcon />
            Resolve
          </Button>
        </PermissionProvider>
        <PermissionProvider
          action={PERMISSION.REPLY_INQUIRY}
          extraCondition={[fields.includes(title), displayCmt]}
        >
          <Button variant="contained" className={classes.button} color="primary" onClick={onReply}>
            <ReplyIcon />
            Reply
          </Button>
        </PermissionProvider>
        <PermissionProvider
          action={PERMISSION.SAVE_INQUIRY}
          extraCondition={[!fields.includes(title)]}
        >
          <Button variant="contained" className={classes.button} color="primary" onClick={onSave}>
            {' '}
            <SaveIcon /> Save
          </Button>
        </PermissionProvider>
        <PermissionProvider action={PERMISSION.SAVE_COMMENT}>
          <Button variant="contained" className={classes.button} color="primary">
            {' '}
            <SaveIcon /> Save
          </Button>
        </PermissionProvider>
      </Grid>
    </Grid>
  );
};

export default PopoverFooter;
