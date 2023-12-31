import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
const useStyles = makeStyles((theme) => ({
  label: {
    '& label': {
      color: 'black',
      fontSize: '20px',
      fontWeight: '600'
    }
  },
  inputTimeDate: {
    textTransform: 'uppercase'
  }
}));

export default function DateTimePickers(props) {
  const classes = useStyles();
  const { time, onChange } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        className={classes.label}
        minDate={'1000-01-01'}
        maxDate={'3000-01-01'}
        id="mui-pickers-date"
        format="dd MMM yyyy"
        onKeyDown={(e) => e.preventDefault()}
        value={time || null}
        onChange={onChange}
        KeyboardButtonProps={{
          'aria-label': 'change date'
        }}
        inputProps={{
          className: classes.inputTimeDate
        }}
        helperText=""
      />
    </MuiPickersUtilsProvider>
  );
}
