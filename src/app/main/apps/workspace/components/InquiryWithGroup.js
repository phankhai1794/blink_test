import React from 'react';
import {FormControlLabel, Radio} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  labelDisabled: {
    '&.Mui-disabled': {
      color: '#132535',
    },
  },
  inqGroupRoot: {
    borderTop: '1px solid #0000001c',
    margin: '5px 0px',
    '& .MuiFormControlLabel-root': {
      justifyContent: 'flex-end',
      display: 'flex',
    }
  }
}))

const InquiryWithGroup = ({ inqGroup, role }) => {
  const classes = useStyles();

  return (
    <div className={classes.inqGroupRoot}>
      {/*{role === 'Admin' ? (*/}
      {/*  <FormControlLabel classes={{ label: classes.labelDisabled }} control={<Radio checked disabled style={{ color: '#132535' }} />} label={inqGroup.receiver.includes('customer') ? "Customer" : "Onshore"} />*/}
      {/*) : ``}*/}
      <div style={{ padding: role === 'Admin' ? '10px 0px' : '16px 0px' }}>{inqGroup.content}</div>
    </div>
  );
};

export default InquiryWithGroup;