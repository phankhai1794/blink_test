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
import { saveInquiry, changeStatus } from '../api/inquiry';
import { uploadFile } from '../api/file';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));
const PopoverFooter = ({
  title,
  forCustomer,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [currentField, question, fields, myBL] = useSelector((state) => [
    state.workspace.currentField, state.workspace.question, state.workspace.fields, state.workspace.myBL])
  const onSave = () => {
    let inquiry = [], answer = [], inqAns = [], inqMedia = [], formData = []
    for (const q of question) {
      const inq_id = uuidv4()
      const inq = {
        id: inq_id,
        content: q.content,
        field: q.field,
        inqType: q.inqType,
        ansType: q.ansType,
        receiver: q.receiver,
        mybl: myBL.id
      }
      for (const f of q.files) {
        const media_id = uuidv4()
        const inq_media = {
          media: media_id,
          inquiry: inq_id
        }
        inqMedia.push(inq_media)
        const form_data = f.data
        form_data.append("id", media_id)
        formData.push(form_data)
      }
      for (const k of q.choices) {
        const ans_id = uuidv4()
        const inq_ans = {
          inquiry: inq_id,
          answer: ans_id,
          confirm: false,
        }
        const ans = {
          id: ans_id,
          content: k,
          type: q.ansType,
        }
        answer.push(ans)
        inqAns.push(inq_ans)
      }
      inquiry.push(inq)
    }
    axios.all(formData.map((endpoint) => uploadFile(endpoint))).then(() => {
      saveInquiry({ inquiry, inqAns, answer, inqMedia }).then(() => {
        dispatch(Actions.displaySuccess(true))
        dispatch(Actions.saveInquiry())
      }).catch(error => dispatch(Actions.displayFail(true, error)))
    }).catch(error => dispatch(Actions.displayFail(true, error)))
  }
  const toggleInquiriresDialog = () => {
    dispatch(Actions.toggleAllInquiry())
  }
  const onResolve = () => {
    changeStatus(currentField, "COMPL").then(() => {
      dispatch(Actions.toggleReload())
    }).catch(error => dispatch(Actions.displayFail(true, error)))
  }
  const onReply = () => {
    dispatch(Actions.setReply(true))
  }
  const nextQuestion = () => {
    var temp = fields.indexOf(title)
    if (temp !== fields.length - 1) {
      temp += 1
    }
    else {
      temp = 0
    }
    dispatch(Actions.setField(fields[temp]))
  }
  const prevQuestion = () => {
    var temp = fields.indexOf(title)
    if (temp !== 0) {
      temp -= 1
    }
    else {
      temp = fields.length - 1
    }
    dispatch(Actions.setField(fields[temp]))
  }
  return (
    <Grid container style={{ margin: '3rem auto' }}>
      <Grid item xs={5}>
        <Link style={{ fontSize: '16px' }} onClick={toggleInquiriresDialog}>
          Open All Inquiries
        </Link>
        {fields.includes(title) ?
          <>
            <IconButton onClick={prevQuestion}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={nextQuestion}>
              <NavigateNextIcon />
            </IconButton>
          </> : null
        }
      </Grid>
      <Grid item xs={3}>
        {forCustomer && (
          <Grid container direction="row">
            <Grid item>
              <TextsmsIcon />
            </Grid>
            <Grid item>
              <h2 style={{ margin: '0', fontSize: '16px' }}>Leave a comment</h2>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid item xs={4} className="flex justify-end">
        {fields.includes(title) ?
          <>
            <Button variant="contained" className={classes.button} color="primary" onClick={onResolve}>
              <CheckIcon />
              Resolve
            </Button>
            <Button variant="contained" className={classes.button} color="primary" onClick={onReply}>
              <ReplyIcon />
              Reply
            </Button>

          </> :
          <Button variant="contained" className={classes.button} color="primary" onClick={onSave}>
            {' '}
            <SaveIcon /> Save
          </Button>
        }

      </Grid>
    </Grid>
  );
};

export default PopoverFooter;
