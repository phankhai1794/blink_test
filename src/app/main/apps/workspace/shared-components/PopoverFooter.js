import React from 'react';
import { Link, Grid, Button } from '@material-ui/core';
import TextsmsIcon from '@material-ui/icons/Textsms';
import SaveIcon from '@material-ui/icons/Save';
const PopoverFooter = ({
  toggleInquiriresDialog,
  prevQuestion,
  nextQuestion,
  forCustomer,
  onSave
}) => {
  return (
    <Grid container style={{ margin: '3rem auto' }}>
      <Grid item xs={5}>
        <Link style={{ fontSize: '16px' }} onClick={toggleInquiriresDialog}>
          Open All Inquiries
        </Link>
      </Grid>
      <Grid item xs={5}>
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
      {/* <Grid item xs={1} style={{ display: "flex", justifyContent: "flex-end" }}>
                <ArrowBackIosIcon />
                <ArrowForwardIosIcon />
            </Grid> */}
      <Grid item xs={2} className="flex justify-end">
        <Button variant="contained" color="primary" onClick={onSave}>
          {' '}
          <SaveIcon /> Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default PopoverFooter;
