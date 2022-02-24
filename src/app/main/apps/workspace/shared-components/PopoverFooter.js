import React, { useState } from 'react';
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
  const fields = useSelector((state) => state.workspace.fields)
  const onSave = () => {
    dispatch(Actions.saveQuestion())
  }
  const toggleInquiriresDialog = () => {
    dispatch(Actions.toggleAllInquiry())
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
              <NavigateBeforeIcon/>
            </IconButton>
            <IconButton onClick={nextQuestion}>
              <NavigateNextIcon/>
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
          <Button variant="contained" className={classes.button} color="primary" onClick={onSave}>
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
