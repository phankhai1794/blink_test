import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Paper, Select, MenuItem, Input, Checkbox, ListItemText, Chip, Grid, Icon } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { formatDate } from '@shared';
import clsx from 'clsx';
import { DateRangePicker, defaultStaticRanges } from 'react-date-range';
import { subMonths, addDays, subDays } from 'date-fns';

import QueueListTable from './QueueListTable';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const useStyles = makeStyles((theme) => ({
  headerPopup: {
    borderBottom: '1px solid #8A97A3',
    '& h6': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Montserrat',
    },
    padding: '10px 24px',
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
    marginBottom: theme.spacing(1),
    padding: '24px',
    '& span': {
      fontFamily: 'Montserrat',
      fontSize: '13px',
    },
    '& input': {
      fontFamily: 'Montserrat',
      fontSize: '14px',
      textTransform: 'uppercase'
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
    display: 'flex',
    flexWrap: 'wrap'
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
      flexBasis: '33%',
      maxWidth: '33%'
    },
    '& .MuiGrid-grid-xs-3': {
      flexBasis: '23%',
      maxWidth: '23%'
    },
    '& .MuiGrid-grid-xs-1': {
      flexBasis: '11%',
      maxWidth: '11%'
    }
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const QueueList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openQueueList = useSelector(({ workspace }) => workspace.inquiryReducer.openQueueList);

  const handleClose = () => dispatch(InquiryActions.openQueueList(false));

  return (
    <div>
      <Dialog
        className={classes.popupContent}
        open={openQueueList}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullScreen
        scroll='paper'
      >
        {/* Header popup */}
        <DialogTitle className={classes.headerPopup}>
          {'BL Status'}
          <CloseIcon className={classes.closeBtn} onClick={handleClose} />
        </DialogTitle>
        {/* Body popup */}
        <DialogContent className={classes.bodyPopup}>
          <SearchLayout />
          <TableContent />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Table
const TableContent = (props) => {
  const classes = useStyles();
  return (
    <Paper>
      <QueueListTable />
    </Paper>
  )
}

const SearchLayout = (props) => {
  const end = new Date();
  const start = subMonths(end, 1);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({ bookingNo: '', from: start, to: end, blStatus: 'PENDING,IN_QUEUE', isSelectedAll: false })
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);
  const [selectedStatus, setSelectedStatus] = React.useState(['In Queue', 'Pending']);
  const [startingDate, setStartingDate] = useState('');
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [labelDate, setLabelDate] = useState();
  const pickerRef = useRef(null);

  const blStatusOption = [
    'In Queue',
    'Pending',
    'Completed',
  ];

  const handleChange = (query) => setState({ ...state, ...query });

  const getLabelDate = (startDate, endDate) => {
    return defaultStaticRanges.find(
      (date) =>
        formatDate(date.range().startDate, 'MMM DD YYYY') === formatDate(startDate, 'MMM DD YYYY') &&
        formatDate(date.range().endDate, 'MMM DD YYYY') === formatDate(endDate, 'MMM DD YYYY')
    )?.label;
  };


  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    const maxEndDate = addDays(startDate, 30);
    const minStartDate = subDays(endDate, 30);
    if (startDate.getTime() === endDate.getTime()) setStartingDate(endDate);

    // If the selected end date is beyond the maximum, adjust it
    if (startDate < startingDate) {
      const temp = startDate < minStartDate ? minStartDate : startDate;
      setLabelDate(getLabelDate(temp, endDate));
      handleChange({
        from: temp,
        to: endDate
      });
    } else {
      const temp = endDate > maxEndDate ? maxEndDate : endDate;
      setLabelDate(getLabelDate(startDate, temp));
      handleChange({
        from: startDate,
        to: endDate > maxEndDate ? maxEndDate : endDate
      });
    }
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSelectStatus = (event) => {
    let values = event.target.value;
    const blStatus = {
      'In Queue': 'IN_QUEUE',
      'Pending': 'PENDING',
      'Completed': 'COMPLETED',
    };
    const arrStatus = [];
    if ((values.indexOf('All') !== -1) && (selectedStatus.indexOf('All') === -1)) {
      setSelectedStatus([...blStatusOption, 'All']);
      setState({ ...state, blStatus: 'IN_QUEUE,PENDING,COMPLETED' })
    } else if ((values.indexOf('All') === -1) && (selectedStatus.indexOf('All') !== -1)) {
      setSelectedStatus([]);
      setState({ ...state, blStatus: '' })
    } else {
      const arrSelected = [];
      values.forEach(item => {
        if (item !== 'All') {
          arrStatus.push(blStatus[item]);
          arrSelected.push(item);
        }
      });
      setSelectedStatus(arrSelected);
      setState({ ...state, blStatus: arrStatus.join(',') })
    }
  };

  const handelSearch = (e) => {
    let blStatus = state.blStatus;
    let bookingNo = state.bookingNo;
    if (state.blStatus.indexOf() !== -1) {
      blStatus = blStatus.splice(blStatus.indexOf(), 1);
    }
    if (bookingNo) {
      bookingNo = bookingNo.toUpperCase();
    }
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...state, bookingNo }));
  }

  const handelReset = (e) => {
    let query = { bookingNo: '', currentPageNumber: 1, from: start, to: end, blStatus: 'PENDING,IN_QUEUE', sortField: '' };

    setState({ ...query });
    setSelectedStatus(['In Queue', 'Pending']);
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
              onChange={(e) => handleChange({ bookingNo: e.target.value.replace(/\s+|;+/g, ',') })}
              startAdornment={<InputAdornment className={classes.searchBox} position='start' >{''}</InputAdornment>}
              labelWidth={110}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handelSearch();
                }
              }}
            />
          </FormControl>
        </Grid>
        {/* From - To */}
        <Grid item xs={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>
              <span>Date</span>
            </InputLabel>
            <OutlinedInput
              value={
                labelDate ||
                `${formatDate(state.from, 'MMM DD YYYY')} - ${formatDate(state.to, 'MMM DD YYYY')}`
              }
              endAdornment={
                <Icon>calendar_today</Icon>
              }
              onClick={() => setPickerOpen(true)}
              inputProps={{
                readOnly: true
              }}
              labelWidth={30}
            />
            {isPickerOpen && (
              <div ref={pickerRef}>
                <DateRangePicker
                  ranges={[
                    {
                      startDate: state.from,
                      endDate: state.to,
                      key: 'selection'
                    }
                  ]}
                  onChange={handleDateChange}
                />
              </div>
            )}
          </FormControl>
        </Grid>
        {/* BL Status */}
        <Grid item xs={4}>
          <FormControl fullWidth variant='outlined'>
            <InputLabel htmlFor='selected-status'>BL Status</InputLabel>
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
        <Grid item xs={1} style={{ margin: 'auto' }} wrap-xs-nowrap>
          <Button
            className={clsx(classes.btn, classes.btnSearch)}
            onClick={handelSearch}>
            <SearchIcon />
            <span>Search</span>
          </Button>
          <Button
            className={classes.btnReset}
            variant='text'
            style={{ backgroundColor: 'transparent' }}
            onClick={handelReset}>
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
