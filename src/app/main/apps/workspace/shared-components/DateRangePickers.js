import React, { useState } from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useMediaQuery, Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  label: {
    '& label': {
      color: 'black',
      fontSize: '20px',
      fontWeight: '600'
    },
  },
}));

export default function DateRangePickers(props) {
  const classes = useStyles();
  const { time, onChange } = props;

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [active, setActive] = useState(false);

  const openCalendar = () => {
    // setActive(true);
  }

  return (
    <Grid container justify='space-around'>
      <Grid item xs={12} sm={6}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TextField
            label='Select Date'
            onClick={() => openCalendar()}
            value={selectedStartDate}
            onChange={setSelectedStartDate}
            variant='outlined'
            InputProps={{
              inputComponent: KeyboardDatePicker,
              inputProps: {
                format: 'MM/dd/yyyy',
                disableToolbar: true,
                variant: 'inline',
                autoOk: true,
                disablePast: true,
                utils: DateFnsUtils,
              },
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TextField
            label='Select Date'
            onClick={() => openCalendar}
            value={selectedEndDate}
            onChange={setSelectedEndDate}
            variant='outlined'
            InputProps={{
              inputComponent: KeyboardDatePicker,
              inputProps: {
                format: 'MM/dd/yyyy',
                disableToolbar: true,
                variant: 'inline',
                autoOk: true,
                disablePast: true,
                utils: DateFnsUtils,
              },
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );

}
