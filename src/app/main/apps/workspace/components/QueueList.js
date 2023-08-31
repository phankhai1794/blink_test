import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Paper, Select, MenuItem, Input, Checkbox, ListItemText, Chip, Grid, Icon } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import * as DashboardActions from 'app/main/apps/workspace/store/actions/dashboard';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { formatDate } from '@shared';
import clsx from 'clsx';
import { DateRangePicker, defaultStaticRanges } from 'react-date-range';
import { subMonths, addDays, subDays } from 'date-fns';
import QueueListAdmin from 'app/main/apps/dashboards/admin/components/QueueList';

import { setLocalStorageItem } from '../shared-components/function';

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
  const userType = useSelector(({ user }) => user.userType);

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
          {userType === 'ONSHORE' ? (
            <QueueListAdmin />
          ) : (
            <>
              <SearchLayout />
              <TableContent />
            </>
          )}
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
const mapperBlinkStatus = {
  'IN_QUEUE': 'In Queue',
  'PENDING': 'Pending',
  'COMPLETED': 'Completed',
};
const blStatusOption = Object.keys(mapperBlinkStatus);

const SearchLayout = (props) => {
  const end = new Date();
  const start = subMonths(end, 1);
  const settings = JSON.parse(localStorage.getItem('cdboard') || '{}');
  const classes = useStyles();
  const dispatch = useDispatch();
  const initialState = {
    bookingNo: '',
    from: start,
    to: end,
    blStatus: ['IN_QUEUE', 'PENDING'],
  };
  const [state, setState] = useState({
    bookingNo: settings.bookingNo || '',
    from: settings.from || start,
    to: settings.to || end,
    blStatus: settings.blStatus || ['IN_QUEUE', 'PENDING']
  });
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);
  const [startingDate, setStartingDate] = useState('');
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [labelDate, setLabelDate] = useState();
  const pickerRef = useRef(null);

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
    let from = '';
    let to = '';
    if (startDate < startingDate) {
      from = startDate < minStartDate ? minStartDate : startDate;
      to = endDate;
    } else {
      from = startDate;
      to = endDate > maxEndDate ? maxEndDate : endDate;
    }
    handleChange({ from, to });
    setLabelDate(getLabelDate(from, to));
    setLocalStorageItem('from', from);
    setLocalStorageItem('to', to);
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
    if (values.indexOf('All') !== -1 && values.indexOf('All') === (values.length - 1)) {
      if (values.length <= blStatusOption.length) {
        setState({ ...state, blStatus: blStatusOption });
        setLocalStorageItem('blStatus', blStatusOption);
      } else {
        setState({ ...state, blStatus: [] });
        setLocalStorageItem('blStatus', []);
      }
    } else {
      setState({ ...state, blStatus: values });
      setLocalStorageItem('blStatus', values);
    }
  };

  const handleSearch = (e) => {
    let blStatus = state.blStatus.join(',');
    let bookingNo = state.bookingNo;
    if (state.blStatus.indexOf() !== -1) {
      blStatus = blStatus.splice(blStatus.indexOf(), 1);
    }
    if (bookingNo) bookingNo = bookingNo.toUpperCase();

    setLocalStorageItem('bookingNo', state.bookingNo);
    dispatch(DashboardActions.searchQueueQuery({ ...searchQueueQuery, ...state, bookingNo }));
  }

  const handleReset = (e) => {
    let query = { ...initialState, blStatus: 'PENDING,IN_QUEUE', sortField: '' };
    
    dispatch(DashboardActions.setReset(true));
    dispatch(DashboardActions.setPage(1, 10));
    dispatch(DashboardActions.setColumn({
      etd: true,
      status: true,
      inquiry: true,
      amendment: true,
      resolve: true,
      vvd: true,
      pol: false,
      pod: false,
      del: false,
      eta: false,
      shipperN: false,
    }));
    dispatch(DashboardActions.searchQueueQuery({ ...searchQueueQuery, ...query }));

    setState(initialState);
    localStorage.removeItem("cdboard");
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
              labelWidth={120}
              inputProps={{ style: { textTransform: "uppercase" } }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
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
                <Icon fontSize='small'>calendar_today</Icon>
              }
              onClick={() => setPickerOpen(true)}
              inputProps={{
                readOnly: true
              }}
              labelWidth={35}
            />
            {isPickerOpen && (
              <div ref={pickerRef}>
                <DateRangePicker
                  ranges={[
                    {
                      startDate: new Date(state.from),
                      endDate: new Date(state.to),
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
            <InputLabel htmlFor='selected-status'>
              <span>BL Status</span>
            </InputLabel>
            <OutlinedInput
              onChange={(e) => handleChange({ blStatus: e.target.value })}
              inputProps={{
                style: { width: 0 }
              }}
              startAdornment={
                <Select
                  className={classes.selectStatus}
                  multiple
                  value={state.blStatus}
                  onChange={handleSelectStatus}
                  input={<Input style={{ width: '100%' }} />}
                  renderValue={(selected) =>
                    <div className={classes.chips}>
                      {selected.map((value) =>
                        <Chip key={value} label={mapperBlinkStatus[value]} className={classes.chip} />
                      )}
                    </div>}
                  disableUnderline
                >
                  <MenuItem key={'All'} value={'All'} classes={{ selected: classes.menuItemSelected }}>
                    {/* <Checkbox checked={selectedStatus.indexOf('All') > -1} onChange={(_e, checked) => handleCheckAll(checked)} /> */}
                    <Checkbox checked={state.blStatus.length === blStatusOption.length} color='primary' />
                    <ListItemText primary={'All'} />
                  </MenuItem>
                  {blStatusOption.map((status) => (
                    <MenuItem key={status} classes={{ selected: classes.menuItemSelected }} value={status}>
                      <Checkbox checked={state.blStatus.indexOf(status) > -1} color='primary' />
                      <ListItemText primary={mapperBlinkStatus[status]} />
                    </MenuItem>
                  ))}
                </Select>
              }
              labelWidth={70}
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
