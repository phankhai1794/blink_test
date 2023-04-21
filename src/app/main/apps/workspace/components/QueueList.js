import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Paper, Select, MenuItem, Input, Checkbox, ListItemText, Chip } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { formatDate } from '@shared';
import clsx from 'clsx';
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
  startIconBtn: {

  },
  paper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    padding: '24px',
  },
  searchBox: {
    height: '40px',
  },
  searchBkgNo: {
    width: '500px'
  },
  searchFrom: {
    width: '200px',
  },
  searchTo: {
    width: '200px',
  },
  searchBlStatus: {
    width: '300px',
  },
  btnReset: {
    textTransform: 'none',
    fontFamily: 'Montserrat',
    color: '#BD0F72',
  },
  selectStatus: {
    minWidth: '285px',
    '& :focus': {
      backgroundColor: 'transparent'
    }
  },
  chips: {
    display: 'flex',
  },
  chip: {
    backgroundColor: '#E2E6EA',
    borderRadius: '4px',
    height: '24px',
    margin: 2,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const WEEK_NUMBER = 7;

const QueueList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openQueueList = useSelector(({ workspace }) => workspace.inquiryReducer.openQueueList);

  const handleClose = () => dispatch(InquiryActions.openQueueList(false));

  return (
    <div>
      <Dialog
        open={openQueueList}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth={'xl'}
        scroll='body'
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState({ bookingNo: '', from: '', to: '', blStatus: 'PENDING,IN_QUEUE' })
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);
  const [selectedStatus, setSelectedStatus] = React.useState(['In Queue', 'Pending']);

  useEffect(() => {
    let currentDate = new Date();
    let sevenDayBefore = formatDate(currentDate.setDate(currentDate.getDate() - WEEK_NUMBER), 'YYYY-MM-DD');
    setState({ ...state, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD') })
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD') }));
  }, [])

  const blStatusOption = [
    'In Queue',
    'Pending',
    'Completed',
  ];

  const handleSelectStatus = (event) => {
    const blStatus = {
      'In Queue': 'IN_QUEUE',
      'Pending': 'PENDING',
      'Completed': 'COMPLETED',
    };
    const arrStatus = [];
    event.target.value.forEach(item => arrStatus.push(blStatus[item]));
    setSelectedStatus(event.target.value);
    setState({ ...state, blStatus: arrStatus.join(',') })
  };
  const handleChange = (query) => {
    setState({ ...state, ...query });
  }

  const handelSearch = (e) => dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...state }));

  const handelReset = (e) => {
    let currentDate = new Date();
    let sevenDayBefore = formatDate(currentDate.setDate(currentDate.getDate() - WEEK_NUMBER), 'YYYY-MM-DD');
    let query = { bookingNo: '', currentPageNumber: 1, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD'), blStatus: 'PENDING,IN_QUEUE', sortField: '' };

    setState({ ...query, from: sevenDayBefore, to: formatDate(new Date(), 'YYYY-MM-DD') })
    setSelectedStatus(['In Queue', 'Pending']);
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...query }));
  }

  return (
    <Paper className={classes.paper}>
      {/* Booking Number */}
      <FormControl className={classes.searchBkgNo} variant='outlined'>
        <InputLabel >Booking Number</InputLabel>
        <OutlinedInput
          className={classes.searchBox}
          value={state.bookingNo}
          onChange={(e) => handleChange({ bookingNo: e.target.value })}
          startAdornment={<InputAdornment className={classes.searchBox} position='start' >{''}</InputAdornment>}
          labelWidth={110}
        />
      </FormControl>
      {/* From */}
      <FormControl className={classes.searchFrom} variant='outlined'>
        <InputLabel >From</InputLabel>
        <OutlinedInput
          className={classes.searchBox}
          value={state.from}
          onChange={(e) => handleChange({ from: e.target.value })}
          startAdornment={<InputAdornment className={classes.searchBox} position='start' >{''}</InputAdornment>}
          labelWidth={40}
          type='date'
        />
      </FormControl>
      {/* To */}
      <FormControl className={classes.searchTo} variant='outlined'>
        <InputLabel >To</InputLabel>
        <OutlinedInput
          className={classes.searchBox}
          value={state.to}
          onChange={(e) => handleChange({ to: e.target.value })}
          startAdornment={<InputAdornment position='start' >{''}</InputAdornment>}
          labelWidth={20}
          type='date'
        />
      </FormControl>
      {/* BL Status */}
      <FormControl className={classes.searchBlStatus} variant='outlined'>
        <InputLabel htmlFor='selected-status'>BL Status</InputLabel>
        <OutlinedInput
          className={classes.searchBox}
          value={state.blStatus}
          onChange={(e) => handleChange({ blStatus: e.target.value })}
          startAdornment={
            <Select
              className={classes.selectStatus}
              multiple
              value={selectedStatus}
              onChange={handleSelectStatus}
              input={<Input />}
              renderValue={(selected) =>
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>}
              disableUnderline
            >
              {blStatusOption.map((status) => (
                <MenuItem key={status} value={status} >
                  <Checkbox checked={selectedStatus.indexOf(status) > -1} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          }
          labelWidth={60}
        />
      </FormControl>
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
        <span className='underline'>Reset</span>
      </Button>
    </Paper>
  )
}

export default QueueList;
