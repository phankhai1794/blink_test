import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Paper, Select, MenuItem, Input, Checkbox, ListItemText, Chip, Grid } from '@material-ui/core';
// import Slide from '@material-ui/core/Slide';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import SearchIcon from '@material-ui/icons/Search';
import { formatDate } from '@shared';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from "moment";
import { mapperBlinkStatus } from '@shared/keyword'

import QueueListTable from './QueueListTable';
const useStyles = makeStyles((theme) => ({
  headerPopup: {
    borderBottom: '1px solid #8A97A3',
    '& h6': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Montserrat',
    },
  },
  bodyPopup: {
    backgroundColor: '#FFF9F9'
  },
  btn: {
    textTransform: 'none',
    backgroundColor: '#BD0F72',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#BD0F73'
    }
  },
  btnSearch: {
    color: '#FFFF',
    fontFamily: 'Montserrat'
  },
  closeBtn: {
    cursor: 'pointer',
  },
  popupContent: {
    '& .MuiDialog-paper': {
      margin: '0px'
    }
  },
  paper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '24px',
    '& span': {
      fontFamily: 'Montserrat',
      fontSize: '13px',
    },
    '& input': {
      fontFamily: 'Montserrat',
      fontSize: '14px',
    },
  },
  searchBox: {
    height: '40px',
  },
  btnReset: {
    textTransform: 'none',
    fontFamily: 'Montserrat',
    color: '#BD0F72',
  },
  selectStatus: {
    // minWidth: '285px',
    '& :focus': {
      backgroundColor: 'transparent'
    }
  },
  chips: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  chip: {
    backgroundColor: '#E2E6EA',
    borderRadius: '4px',
    height: '24px',
    margin: 2,
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#FDF2F2',
    },
  },
  menuItemSelected: {
    backgroundColor: '#FDF2F2 !important',
  },
  grid: {
    '& .MuiGrid-grid-xs-4': {
      flexBasis: '30%',
      maxWidth: '30%'
    },
    '& .MuiGrid-grid-xs-2': {
      flexBasis: '16%',
      maxWidth: '16%'
    },
    '& .MuiGrid-grid-xs-1': {
      flexBasis: '13%',
      maxWidth: '13%'
    }
  }
}));

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction='up' ref={ref} {...props} />;
// });
const WEEK_NUMBER = 7;

const QueueList = () => {
  // const classes = useStyles();
  // const dispatch = useDispatch();
  // const openQueueList = useSelector(({ workspace }) => workspace.inquiryReducer.openQueueList);

  // const handleClose = () => dispatch(InquiryActions.openQueueList(false));

  return (
    <>
      <SearchLayout />
      <QueueListTable />
    </>
  );
};

const SearchLayout = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({ bookingNo: '', from: '', to: '', blStatus: [], isSelectedAll: false })
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    let currentDate = new Date();
    let sevenDayBefore = formatDate(currentDate.setDate(currentDate.getDate() - WEEK_NUMBER), 'YYYY-MM-DD');
    setState({ ...state, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD') })
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD') }));
  }, [])

  const blStatusOption = Object.values(mapperBlinkStatus);

  const handleSelectStatus = (event) => {
    let values = event.target.value;
    const arrStatus = [];
    if ((values.indexOf('All') !== -1) && (selectedStatus.indexOf('All') === -1)) {
      setSelectedStatus([...blStatusOption, 'All']);
      setState({ ...state, blStatus: Object.keys(mapperBlinkStatus) })
    } else if ((values.indexOf('All') === -1) && (selectedStatus.indexOf('All') !== -1)) {
      setSelectedStatus([]);
      setState({ ...state, blStatus: '' })
    } else {
      const arrSelected = [];
      values.forEach(item => {
        if (item !== 'All') {
          arrStatus.push(Object.keys(mapperBlinkStatus).find(key => mapperBlinkStatus[key] === item));
          arrSelected.push(item);
        }
      });
      setSelectedStatus(arrSelected);
      setState({ ...state, blStatus: arrStatus })
    }
  };

  const handleChange = (query) => {
    setState({ ...state, ...query });
  }

  const handleSearch = () => {
    let blStatus = state.blStatus;
    if (state.blStatus.indexOf() !== -1) {
      blStatus = blStatus.splice(blStatus.indexOf(), 1);
    }
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...state }));
  }

  const handleReset = (e) => {
    let currentDate = new Date();
    let sevenDayBefore = formatDate(currentDate.setDate(currentDate.getDate() - WEEK_NUMBER), 'YYYY-MM-DD');
    let query = { bookingNo: '', currentPageNumber: 1, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD'), blStatus: [], sortField: '' };

    setState({ ...query, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD') })
    setSelectedStatus([]);
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...query }));
  }

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={1} className={classes.grid}>
        {/* Booking Number */}
        <Grid item xs={4}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>
              <span>Booking Number</span>
            </InputLabel>
            <OutlinedInput
              value={state.bookingNo}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              onChange={(e) => handleChange({ bookingNo: e.target.value })}
              startAdornment={<InputAdornment className={classes.searchBox} position='start' >{''}</InputAdornment>}
              labelWidth={110}
            />
          </FormControl>
        </Grid>
        {/* From */}
        <Grid item xs={2}>
          <FormControl fullWidth variant='outlined'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputVariant="outlined"
                label="From"
                disableToolbar
                variant="inline"
                format="MMM - dd - yyyy"
                value={state.from}
                onChange={(date) => handleChange({ from: moment(date).format("YYYY-MM-DD") })}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
        {/* To */}
        <Grid item xs={2}>
          <FormControl fullWidth variant='outlined'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputVariant="outlined"
                label="To"
                disableToolbar
                variant="inline"
                format="MMM - dd - yyyy"
                value={state.to}
                onChange={(date) => handleChange({ to: moment(date).format("YYYY-MM-DD") })}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
        </Grid>
        {/* BL Status */}
        <Grid item xs={3}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel htmlFor='selected-status'>BLink Status</InputLabel>
            <OutlinedInput
              onChange={(e) => handleChange({ blStatus: e.target.value })}
              inputProps={{
                style: { width: 0 }
              }}
              startAdornment={
                <Select
                  className={classes.selectStatus}
                  multiple
                  value={selectedStatus}
                  onChange={handleSelectStatus}
                  input={<Input style={{ width: '100%' }} />}
                  renderValue={(selected) =>
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        (value !== 'All') && <Chip key={value} label={value} className={classes.chip} />
                      ))}
                    </div>}
                  disableUnderline
                >
                  <MenuItem key={'All'} value={'All'} classes={{ selected: classes.menuItemSelected }}>
                    {/* <Checkbox checked={selectedStatus.indexOf('All') > -1} onChange={(_e, checked) => handleCheckAll(checked)} /> */}
                    <Checkbox checked={selectedStatus.indexOf('All') > -1} color='primary' />
                    <ListItemText primary={'All'} />
                  </MenuItem>
                  {blStatusOption.map((status) => (
                    <MenuItem key={status} classes={{ selected: classes.menuItemSelected }} value={status}>
                      <Checkbox checked={selectedStatus.indexOf(status) > -1} color='primary' />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              }
              labelWidth={60}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1} style={{ margin: 'auto' }}>
          <Button
            className={clsx(classes.btn, classes.btnSearch)}
            onClick={handleSearch}>
            <SearchIcon />
            <span>Search</span>
          </Button>
          <Button
            className={classes.btnReset}
            variant='text'
            style={{ backgroundColor: 'transparent' }}
            onClick={handleReset}>
            <span className='underline'>
              <span>Reset</span>
            </span>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default QueueList;
